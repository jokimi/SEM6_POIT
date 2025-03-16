const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:4000");

ws.on("open", () => console.log("Подключено к серверу"));
ws.on("message", (data) => console.log("Получено уведомление:", JSON.parse(data)));
ws.on("close", () => console.log("Соединение закрыто"));