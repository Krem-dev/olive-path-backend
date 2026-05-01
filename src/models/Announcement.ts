import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface AnnouncementAttributes {
  id: number;
  title: string;
  message: string;
  date: string; // YYYY-MM-DD — when the announcement is "for"
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type AnnouncementCreationAttributes = Optional<
  AnnouncementAttributes,
  'id' | 'isActive'
>;

class Announcement
  extends Model<AnnouncementAttributes, AnnouncementCreationAttributes>
  implements AnnouncementAttributes
{
  declare id: number;
  declare title: string;
  declare message: string;
  declare date: string;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Announcement.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING(255), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize,
    tableName: 'announcements',
    indexes: [{ fields: ['date'] }],
  },
);

export default Announcement;
