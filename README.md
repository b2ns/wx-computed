# wx-computed
几乎照搬vue源码为小程序增加computed和watch特性


## 使用
这里配合[wx-wrapper](https://github.com/b2ns/wx-wrapper)来进行演示，推荐使用这种方式进行全局引入
```javascript
import wrapper from 'wx-wrapper';
import computed from 'wx-computed';

// 一次性为所有页面和组件引入该功能
wrapper({
    Page: {
        onLoad() {
            computed(this);
        }
    },
    Component: {
        attached(rawObj) {
            // 由于小程序限制, 自定义属性需手动绑定
            ['computed', 'watch'].forEach(v => this[v] = rawObj[v]);
            computed(this);
        }
    }
});

// 当然也可直接在Page或Component中单独手动引入
Page({
    data: {num: 1},
    computed: {
        num2() {
            return this.data.num << 1;
        }
    },
    watch: {
        num2() {
            console.log('watch num2');
        }
    },
    onLoad() {
        // 不推荐这样引入，太麻烦
        computed(this);
    }

});
```
