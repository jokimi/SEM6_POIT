const WebSocket = require("ws");
const fs = require("fs");

const ws = new WebSocket("ws://localhost:4000");
const connectionServer = WebSocket.createWebSocketStream(ws, { encoding: "utf8", });

ws.on("ping", (data) => {
	console.log(`Ping! Сообщение: ${data.toString()}`);
});

connectionServer.pipe(process.stdout);