import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface WeeklyDevotionAttributes {
  id: number;
  title: string;
  weekStart: string;          // YYYY-MM-DD (Sunday or Monday — your choice)
  weekEnd: string;            // YYYY-MM-DD
  scripture: string;
  scriptureRef: string;
  encouragement: string;      // short tagline
  reflection: string;         // multi-paragraph; paragraphs separated by \n\n
  prayer: string | null;
  pastorName: string;
  pastorTitle: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type WeeklyDevotionCreationAttributes = Optional<
  WeeklyDevotionAttributes,
  'id' | 'prayer' | 'pastorTitle' | 'isActive'
>;

class WeeklyDevotion
  extends Model<WeeklyDevotionAttributes, WeeklyDevotionCreationAttributes>
  implements WeeklyDevotionAttributes
{
  declare id: number;
  declare title: string;
  declare weekStart: string;
  declare weekEnd: string;
  declare scripture: string;
  declare scriptureRef: string;
  declare encouragement: string;
  declare reflection: string;
  declare prayer: string | null;
  declare pastorName: string;
  declare pastorTitle: string | null;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

WeeklyDevotion.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING(255), allowNull: false },
    weekStart: { type: DataTypes.DATEONLY, allowNull: false, unique: true },
    weekEnd: { type: DataTypes.DATEONLY, allowNull: false },
    scripture: { type: DataTypes.TEXT, allowNull: false },
    scriptureRef: { type: DataTypes.STRING(100), allowNull: false },
    encouragement: { type: DataTypes.TEXT, allowNull: false },
    reflection: { type: DataTypes.TEXT('long'), allowNull: false },
    prayer: { type: DataTypes.TEXT, allowNull: true },
    pastorName: { type: DataTypes.STRING(255), allowNull: false },
    pastorTitle: { type: DataTypes.STRING(255), allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize,
    tableName: 'weekly_devotions',
    indexes: [{ fields: ['week_start'] }],
  },
);

export default WeeklyDevotion;
