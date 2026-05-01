import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface QAItemAttributes {
  id: number;
  question: string;
  answer: string;
  scripture: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type QAItemCreationAttributes = Optional<QAItemAttributes, 'id' | 'sortOrder' | 'isActive'>;

class QAItem extends Model<QAItemAttributes, QAItemCreationAttributes> implements QAItemAttributes {
  declare id: number;
  declare question: string;
  declare answer: string;
  declare scripture: string;
  declare category: string;
  declare sortOrder: number;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

QAItem.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    scripture: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'qa_items',
    indexes: [
      { fields: ['category'] },
    ],
  }
);

export default QAItem;
