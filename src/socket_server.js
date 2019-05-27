const Websocket = require('ws');
const Chat = require('./Chat');


const serverClients = [];
const chats = [];
const publicChat = new Chat('public');
chats.push(publicChat);
const regexp = /\/([a-zA-Z]*)/;

const getClientByID = (id) => {
  const clientG = serverClients.filter(client => client.remotePort.toString() === id.trim());
  // console.log(client);
  return clientG[0];
};
const commands = {
  '/clients': (data, clientG) => {
    serverClients.forEach((client) => {
      clientG.send(client.remotePort.toString());
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
        interlocutor.send(`You are connected to the chat with user ID: ${creator.remotePort}`);
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
          if (user !== clientG) user.send(`User with ID: ${clientG.remotePort} leaved the chat.`);
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

const server = new Websocket.Server({
  port: 7000
})

server.on('connection', (client) => {
  console.log(`client connected, ID: ${client.remotePort}`);
  // eslint-disable-next-line no-param-reassign
  client.chats = [];
  publicChat.addUser(client);
  serverClients.push(client);
  client.chats.push(publicChat.getID());

  client.on('message', (data) => {
    // if (data.toString().trim() === 'hello')
    //     client.send('world');
    if (data.toString()[0] === '/') {
      const newData = data.toString().split(' ');
      const command = data.toString().match(regexp)[0];
      if (commands[command] !== undefined) {
        commands[command](newData, client);
      } else {
        client.send(`Command not found, list of commands: ${Object.keys(commands).toString()}`);
      }
    } else if (chats.length > 0 && client.chats.length > 0) {
      chats.forEach((chat) => {
        console.log(`${client.chats[0] + chat.getID()} xxx ${client.chats.includes(chat.getID())}`);
        if (client.chats.indexOf(chat.getID().trim()) !== -1) {
          chat.users.forEach((user) => {
            if (chat.inChat(user) && user !== client) {
              user.send(`received data from ${client.remotePort}. Data: ${data}`);
            }
          });
        }
      });
    } else {
      console.log(`Received client data: ${data}`);
    }
  });

  client.on('close', () => {
    console.log('client disconnected');
  });
});
// server.listen(7000, () => {
//   console.log('server receiving data...');
// });
