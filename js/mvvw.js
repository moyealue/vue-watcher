/* 1.实现data代理
 * 2.劫持数据
* */
class MVVM {
    constructor(options) {
        let {el, data} = options, _this = this;

        Object.keys(data).forEach(key => {
            Object.defineProperty(_this, key, {
                enumerable: true,
                configurable: false,
                get() {
                    return data[key];
                },
                set(newVal) {
                    data[key] = newVal;
                }
            });
        });

        observer(data);
    }

    $watcher(exp, cb) {
        return new Watcher(exp, cb, this);
    }
}