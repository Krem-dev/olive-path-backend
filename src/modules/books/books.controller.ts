import { Request, Response } from 'express';
import { Op } from 'sequelize';
import {
  Book,
  BookChapter,
  BookProgress,
  BookPurchase,
} from '../../models';
import { success } from '../../utils/response';
import { ForbiddenError, NotFoundError } from '../../middleware/error';
import { AuthenticatedRequest } from '../../types/express';
import { paramInt } from '../../utils/params';

const ACTIVE = { isActive: true };

/** Returns the set of book IDs the current user owns (status='paid' or 'free'). */
async function getOwnedBookIds(userId: number): Promise<number[]> {
  const purchases = await BookPurchase.findAll({
    where: { userId, status: { [Op.in]: ['paid', 'free'] } },
    attributes: ['bookId'],
  });
  return purchases.map((p) => p.bookId);
}

function serializeBook(book: Book) {
  const json = book.toJSON();
  return {
    ...json,
    categories: book.categories
      ? book.categories
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean)
      : [],
  };
}

/** GET /books — catalog of books the user does NOT own (browse). */
export async function getCatalog(req: Request, res: Response): Promise<void> {
  const auth = req as AuthenticatedRequest;
  const ownedIds = await getOwnedBookIds(auth.user.id);

  const where: Record<string, unknown> = { isActive: true };
  if (ownedIds.length > 0) where.id = { [Op.notIn]: ownedIds };

  const search = (req.query.search as string)?.trim();
  if (search) {
    where[Op.and as unknown as string] = [
      where[Op.and as unknown as string] ?? {},
      {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { subtitle: { [Op.like]: `%${search}%` } },
          { author: { [Op.like]: `%${search}%` } },
          { categories: { [Op.like]: `%${search}%` } },
        ],
      },
    ];
  }

  const books = await Book.findAll({
    where,
    order: [
      ['isFeatured', 'DESC'],
      ['publishedAt', 'DESC'],
    ],
  });

  success(res, books.map(serializeBook));
}

/** GET /books/owned — books the user has purchased / claimed. */
export async function getOwned(req: Request, res: Response): Promise<void> {
  const auth = req as AuthenticatedRequest;
  const ownedIds = await getOwnedBookIds(auth.user.id);

  if (ownedIds.length === 0) {
    success(res, []);
    return;
  }

  const books = await Book.findAll({
    where: { id: { [Op.in]: ownedIds }, ...ACTIVE },
    include: [
      {
        model: BookProgress,
        as: 'progressEntries',
        where: { userId: auth.user.id },
        required: false,
      },
    ],
    order: [['publishedAt', 'DESC']],
  });

  const data = books.map((b) => {
    const progress = b.get('progressEntries') as BookProgress[] | undefined;
    return {
      ...serializeBook(b),
      progress: progress?.[0]
        ? {
            currentPage: progress[0].currentPage,
            progress: progress[0].progress,
            lastOpenedAt: progress[0].lastOpenedAt,
          }
        : null,
    };
  });

  success(res, data);
}

/** GET /books/:id — public catalog detail. */
export async function getById(req: Request, res: Response): Promise<void> {
  const auth = req as AuthenticatedRequest;
  const id = paramInt(req.params.id);

  const book = await Book.findOne({ where: { id, ...ACTIVE } });
  if (!book) throw new NotFoundError('Book not found');

  const ownedIds = await getOwnedBookIds(auth.user.id);
  const owned = ownedIds.includes(book.id);

  let progress = null;
  if (owned) {
    const p = await BookProgress.findOne({
      where: { userId: auth.user.id, bookId: book.id },
    });
    if (p) {
      progress = {
        currentPage: p.currentPage,
        progress: p.progress,
        lastOpenedAt: p.lastOpenedAt,
      };
    }
  }

  success(res, { ...serializeBook(book), owned, progress });
}

/** GET /books/:id/content — chapters; only for owners. */
export async function getContent(req: Request, res: Response): Promise<void> {
  const auth = req as AuthenticatedRequest;
  const id = paramInt(req.params.id);

  const book = await Book.findOne({ where: { id, ...ACTIVE } });
  if (!book) throw new NotFoundError('Book not found');

  const ownedIds = await getOwnedBookIds(auth.user.id);
  if (!ownedIds.includes(book.id)) {
    throw new ForbiddenError('You do not own this book');
  }

  const chapters = await BookChapter.findAll({
    where: { bookId: book.id },
    order: [['number', 'ASC']],
  });

  success(res, {
    bookId: book.id,
    chapters: chapters.map((c) => ({
      id: c.id,
      number: c.number,
      title: c.title,
      paragraphs: c.body.split(/\n\n+/).filter(Boolean),
    })),
  });
}

/** GET /books/:id/progress — current user's reading progress. */
export async function getProgress(req: Request, res: Response): Promise<void> {
  const auth = req as AuthenticatedRequest;
  const bookId = paramInt(req.params.id);

  const progress = await BookProgress.findOne({
    where: { userId: auth.user.id, bookId },
  });

  success(
    res,
    progress
      ? {
          currentPage: progress.currentPage,
          progress: progress.progress,
          lastOpenedAt: progress.lastOpenedAt,
        }
      : null,
  );
}

/** PATCH /books/:id/progress — upsert reading progress. */
export async function updateProgress(req: Request, res: Response): Promise<void> {
  const auth = req as AuthenticatedRequest;
  const bookId = paramInt(req.params.id);
  const currentPage = parseInt(req.body.currentPage, 10);

  const book = await Book.findOne({ where: { id: bookId, ...ACTIVE } });
  if (!book) throw new NotFoundError('Book not found');

  const ownedIds = await getOwnedBookIds(auth.user.id);
  if (!ownedIds.includes(book.id)) {
    throw new ForbiddenError('You do not own this book');
  }

  const ratio = book.pages > 0
    ? Math.min(1, Math.max(0, currentPage / book.pages))
    : 0;

  const [progress] = await BookProgress.upsert({
    userId: auth.user.id,
    bookId: book.id,
    currentPage,
    progress: ratio,
    lastOpenedAt: new Date(),
  });

  success(res, {
    currentPage: progress.currentPage,
    progress: progress.progress,
    lastOpenedAt: progress.lastOpenedAt,
  });
}
