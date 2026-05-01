import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface BookProgressAttributes {
  id: number;
  userId: number;
  bookId: number;
  currentPage: number;
  /** 0..1 — convenience field, also derivable as currentPage / book.pages. */
  progress: number;
  lastOpenedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

type BookProgressCreationAttributes = Optional<
  BookProgressAttributes,
  'id' | 'currentPage' | 'progress' | 'lastOpenedAt'
>;

class BookProgress
  extends Model<BookProgressAttributes, BookProgressCreationAttributes>
  implements BookProgressAttributes
{
  declare id: number;
  declare userId: number;
  declare bookId: number;
  declare currentPage: number;
  declare progress: number;
  declare lastOpenedAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

BookProgress.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    bookId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    currentPage: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    progress: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0, max: 1 },
    },
    lastOpenedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'book_progress',
    indexes: [
      { unique: true, fields: ['user_id', 'book_id'] },
      { fields: ['user_id', 'last_opened_at'] },
    ],
  },
);

export default BookProgress;
