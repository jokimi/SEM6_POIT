const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const ws = new WebSocket('ws://localhost:4000');
const requestedFile = 'fromserver.txt';
const savePath = path.join(__dirname, requestedFile);

ws.on('open', () => {
    ws.send(requestedFile + '\n');
});

const fileStream = fs.createWriteStream(savePath);

ws.on('message', (data) => {
    const message = data.toString().trim();
    if (message === 'END') {
        console.log(`Файл ${requestedFile} успешно загружен`);
        ws.close();
        return;
    }
    if (message.startsWith('Ошибка')) {
        console.error(message);
        ws.close();
        return;
    }
    fileStream.write(data);
});

ws.on('error', (error) => {
    console.error('Ошибка WebSocket:', error);
});

ws.on('close', () => {
    fileStream.end();
});