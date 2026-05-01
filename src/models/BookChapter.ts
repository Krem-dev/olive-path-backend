import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface BookChapterAttributes {
  id: number;
  bookId: number;
  number: number;
  title: string;
  /** Paragraphs joined by `\n\n`. Split client-side. */
  body: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type BookChapterCreationAttributes = Optional<BookChapterAttributes, 'id'>;

class BookChapter
  extends Model<BookChapterAttributes, BookChapterCreationAttributes>
  implements BookChapterAttributes
{
  declare id: number;
  declare bookId: number;
  declare number: number;
  declare title: string;
  declare body: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

BookChapter.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    bookId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    number: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    body: { type: DataTypes.TEXT('long'), allowNull: false },
  },
  {
    sequelize,
    tableName: 'book_chapters',
    indexes: [
      { fields: ['book_id'] },
      { unique: true, fields: ['book_id', 'number'] },
    ],
  },
);

export default BookChapter;
