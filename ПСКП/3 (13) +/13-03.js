const net = require('net');
const HOST = '127.0.0.1';
const PORT = 4000;
let sum = 0;
let server = net.createServer();

server.on('connection', socket => {
    console.log(`\nNew connection: ${socket.remoteAddress}:${socket.remotePort}`);
    socket.on('data', data => {
        sum += data.readInt32LE();
        console.log(`Server received from client: `, data, `sum = ${sum}`);
    })
    let buf = Buffer.alloc(4);
    setTimeout(() => {
        setInterval(() => {
            buf.writeInt32LE(sum, 0);
            socket.write(buf);
        }, 5000);
    }, 500);
    socket.on('close', () => {
        console.log('Connection closed.');
    });
    socket.on('error', error => {
        console.log('[ERROR] Client: ' + error.message);
    });
});

server.on('error', error => {
    console.log('[ERROR] Server: ' + error.message);
});
server.listen(PORT, HOST);