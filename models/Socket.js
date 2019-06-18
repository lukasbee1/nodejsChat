module.exports = (sequelize, type) => sequelize.define('socket', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: type.INTEGER,
  socketId: type.STRING,
});
