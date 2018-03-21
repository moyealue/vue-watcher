let dopId = 0;
class Dep {
    constructor() {
        this.watchers = [];
        this.uid = dopId++;
    }

    addSub(sub) {
        this.watchers.push(sub);
    }

    notify() {
        this.watchers.forEach($watcher=> {
            $watcher.update();
        });
    }
}

/*子属性只存放子属性的观察者  父属性存放子属性+父属性的观察者
 *child.someStr的订阅器中只有someStr的观察者
 *somestr的变更不会通知child  child变更会通知somestr
* */