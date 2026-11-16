import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface ProgramAttributes {
  id: number;
  title: string;
  description: string;
  date: string;        // YYYY-MM-DD
  time: string;        // e.g. "9:00 AM"
  location: string;
  imageUrl: string | null; // flyer image
  showPopup: boolean; // pop up on app open
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type ProgramCreationAttributes = Optional<
  ProgramAttributes,
  'id' | 'imageUrl' | 'showPopup' | 'isActive'
>;

class Program
  extends Model<ProgramAttributes, ProgramCreationAttributes>
  implements ProgramAttributes
{
  declare id: number;
  declare title: string;
  declare description: string;
  declare date: string;
  declare time: string;
  declare location: string;
  declare imageUrl: string | null;
  declare showPopup: boolean;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Program.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    time: { type: DataTypes.STRING(20), allowNull: false },
    location: { type: DataTypes.STRING(255), allowNull: false },
    imageUrl: { type: DataTypes.STRING(2048), allowNull: true },
    showPopup: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize,
    tableName: 'programs',
    indexes: [{ fields: ['date'] }],
  },
);

export default Program;
