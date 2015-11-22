'use strict';

exports.init = function () {
    Object.defineProperty(Object.prototype, 'check', {
        get: getBindedFunctions
    });
};

function getBindedFunctions() {

    var functions = getAllFunctions();
    var result = getAcceptableFunctions(this, functions);
    for (var func in result) {
        result[func] = result[func].bind(this);
    }
    return result;
}

function getAcceptableFunctions(obj, functions) {
    var prot = Object.getPrototypeOf(obj);
    if (prot === Array.prototype) {
        var comparableFunctions = ['hasKeys', 'hasValueType',
                'hasLength','containsValues', 'hasValues'];
    }
    if (prot === Object.prototype) {
        var comparableFunctions = ['hasKeys', 'hasValueType',
            'containsValues', 'hasValues'];
    }
    if (prot === String.prototype) {
        var comparableFunctions = ['hasWordsCount', 'hasLength'];
    }
    if (prot === Function.prototype) {
        var comparableFunctions = ['hasParamsCount'];
    }
    var res = {};
    for (var i = 0; i < comparableFunctions.length; i++) {
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
            return this[prop] === null ? false : type === typeof this[prop];
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
            return this.trim().split(/\s+/).length === count;
        },

        containsValues: function (values) {
            return values.every(function (value) {
                return this.indexOf(value) !== -1;
            }, this);
        }
    };
}
