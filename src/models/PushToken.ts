import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface PushTokenAttributes {
  id: number;
  userId: number;
  token: string;
  platform: 'android' | 'ios';
  createdAt?: Date;
  updatedAt?: Date;
}

type PushTokenCreationAttributes = Optional<PushTokenAttributes, 'id'>;

class PushToken extends Model<PushTokenAttributes, PushTokenCreationAttributes> implements PushTokenAttributes {
  declare id: number;
  declare userId: number;
  declare token: string;
  declare platform: 'android' | 'ios';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PushToken.init(
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
    token: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    platform: {
      type: DataTypes.ENUM('android', 'ios'),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'push_tokens',
    indexes: [
      { unique: true, fields: ['user_id', 'token'] },
    ],
  },
);

export default PushToken;
