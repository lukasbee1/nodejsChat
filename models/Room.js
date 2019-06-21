module.exports = (sequelize, type) => sequelize.define('room', {
  id: {
    type: type.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: type.STRING,
});
