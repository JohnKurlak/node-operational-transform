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

            if (this.isInsert(newOperation) && this.isInsert(oldOperation)) {
                if (oldOperation.index < newOperation.index) {
                    newOperation.index += oldOperation.text.length;
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