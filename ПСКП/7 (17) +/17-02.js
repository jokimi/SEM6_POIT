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
    console.time('SET');
    for (let i = 1; i <= 10000; i += 1000) {
        await Promise.all(
            Array.from({ length: 1000 }, (_, j) =>
                client.set((i + j).toString(), `set${i + j}`)
            )
        );
    }
    console.timeEnd('SET');
    console.time('GET');
    for (let i = 1; i <= 10000; i += 1000) {
        await Promise.all(
            Array.from({ length: 1000 }, (_, j) =>
                client.get((i + j).toString())
            )
        );
    }
    console.timeEnd('GET');
    console.time('DEL');
    for (let i = 1; i <= 10000; i += 1000) {
        await Promise.all(
            Array.from({ length: 1000 }, (_, j) =>
                client.del((i + j).toString())
            )
        );
    }
    console.timeEnd('DEL');
    await client.quit();
})();