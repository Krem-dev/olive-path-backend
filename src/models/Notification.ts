import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface NotificationAttributes {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'new_teaching' | 'devotion' | 'general' | 'prayer';
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type NotificationCreationAttributes = Optional<NotificationAttributes, 'id' | 'isRead'>;

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  declare id: number;
  declare userId: number;
  declare title: string;
  declare message: string;
  declare type: 'new_teaching' | 'devotion' | 'general' | 'prayer';
  declare isRead: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Notification.init(
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('new_teaching', 'devotion', 'general', 'prayer'),
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'notifications',
    indexes: [
      { fields: ['user_id', 'is_read'] },
      { fields: ['user_id', 'created_at'] },
    ],
  }
);

export default Notification;
