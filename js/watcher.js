let watcherId = 0;
class Watcher {
    constructor(exp, cb, vm) {
        this.uid = watcherId++;
        console.log('watcher constructor');
        this.exp = exp;
        this.cb = cb;
        Dep.target = this;
        this.value = this.parseExp(exp, vm); //如果exp是obj.key则vm[exp]获取不到数据
        Dep.target = null;
    }

    update() {
        let oldVal = this.value;
        this.value = this.parseExp(this.exp, vm);
        this.cb(this.value, oldVal);
    }

    parseExp(exp, obj) {
        let exps = exp.split('.');
        for ( let i=0, len=exps.length; i<len; i++ ) {
            obj = obj[exps[i]];
        }
        return obj;
    }
}

/*
* 1.vm.$watcher('child', (newVal, oldVal)=>{
*   console.log('child', 'newVal = ' + newVal, 'oldVal = ' + oldVal);
* });
*
* 2.vm.$watcher('child.someStr', (newVal, oldVal)=>{
*   console.log('child someStr', 'newVal = ' + newVal, 'oldVal = ' + oldVal);
* });
*
* 调用1：生成Watcher对象，parseExp中触发child的get，get中将Watcher对象添加进child的dep中
* 调用2：生成Watcher对象
*       parseExp中触发child的get，get中将child.someStr的watcher对象添加进child的dep中
*       parseExp中触发child.someStr的get，get中将child.someStr的watcher对象添加进child.someStr的dep中
*
* child set的时候触发通知执行child[watcher]、child.someStr[watcher]的update方法
* child.someStr set的时候触发通知执行child.someStr[watcher]的update方法
*
* 子属性发生变动只执行子元素的回调，父属性发生变动执行父元素及子元素的回调
* */

/*
* 监听数组
* 修改数组上push、splice等方法，执行这些方法等时候触发通知执行update
* 数组初次进入observe的时候，修改原型，添加变异方法，因数组整体为一个对象会进入到defineReactive(data, arrname,通过data.arr监听arr变动)，get添加订阅，数组修改任何项目
* */