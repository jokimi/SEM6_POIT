const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 4000 }, () => {
	console.log(`ws://localhost:4000`);
});

server.on("connection", (ws) => {
	ws.on("pong", (data) => {
		console.log(`Pong! Сообщение: ${data.toString()}`);
	});
	ws.onclose = (event) => console.log(event.code, event.reason);
});

let count = 0;

setInterval(() => {
	server.clients.forEach((client) => {
		client.send(`11-03-server: ${++count}\n`);
	});
}, 15000);

setInterval(() => {
	server.clients.forEach((client) => {
		client.ping("ping");
	});
	console.log(`server: ping, ${server.clients.size} connected clients`);
}, 5000);