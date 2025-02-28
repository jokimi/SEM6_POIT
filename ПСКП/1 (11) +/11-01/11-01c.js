const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const { createReadStream } = require('fs');

const ws = new WebSocket('ws://localhost:4000');
const filePath = path.join(__dirname, 'toserver.txt');

ws.on('open', () => {
    const fileName = path.basename(filePath);
    ws.send(fileName + '\n');
    const fileStream = createReadStream(filePath);
    fileStream.on('data', (chunk) => {
        ws.send(chunk);
    });
    fileStream.on('end', () => {
        console.log(`Файл ${fileName} успешно отправлен`);
        ws.close();
    });
    fileStream.on('error', (err) => {
        console.error('Ошибка чтения файла:', err);
    });
});

ws.on('message', (message) => {
    console.log('Ответ от сервера:', message.toString());
});

ws.on('error', (error) => {
    console.error('Ошибка WebSocket:', error);
});