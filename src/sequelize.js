const Sequelize = require('sequelize');
const UserModel = require('../models/User');
const MessageModel = require('../models/Message');
const RoomModel = require('../models/Room');
// const SocketModel = require('../models/Socket');

const sequelize = new Sequelize('chatdb', 'maksim', 'pass', {
  host: 'localhost',
  dialect: 'mysql',
});

const User = UserModel(sequelize, Sequelize);
const Message = MessageModel(sequelize, Sequelize);
const Room = RoomModel(sequelize, Sequelize);

const UserRoom = sequelize.define('UserRoom', {});

User.belongsToMany(Room, { through: UserRoom });
Room.belongsToMany(User, { through: UserRoom });

Room.hasMany(Message, {
  foreignKey: {
    name: 'roomId',
    allowNull: false,
  },
});
User.hasMany(Message, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
});
Message.belongsTo(User, {
  as: 'sender',
  foreignKey: 'userId',
});

sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
  .then(() => sequelize
    .sync({
      force: false,
    }))
  .then(() => sequelize.query('SET FOREIGN_KEY_CHECKS = 1'))
  .then(() => Room.findOrCreate({ where: { name: 'common', avatar: 'img/group.png' } }))
  // .then(room => UserRoom.create({ userId: 1, roomId: room.id }))
  // .then(() => Message.create({ userId: 1, tweet: 'messadfadsfadfadf', roomId: 1 }))
  // .then(() => Message.create({ userId: 1, tweet: 'adsfdasfdsfds', roomId: 1 }))
  .then(() => {
    console.log('Database synchronised.');
  }, (err) => {
    console.log(err);
  });
module.exports = {
  Message,
  User,
  Room,
  UserRoom,
};
