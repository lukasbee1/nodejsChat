module.exports = (sequelize, type) => sequelize.define('message', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tweet: type.STRING,
  roomId: {
    type: type.INTEGER,
  },
  authorId: type.STRING,
});
