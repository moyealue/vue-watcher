/* 对data中的每一项进行劫持
 * 如果data[key]是对象，则循环进行劫持
* */

let observer = (data) => {
    if ( typeof data != 'object' ) {
        return;
    }

    return new Observer(data);
}

class Observer {
    constructor(data) {
        Object.keys(data).forEach((key) => {
            this.defineReactive(data, key, data[key]);
        })
    }

    defineReactive(data, key, val) {

        let dep = new Dep();
        console.log(key, dep.uid);

        //data[key]为对象时进行循环遍历
        let childObj = observer(data[key]);

        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get() {
                //添加watcher
                if ( Dep.target ) {
                    dep.addSub(Dep.target); //添加去重操作
                    //console.log(dep.uid, dep.watchers, key)
                }
                return val;
            },
            set(newVal) {
                if ( newVal == val ) {
                    return;
                }
                val = newVal;

                //新增、删除子元素
                childObj = observer(newVal);

                //发出通知
                //console.log(dep.uid, dep.watchers, key)
                dep.notify();
            }
        })
    }
}
