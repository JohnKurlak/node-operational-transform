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

let otDocuments = {};

io.on('connection', socket => {
    socket.on('join', id => {
        console.log('Client joined', id);
        socket.join(id);

        if (!otDocuments[id]) {
            otDocuments[id] = new OperationalTransformation();
        }
    });

    socket.on('push', (id, version, operation) => {
        const otDocument = otDocuments[id];
        if (!otDocument) {
            // Fow now, fail gracefully
            return;
        }

        console.log('Client (v. ' + version + ') pushed', operation, 'to server (v. ' + otDocument.version + ')');

        otDocument.merge(version, operation);
        socket.to(id).broadcast.emit('merge', otDocument.version, operation);
    });
});

class OperationalTransformation {
    constructor() {
        this.version = 0;
        this.operations = [];
    }

    merge(version, operation) {
        ++this.version;
        this.operations.push(operation);
        return operation;
    }
}