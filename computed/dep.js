import {remove} from './util.js';

/* 依赖搜集器 */
let uid = 0;
export default class Dep {
    constructor() {
        this.id = uid++;
        this.subs = [];
    }
    addSub(sub) {
        this.subs.push(sub);
    }
    removeSub(sub) {
        remove(this.subs, sub);
    }
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    }
    notify() {
        this.subs.forEach(sub => sub.update());
    }
}

/* 依赖搜集开关 */
Dep.target = null;
let targetStack = [];
Dep.pushTarget = function pushTarget(target) {
    targetStack.push(target);
    Dep.target = target;
};
Dep.popTarget = function popTarget() {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
};
