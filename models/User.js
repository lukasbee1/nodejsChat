module.exports = (sequelize, type) => sequelize.define('user', {
  id: {
    type: type.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: type.STRING,
  email: {
    type: type.STRING,
    unique: true,
  },
  password: type.STRING,
  uniqueId: type.STRING,
  avatar: type.STRING,
});
