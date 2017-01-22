/**
 * @requires ./operation.js
 */

(function (global) {
    'use strict';

    const Operation = (typeof module === 'object' && typeof exports === 'object')
        ? require('./operation')
        : window.NodeOT.Operation;

    class OperationTransformer {
        static transform(newOperation, oldOperation) {
            // TODO: Add support for more operation types

            const newOperationIsInsert = this.isInsert(newOperation);
            const newOperationLength = newOperation.text.length;
            const newOperationStart = newOperation.index;
            const newOperationEnd = newOperationStart + newOperationLength;

            const oldOperationIsInsert = this.isInsert(oldOperation);
            const oldOperationLength = oldOperation.text.length;
            const oldOperationStart = oldOperation.index;
            const oldOperationEnd = oldOperationStart + oldOperationLength;

            if (newOperationIsInsert && oldOperationIsInsert) {
                if (oldOperationStart <= newOperationStart) {
                    newOperation.index += oldOperationLength;
                }
            }
        }

        static inverse(operation) {
            const isInsert = this.isInsert(operation);

            return {
                type: isInsert ? Operation.DELETE : Operation.INSERT,
                text: operation.text,
                index: operation.index,
            };
        }

        static isInsert(operation) {
            return (operation.type === Operation.INSERT);
        }

        static isDelete(operation) {
            return (operation.type === Operation.DELETE);
        }
    }

    global.NodeOT = global.NodeOT || {};
    global.NodeOT.OperationTransformer = OperationTransformer;

    if (typeof module === 'object' && typeof exports === 'object') {
        module.exports = OperationTransformer;
    }
}(typeof window !== 'undefined' ? window : this));