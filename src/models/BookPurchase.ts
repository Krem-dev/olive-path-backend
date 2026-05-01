import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface BookPurchaseAttributes {
  id: number;
  userId: number;
  bookId: number;
  /** Amount paid in major currency units. 0 for free books. */
  amount: number;
  currency: string;
  /** Paystack reference if paid; null for free claims. */
  paystackRef: string | null;
  status: 'pending' | 'paid' | 'failed' | 'free';
  paidAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type BookPurchaseCreationAttributes = Optional<
  BookPurchaseAttributes,
  'id' | 'paystackRef' | 'paidAt' | 'currency' | 'amount'
>;

class BookPurchase
  extends Model<BookPurchaseAttributes, BookPurchaseCreationAttributes>
  implements BookPurchaseAttributes
{
  declare id: number;
  declare userId: number;
  declare bookId: number;
  declare amount: number;
  declare currency: string;
  declare paystackRef: string | null;
  declare status: 'pending' | 'paid' | 'failed' | 'free';
  declare paidAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

BookPurchase.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    bookId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      get() {
        const raw = this.getDataValue('amount');
        return raw === null ? 0 : parseFloat(raw as unknown as string);
      },
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'GHS',
    },
    paystackRef: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'free'),
      allowNull: false,
      defaultValue: 'pending',
    },
    paidAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'book_purchases',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['book_id'] },
      { fields: ['user_id', 'book_id', 'status'] },
    ],
  },
);

export default BookPurchase;
