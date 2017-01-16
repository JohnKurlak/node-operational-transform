(function (global) {
    'use strict';

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
                type: isInsert ? 'delete' : 'insert',
                text: operation.text,
                index: operation.index,
            };
        }

        static isInsert(operation) {
            return (operation.type === 'insert');
        }

        static isDelete(operation) {
            return (operation.type === 'delete');
        }
    }

    global.NodeOT = global.NodeOT || {};
    global.NodeOT.OperationTransformer = OperationTransformer;

    if (typeof module === 'object' && typeof exports === 'object') {
        module.exports = OperationTransformer;
    }
}(typeof window !== 'undefined' ? window : this));