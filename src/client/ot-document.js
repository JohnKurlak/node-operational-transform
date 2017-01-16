/**
 * @requires ../client/init.js
 * @requires ../shared/operation-transformer.js
 */

(function (NodeOT) {
    'use strict';

    const OperationTransformer = NodeOT.OperationTransformer;

    class OTDocument {
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
                const inverseOperation = OperationTransformer.inverse(this.pendingOperations[i]);
                this._applyToClient(inverseOperation);
            }

            this.version = version;
            this.operations.push(operation);

            this._applyToClient(operation);

            for (let i = 0; i < this.pendingOperations.length; ++i) {
                OperationTransformer.transform(this.pendingOperations[i], operation);
                this._applyToClient(this.pendingOperations[i], true);
            }
        }

        merged(version) {
            this.version = version;
            this.operations.push(this.pendingOperations.shift());

            if (this.pendingOperations.length > 0) {
                this._sendToServer(this.pendingOperations[0]);
            }
        }
    }

    NodeOT.OTDocument = OTDocument;
}(window.NodeOT));