import {def} from './util.js';

/* array */
let arrayProto = Array.prototype;
export let arrayMethods = Object.create(arrayProto);

let methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
];

methodsToPatch.forEach(method => {
    let original = arrayProto[method];
    def(arrayMethods, method, function mutator(...args) {
        let result = original.apply(this, args);
        let ob = this.__ob__;
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
            default: break;
        }
        if (inserted) ob.observeArray(inserted);
        ob.dep.notify();
        return result;
    });
});

export function dependArray(value) {
    value.forEach(val => {
        val && val.__ob__ && val.__ob__.dep.depend();
        if (Array.isArray(val)) {
            dependArray(val);
        }
    });
}
