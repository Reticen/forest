cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        let land = cc.find('/Canvas/ScrollView/view/content').getComponent('land');
        let score = cc.find('/Canvas/Score').getComponent('score');
        let gameover = cc.find('/Canvas/Gameover').getComponent('gameover');
        this.node.children[0].on(cc.Node.EventType.TOUCH_END, () => {
            land.size = 4;
            score.highest = 0;
            gameover.on_touch_start();
        }, this);
        this.node.children[1].on(cc.Node.EventType.TOUCH_END, () => {
            land.size = 5;
            score.highest = 0;
            gameover.on_touch_start();
        }, this);
        this.node.children[2].on(cc.Node.EventType.TOUCH_END, () => {
            land.size = 6;
            score.highest = 0;
            gameover.on_touch_start();
        }, this);
    },

    // update (dt) {},
});
