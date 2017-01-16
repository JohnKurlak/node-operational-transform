'use strict';

const OperationTransformer = require('../shared/operation-transformer');

class OTDocument {
    constructor() {
        this._version = 0;
        this._operations = [];
    }

    get version() {
        return this._version;
    }

    get operations() {
        return this._operations;
    }

    merge(version, operation) {
        for (let i = version; i < this._version; ++i) {
            OperationTransformer.transform(operation, this._operations[i]);
        }

        this._operations.push(operation);
        ++this._version;
        return operation;
    }
}

module.exports = OTDocument;