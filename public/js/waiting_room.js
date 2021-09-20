var waiting_room = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, {"key": "waiting_room"});
    },
    init: function(data) {
        this.room=data.room;
        console.log('hello waiting_room');
    },
    preload: function() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'js/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        this.load.plugin('rexinputtextplugin', 'js/rexinputtextplugin.min.js', true);
    },
    create: function() {
        this.add.text(25,25,"Room "+this.room, {
            fontSize: 30, color: "#000000",
            fontFamily: 'Montserrat'
        });
        this.add.text(1000/2,750/2-200,"Waiting...", {
            fontSize: 50, color: "#000000",
            fontFamily: 'Montserrat'
        }).setOrigin(0.5);

        var pl=this.add.text(1000/2,750/2-130,"0 of 8", {
            fontSize: 40, color: "#000000",
            fontFamily: 'Montserrat'
        }).setOrigin(0.5);
        
        var pls=this.add.text(1000/2,750/2-90, "", {
            fontSize: 20, color: "#000000",
            fontFamily: 'Montserrat',
            align: 'left'
        }).setOrigin(0.5,0).setResolution(3);

        var self=this;

        socket.on('player_list_pong',function(list) {
            pl.text=list.length+' of 8';
            pls.text='';
            var all_ready=true;
            for(var u of list) {
                pls.text=pls.text+"○ "+u[0];
                if(u[1]) {
                    pls.text+=' √';
                }
                else all_ready=false;
                pls.text+='\n';
            }
            pls.text+=' ';
            if(all_ready&&list.length>=4)
                socket.emit("start_game",self.room);
        });
        var self=this;
        var update_members=function() {
            socket.emit('player_list_ping',self.room);
        };
        var si=setInterval(update_members,500);
        socket.on('start_game_pong',function() {
            clearInterval(si);
            socket.removeAllListeners('start_game_pong');
            socket.removeAllListeners('player_list_pong');
            self.scene.start("game_scene",{room:self.room});
        });


        var buttons = self.rexUI.add.buttons({
            x: 80, y: 680, width: 100,
            orientation: 'y',
            buttons: [
                createButton(self, 'back')
            ],
            space: {item: 30},
            align: 'center'
        }).layout();

        start_game=function() {
            socket.emit("start_game",self.room);
        };

        buttons
            .on('button.click', function (button, index, pointer, event) {
                clearInterval(si);
                socket.removeAllListeners('start_game_pong');
                socket.removeAllListeners('player_list_pong');
                socket.emit('leave_room');
                self.scene.start("main_menu");
            })
            .on('button.over', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle(5, 0xb58900);
            })
            .on('button.out', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle();
            });
        buttons = this.rexUI.add.buttons({
            x: 1000/2, y: 750/2+160, width: 200,
            orientation: 'y',
            buttons: [
                createButton(this, '  Ready  ', height=80)
            ],
            space: {item: 30},
            align: 'center'
        }).layout();
        buttons
            .on('button.click', function (button, index, pointer, event) {
                if(button.text=='  Ready  ') {
                    socket.emit('set_ready',true);
                    button.text='Unready';
                }
                else if(button.text=='Unready') {
                    socket.emit('set_ready',false);
                    button.text='  Ready  ';
                }
            })
            .on('button.over', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle(5, 0xb58900);
            })
            .on('button.out', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle();
            });
        
        makeChatBox(self, socket, this.room);
    },
    update: function() {}
});