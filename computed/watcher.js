import {isUndef, isObject, noop, parsePath} from './util.js';
import queueWatcher from './queue.js';
import Dep from './dep.js';

/* 观察者 */
let uid$2 = 0;
export default class Watcher {
    constructor(vm, key, expOrFn, cb) {
        this.id = uid$2++;
        this.vm = vm;
        // computed key
        this.key = key;
        // watch callback
        this.cb = cb || noop;
        this.deps = [];
        this.newDeps = [];
        this.depIds = new Set();
        this.newDepIds = new Set();
        this.getter = noop;
        // 小程序setData时会触发setter，避免在setter中改变依赖项目而进入死循环
        this.isUpdating = false;

        if (typeof expOrFn === 'function') {
            // for computed
            this.getter = expOrFn;
        } else {
            // for watch
            this.getter = parsePath(expOrFn);
        }

        this.value = this.get();
        this.updateView();
    }
    get() {
        Dep.pushTarget(this);
        let value = '';
        try {
            value = this.getter.call(this.vm, this.vm);
        } catch (e) {

        } finally {
            Dep.popTarget();
            this.cleanupDeps();
        }
        return value;
    }
    addDep(dep) {
        let id = dep.id;
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id);
            this.newDeps.push(dep);
            if (!this.depIds.has(id)) {
                dep.addSub(this);
            }
        }
    }
    cleanupDeps() {
        this.deps.forEach(dep => {
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this);
            }
        });
        let tmp = this.depIds;
        this.depIds = this.newDepIds;
        this.newDepIds = tmp;
        this.newDepIds.clear();
        tmp = this.deps;
        this.deps = this.newDeps;
        this.newDeps = tmp;
        this.newDeps.length = 0;
    }
    update() {
        queueWatcher(this);
    }
    run() {
        let value = this.getter.call(this.vm, this.vm);
        if (value !== this.value || isObject(value)) {
            let oldVal = this.value;
            this.value = value;
            this.updateView();
            this.cb.call(this.vm, this.value, oldVal);
        }
    }
    depend() {
        this.deps.forEach(dep => dep.depend());
    }
    // 包装小程序更新视图的方法
    updateView() {
        if (!this.key || isUndef(this.value)) return;
        this.isUpdating = true;
        this.vm.setData({
            [this.key]: this.value
        });
        this.isUpdating = false;
    }
}
