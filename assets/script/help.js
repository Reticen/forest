cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            let target = cc.find('/Canvas/Text');
            if (!target.opacity) {
                let f = function (target, a) {
                    target.opacity = a;
                    if (a < 255) {
                        setTimeout(() => {
                            f(target, a + 15);
                        }, 5);
                    }
                };
                f(target, 0);
            }
        }, this);
    },

    // update (dt) {},
});
