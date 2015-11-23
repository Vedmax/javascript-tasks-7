'use strict';

exports.init = function () {
    Object.defineProperty(Object.prototype, 'check', {
        get: getBindedFunctions
    });
};

var functions = getAllFunctions();

function getBindedFunctions() {
    var result = getComparrableFunctions(this);
    result = getAcceptableFunctions(result);
    for (var func in result) {
        result[func] = result[func].bind(this);
    }
    return result;
}

function getAcceptableFunctions(comparableFunctions) {
    return comparableFunctions.reduce(function (result, name) {
        result[name] = functions[name];

        return result;
    }, {});
}

function getComparrableFunctions(obj) {
    var prot = Object.getPrototypeOf(obj);
    if (prot === Array.prototype) {
        return ['hasKeys', 'hasValueType',
                'hasLength','containsValues', 'hasValues'];
    }
    if (prot === Object.prototype) {
        return ['hasKeys', 'hasValueType',
            'containsValues', 'hasValues'];
    }
    if (prot === String.prototype) {
        return ['hasWordsCount', 'hasLength'];
    }
    if (prot === Function.prototype) {
        return ['hasParamsCount'];
    }
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
            return this[prop] === null ? false :
            Object.prototype.toString.call(this[prop]) === Object.prototype.toString.call(type);
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
