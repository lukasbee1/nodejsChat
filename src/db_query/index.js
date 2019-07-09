
const {
  generateUserId,
} = require('../utils/utils');

// const socketList = require('../socketList/socketList');

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
  console.log('get chats');
  console.log(req);
  Room.findAll({
    include: [
      {
        model: User,
        where: {
          id: req.params.id,
        },
      },
    ],
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
            res.json(messages);
          });
      });
  }
  return [{
    key: 'error',
  }];
};

const createChat = (req) => {
  const { name, usersId } = req.body;
  Room.create({
    name,
  })
    .then((data) => {
      saveMessage(1, 'Chat created', data.id);
      usersId.forEach((userId) => {
        addUserToChat(userId, data.id);
      });
      // User.findAll({
      //   include: [
      //     {
      //       model: Room,
      //       where: {
      //         id: data.id,
      //       },
      //     },
      //   ],
      // })
      //   .then((users) => {
      //     socketList.connections[0].emit('chatsUpdated', users);
      //   });
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
  }).then((user) => {
    addUserToChat(user.id, 1);
    res.send({
      email,
      uniqueId,
      login,
      id: user.id,
      avatar,
    });
  })
    .catch((error) => {
      console.log(`There has been a problem with your fetch operation: ${error.message}`);
      // ADD THIS THROW error
      throw error;
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
