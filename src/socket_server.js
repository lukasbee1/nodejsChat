/* eslint-disable no-param-reassign */
const express = require('express');

const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
// const jwtDecode = require('jwt-decode');
const cors = require('cors');
const socketList = require('./socketList/socketList');
const {
  saveMessage,
  postLogin,
  postRegister,
  getChats,
  getUsers,
  getMessages,
  createChat,
} = require('./db_query/index');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(cors());
server.listen(8080, () => {
  console.log('Server started on 8080');
});

app.post('/login', postLogin);
app.post('/register', postRegister);
app.post('/createChat', createChat);
app.get('/api/chatsList/userId:id?', getChats);
app.get('/api/usersList', getUsers);
app.get('/api/messages/id:chatId?', getMessages);

io.on('connection', (client) => {
  console.log('client connected');
  client.on('activeChat', (active) => {
    client.join(active);
  });
  client.on('message', ({ tweet, sender, roomId }) => {
    console.log(tweet);
    saveMessage(sender, tweet, roomId).then((mess) => {
      io.sockets.in(roomId).emit('reply', mess, roomId);
    });
  });

  client.on('disconnect', () => {
    console.log('client disconnected');
    socketList.removeUser(client);
  });
  client.on('uniqueId', (uniqueId) => {
    client.uniqueId = uniqueId;
    socketList.addUser(client);
  });
});
