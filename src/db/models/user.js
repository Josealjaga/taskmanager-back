import { DataTypes, } from 'sequelize';

import { sequelize, } from '../connection.js';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fotoperfil: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }
);

export default User