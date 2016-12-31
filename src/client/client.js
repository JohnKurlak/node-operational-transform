(function () {
    'use strict';

    if (!io) {
        throw new Error('io must be defined! Make sure you have loaded the socket.io client.');
    }

    class NodeOTClient {
        constructor(socketIOEndpoint, id) {
            this._socketIOEndpoint = socketIOEndpoint;
            this._id = id;
            this._handlers = {};
            this._otDocument = new OperationalTransformation(
                operation => this._sendServer('push', operation),
                operation => this._sendClient('apply', operation),
            );

            this._connect();
            this._listen();
        }

        static for(socketIOEndpoint, id) {
            return new NodeOTClient(socketIOEndpoint, id);
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

    // TODO: Move into separate file
    class OperationalTransformation {
        constructor(sendToServer, applyToClient) {
            this.version = 0;
            this.operations = [];
            this.pendingOperations = [];
            this._sendToServer = sendToServer;
            this._applyToClient = applyToClient;
        }

        commit(operation) {
            if (this.pendingOperations.length === 0) {
                this._sendToServer(operation);
            }

            this.pendingOperations.push(operation);
        }

        merge(version, operation) {
            for (let i = this.pendingOperations.length - 1; i >= 0; --i) {
                const inverseOperation = this._inverse(this.pendingOperations[i]);
                this._applyToClient(inverseOperation);
            }

            this.version = version;
            this.operations.push(operation);

            this._applyToClient(operation);

            for (let i = 0; i < this.pendingOperations.length; ++i) {
                this._transform(this.pendingOperations[i], operation);
                this._applyToClient(this.pendingOperations[i]);
            }
        }

        merged(version) {
            this.version = version;
            this.operations.push(this.pendingOperations.shift());

            if (this.pendingOperations.length > 0) {
                this._sendToServer(this.pendingOperations[0]);
            }
        }

        _inverse(operation) {
            const isInsert = this._isInsert(operation);

            return {
                type: isInsert ? 'delete' : 'insert',
                text: operation.text,
                start: operation.start,
                end: isInsert ? operation.start + operation.text.length : operation.start,
            };
        }

        _transform(newOperation, oldOperation) {
            if (this._isInsert(newOperation) && this._isInsert(oldOperation)) {
                if (newOperation.start === newOperation.end && oldOperation.start === oldOperation.end) {
                    if (oldOperation.start < newOperation.start) {
                        newOperation.start += oldOperation.text.length;
                        newOperation.end = newOperation.start;
                    }
                }
            }
        }

        _isInsert(operation) {
            return (operation.type === 'insert');
        }

        _isDelete(operation) {
            return (operation.type === 'delete');
        }
    }

    window.NodeOTClient = NodeOTClient;
}());