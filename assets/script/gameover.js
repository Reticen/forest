cc.Class({
    extends: cc.Component,

    set() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.on_touch_end, this);
        this.node.opacity = 245;
        let land = cc.find('/Canvas/ScrollView/view/content').getComponent('land');
        land.gameover();
        let plant = cc.find('/Canvas/Plant').getComponent('move');
        plant.gameover();
    },

    on_touch_end() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.on_touch_end, this);
        this.node.opacity = 0;
        let score = cc.find('/Canvas/Score').getComponent('score');
        score.onLoad();
        let land = cc.find('/Canvas/ScrollView/view/content').getComponent('land');
        land.onLoad();
        let plant = cc.find('/Canvas/Plant').getComponent('move');
        plant.onLoad();
    },

    // update (dt) {},
});
