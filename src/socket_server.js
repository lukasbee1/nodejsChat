/* eslint-disable no-param-reassign */

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const jwtDecode = require('jwt-decode');
const cors = require('cors');
const Chat = require('./Chat');


const regexp = /\/([a-zA-Z]*)/;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

server.listen(8080, () => {
  console.log('Server started on 8080');
});
let userData;

app.post('/login', (req, res) => {
  userData = jwtDecode(req.body.id_token);
  console.log(userData);
  res.send(userData);
});

const clients = [];
const chats = [];
const clientsID = [];

const ID = () => `_${Math.random().toString(36).substr(2, 5)}`;
const getClientByID = id => clients.filter(client => client.id === id.trim())[0];

const commands = {
  '/clients': (data, clientG) => {
    clients.forEach((client) => {
      clientG.send(client.id);
    });
  },
  '/createChat': (data, creator) => {
    if (data[1]) {
      const interlocutor = getClientByID(data[1]);
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
  //   '/addUser': (clientG, user) => { // for creating group chat from dual
  //   },
};

io.on('connection', (client) => {
  client.chats = [];
  client.id = ID();
  clientsID.push(client.id);
  clients.push(client);
  console.log(`client connected, ID: ${client.id}`);
  clients.forEach((cl) => {
    cl.emit('clientsID', clientsID);
  });

  client.on('reply', (data) => {
    // console.log(data);
    if (data[0] === '/') {
      const newData = data.toString().split(' ');
      const command = data.toString().match(regexp)[0];
      if (commands[command] !== undefined) {
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
    clients.splice(getClientByID(client.id), 1);
    clientsID.splice(client.id, 1);
  });
});
