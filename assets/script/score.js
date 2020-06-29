cc.Class({
    extends: cc.Component,

    properties: {
        number: {
            default: 0,
            type: cc.Integer,
        },
    },

    onLoad() {
        this.number = 0;
        this.highest = localStorage.getItem('highest');
        if (!this.highest) {
            this.highest = [];
            this.highest[4] = 0;
            this.highest[5] = 0;
            this.highest[6] = 0;
            localStorage.setItem('highest', this.highest.join(','));
        } else {
            this.highest = this.highest.split(',').map(Number);
        }
        let label = this.getComponent(cc.Label);
        let land = cc.find('/Canvas/ScrollView/view/content').getComponent('land');
        label.string = 'Score: ' + this.number + "\nHighest: " + this.highest[land.size];
    },

    add(num) {
        let label = this.getComponent(cc.Label);
        let land = cc.find('/Canvas/ScrollView/view/content').getComponent('land');
        this.number += num;
        if (this.number > this.highest[land.size]) {
            this.highest[land.size] = this.number;
            localStorage.setItem('highest', this.highest.join(','));
        }
        label.string = 'Score: ' + this.number + "\nHighest: " + this.highest[land.size];
    },

    // update (dt) {},
});
