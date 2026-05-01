import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface SermonAttributes {
  id: number;
  title: string;
  scripture: string;
  summary: string;
  thumbnailUrl: string;
  audioUrl: string | null;
  videoId: string | null; // YouTube video ID
  duration: string; // e.g. "45 min"
  contentType: 'video' | 'audio' | 'reading';
  category: 'preaching' | 'motivation';
  publishedAt: Date;
  viewCount: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type SermonCreationAttributes = Optional<SermonAttributes, 'id' | 'audioUrl' | 'videoId' | 'viewCount' | 'isActive'>;

class Sermon extends Model<SermonAttributes, SermonCreationAttributes> implements SermonAttributes {
  declare id: number;
  declare title: string;
  declare scripture: string;
  declare summary: string;
  declare thumbnailUrl: string;
  declare audioUrl: string | null;
  declare videoId: string | null;
  declare duration: string;
  declare contentType: 'video' | 'audio' | 'reading';
  declare category: 'preaching' | 'motivation';
  declare publishedAt: Date;
  declare viewCount: number;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Sermon.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    scripture: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    thumbnailUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    audioUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    videoId: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    contentType: {
      type: DataTypes.ENUM('video', 'audio', 'reading'),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('preaching', 'motivation'),
      allowNull: false,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    viewCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'sermons',
    indexes: [
      { fields: ['category'] },
      { fields: ['content_type'] },
      { fields: ['published_at'] },
    ],
  }
);

export default Sermon;
