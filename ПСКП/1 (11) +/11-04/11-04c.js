const WebSocket = require('ws');

if (process.argv.length < 3) {
    console.log('Вы не указали имя клиента!');
    process.exit(1);
}

const clientName = process.argv[2];
const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => {
    const message = {
        client: clientName,
        timestamp: new Date().toISOString()
    };

    ws.send(JSON.stringify(message));
});

ws.on('message', (data) => {
    console.log('Ответ от сервера:', data.toString());
});