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
        }

        static for(socketIOEndpoint, id) {
            return new NodeOTClient(socketIOEndpoint, id);
        }

        _connect() {
            this.socket = io.connect(this.socketIOEndpoint);
            this.socket.emit('join', { id: this.id });

            /*
            socket.on('outgoingUpdateAccepted', function (data) {

            });

            socket.on('incomingUpdate', function (data) {

            });
            */
        }
    }

    window.NodeOTClient = NodeOTClient;
}());