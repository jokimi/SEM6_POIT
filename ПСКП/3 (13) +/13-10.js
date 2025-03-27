const dgram = require('dgram');
const readline = require('readline');
const client = dgram.createSocket('udp4');
const PORT = 4000;
const HOST = '127.0.0.1';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter message to send to server: ', (message) => {
    const msgBuffer = Buffer.from(message);
    client.send(msgBuffer, PORT, HOST, (err) => {
        if (err) {
            console.error('Error sending message:', err);
            client.close();
            return;
        }
        console.log(`Message sent: ${message}`);
    });
});

client.on('message', (msg, rinfo) => {
    console.log(`Received from server: ${msg}`);
    client.close();
});

client.on('close', () => {
    console.log('Connection closed.');
});

client.on('error', (err) => {
    console.error(`Client error: ${err.message}`);
});