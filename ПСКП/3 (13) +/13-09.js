const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const PORT = 4000;
const HOST = '127.0.0.1';

server.on('message', (msg, rinfo) => {
    console.log(`Received message: ${msg} from ${rinfo.address}:${rinfo.port}`);
    const response = `ECHO: ${msg}`;
    server.send(response, rinfo.port, rinfo.address, (err) => {
        if (err) {
            console.error('Error sending response:', err);
        }
        else {
            console.log(`Sent response: ${response} to ${rinfo.address}:${rinfo.port}`);
        }
    });
});

server.on('error', (err) => {
    console.error(`Server error: ${err.message}`);
});

server.bind(PORT, HOST, () => {
    console.log(`UDP server listening on ${HOST}:${PORT}`);
});