const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 4000 });
console.log('ws://localhost:4000');

let messageCount = 0;

server.on('connection', (ws) => {
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log(`Получено сообщение от клиента ${data.client}:`, data);
            messageCount++;
            const response = {
                server: messageCount,
                client: data.client,
                timestamp: data.timestamp
            };
            ws.send(JSON.stringify(response));
        } catch (error) {
            console.error('Ошибка обработки сообщения:', error);
            ws.send(JSON.stringify({ error: 'Неверный формат сообщения' }));
        }
    });
});