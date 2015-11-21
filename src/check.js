'use strict';

exports.init = function () {
    Object.defineProperty(Object.prototype, 'check', {
        get: getBindedFunctions
    });
};

function getBindedFunctions() {
    var acceptableFunctions = [
        ['hasKeys', 'hasValueType', 'hasLength','containsValues', 'hasValues'],
        ['hasKeys', 'hasValueType', 'containsValues', 'hasValues'],
        ['hasWordsCount', 'hasLength'],
        ['hasParamsCount']
    ];
    var functions = getAllFunctions();
    var result = getAcceptableFunctions(acceptableFunctions, this, functions);
    for (var func in result) {
        result[func] = result[func].bind(this);
    }
    return result;
}

function getAcceptableFunctions(acceptableFunctions, obj, functions) {
    var prot = Object.getPrototypeOf(obj);
    var index = [Array, Object, String, Function];
    for (var i = 0; i < index.length; i++) {
        if (index[i].prototype === prot) {
            var comparableFunctions = acceptableFunctions[i];
        }
    }
    var res = {};
    for (i = 0; i < comparableFunctions.length; i++) {
        res[comparableFunctions[i]] = functions[comparableFunctions[i]];
    }
    return res;
}

function getAllFunctions() {
    return {
        hasKeys: function (args) {
            for (var i = 0; i < args.length; i++) {
                if (!this.hasOwnProperty(args[i])) {
                    return false;
                }
            }
            return true;
        },

        hasValueType: function (prop, type) {
            if (!this.hasOwnProperty(prop)) {
                return false;
            }
            type = type.toString().slice(9, -20).toLocaleLowerCase();
            if (type === 'array') {
                return Object.getPrototypeOf(this[prop]) === Array.prototype;
            }
            return typeof this[prop] === null ? type === null : type === typeof this[prop];
        },

        hasLength: function (length) {
            return this.length === length;
        },

        hasValues: function (values) {
            for (var i = 0; i < this.length; i++) {
                if (values.indexOf(this[i]) === -1) {
                    return false;
                }
            }
            return true;
        },

        hasParamsCount: function (count) {
            return this.length === count;
        },

        hasWordsCount: function (count) {
            return this.trim().split(' ').length === count;
        },

        containsValues: function (values) {
            return values.every(function (x) {
                return this.indexOf(x) !== -1;
            }, this);
        }
    };
}
