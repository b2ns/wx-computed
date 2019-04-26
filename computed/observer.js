import {def, hasProto, hasOwn, isObject, isPlainObject, isUndef} from './util.js';
import {arrayMethods, dependArray} from './array.js';
import Dep from './dep.js';

/* 消息订阅器 */
export default class Observer {
    constructor(value) {
        this.value = value;
        this.dep = new Dep();
        def(value, '__ob__', this);
        if (Array.isArray(value)) {
            if (hasProto) {
                value.__proto__ = arrayMethods;
            } else {
                Object.getOwnPropertyNames(arrayMethods).forEach(key => {
                    def(value, key, arrayMethods[key]);
                });
            }
            this.observeArray(value);
        } else {
            this.walk(value);
        }
    }
    walk(value) {
        Object.keys(value).forEach(key => {
            // 忽略__xxx__类似的特殊属性
            if (!/^__.*__$/gi.test(key)) {
                defineReactive(value, key);
            }
        });
    }
    observeArray(value) {
        value.forEach(val => Observer.observe(val));
    }
}
Observer.observe = function observe(value) {
    if (!isObject(value)) return;
    let ob = null;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
    } else if (isPlainObject(value) || Array.isArray(value)) {
        ob = new Observer(value);
    }
    return ob;
};

/* 定义响应式属性 */
export function defineReactive(obj, key, val) {
    let dep = new Dep();
    let property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) return;
    if (isUndef(val)) {
        val = obj[key];
    }

    let childOb = Observer.observe(val);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            if (Dep.target) {
                dep.depend();
                if (childOb) {
                    childOb.dep.depend();
                    if (Array.isArray(val)) {
                        dependArray(val);
                    }
                }
            }
            return val;
        },
        set(newVal) {
            if (newVal === val || (newVal !== newVal && val !== val)) return;
            val = newVal;
            childOb = Observer.observe(newVal);
            dep.notify();
        }
    });
}

