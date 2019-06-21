module.exports = (sequelize, type) => sequelize.define('message', {
  id: {
    type: type.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  tweet: type.STRING,
});
