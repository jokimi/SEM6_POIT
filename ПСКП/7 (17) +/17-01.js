const redis = require('redis')

const client = redis.createClient({url: 'redis://redis-17126.c261.us-east-1-4.ec2.redns.redis-cloud.com:17126'});

client.on('ready', () => console.log('Готово к работе'));
client.on('error', (e) => console.log('Ошибка', e));
client.on('connect', () => console.log('Подключено'));
client.on('end', () => console.log('Завершение работы'));

client.connect()
    .then(() => {
        console.log("test message");
        client.quit();
    })
    .catch(err => console.log(err));