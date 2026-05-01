import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface BookAttributes {
  id: number;
  title: string;
  subtitle: string | null;
  author: string;
  authorTitle: string | null;
  description: string;
  coverUrl: string;
  pages: number;
  /** Price in major currency units (e.g. 40.00 = ₵40). 0 = free. */
  price: number;
  currency: string;
  /** Comma-separated topics, e.g. "Devotional,Hope". */
  categories: string;
  publishedAt: Date;
  isActive: boolean;
  isFeatured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type BookCreationAttributes = Optional<
  BookAttributes,
  | 'id'
  | 'subtitle'
  | 'authorTitle'
  | 'isActive'
  | 'isFeatured'
  | 'currency'
>;

class Book
  extends Model<BookAttributes, BookCreationAttributes>
  implements BookAttributes
{
  declare id: number;
  declare title: string;
  declare subtitle: string | null;
  declare author: string;
  declare authorTitle: string | null;
  declare description: string;
  declare coverUrl: string;
  declare pages: number;
  declare price: number;
  declare currency: string;
  declare categories: string;
  declare publishedAt: Date;
  declare isActive: boolean;
  declare isFeatured: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING(255), allowNull: false },
    subtitle: { type: DataTypes.STRING(255), allowNull: true },
    author: { type: DataTypes.STRING(255), allowNull: false },
    authorTitle: { type: DataTypes.STRING(255), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: false },
    coverUrl: { type: DataTypes.STRING(500), allowNull: false },
    pages: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: { min: 1 },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      get() {
        const raw = this.getDataValue('price');
        return raw === null ? 0 : parseFloat(raw as unknown as string);
      },
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'GHS',
    },
    categories: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    tableName: 'books',
    indexes: [
      { fields: ['is_active'] },
      { fields: ['is_featured'] },
      { fields: ['published_at'] },
    ],
  },
);

export default Book;
