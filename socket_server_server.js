const Chat = require('./Chat');
const net = require('net');

const serverClients = [];
const chats = [];
const regexp = '/[0-9]{5}/';
const regexp2 = '/\/[a-z]+/i';
const regexp3 = '\/([a-zA-Z]*)'

const getClientByID = (id) => {
    console.log('id' + id);
    client = serverClients.filter(client => client.remotePort.toString() === id.trim());
    // console.log(client);
    return client[0];
}
const commands = {
    '/clients': (data, clientG) => {
        serverClients.forEach(client => {
            clientG.write(client.remotePort.toString());
        });
    },
    '/createChat': (data, creator) => {
        if (data[1]) {
            const interlocutor = getClientByID(data[1]);
            if (interlocutor) {
                const chat = new Chat('asdasd');
                //interlocutorReturn.write('Will you connect to chat?[y/n]');
                interlocutor.chats.push(chat.getID());
                creator.chats.push(chat.getID());
                chat.addUser(interlocutor);
                chat.addUser(creator);
                chats.push(chat);
                console.log('Success! Chat was created!');
                creator.write('Success! Chat was created!');
                interlocutor.write('You are connected to the chat with user ID: ' + creator.remotePort);
                return interlocutor;
            } else {
                console.log('interlocutor not found');
            }
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
                currChat.users.forEach(user => {
                    if (user !== clientG)
                        user.write('User with ID: ' + clientG.remotePort + ' leaved the chat.');
                });
                clientG.write('You are leave chat');
            } else {
                console.log('chat not found...');
            }
        } else {
            creator.write('wrong input, chatlist: ');
        }
    },
    '/chatList': (data, clientG) => {
        chats.forEach(chat => {
            clientG.write(chat.getID());
        });
    },
    '/addUser': (clientG, user) => { //for creating group chat from dual

    }
}

// Create and return a net.Server object, the function will be invoked when client connect to this server.
var server = net.createServer(function (client) {
    console.log('client connected, ID: ' + client.remotePort);
    client.chats = [];
    serverClients.push(client);

    client.on('data', function (data) {

        // if (data.toString().trim() === 'hello')
        //     client.write('world');
        if (data.toString()[0] === '/') {

            const newData = data.toString().split(' ');
            const command = data.toString().match(regexp3)[0];
            if (commands[command] !== undefined) {
                commands[command](newData, client);
            } else {
                client.write('Command not found, list of commands: ' + Object.keys(commands).toString());
            }
        }
        else if (chats.length > 0 && client.chats.length > 0) {
            chats.forEach(chat => {
                if (client.chats.includes(chat.getID())) {
                    chat.users.forEach(user => {
                        if (chat.inChat(user) && user !== client) {
                            user.write('received data from ' + client.remotePort + '. Data: ' + data);
                        }
                    });
                }
            });
        } else {
            console.log('Received client data: ' + data);
        }
    });

    client.on('end', () => {
        console.log('client disconnected');
    });

});
server.listen(7000, () => {
    console.log('server receiving data...');
});
