cc.Class({
    extends: cc.Component,

    properties: {
        size: {
            default: 0,
            type: cc.Integer
        },
        length: {
            default: 0,
            type: cc.Integer
        },
    },

    onLoad() {
        this.length = parseInt(700 / this.size);
        this.node.on(cc.Node.EventType.TOUCH_START, this.on_touch_start, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.on_touch_end, this);
        this.node.width = this.node.height = this.size * this.length + 20;
        cc.loader.loadRes('space', cc.SpriteFrame, (err, spriteFrame) => {
            let delta = this.size * this.size - this.node.children.length;
            for (let i = 0; i < delta; ++i) {
                let node = new cc.Node('Sprite');
                node.addComponent(cc.Sprite);
                node.parent = this.node;
            }
            for (let i = 0; i < this.size * this.size; ++i) {
                this.generate(i, spriteFrame);
            }
            for (let i = this.size * this.size; i < this.node.children.length; ++i) {
                this.node.children[i].opacity = 0;
            }
        });
    },

    generate(id, spriteFrame) {
        let size = this.size;
        let length = this.length;
        let target = this.node.children[id];
        target.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        target.width = target.height = length;
        target.x = parseInt(id / size) * length + length / 2 + 10;
        target.y = parseInt(id % size) * length + length / 2 + 10;
        target.opacity = 255;
        let g = function (target, a) {
            target.height = length - a;
            target.y = parseInt(id % size) * length + target.height / 2 + 10;
            if (a > 0) {
                setTimeout(g, 5, target, a - 1);
            }
        };
        let f = function (target, a) {
            target.height = length - a;
            target.y = parseInt(id % size) * length + target.height / 2 + 10;
            if (a < 15) {
                setTimeout(f, 5, target, a + 1);
            } else {
                g(target, 15);
            }
        };
        f(target, 0);
    },

    on_touch_start() {
        this.tap = 1;
        setTimeout(() => {
            this.tap = 0;
        }, 300);
    },

    on_touch_end(event) {
        if (this.tap) {
            let plant = cc.find('/Canvas/Plant');
            plant.x = event.getLocationX() - 360;
            plant.y = event.getLocationY() - 640;
            plant.getComponent('move').on_touch_end();
        }
    },

    gameover() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.on_touch_start, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.on_touch_end, this);
    }

    // update (dt) {},
});
