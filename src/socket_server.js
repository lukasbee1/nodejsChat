/* eslint-disable no-param-reassign */
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
// const jwtDecode = require('jwt-decode');
const cors = require('cors');
const Chat = require('./Chat');
const UserC = require('./User');

const {
  User,
  Message,
  Room,
} = require('./sequelize');

const regexp = /\/([a-zA-Z]*)/;

const users = [];
const chats = [];
const usersInfo = [];

const commonChat = new Chat('common');

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

let userInfo;
app.post('/login', (req, res) => {
  const {
    email,
    login,
    name,
  } = req.body;
  const us = new UserC(email, login, name);
  commonChat.addUser(us);
  const {
    id,
  } = us;
  users.push(us);
  userInfo = {
    email,
    login,
    name,
  }; // data for other clients, without uniqueId, password, ect...
  usersInfo.push(userInfo);

  io.emit('clientsUpdated', usersInfo);
  return User.create({
    uniqueId: us.id,
    name,
    email,
  }).then(() => {
    if (users) {
      return res.send({
        email,
        id,
        login,
      });
    }
    return res.status(400).send('Error in insert new record');
  });
});

app.get('/api/clientsList', (req, res) => {
  Room.findAll()
    .then((rooms) => {
      res.json(rooms);
      io.emit('clientsUpdated', rooms);
    });
});

app.get('/api/messages/id:chatId?', (req, res) => {
  console.log(req.params);
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
});

const commands = {
  '/clients': (data, clientG) => {
    const names = [];
    users.forEach((user) => {
      names.push(`${user.firstName} `);
    });
    clientG.emit('message', names);
  },
  '/createChat': (data, creator) => {
    if (data[1]) {
      const interlocutor = UserC.getClientByID(data[1]);
      if (interlocutor) {
        const chat = new Chat('asdasd');
        // interlocutorReturn.send('Will you connect to chat?[y/n]');
        interlocutor.chats.push(chat.getID());
        creator.chats.push(chat.getID());
        chat.addUser(interlocutor);
        chat.addUser(creator);
        chats.push(chat);
        console.log('Success! Chat was created!');
        creator.send('Success! Chat was created!');
        interlocutor.send(`You are connected to the chat with user ID: ${creator.id}`);
        return interlocutor;
      }
      console.log('interlocutor not found');
    } else {
      creator.send('wrong input...');
    }
    return 'error';
  },
  '/leaveChat': (data, clientG) => {
    if (data[1]) {
      const currChat = Chat.getChatByID(data[1], chats);
      if (currChat) {
        clientG.chats.splice(chats.indexOf(currChat.getID()), 1);
        currChat.removeUser(clientG);
        currChat.users.forEach((user) => {
          if (user !== clientG) user.send(`User with ID: ${clientG.id} leaved the chat.`);
        });
        clientG.send('You are leave chat');
      } else {
        console.log('chat not found...');
      }
    } else {
      clientG.send('wrong input, chatlist: ');
    }
  },
  '/chatList': (data, clientG) => {
    chats.forEach((chat) => {
      clientG.send(chat.getID());
    });
  },
};
io.on('connection', (client) => {
  console.log(`client connected, email: ${1}`);
  client.on('reply', (data) => {
    // console.log(data);
    if (data[0] === '/') {
      const newData = data.toString().split(' ');
      const command = data.toString().match(regexp)[0];
      if (commands[command] !== undefined) {
        console.log('command');
        commands[command](newData, client);
      } else {
        client.send(`Command not found, list of commands: ${Object.keys(commands).toString()}`);
      }
    } else if (chats.length > 0 && client.chats.length > 0) {
      chats.forEach((chat) => {
        if (client.chats.indexOf(chat.getID().trim()) !== -1) {
          chat.users.forEach((user) => {
            if (chat.inChat(user) && user !== client) {
              user.send(`${data}`);
            }
          });
        }
      });
    } else {
      console.log(`Received client data: ${data}`);
      // client.send(data);
    }
  });

  client.on('disconnect', () => {
    console.log('client disconnected');
    //  clients.splice(getClientByID(client.id), 1);
    //  clientsID.splice(client.id, 1);
  });
});
