import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

/** Tracks which sermons/motivations a user has downloaded for offline. */
interface DownloadAttributes {
  id: number;
  userId: number;
  sermonId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type DownloadCreationAttributes = Optional<DownloadAttributes, 'id'>;

class Download
  extends Model<DownloadAttributes, DownloadCreationAttributes>
  implements DownloadAttributes
{
  declare id: number;
  declare userId: number;
  declare sermonId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Download.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    sermonId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  {
    sequelize,
    tableName: 'downloads',
    indexes: [{ unique: true, fields: ['user_id', 'sermon_id'] }],
  },
);

export default Download;
