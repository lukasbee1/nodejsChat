const {
  generateUserId,
} = require('../utils/utils');
const socketList = require('../socketList/socketList');
const {
  User,
  Room,
  UserRoom,
  Message,
} = require('../sequelize');

const postLogin = (req, res) => {
  const {
    email,
    login,
    name,
    avatar,
  } = req.body;

  const uniqueId = generateUserId();
  return User.create({
    uniqueId,
    name,
    email,
    avatar,
  }).then(data => res.send({
    email,
    uniqueId,
    login,
    id: data.id,
    avatar,
  }));
};

// !!!!!!!!!!!!!!!!!!!emit!!!!!!!!!!!!!!
const getChats = (req, res) => {
  Room.findAll()
    .then((rooms) => {
      res.json(rooms);
      // io.emit('chatsUpdated', rooms);
    });
};

const getUsers = (req, res) => {
  User.findAll()
    .then((users) => {
      res.json(users);
      // io.emit('clientsUpdated', users);
    });
};

const saveMessage = (userId, tweet, roomId) => {
  Message.create({
    userId,
    tweet,
    roomId,
  });
};

const getMessages = (req, res) => {
  let query;
  if (req.params.chatId) {
    query = Message.findAll({
      where: {
        roomId: req.params.chatId,
      },
    });
    return query.then(messages => res.json(messages));
  }
  return [{
    key: 'error',
  }];
};

const createChat = (name, usersId) => {
  Room.create({
    name,
  })
    .then((data) => {
      saveMessage(1, 'Chat created', data.id);
      Room.findAll()
        .then((rooms) => {
          socketList.connections[0].emit('clientsUpdated', rooms);
        });
    })
    .then((room) => {
      usersId.forEach((element) => {
        UserRoom.create({
          userId: element,
          roomId: room.id,
        });
      });
    });
};

// const createUser = ()
module.exports = {
  postLogin,
  getChats,
  getUsers,
  saveMessage,
  getMessages,
  createChat,
};
