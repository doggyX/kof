export { AcGameObject };
let AC_GAME_OBJECT = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECT.push(this);

        this.timedelta = 0; // 时间间隔
        this.has_call_start = false;

    }

    start() { // 初始执行一次

    }

    update() { // 每一帧都执行一次 除了第一帧以外

    }

    destroy() { // 删除当前对象
        for (let i in AC_GAME_OBJECT) {
            if (AC_GAME_OBJECT[i] === this) {
                AC_GAME_OBJECT.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp; // timestamp -- 当前执行时刻
let AC_GAME_OBJECT_FRAME =  (timestamp)=> {
    for (let obj of AC_GAME_OBJECT) {
        if (!obj.has_call_start) { // 没有开始执行过 则开始执行
            obj.start();
            obj.has_call_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp; // timedelta - 每两帧之间的时间间隔 - 单位是毫秒
            obj.update();
        }
    }

    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_OBJECT_FRAME);
}

requestAnimationFrame(AC_GAME_OBJECT_FRAME);
    