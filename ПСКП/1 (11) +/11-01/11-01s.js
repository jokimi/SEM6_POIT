const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const { createWebSocketStream } = require('ws');

const UPLOAD_DIR = path.join(__dirname, 'upload');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

const server = new WebSocket.Server({ port: 4000 });
console.log('ws://localhost:4000');

server.on('connection', (ws) => {
    const wsStream = createWebSocketStream(ws, { encoding: 'utf8' });
    wsStream.once('data', (fileName) => {
        fileName = fileName.trim();
        const filePath = path.join(UPLOAD_DIR, fileName);
        const fileStream = fs.createWriteStream(filePath);
        console.log(`Начинаем прием файла: ${fileName}`);
        wsStream.pipe(fileStream);
        fileStream.on('finish', () => {
            console.log(`Файл ${fileName} сохранен`);
            ws.send('Файл успешно загружен');
            ws.close();
        });
        fileStream.on('error', (err) => {
            console.error('Ошибка записи файла:', err);
            ws.send('Ошибка при сохранении файла');
            ws.close();
        });
    });
});