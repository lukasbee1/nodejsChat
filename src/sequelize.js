const Sequelize = require('sequelize');
const UserModel = require('../models/User');
const MessageModel = require('../models/Message');
const RoomModel = require('../models/Room');
const SocketModel = require('../models/Socket');

const sequelize = new Sequelize('chatdb', 'maksim', 'pass', {
  host: 'localhost',
  dialect: 'mysql',
});

const User = UserModel(sequelize, Sequelize);
const UserRoom = sequelize.define('user_room', {});
const Message = MessageModel(sequelize, Sequelize);
const Room = RoomModel(sequelize, Sequelize);
const Socket = SocketModel(sequelize, Sequelize);

User.belongsToMany(Room, { through: UserRoom, unique: false });
Room.belongsToMany(User, { through: UserRoom, unique: false });

Room.hasMany(User);
Room.hasMany(Message, {
  foreignKey: {
    name: 'roomId',
    allowNull: false,
  },
});
User.hasMany(Socket, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
});

sequelize.sync({ force: true })
  .then(() => {
    console.log('Database & tables created!');
  }).then(() => {
    Room.create({
      name: 'common',
      uniqueId: 7777,
    }).then((rooms) => {
      console.log(rooms);
    });
  });

module.exports = {
  User,
  Message,
  Room,
};
