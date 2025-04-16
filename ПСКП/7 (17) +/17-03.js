const redis = require('redis');

const client = redis.createClient({
    url: 'redis://default:0oS3ALSjppFh8CqtyOjXr1EcAnuDPxK2@redis-17126.c261.us-east-1-4.ec2.redns.redis-cloud.com:17126'
});

client.on('ready', () => console.log('Готово к работе'));
client.on('error', (e) => console.log('Ошибка', e));
client.on('connect', () => console.log('Подключено'));
client.on('end', () => console.log('Завершение работы'));

(async () => {
    await client.connect();
    await client.set('incr', 0);
    console.time('INCR');
    for (let i = 0; i < 10000; i += 1000) {
        await Promise.all(
            Array.from({ length: 1000 }, () => client.incr('incr'))
        );
    }
    console.timeEnd('INCR');
    console.time('DECR');
    for (let i = 0; i < 10000; i += 1000) {
        await Promise.all(
            Array.from({ length: 1000 }, () => client.decr('incr'))
        );
    }
    console.timeEnd('DECR');
    await client.quit();
})();