export class Controller {
    constructor($canvas) {
        this.$canvas = $canvas;
        
        this.pressed_keys = new Set();  // Set 按照按下key的先后顺序 去重地记录每一个值
        this.start();
    }

    start() {
        let outer = this;
        this.$canvas.keydown(function (e) { // 里边的函数一直执行 一直在等待事件的发生
            outer.pressed_keys.add(e.key);
             console.log("down",outer.pressed_keys); // debug 
        })

        this.$canvas.keyup(function (e) {
            outer.pressed_keys.delete(e.key);
            // console.log("up",this.pressed_keys);
        })

    }
}