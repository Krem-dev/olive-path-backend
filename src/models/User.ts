import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';
import bcrypt from 'bcryptjs';

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string | null;
  avatarUrl: string | null;
  googleId: string | null;
  authProvider: 'email' | 'google';
  notificationsEnabled: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'password' | 'avatarUrl' | 'googleId' | 'authProvider' | 'notificationsEnabled' | 'isActive'>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string | null;
  declare avatarUrl: string | null;
  declare googleId: string | null;
  declare authProvider: 'email' | 'google';
  declare notificationsEnabled: boolean;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  async comparePassword(candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
  }

  toSafeJSON() {
    const { password, ...safe } = this.toJSON();
    return safe;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true, // null for Google OAuth users
    },
    avatarUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    authProvider: {
      type: DataTypes.ENUM('email', 'google'),
      defaultValue: 'email',
    },
    notificationsEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password') && user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
  }
);

export default User;
