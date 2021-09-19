var help_scene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "help_scene" });
    },
    init: function() {console.log("Hi tutorial")},
    preload: function() {
        this.load.image('title', "assets/dovic.png");
        this.counter = 1;
        this.nums = 7;
        for (var i = 1; i <= this.nums; i += 1) 
            this.load.image('image' + i, 'assets/tutorial'+i+'.png');
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    },
    create: function() {
        this.cimage = this.add.image(1000/2,50, 'image1').setOrigin(0.5,0);
        var buttons = this.rexUI.add.buttons({
                x: 80, y: 680, width: 100,
                orientation: 'y',
                buttons: [
                    createButton(this, 'Back')
                ],
                space: {item: 30},
                align: 'center'
        }).layout();
        var move_buttons = this.rexUI.add.buttons({
            x: 780, y: 680, width: 100,
            orientation: 'x',
            buttons: [
                createButton(this, 'Previous'),
                createButton(this, 'Next')
            ],
            space: {item: 30},
            align: 'center'
        }).layout();
        var self=this;
        move_buttons.on('button.click', function (button, index, pointer, event) {
            if (button.text == 'Previous') self.counter = Math.max(1, self.counter - 1);
            if (button.text == 'Next') 
                self.counter = Math.min(self.nums, self.counter + 1);
            console.log(self.counter);
            self.cimage.destroy();
            self.cimage = self.add.image(1000/2, 50, 'image' + self.counter).setOrigin(0.5,0);
        })
        .on('button.over', function (button, groupName, index) {
            button.getElement('background').setStrokeStyle(5, 0xb58900);
        })
        .on('button.out', function (button, groupName, index) {
            button.getElement('background').setStrokeStyle();
        });
        buttons
        .on('button.click', function (button, index, pointer, event) {
            self.scene.start("main_menu")
        })
        .on('button.over', function (button, groupName, index) {
            button.getElement('background').setStrokeStyle(5, 0xb58900);
        })
        .on('button.out', function (button, groupName, index) {
            button.getElement('background').setStrokeStyle();
        });
    },
    update: function(){}
});
