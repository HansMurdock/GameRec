const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Wishlist = sequelize.define("Wishlist", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gameSlug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gameName: { type: DataTypes.STRING },
  gameImage: { type: DataTypes.STRING },
  gameScore: { type: DataTypes.INTEGER },
  listType: {
    type: DataTypes.ENUM("library", "wishlist"),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Playing", "Finished", "Dropped"),
    allowNull: true,
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

Wishlist.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Wishlist, { foreignKey: "userId" });

module.exports = Wishlist;
