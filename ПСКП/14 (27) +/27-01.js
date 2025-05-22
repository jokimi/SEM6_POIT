const TelegramBot = require('node-telegram-bot-api');

const token = '7908179036:AAFzy_jgSVZEBSDwAjbFRQN1yikqQcHUhWs';
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const message = msg.text;
    bot.sendMessage(chatId, `echo: ${message}`);
});