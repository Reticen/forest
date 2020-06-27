cc.Class({
    extends: cc.Component,

    properties: {
        number: {
            default: 0,
            type: cc.Integer,
        },
        highest: {
            default: 0,
            type: cc.Integer,
        },
    },

    onLoad() {
        this.number = 0;
        let label = this.getComponent(cc.Label);
        label.string = 'Score: ' + this.number + "\nHighest: " + this.highest;
    },

    add(num) {
        let label = this.getComponent(cc.Label);
        this.number += num;
        if (this.number > this.highest) {
            this.highest = this.number;
            label.string = 'Score: ' + this.number + "\nHighest: " + this.highest;
        }
        label.string = 'Score: ' + this.number + "\nHighest: " + this.highest;
    },

    // update (dt) {},
});
