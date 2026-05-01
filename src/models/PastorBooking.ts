import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface PastorBookingAttributes {
  id: number;
  userId: number;
  fullName: string;
  church: string;
  phone: string;
  email: string;
  programDate: string | null; // YYYY-MM-DD
  location: string | null;
  message: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'declined';
  createdAt?: Date;
  updatedAt?: Date;
}

type PastorBookingCreationAttributes = Optional<
  PastorBookingAttributes,
  'id' | 'programDate' | 'location' | 'message' | 'status'
>;

class PastorBooking
  extends Model<PastorBookingAttributes, PastorBookingCreationAttributes>
  implements PastorBookingAttributes
{
  declare id: number;
  declare userId: number;
  declare fullName: string;
  declare church: string;
  declare phone: string;
  declare email: string;
  declare programDate: string | null;
  declare location: string | null;
  declare message: string | null;
  declare status: 'pending' | 'confirmed' | 'completed' | 'declined';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PastorBooking.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    fullName: { type: DataTypes.STRING(100), allowNull: false },
    church: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(30), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false },
    programDate: { type: DataTypes.DATEONLY, allowNull: true },
    location: { type: DataTypes.STRING(255), allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'declined'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'pastor_bookings',
    indexes: [{ fields: ['user_id'] }, { fields: ['status'] }],
  },
);

export default PastorBooking;
