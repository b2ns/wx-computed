/* util */
export let hasProto = '__proto__' in {};

export function type(val) {
    return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
}

export function isUndef(v) {
    return v === undefined || v === null;
}

export function isObject(obj) {
    return obj !== null && typeof obj  === 'object';
}

export function isPlainObject(obj) {
    return type(obj) === 'object';
}

export function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

export function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
}

export function noop() {}

export function remove(arr, item) {
    if (arr.length) {
        let index = arr.indexOf(item);
        if (index > -1) {
            return arr.splice(index, 1);
        }
    }
}

export function parsePath(path) {
    let segments = path.split('.');
    return function (obj) {
        obj = obj.data;
        for (let seg of segments) {
            if (!obj) return;
            obj = obj[seg];
        }
        return obj;
    };
}
