const Chat = require('./Chat');
const net = require('net');

const serverClients = [];
const chats = [];

const sendMessage = (chatID, message) => {

}
const findInterlocutor = (element) => {
    if (element.remotePort.toString() === interlocutorID.toString())
        return element;
}
const questions = {

}

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

                //creator.write('user not found with ID: ' + interlocutorID);
                if (interlocutorReturn) {
                    interlocutorReturn.write('Will you connect to chat?[y/n]');
                    interlocutorReturn.on('response', (msg) => {
                        console.log('response emmited');
                        if (msg.toString() === 'yes') {

                            chat.addUser(interlocutorReturn);
                            chat.addUser(creator);
                            chats.push(chat);
                            console.log('Success! Chat was created!');
                            creator.write('Success! Chat was created!');
                            return interlocutorReturn;
                        } else {
                            creator.write('Interlocutor refused your suggestion...');
                        }
                    });
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
    }
}

// Create and return a net.Server object, the function will be invoked when client connect to this server.
var server = net.createServer(function (client) {
    console.log('client connected, ID: ' + client.remotePort);
    serverClients.push(client);

    client.on('data', function (data) {

        // Print received client data and length.
        console.log('Received client data: ' + data);
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
    });

    client.on('end', () => {
        console.log('client disconnected');
    });

});
server.listen(7000, () => {
    console.log('server receiving data...');
});
