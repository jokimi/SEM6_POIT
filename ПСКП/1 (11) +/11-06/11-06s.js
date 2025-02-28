const rpcws = require('rpc-websockets').Server;
let server = new rpcws({ port: 4000, host: 'localhost' });

server.event('A');
server.event('B');
server.event('C');

process.stdin.setEncoding('utf-8');

process.stdin.on('readable', () => {
    let data = null;
    while ((data = process.stdin.read()) != null) {
        switch (data.trim().toUpperCase()) {
            case 'A':
                server.emit('A', 'Событие A');
                break;
            case 'B':
                server.emit('B', 'Событие B');
                break;
            case 'C':
                server.emit('C', 'Событие C');
                break;
        }
    }
});