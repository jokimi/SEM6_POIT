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
    console.time('HSET');
    for (let i = 1; i <= 10000; i += 1000) {
        const batch = [];
        for (let j = i; j < i + 1000; j++) {
            batch.push(client.hSet('myhash', j.toString(), JSON.stringify({ id: j, val: `val-${j}` })));
        }
        await Promise.all(batch);
    }
    console.timeEnd('HSET');
    console.time('HGET');
    for (let i = 1; i <= 10000; i += 1000) {
        const batch = [];
        for (let j = i; j < i + 1000; j++) {
            batch.push(client.hGet('myhash', j.toString()));
        }
        await Promise.all(batch);
    }
    console.timeEnd('HGET');
    await client.quit();
})();