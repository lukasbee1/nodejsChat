const net = require('net');
const Chat = require('./Chat');

const serverClients = [];
const chats = [];
const publicChat = new Chat('public');
chats.push(publicChat);
// const regexp = '/[0-9]{5}/';
// const regexp2 = '/\/[a-z]+/i';
const regexp3 = '\/([a-zA-Z]*)';

const getClientByID = (id) => {
  const clientG = serverClients.filter(client => client.remotePort.toString() === id.trim());
  // console.log(client);
  return clientG[0];
};
const commands = {
  '/clients': (data, clientG) => {
    serverClients.forEach((client) => {
      clientG.write(client.remotePort.toString());
    });
  },
  // eslint-disable-next-line consistent-return
  '/createChat': (data, creator) => {
    if (data[1]) {
      const interlocutor = getClientByID(data[1]);
      if (interlocutor) {
        const chat = new Chat('asdasd');
        // interlocutorReturn.write('Will you connect to chat?[y/n]');
        interlocutor.chats.push(chat.getID());
        creator.chats.push(chat.getID());
        chat.addUser(interlocutor);
        chat.addUser(creator);
        chats.push(chat);
        console.log('Success! Chat was created!');
        creator.write('Success! Chat was created!');
        interlocutor.write(`You are connected to the chat with user ID: ${creator.remotePort}`);
        return interlocutor;
      }
      console.log('interlocutor not found');
    } else {
      creator.write('wrong input...');
    }
  },
  '/leaveChat': (data, clientG) => { // needs in fixing
    if (data[1]) {
      const currChat = Chat.getChatByID(data[1], chats);
      if (currChat) {
        clientG.chats.splice(chats.indexOf(currChat.getID()), 1);
        currChat.removeUser(clientG);
        currChat.users.forEach((user) => {
          if (user !== clientG) user.write(`User with ID: ${clientG.remotePort} leaved the chat.`);
        });
        clientG.write('You are leave chat');
      } else {
        console.log('chat not found...');
      }
    } else {
      clientG.write('wrong input, chatlist: ');
    }
  },
  '/chatList': (data, clientG) => {
    chats.forEach((chat) => {
      clientG.write(chat.getID());
    });
  },
  //   '/addUser': (clientG, user) => { // for creating group chat from dual

//   },
};

const server = net.createServer((client) => {
  console.log(`client connected, ID: ${client.remotePort}`);
  // eslint-disable-next-line no-param-reassign
  client.chats = [];
  publicChat.addUser(client);
  serverClients.push(client);
  client.chats.push(publicChat.getID());

  client.on('data', (data) => {
    // if (data.toString().trim() === 'hello')
    //     client.write('world');
    if (data.toString()[0] === '/') {
      const newData = data.toString().split(' ');
      const command = data.toString().match(regexp3)[0];
      if (commands[command] !== undefined) {
        commands[command](newData, client);
      } else {
        client.write(`Command not found, list of commands: ${Object.keys(commands).toString()}`);
      }
    } else if (chats.length > 0 && client.chats.length > 0) {
      chats.forEach((chat) => {
        console.log(`${client.chats[0] + chat.getID()} xxx ${client.chats.includes(chat.getID())}`);
        if (client.chats.indexOf(chat.getID().trim()) !== -1) {
          chat.users.forEach((user) => {
            if (chat.inChat(user) && user !== client) {
              user.write(`received data from ${client.remotePort}. Data: ${data}`);
            }
          });
        }
      });
    } else {
      console.log(`Received client data: ${data}`);
    }
  });

  client.on('end', () => {
    console.log('client disconnected');
  });
});
server.listen(7000, () => {
  console.log('server receiving data...');
});
