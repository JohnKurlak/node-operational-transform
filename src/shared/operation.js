(function (global) {
    'use strict';

    class Operation {
        constructor() {
            this.INSERT = 'insert';
            this.DELETE = 'delete';
        }
    }

    global.NodeOT = global.NodeOT || {};
    global.NodeOT.Operation = new Operation();

    if (typeof module === 'object' && typeof exports === 'object') {
        module.exports = Operation;
    }
}(typeof window !== 'undefined' ? window : this));