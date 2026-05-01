import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface CounsellingBookingAttributes {
  id: number;
  userId: number;
  fullName: string;
  phone: string;
  email: string | null;
  type: string;            // e.g. "Marriage & Family"
  preferredDate: string | null; // YYYY-MM-DD
  concern: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

type CounsellingBookingCreationAttributes = Optional<
  CounsellingBookingAttributes,
  'id' | 'email' | 'preferredDate' | 'concern' | 'status'
>;

class CounsellingBooking
  extends Model<CounsellingBookingAttributes, CounsellingBookingCreationAttributes>
  implements CounsellingBookingAttributes
{
  declare id: number;
  declare userId: number;
  declare fullName: string;
  declare phone: string;
  declare email: string | null;
  declare type: string;
  declare preferredDate: string | null;
  declare concern: string | null;
  declare status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CounsellingBooking.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    fullName: { type: DataTypes.STRING(100), allowNull: false },
    phone: { type: DataTypes.STRING(30), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: true },
    type: { type: DataTypes.STRING(80), allowNull: false },
    preferredDate: { type: DataTypes.DATEONLY, allowNull: true },
    concern: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'counselling_bookings',
    indexes: [{ fields: ['user_id'] }, { fields: ['status'] }],
  },
);

export default CounsellingBooking;
