'use strict';

const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketio(server);

const port = 3000;

server.listen(port, () => {
    console.log('Server listening on port ' + port + '!');
});

io.on('connection', socket => {
    socket.on('join', data => {
        console.log('Client joined', data.id);
        socket.join(data.id);
    });

    socket.on('push', (id, operation) => {
        console.log('Client pushed', operation);
        socket.to(id).broadcast.emit('merge', operation);
    });
});