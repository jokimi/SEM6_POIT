const redis = require('redis');

const publisher = redis.createClient({
    url: 'redis://default:0oS3ALSjppFh8CqtyOjXr1EcAnuDPxK2@redis-17126.c261.us-east-1-4.ec2.redns.redis-cloud.com:17126'
});

publisher.on('ready', () => console.log('Готово к работе'));
publisher.on('error', (e) => console.log('Ошибка', e));
publisher.on('connect', () => console.log('Подключено'));
publisher.on('end', () => console.log('Завершение работы'));

(async () => {
    await publisher.connect();
    let i = 0;
    const interval = setInterval(async () => {
        const message = `Сообщение ${++i}`;
        await publisher.publish('news', message);
        console.log(`[PUBLISHER] Отправлено: ${message}`);
        if (i >= 5) {
            clearInterval(interval);
            await publisher.quit();
        }
    }, 1000);
})();