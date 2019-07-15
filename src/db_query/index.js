
const { generateUserId } = require('../utils/utils');
const socketList = require('../socketList/socketList');
const {
  User, Room, UserRoom, Message,
} = require('../sequelize');

const addUserToChat = (userId, roomId) => {
  UserRoom.create({ userId, roomId }); // must emit added user!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
};

const getChats = (req, res) => {
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
    });
};

const getUsers = (req, res) => {
  User.findAll()
    .then((users) => {
      res.json(users);
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

const createChat = (req, res) => {
  const { name, users } = req.body;
  Room.create({
    name,
  })
    .then((data) => {
      console.log('chat created, id: ', data.id);
      saveMessage(1, 'Chat created', data.id);
      users.forEach((user) => {
        addUserToChat(user.id, data.id);
        socketList.connections.map(conn => (conn.uniqueId === user.uniqueId ? conn.emit('chatInvite', data) : null));
      });
      res.send(data);
    })
    .then(() => {

    })
    .catch((error) => {
      console.log(`There has been a problem with your fetch operation: ${error.message}`);
      throw error;
    });
};
const postLogin = (req, res) => {
  console.log('post Login!!!!!!!!!!!!!');
  const {
    login,
    password,
  } = req.body;
  console.log(login, password);
  return User.findOne({
    where: {
      login,
    },
  }).then((user) => {
    if (user) {
      if (user.password === password) {
        console.log(user);
        res.send({
          login,
          email: user.email,
          uniqueId: user.uniqueId,
          id: user.id,
          avatar: user.avatar,
        });
      }
    } else {
      res.send({ error: 'invalid email or password' });
    }
  })
    .catch((error) => {
      console.log(`There has been a problem with your fetch operation: ${error.message}`);
      throw error;
    });
};

const postRegister = (req, res) => {
  const {
    email,
    login,
    name,
    avatar,
    password,
  } = req.body;
  const uniqueId = generateUserId();
  return User.create({
    login,
    email,
    uniqueId,
    name,
    avatar,
    password,
  }).then((user) => {
    addUserToChat(user.id, 1);
    res.send({
      avatar,
      email,
      uniqueId,
      login,
      id: user.id,
    });
  })
    .catch((error) => {
      console.log(`There has been a problem with your fetch operation: ${error.message}`);
      throw error;
    });
};
module.exports = {
  postLogin,
  getChats,
  getUsers,
  saveMessage,
  getMessages,
  createChat,
  addUserToChat,
  postRegister,
};
