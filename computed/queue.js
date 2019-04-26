/* 观察者队列 */

let queue = [];
let index = 0;
let has = {};
let flushing = false;
let waiting = false;

function flushWatcherQueue() {
    flushing = true;
    queue.sort((a, b) => a.id - b.id);
    for (index = 0; index < queue.length; index++) {
        let watcher = queue[index];
        has[watcher.id] = null;
        watcher.run();
    }
    index = queue.length = 0;
    has = {};
    flushing = waiting = false;
}

export default function queueWatcher(watcher) {
    let id = watcher.id;
    if (!has[id]) {
        has[id] = true;
        if (!flushing) {
            queue.push(watcher);
        } else {
            let i = queue.length - 1;
            while (i > index && queue[index].id > id) i--;
            queue.splice(i + 1, 0, watcher);
        }
        if (!waiting) {
            waiting = true;
            setTimeout(flushWatcherQueue, 0);
        }
    }
}
