// Import net module.
var net = require('net');

// const readline = require('readline');
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// This function create and return a net.Socket object to represent TCP client.
function getConn() {

    const option = {
        host: 'localhost',
        port: 7000
    }

    const client = net.createConnection(option, function () {
        console.log('creating connection...');
    });

    client.setEncoding('utf8');

    client.on('connect', function (socket) {
        console.log('client connected, listening client');
    })
    client.on('ready', function (socket) {
        process.stdin.on('readable', () => {
            let chunk;
            // Use a loop to make sure we read all available data.
            while ((chunk = process.stdin.read()) !== null) {
                //process.stdout.write(`data: ${chunk}`);
                this.write(chunk);
                client.emit('response', chunk);
            }
        });
        process.stdin.on('end', () => {
            process.stdout.write('end');
        });
    });

    // When receive server send back data.
    client.on('data', function (data) {
        console.log('Server return data: ' + data);
        if (data.toString() === 'Will you connect to chat?[y/n]') {

        }

    });

    // When connection disconnected.
    client.on('end', function () {
        console.log('Client socket disconnect. ');
        process.exit();
    });

    client.on('error', function (err) {
        console.error(JSON.stringify(err));
    });

    return client;
}


const javaClient = getConn();
//javaClient.write('hello');
