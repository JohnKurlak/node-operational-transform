(function () {
    'use strict';

    if (!io) {
        throw new Error('io must be defined! Make sure you have loaded the socket.io client.');
    }

    class NodeOTClient {
        constructor(socketIOEndpoint, id) {
            this.socketIOEndpoint = socketIOEndpoint;
            this.id = id;

            this._connect();
            this._listen();
        }

        static for(socketIOEndpoint, id) {
            return new NodeOTClient(socketIOEndpoint, id);
        }

        commit(operation) {
            console.log('pushing', operation);
            this.socket.emit('push', this.id, operation);
        }

        _connect() {
            this.socket = io.connect(this.socketIOEndpoint);
            this.socket.emit('join', { id: this.id });
        }

        _listen() {
            this.socket.on('merge', operation => {
                console.log('merge', operation);
            });
        }
    }

    window.NodeOTClient = NodeOTClient;
}());