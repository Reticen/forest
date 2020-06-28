cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            cc.director.loadScene("Game");
        }, this);
    },

    // update (dt) {},
});
