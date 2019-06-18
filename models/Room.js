module.exports = (sequelize, type) => sequelize.define('room', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: type.STRING,
  uniqueId: type.STRING,
});
