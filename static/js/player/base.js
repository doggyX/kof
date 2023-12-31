import { AcGameObject } from "/static/js/ac_game_object/base.js";

export class Player extends AcGameObject {
    constructor(root, info) {
        super();

        this.root = root;
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;

        this.width = info.width;
        this.height = info.height;
        this.color = info.color;
        
        this.vx = 0;   // x轴和y轴的速度
        this.vy = 0;

        this.speedx = 400; // 水平速度
        this.speedy = 2000; // 跳起的初始速度
        
        this.ctx = this.root.game_map.ctx;
        this.pressed_keys = this.root.game_map.controller.pressed_keys;

        this.gravity = 50;
        this.direction = 1; // 朝右为1 负方向为-1
        
        this.status = 3; // 0：idle 1: 向前 2：向后 3：跳跃 4：攻击 5：被打 6：死亡

        this.animations = new Map(); // 动画
        this.frame_current_cnt = 0; //当前到了多少帧
        this.jump_cnt = 0;

        this.hp = 100;
        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`);
        this.$hp_div = this.$hp.find('div');
    }

    start() {   
        
    }

   

    update_move() {
        this.vy += this.gravity;
        if (this.status === 3) {
            if (this.y === 450) this.frame_current_cnt = 0;
        }
        
        this.x += this.vx * this.timedelta / 1000;  // 因为timedelta的单位是ms
        this.y += this.vy * this.timedelta / 1000;

        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;
            if(this.status===3)
            this.status = 0;
        }

        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.root.game_map.$canvas.width()) {
            this.x = this.root.game_map.$canvas.width() - this.width;
        }
    }

    update_control() {
        let w, a, d, space;
        if (this.id === 0) {
            w = this.pressed_keys.has('w'); 
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        }
        else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }

        if (this.status === 0 || this.status === 1) {
            if (space) {
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            } else if (w) {
                if (d) {
                    console.log("d");
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy = -this.speedy;
                this.status = 3;
            } else if (d) {
                this.vx = this.speedx;
                this.status = 1;
            } else if (a) {
                this.vx = -this.speedx;
                this.status = 1;
            } else {
                this.status = 0;
                this.vx = 0;
            }
        }
    }

    update_direction() {
        if(this.status===6) return;
        let players = this.root.players;
        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if (me.x < you.x) {
                me.direction = 1;
                you.direction = -1;
            }
        }
    }

    is_collision(r1,r2) { // 碰撞检测
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2)) return false;
        if (Math.max(r1.y1, r2. y1) > Math.min(r1.y2, r2.y2)) return false;
        return true;

    }

    is_attack() {
        this.status = 5;
        this.frame_current_cnt = 0;
        this.hp -= 20;
        this.hp = Math.max(0, this.hp);
        this.$hp.animate({
            width: this.$hp.parents().width() * this.hp / 100,
        }, 800);

        this.$hp_div.animate({
            width: this.$hp.parents().width() * this.hp / 100,
        }, 300);

        if (this.hp <= 0) {
            this.status = 6;
            this.vx = 0;
            this.frame_current_cnt = 0;
        }
    }

    update_attack() {
        if (this.status === 4 && this.frame_current_cnt == 36) {
            let me = this, you = this.root.players[1 - this.id];
            if (you.status === 6) return;
            let r1;
            if (me.direction > 0) {
                r1 = {
                    x1: this.x + 100,
                    y1: this.y + 40,
                    x2: this.x + 100 + 100,
                    y2: this.y + 40 + 20,
                }
            } else {
                r1 = {
                    x1: (this.x - (200 - this.width)),
                    y1: this.y + 40,
                    x2: (this.x - (200 - this.width)) + 100,
                    y2: this.y + 40 + 20,
                }
            }

            let r2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2:you.y+you.height,
            }
            //console.log(this.is_collision(r1, r2));
            if (this.is_collision(r1, r2)) {
                //console.log("attack");
                you.is_attack();
            }
        }
    }


    update() {
        this.update_control();
        this.update_move();
        this.update_direction();
        this.update_attack();
        this.render();
    }

    render() { // 渲染

        // 碰撞盒子
        // this.ctx.fillStyle = 'blue';
        // this.ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // if (this.direction > 0) {
        // this.ctx.fillStyle = 'red';
        // this.ctx.fillRect(this.x+100, this.y+40, 120, 20);  
        // } else {
        //     this.ctx.fillStyle = 'red';
        // this.ctx.fillRect(this.x-(220-this.width), this.y+40, 120, 20);
        // }
        

        let status = this.status;

        if (this.status === 1 && this.direction * this.vx < 0) status = 2;

        let obj = this.animations.get(status);
        if (obj && obj.loaded) {
            if (this.direction > 0) {
                    let k = parseInt(this.frame_current_cnt/obj.frame_rate) % obj.frame_cnt;
                    let image = obj.gif.frames[k].image;
                    this.ctx.drawImage(image,this.x, this.y+obj.offset_y,image.width*obj.scale, image.height*obj.scale);
            } else {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.game_map.$canvas.width(),0);
                let k = parseInt(this.frame_current_cnt/obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.game_map.$canvas.width()-this.x-this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
                this.ctx.restore();
            }
        }
       
        if (status === 4|| status===5||status===6 ) {
            if (this.frame_current_cnt ===(obj.frame_rate* obj.frame_cnt)-1) { // 让最后一帧停下来 不然会播放第一帧
                if (this.status === 6) {
                    this.frame_current_cnt--;
                } else {
                    this.status = 0;
                } 
            }
        }
        this.frame_current_cnt++;
    }
    
}