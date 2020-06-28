cc.Class({
    extends: cc.Component,

    properties: {
        land: {
            default: null,
            type: cc.Component,
        },
    },

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.on_touch_move, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.on_touch_end, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.on_touch_cancel, this);
        this.node.x = 200;
        this.node.y = 500;

        this.multiply = 1;
        this.map = [];
        for (let i = 0; i < this.land.size; ++i) {
            this.map[i] = [];
        }

        this.species = [];
        cc.loader.loadRes('plant1.1', cc.SpriteFrame, (err, spriteFrame) => {
            this.species[1] = spriteFrame;
            this.generate();
        });
        cc.loader.loadRes('plant2.1', cc.SpriteFrame, (err, spriteFrame) => {
            this.species[2] = spriteFrame;
            this.generate();
        });
        cc.loader.loadRes('plant3.1', cc.SpriteFrame, (err, spriteFrame) => {
            this.species[3] = spriteFrame;
            this.generate();
        });
        cc.loader.loadRes('plant4.1', cc.SpriteFrame, (err, spriteFrame) => {
            this.species[4] = spriteFrame;
            this.generate();
        });
    },

    generate() {
        if (this.species[1] && this.species[2] && this.species[3] && this.species[4]) {
            this.plant = parseInt(Math.random() * 4) + 1;
            this.getComponent(cc.Sprite).spriteFrame = this.species[this.plant];
            this.node.width = this.node.height = this.land.length;
        }
    },

    on_touch_move(event) {
        this.move = 1;
        this.node.opacity = 100;     //半透明
        let delta = event.touch.getDelta();
        this.node.x += delta.x;      //this.x是在父节点坐标系下的坐标
        this.node.y += delta.y;

        let size = this.land.size;
        let length = this.land.length;
        let old_vect = this.node.convertToWorldSpace([this.node.x, this.node.y]);   //世界坐标系的坐标
        let new_vect = this.land.node.convertToNodeSpace(old_vect);                 //土地坐标系的坐标
        let blocks = this.land.node.children;
        let min = 0;
        let distance = [];
        for (let i = 0; i < size * size; ++i) {
            distance[i] = (new_vect.x - blocks[i].x) * (new_vect.x - blocks[i].x) + (new_vect.y - blocks[i].y) * (new_vect.y - blocks[i].y);
            if (distance[i] < distance[min]) {
                min = i;
            }
        }

        for (let i = 0; i < size * size; ++i) {
            if (i == min && new_vect.x >= blocks[min].x - length / 2 && new_vect.x <= blocks[min].x + length / 2 && new_vect.y >= blocks[min].y - length / 2 && new_vect.y <= blocks[min].y + length / 2 && !this.map[parseInt(min / size)][parseInt(min % size)]) {
                blocks[i].opacity = 100;
            } else {
                blocks[i].opacity = 255;
            }
        }
    },

    check(x, y) {
        if (x < 0 || x >= this.land.size || y < 0 || y >= this.land.size || !this.map[x][y]) {
            return 1;
        }
        let ret = 0;
        if (x) {
            ret += this.map[x - 1][y] > 0;
        }
        if (x < this.land.size - 1) {
            ret += this.map[x + 1][y] > 0;
        }
        if (y) {
            ret += this.map[x][y - 1] > 0;
        }
        if (y < this.land.size - 1) {
            ret += this.map[x][y + 1] > 0;
        }
        return ret <= this.map[x][y];
    },

    go_to_block(x, y) {
        if (!this.check(x, y)) return 0;
        if (x) {
            if (!this.check(x - 1, y)) return 0;
        }
        if (x < this.land.size - 1) {
            if (!this.check(x + 1, y)) return 0;
        }
        if (y) {
            if (!this.check(x, y - 1)) return 0;
        }
        if (y < this.land.size - 1) {
            if (!this.check(x, y + 1)) return 0;
        }
        return 1;
    },

    go_to_end() {
        let flag = true;
        for (let i = 0; i < this.land.size; ++i) {
            for (let j = 0; j < this.land.size; ++j) {
                if (!this.map[i][j]) {
                    this.map[i][j] = this.plant;
                    if (this.go_to_block(i, j)) {
                        flag = false;
                        this.map[i][j] = 0;
                        break;
                    }
                    this.map[i][j] = 0;
                }
            }
            if (flag == false) break;
        }
        if (flag == true) {
            let gameover = cc.find('/Canvas/Gameover').getComponent('gameover');
            gameover.set();
        }
    },

    on_touch_end() {
        this.node.opacity = 255;

        let size = this.land.size;
        let length = this.land.length;
        let old_vect = this.node.convertToWorldSpace([this.node.x, this.node.y]);   //世界坐标系的坐标
        let new_vect = this.land.node.convertToNodeSpace(old_vect);                 //土地坐标系的坐标
        let blocks = this.land.node.children;
        let min = 0;
        let distance = [];
        for (let i = 0; i < size * size; ++i) {
            blocks[i].opacity = 255;
            distance[i] = (new_vect.x - blocks[i].x) * (new_vect.x - blocks[i].x) + (new_vect.y - blocks[i].y) * (new_vect.y - blocks[i].y);
            if (distance[i] < distance[min]) {
                min = i;
            }
        }

        if (new_vect.x >= blocks[min].x - length / 2 && new_vect.x <= blocks[min].x + length / 2 && new_vect.y >= blocks[min].y - length / 2 && new_vect.y <= blocks[min].y + length / 2) {
            let x = parseInt(min / size);
            let y = parseInt(min % size);
            if (!this.map[x][y]) {
                this.map[x][y] = this.plant;
                if (this.check(x, y) && this.check(x - 1, y) && this.check(x + 1, y) && this.check(x, y - 1) && this.check(x, y + 1)) {
                    this.land.generate(min, this.getComponent(cc.Sprite).spriteFrame);
                    let score = cc.find('/Canvas/Score').getComponent('score');
                    let add_score = parseInt((parseInt(Math.random() * 21) + 40) * (5 - this.plant) * this.multiply);
                    this.multiply += 1 / this.land.size / this.land.size;
                    score.add(add_score);     //加分
                    this.generate();
                } else {
                    let g = function (target, a) {
                        target.opacity = a;
                        if (a < 255) {
                            setTimeout(() => {
                                g(target, a + 15);
                            }, 5);
                        }
                    };
                    let f = function (target, a) {
                        target.opacity = a;
                        if (a > 0) {
                            setTimeout(() => {
                                f(target, a - 15);
                            }, 5);
                        } else {
                            g(target, 0);
                        }
                    };
                    f(blocks[min], 255);
                    this.map[x][y] = 0;
                }
                this.go_to_end();
            }
        }

        this.node.x = 200;
        this.node.y = 500;
    },

    on_touch_cancel() {
        this.on_touch_end();
    },

    gameover() {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.on_touch_move, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.on_touch_end, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.on_touch_cancel, this);
    },

    // update (dt) {},
});
