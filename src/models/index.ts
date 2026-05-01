import User from './User';
import Sermon from './Sermon';
import QAItem from './QAItem';
import WeeklyDevotion from './WeeklyDevotion';
import Notification from './Notification';
import Bookmark from './Bookmark';
import Download from './Download';
import PrayerRequest from './PrayerRequest';
import Book from './Book';
import BookChapter from './BookChapter';
import BookPurchase from './BookPurchase';
import BookProgress from './BookProgress';
import Announcement from './Announcement';
import Program from './Program';
import CounsellingBooking from './CounsellingBooking';
import PastorBooking from './PastorBooking';

// ── User-owned 1:M ──
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Bookmark, { foreignKey: 'userId', as: 'bookmarks' });
Bookmark.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Download, { foreignKey: 'userId', as: 'downloads' });
Download.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(PrayerRequest, { foreignKey: 'userId', as: 'prayerRequests' });
PrayerRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(BookPurchase, { foreignKey: 'userId', as: 'bookPurchases' });
BookPurchase.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(BookProgress, { foreignKey: 'userId', as: 'bookProgress' });
BookProgress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(CounsellingBooking, {
  foreignKey: 'userId',
  as: 'counsellingBookings',
});
CounsellingBooking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(PastorBooking, { foreignKey: 'userId', as: 'pastorBookings' });
PastorBooking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ── Sermon ↔ Bookmark / Download ──
Sermon.hasMany(Bookmark, { foreignKey: 'sermonId', as: 'bookmarks' });
Bookmark.belongsTo(Sermon, { foreignKey: 'sermonId', as: 'sermon' });

Sermon.hasMany(Download, { foreignKey: 'sermonId', as: 'downloads' });
Download.belongsTo(Sermon, { foreignKey: 'sermonId', as: 'sermon' });

User.belongsToMany(Sermon, {
  through: Bookmark,
  foreignKey: 'userId',
  otherKey: 'sermonId',
  as: 'bookmarkedSermons',
});
Sermon.belongsToMany(User, {
  through: Bookmark,
  foreignKey: 'sermonId',
  otherKey: 'userId',
  as: 'bookmarkedBy',
});

// ── Book ↔ Chapters / Purchases / Progress ──
Book.hasMany(BookChapter, { foreignKey: 'bookId', as: 'chapters' });
BookChapter.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

Book.hasMany(BookPurchase, { foreignKey: 'bookId', as: 'purchases' });
BookPurchase.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

Book.hasMany(BookProgress, { foreignKey: 'bookId', as: 'progressEntries' });
BookProgress.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

User.belongsToMany(Book, {
  through: BookPurchase,
  foreignKey: 'userId',
  otherKey: 'bookId',
  as: 'purchasedBooks',
});
Book.belongsToMany(User, {
  through: BookPurchase,
  foreignKey: 'bookId',
  otherKey: 'userId',
  as: 'owners',
});

export {
  User,
  Sermon,
  QAItem,
  WeeklyDevotion,
  Notification,
  Bookmark,
  Download,
  PrayerRequest,
  Book,
  BookChapter,
  BookPurchase,
  BookProgress,
  Announcement,
  Program,
  CounsellingBooking,
  PastorBooking,
};
