var createButton = function (scene, text, height0=80) {
    return scene.rexUI.add.label({
        width: 80, height: height0,
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x268bd2),
        text: scene.add.text(0, 0, text, {fontSize: 40, color: "#ffffff", fontStyle: "bold", fontFamily: 'Montserrat'}).setResolution(2),
        space: {
            left: 10,
            right: 10,
        },
        align: 'center'
    });
};
var main_menu = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, {"key": "main_menu"});
    },
    init: function() {
        console.log('hello main_menu');
    },
    preload: function() {
        this.load.image('title', "assets/dovic.png");
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);

    },
    create: function() {
        this.add.image(1000/2,750/2-150, 'title');

        var inputText = this.add.rexInputText(1000/2, 750/2+10, 10, 10, {
            id: 'myNumberInput',
            type: 'text',
            text: (typeof playerName !== 'undefined') ? playerName : generateName(),
            fontSize: '34px',
            border: 1,
            color: '0x000000',
            backgroundColor: 'transparent',
            borderColor: '0x000000',
            maxLength: 12
        })
            .resize(300, 50)
            .setOrigin(0.5);

        
        inputText.node.addEventListener("keypress", function (evt) {
            if (evt.which != 8 && evt.which != 0 && evt.which > 127) {
                evt.preventDefault();
            }
        });
        
        inputText.on('textchange', function(inputText, e) {
            playerName = inputText.text;
        }, this);

        var buttons = this.rexUI.add.buttons({
            x: 1000/2, y: 750/2+180, width: 300,
            orientation: 'y',
            buttons: [
                createButton(this, 'Play'),
                createButton(this, 'Tutorial')
            ],
            space: {item: 40},
            align: 'center'
        }).layout();
        var self=this;
        buttons
            .on('button.click', function (button, index, pointer, event) {
                console.log(button);
                if(button.text=='Play') {
                    playerName = inputText.text;
                    socket.emit('set_name',inputText.text);
                    playerName = inputText.text;
                    self.scene.start("room_selector");
                }
                if(button.text=='Tutorial'){
                    self.scene.start("help_scene");
                }
            })
            .on('button.over', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle(5, 0xb58900);
            })
            .on('button.out', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle();
            });
    },
    update: function() {}
});