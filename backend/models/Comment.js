const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User"); // Import User untuk relasi

const Comment = sequelize.define("Comment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  gameSlug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// HUBUNGKAN: Satu Komentar milik satu User
Comment.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Comment, { foreignKey: "userId" });

module.exports = Comment;
