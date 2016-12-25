(function () {
    'use strict';

    if (!io) {
        throw new Error('io must be defined! Make sure you have loaded the socket.io client.');
    }

    class NodeOTClient {
        constructor(socketIOEndpoint, id) {
            this.socketIOEndpoint = socketIOEndpoint;
            this.id = id;
            this._handlers = {};
            this.version = 0;

            this._connect();
            this._listen();
        }

        static for(socketIOEndpoint, id) {
            return new NodeOTClient(socketIOEndpoint, id);
        }

        commit(operation) {
            console.log('pushing', operation);
            this._sendServer('push', operation);
        }

        on(eventName, handler) {
            this._handlers[eventName] = this._handlers[eventName] || [];
            this._handlers[eventName].push(handler);
        }

        _merge(version, operation) {
            console.log('merging', operation);
            this.version = version;
            this._sendClient('merge', operation);
        }

        _connect() {
            this.socket = io.connect(this.socketIOEndpoint);
            this._sendServer('join');
        }

        _listen() {
            this.socket.on('merge', this._merge.bind(this));
        }

        _sendServer(eventName, ...args) {
            this.socket.emit(eventName, this.id, this.version, ...args);
        }

        _sendClient(eventName, ...args) {
            const handlers = this._handlers[eventName] || [];

            handlers.forEach(handler => {
                handler(...args);
            });
        }
    }

    window.NodeOTClient = NodeOTClient;
}());