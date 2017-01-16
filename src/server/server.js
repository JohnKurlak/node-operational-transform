'use strict';

const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketio(server);

const OTDocument = require('./ot-document')

const port = 3000;

server.listen(port, () => {
    console.log('Server listening on port ' + port + '!');
});

let otDocuments = {};

io.on('connection', socket => {
    socket.on('join', id => {
        console.log('Client joined', id);
        socket.join(id);

        if (!otDocuments[id]) {
            otDocuments[id] = new OTDocument();
        }

        otDocuments[id].operations.forEach((operation, index) => {
            socket.emit('merge', index + 1, operation);
        });
    });

    socket.on('push', (id, version, operation) => {
        const otDocument = otDocuments[id];
        if (!otDocument) {
            // TODO: Handle failures better; for now, fail gracefully
            return;
        }

        console.log('Client (v. ' + version + ') pushed', operation, 'to server (v. ' + otDocument.version + ')');
        console.log('Non-transformed operation is', operation.type, 'with index=', operation.index);

        otDocument.merge(version, operation);

        console.log('Transformed operation is    ', operation.type, 'with index=', operation.index);

        socket.emit('merged', otDocument.version);
        socket.to(id).broadcast.emit('merge', otDocument.version, operation);
    });
});