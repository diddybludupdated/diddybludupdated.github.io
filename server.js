const express = require('express');
const http = require('http');
const { createBareServer } = require('@twn39/bare-server-node');
const path = require('path');

const app = express();
const bare = createBareServer('/bare/');
const server = http.createServer();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`UnblockPlay running on http://localhost:${PORT}`);
});
