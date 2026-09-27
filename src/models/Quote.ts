import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface QuoteAttributes {
  id: number;
  text: string;
  author: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type QuoteCreationAttributes = Optional<QuoteAttributes, 'id' | 'isActive'>;

class Quote
  extends Model<QuoteAttributes, QuoteCreationAttributes>
  implements QuoteAttributes
{
  declare id: number;
  declare text: string;
  declare author: string;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Quote.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    text: { type: DataTypes.TEXT, allowNull: false },
    author: { type: DataTypes.STRING(255), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize,
    tableName: 'quotes',
  },
);

export default Quote;
