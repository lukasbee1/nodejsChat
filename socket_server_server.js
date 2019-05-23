const Chat = require('./Chat');
const net = require('net');

const serverClients = [];
const chats = [];

const commands = {
    '/clients': (clientG) => {
        serverClients.forEach(client => {
            clientG.write(client.remotePort.toString());
        });
    },
    '/createChat': (outStr, creator) => {
        if (outStr.search(/[0-9]{5}/) !== -1) {
            const chat = new Chat('asdasd');
            let interlocutorID = outStr.match(/[0-9]{5}/)[0];

            if (interlocutorID) {
                const interlocutorReturn = serverClients.filter(client => client.remotePort.toString() === interlocutorID)[0];

                if (interlocutorReturn) {
                    //interlocutorReturn.write('Will you connect to chat?[y/n]');
                    interlocutorReturn.write('You are connected to the chat with user ID: ' + creator.remotePort);

                    interlocutorReturn.chats.push(chat.getID());
                    creator.chats.push(chat.getID());

                    chat.addUser(interlocutorReturn);
                    chat.addUser(creator);
                    chat.setState(true);
                    chats.push(chat);
                    console.log('Success! Chat was created!');
                    creator.write('Success! Chat was created!');
                    return interlocutorReturn;
                } else {
                    creator.write('error: interlocutor not found in serverClients');
                }
            } else {
                creator.write('error: interlocutor not found in your input');
            }
        } else {
            creator.write('wrong input');
            //creator.write(commands['/clients'](this));
        }
    },
    '/leaveChat': (clientG, chatID) => {
        chats.removeUser(clientG);
        chats.users.forEach(user => {
            user.write('User with ID: ' + clientG.remotePort + ' leaved the chat.');
        });
        clientG.write('You are leave chat');
    },
    '/chatList': (clientG) => {
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
            command = data.toString().trim();
            if (command.match(/\/[a-z]+/i)[0] === '/createChat') {
                commands['/createChat'](command, client); //commands['createChat]() returns interlocutor obj


            } else if (commands[command]) {
                commands[command](client);
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
