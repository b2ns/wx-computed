import {isPlainObject, noop} from './util.js';
import Dep from './dep.js';
import Observer from './observer.js';
import Watcher from './watcher.js';

/* 各种初始化 */
function initData(vm) {
    Observer.observe(vm.data);
}

function initComputed(vm) {
    let computed = vm.computed;
    Object.keys(computed).forEach(key => {
        let userDef = computed[key];
        let getter = typeof userDef === 'function' ? userDef : userDef.get;
        let watcher = new Watcher(vm, key, getter || noop, noop);
        defineComputed(watcher, vm.data, key, userDef);
    });
}

let propertyConfig = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
};
function defineComputed(watcher, target, key, userDef) {
    if (typeof userDef === 'function') {
        propertyConfig.get = createComputedGetter(watcher);
        propertyConfig.set = noop;
    } else {
        propertyConfig.get = userDef.get ? createComputedGetter(watcher) : noop;
        propertyConfig.set = createComputedSetter(watcher, userDef.set);
    }
    Object.defineProperty(target, key, propertyConfig);
}

function createComputedGetter(watcher) {
    return function computedGetter() {
        if (watcher) {
            if (Dep.target) {
                watcher.depend();
            }
            return watcher.value;
        }
    };
}

function createComputedSetter(watcher, userDefSet) {
    return function computedSetter(val) {
        if (watcher) {
            if (!watcher.isUpdating) {
                userDefSet && userDefSet.call(watcher.vm, val);
            }
        }
    };
}

function initWatch(vm) {
    let watch = vm.watch;
    Object.keys(watch).forEach(key => new Watcher(vm, '', key, watch[key]));
}

/* 小程序中调用此接口进行注入 */
export default function vueComputed(vm) {
    if (!isPlainObject(vm)) {
        throw new Error('请传入小程序页面或组件实例！');
    }
    vm.data && initData(vm);
    vm.computed && initComputed(vm);
    vm.watch && initWatch(vm);
}
