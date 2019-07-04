/* eslint-disable no-param-reassign */
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
// const jwtDecode = require('jwt-decode');
const cors = require('cors');
const socketList = require('./socketList/socketList');
const {
  saveMessage,
  postLogin,
  getChats,
  getUsers,
  getMessages,
  createChat,
  // addUserToChat,
} = require('./db_query/index');

const regexp = /\/([a-zA-Z]*)/;

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(cors());
server.listen(8080, () => {
  console.log('Server started on 8080');
});

// app.post('/authGoogle', (req, res) => {
//   const userData = jwtDecode(req.body.id_token);
//   const us = new User(userData.email, 'pass', userData.email); // login pass email
//   users.push(us);
//   userLogins.push(us.login);
//   const { login, id } = userData.email;
//   const sock = { login, id };
//   res.send({ sock });
//   io.emit('clientsUpdated', userLogins);
// });

app.post('/login', postLogin);
app.get('/api/chatsList/userId:id?', getChats);
app.get('/api/usersList', getUsers);
app.get('/api/messages/id:chatId?', getMessages);

const commands = {
  // '/clients': (data, clientG) => {
  //   const names = [];
  //   users.forEach((user) => {
  //     names.push(`${user.name}; `);
  //   });
  //   clientG.emit('reply', {
  //     tweet: names,
  //   });
  // },
  '/createChat': (args, creator) => {
    if (args[1]) {
      createChat(args[1]);
      // interlocutorReturn.send('Will you connect to chat?[y/n]');
      // creator.chats.push(chat.getID());

      console.log('Success! Chat was created!');
      creator.send({
        tweet: 'Success! Chat was created!',
      });
      // interlocutor.send({
      //   tweet: `You are connected to the chat with user ID: ${creator.id}`
      // });
    } else {
      creator.send({
        tweet: 'wrong input...',
      });
    }
    return 'error';
  },
  // '/leaveChat': (args, clientG) => {
  //   // if (args[1]) {
  //   //   const currChat = Chat.getChatByID(args[1], chats);
  //   //   if (currChat) {
  //   //     clientG.chats.splice(chats.indexOf(currChat.getID()), 1);
  //   //     currChat.removeUser(clientG);
  //   //     currChat.users.forEach((user) => {
  //   //       if (user !== clientG) {
  //   //         user.send({
  //   //           tweet: `User with ID: ${clientG.id} leaved the chat.`,
  //   //         });
  //   //       }
  //   //     });
  //   //     clientG.send({
  //   //       tweet: 'You are leave chat',
  //   //     });
  //   //   } else {
  //   //     console.log('chat not found...');
  //   //   }
  //   // } else {
  //   //   clientG.send({
  //   //     tweet: 'wrong input, chatlist: ',
  //   //   });
  //   // }
  // },
  // '/chatList': (data, clientG) => {
  //   // chats.forEach((chat) => {
  //   //   clientG.send({
  //   //     tweet: chat.getID(),
  //   //   });
  //   // });
  // },
};

io.on('connection', (client) => {
  console.log(`client connected, email: ${1}`);
  socketList.addUser(client);
  client.on('reply', (data, userId, roomId) => {
    console.log(data);
    saveMessage(userId, data, roomId);
    client.emit('message', data);
    if (data[0] === '/') {
      const newData = data.toString().split(' ');
      const command = data.toString().match(regexp)[0];
      if (commands[command]) {
        console.log('command');
        commands[command](newData, client);
      }

      // else {
      //   console.log('not command');
      //   client.send(
      //     `Command not found, list of commands: ${Object.keys(commands).toString()}`,
      //   );
      // }
    }
  });

  // io.emit('clientsUpdated', usersInfo);
  client.on('disconnect', () => {
    console.log('client disconnected');
    socketList.removeUser(client);
    //  clients.splice(getClientByID(client.id), 1);
    //  clientsID.splice(client.id, 1);
  });
});
