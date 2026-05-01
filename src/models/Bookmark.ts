import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface BookmarkAttributes {
  id: number;
  userId: number;
  sermonId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type BookmarkCreationAttributes = Optional<BookmarkAttributes, 'id'>;

class Bookmark extends Model<BookmarkAttributes, BookmarkCreationAttributes> implements BookmarkAttributes {
  declare id: number;
  declare userId: number;
  declare sermonId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Bookmark.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    sermonId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'bookmarks',
    indexes: [
      { unique: true, fields: ['user_id', 'sermon_id'] },
    ],
  }
);

export default Bookmark;
