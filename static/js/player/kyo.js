import { Player } from "/static/js/player/base.js";
import { GIF } from "/static/js/utils/gif.js";

export class Kyo extends Player {
    constructor(root,info) {
        super(root, info);

        this.init_animations();
    }    

    init_animations() {
        let outer = this;
        let offsets = [0, -22, -22, -140, 0, 0, 0];
        for (let i = 0; i < 7; i++) {
            let gif = GIF();
            gif.load(`/static/images/player/kyo/${i}.gif`);
            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0, // 有多少张图片
                frame_rate: 10, // 每10帧过度一次
                offset_y: offsets[i], // y方向偏移量
                loaded: false, // 是否加载完成
                scale:2, // 缩放
            });

            gif.onload = function () {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;
                if (i == 3) {
                    outer.animations.frame_rate = 8;
                }
            }
        }
    }
}
