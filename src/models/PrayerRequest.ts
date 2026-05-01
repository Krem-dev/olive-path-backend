import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface PrayerRequestAttributes {
  id: number;
  userId: number;
  message: string;
  status: 'pending' | 'praying' | 'answered';
  createdAt?: Date;
  updatedAt?: Date;
}

type PrayerRequestCreationAttributes = Optional<PrayerRequestAttributes, 'id' | 'status'>;

class PrayerRequest extends Model<PrayerRequestAttributes, PrayerRequestCreationAttributes> implements PrayerRequestAttributes {
  declare id: number;
  declare userId: number;
  declare message: string;
  declare status: 'pending' | 'praying' | 'answered';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PrayerRequest.init(
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
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'praying', 'answered'),
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'prayer_requests',
    indexes: [
      { fields: ['user_id'] },
    ],
  }
);

export default PrayerRequest;
