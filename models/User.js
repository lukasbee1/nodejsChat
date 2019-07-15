module.exports = (sequelize, type) => sequelize.define('user', {
  id: {
    type: type.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  login: {
    type: type.STRING,
    unique: true,
  },
  email: {
    type: type.STRING,
    unique: true,
  },
  name: type.STRING,
  password: type.STRING,
  uniqueId: type.STRING,
  avatar: type.STRING,
});
