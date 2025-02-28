const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const { createReadStream } = require('fs');
const { createWebSocketStream } = require('ws');

const DOWNLOAD_DIR = path.join(__dirname, 'download');
const server = new WebSocket.Server({ port: 4000 });
console.log('ws://localhost:4000');

server.on('connection', (ws) => {
    const stream = createWebSocketStream(ws, { encoding: 'utf-8' });
    stream.on('data', (fileName) => {
        fileName = fileName.toString().trim();
        const filePath = path.join(DOWNLOAD_DIR, fileName);
        if (!fs.existsSync(filePath)) {
            ws.send('Ошибка: Файл не найден');
            ws.close();
            return;
        }
        console.log(`Отправляется файл: ${fileName}`);
        const fileStream = createReadStream(filePath);
        fileStream.pipe(stream);
        fileStream.on('end', () => {
            console.log(`Файл ${fileName} отправлен`);
            ws.send('END');
            ws.close();
        });
        fileStream.on('error', (err) => {
            console.error('Ошибка чтения файла:', err);
            ws.send('Ошибка при чтении файла');
            ws.close();
        });
    });
});