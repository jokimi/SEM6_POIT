const rpcws = require('rpc-websockets').Server;
let server = new rpcws({ port: 4000, host: 'localhost' });

server.register('A', () => {
    console.log('Уведомление A')
}).public();

server.register('B', () => {
    console.log('Уведомление B')
}).public();

server.register('C', () => {
    console.log('Уведомление C')
}).public();