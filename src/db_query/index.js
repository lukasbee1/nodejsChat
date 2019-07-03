
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

const addUserToChat = (userId, roomId) => {
  UserRoom.create({
    userId,
    roomId,
  });
};

// !!!!!!!!!!!!!!!!!!!emit!!!!!!!!!!!!!!
const getChats = (req, res) => {
  Room.findAll({
    where: {

    },
  })
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
  if (req.params.chatId) {
    Room.findOne({
      where: {
        id: req.params.chatId,
      },
    })
      .then((room) => {
        console.log(room);
        room.getMessages({
          order: [
            ['id'],
          ],
          include: {
            as: 'Sender',
            model: User,
          },
        })
          .then((messages) => {
            console.log('___________________________________');
            console.log(messages);

            res.json(messages);
          });
      });
  }
  return [{
    key: 'error',
  }];
};

const createChat = (name) => {
  Room.create({
    name,
  })
    .then((data) => {
      saveMessage(1, 'Chat created', data.id);
      Room.findAll()
        .then((rooms) => {
          socketList.connections[0].emit('clientsUpdated', rooms);
        });
    });
  // .then((room) => {
  // usersId.forEach((element) => {
  //   UserRoom.create({
  //     userId: element,
  //     roomId: room.id,
  //   });
  // });
  // });
};
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
  }).then((data) => {
    addUserToChat(data.id, 1);
    res.send({
      email,
      uniqueId,
      login,
      id: data.id,
      avatar,
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
  addUserToChat,
};
