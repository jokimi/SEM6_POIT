const redis = require('redis');

const subscriber = redis.createClient({
    url: 'redis://default:0oS3ALSjppFh8CqtyOjXr1EcAnuDPxK2@redis-17126.c261.us-east-1-4.ec2.redns.redis-cloud.com:17126'
});

subscriber.on('ready', () => console.log('Готово к работе'));
subscriber.on('error', (e) => console.log('Ошибка', e));
subscriber.on('connect', () => console.log('Подключено'));
subscriber.on('end', () => console.log('Завершение работы'));

(async () => {
    await subscriber.connect();

    await subscriber.subscribe('news', (message) => {
        console.log(`[SUBSCRIBER] Получено: ${message}`);
    });
})();