var room_selector = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, {"key": "room_selector"});
    },
    init: function() {
        console.log('hello room_selector');
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
        this.add.text(1000/2,750/2-50,'Input Room Number', {
            fontSize: 30, color: "#073642",
            fontFamily: 'Montserrat'
        }).setOrigin(0.5);
        var warning_text=
        this.add.text(1000/2,750/2+200,'', {
            fontSize: 20, color: "red",
            fontFamily: 'Montserrat'
        }).setOrigin(0.5);

        var inputText = this.add.rexInputText(1000/2, 750/2+10, 10, 10, {
            id: 'myNumberInput',
            type: 'text',
            text: '0000',
            fontSize: '60px',
            border: 1,
            color: '0x000000',
            fontFamily: 'Inconsolata',
            backgroundColor: 'transparent',
            borderColor: '0x000000',
            maxLength: 4
        })
            .resize(200, 50)
            .setOrigin(0.5);
        
        inputText.text=String(Math.floor(Math.random()*10))
                    +String(Math.floor(Math.random()*10))
                    +String(Math.floor(Math.random()*10))
                    +String(Math.floor(Math.random()*10));
        
        inputText.node.addEventListener("keypress", function (evt) {
            if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
                evt.preventDefault();
            }
        });

        var buttons = this.rexUI.add.buttons({
            x: 80, y: 680, width: 100,
            orientation: 'y',
            buttons: [
                createButton(this, 'back')
            ],
            space: {item: 30},
            align: 'center'
        }).layout();
        var self=this;
        buttons
            .on('button.click', function (button, index, pointer, event) {
                self.scene.start("main_menu");
            })
            .on('button.over', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle(5, 0xb58900);
            })
            .on('button.out', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle();
            });
        buttons = this.rexUI.add.buttons({
            x: 1000/2, y: 750/2+110, width: 150,
            orientation: 'y',
            buttons: [
                createButton(this, 'Enter', height=80)
            ],
            space: {item: 30},
            align: 'center'
        }).layout();
        buttons
            .on('button.click', function (button, index, pointer, event) {
                var room=inputText.text;
                var ok=room.length==4;
                for(var s of room) {
                    ok&=s>='0'&&s<='9';
                }
                if(!ok) {
                    warning_text.text='room number must be 4 digits';
                    return;
                }
                socket.emit('connect_room',room);
                socket.on('connect_room_pong',function(text) {
                    console.log(text);
                    socket.removeAllListeners('connect_room_pong');
                    if(text!='ok') {
                        warning_text.text=text;
                        return;
                    }
                    self.scene.start("waiting_room",{
                        room: room
                    })
                });
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