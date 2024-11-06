const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname)));

// create WebSocket server
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (socket) => {
    console.log('user conected');

    socket.on('message', (message) => {
        const { name } = JSON.parse(message);
        console.log('recieved msg:', name);
    
        // broadcast msg for all connected users
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) 
                client.send(name);
        });
    });

    socket.on('close', () => {
        console.log('user disconected');
    });
});

// Embed WebSocket to Express HTTP server
app.server = app.listen(3000, () => {
    console.log('שרת HTTP ו-WS מאזין על פורט 3000');
});

app.server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
