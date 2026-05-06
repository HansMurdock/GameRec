const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: false },
    password: { type: DataTypes.STRING, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.STRING, defaultValue: "user" },
    provider: { type: DataTypes.STRING, defaultValue: "credentials" },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["email", "provider"],
      },
    ],
  },
);

module.exports = User;
