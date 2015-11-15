'use strict';

exports.init = function () {
    Object.defineProperty(Object.prototype, 'check', {
        get: getBindFunctions
    });
};

function getBindFunctions() {
    var functions = getAllFunctions();
    for (var func in functions) {
        functions[func] = functions[func].bind(this);
    }
    return functions;
}

function getAllFunctions() {
    return {
        hasKeys: function (args) {
            if (isNotCorrectType(Object.getPrototypeOf(this), [Array, Object])) {
                console.error('TypeError: hasKeys is not a function');
                return undefined;
            }
            for (var i = 0; i < args.length; i++) {
                if (!this.hasOwnProperty(args[i])) {
                    return false;
                }
            }
            return true;
        },

        hasValueType: function (prop, type) {
            if (isNotCorrectType(Object.getPrototypeOf(this), [Array, Object])) {
                console.error('TypeError: hasValueType is not a function');
                return undefined;
            }
            if (!this.hasOwnProperty(prop)) {
                return false;
            }
            type = type.toString().slice(9, -20).toLocaleLowerCase();
            if (type === 'array') {
                return Object.getPrototypeOf(this[prop]) === Array.prototype;
            }
            return type === typeof this[prop];
        },

        hasLength: function (length) {
            if (isNotCorrectType(Object.getPrototypeOf(this), [Array, String])) {
                console.error('TypeError: hasLength is not a function');
                return undefined;
            }
            return this.length === length;
        },

        hasValues: function (values) {
            if (isNotCorrectType(Object.getPrototypeOf(this), [Array, Object])) {
                console.error('TypeError: hasValues is not a function');
                return undefined;
            }
            for (var i = 0; i < this.length; i++) {
                if (values.indexOf(this[i]) === -1) {
                    return false;
                }
            }
            return true;
        },

        hasParamsCount: function (count) {
            if (isNotCorrectType(Object.getPrototypeOf(this), [Function])) {
                console.error('TypeError: hasParamsCount is not a function');
                return undefined;
            }
            return this.length === count;
        },

        hasWordsCount: function (count) {
            if (isNotCorrectType(Object.getPrototypeOf(this), [String])) {
                console.error('TypeError: hasWordsCount is not a function');
                return undefined;
            }
            return this.split(' ').length === count;
        },

        containsValues: function (values) {
            if (isNotCorrectType(Object.getPrototypeOf(this), [Array, Object])) {
                console.error('TypeError: containsValues is not a function');
                return undefined;
            }
            for (var i = 0; i < values.length; i++) {
                if (this.indexOf(values[i]) === -1) {
                    return false;
                }
            }
            return true;
        }
    };

    function isNotCorrectType(prototype, correctTypes) {
        for (var i = 0; i < correctTypes.length; i++) {
            if (prototype === correctTypes[i].prototype) {
                return false;
            }
        }
        return true;
    }
}
