const { createServer } = require('http');
const net = require('net');
const HOST = '127.0.0.1';
const PORT_4000 = 4000;
const PORT_5000 = 5000;

let socketHandler = port => {
    return socket => {
        console.log(`[${port}] Client connected: ${socket.remoteAddress}:${socket.remotePort}`);
        socket.on('data', data => {
            console.log(`[${port}] Server received: `, data, ` number = ${data.readInt32LE()}`);
            socket.write('ECHO: ' + data.readInt32LE());
        })
        socket.on('close', () => {
            console.log(`[${port}] Connection closed.`);
        })
        socket.on('error', error => {
            console.log(`[ERROR] Client - ${port}: ${error.message}`);
        });
    }
}

net.createServer(socketHandler(PORT_4000))
    .listen(PORT_4000, HOST)
    .on('listening', () => {
        console.log(`\nStarted server: ${HOST}:${PORT_4000}`);
    });

net.createServer(socketHandler(PORT_5000))
    .listen(PORT_5000, HOST)
    .on('listening', () => {
        console.log(`Started server: ${HOST}:${PORT_5000}\n`);
    });