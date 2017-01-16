/**
 * @requires ../client/init.js
 * @requires ./ot-document.js
 */

(function (NodeOT) {
    'use strict';

    if (!io) {
        throw new Error('io must be defined! Make sure you have loaded the socket.io client.');
    }

    const OTDocument = NodeOT.OTDocument;

    class Client {
        constructor(socketIOEndpoint, id) {
            this._socketIOEndpoint = socketIOEndpoint;
            this._id = id;
            this._handlers = {};
            this._otDocument = new OTDocument(
                operation => this._sendServer('push', operation),
                (operation, isLocalOperation) => this._sendClient('apply', operation, isLocalOperation),
            );

            this._connect();
            this._listen();
        }

        static for(socketIOEndpoint, id) {
            return new Client(socketIOEndpoint, id);
        }

        on(eventName, handler) {
            this._handlers[eventName] = this._handlers[eventName] || [];
            this._handlers[eventName].push(handler);
        }

        commit(operation) {
            console.log('pushing', operation);
            this._otDocument.commit(operation);
        }

        _merge(version, operation) {
            console.log('merging', operation);
            console.log('old version=', this._otDocument.version, 'new version=', version);

            this._otDocument.merge(version, operation);
        }

        _merged(version) {
            console.log('merged');
            console.log('old version=', this._otDocument.version, 'new version=', version);

            this._otDocument.merged(version);
        }

        _connect() {
            this.socket = io.connect(this._socketIOEndpoint);
            this._sendServer('join');
        }

        _listen() {
            this.socket.on('merge', this._merge.bind(this));
            this.socket.on('merged', this._merged.bind(this));
        }

        _sendServer(eventName, ...args) {
            this.socket.emit(eventName, this._id, this._otDocument.version, ...args);
        }

        _sendClient(eventName, ...args) {
            const handlers = this._handlers[eventName] || [];

            handlers.forEach(handler => {
                handler(...args);
            });
        }
    }

    NodeOT.Client = Client;
}(window.NodeOT));