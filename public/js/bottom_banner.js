var bottom_banner = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, {"key": "bottom_banner"});
    },

    init: function(data) {
        this.room=data.room;
        this.pscene=data.pscene;
    },
    preload: function() {
        this.load.image('hat', "assets/graduation.png");
        this.load.image('vampire', "assets/vampire.png");
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);
    },
    create: function() {
        this.super_rect=this.add.rectangle(500, 750 - 75, 1000, 150, is_super?0xE3A1A6:0xadadff);
        poly = new Array(6);
        if(!is_super) {
            var ps=[[27+27,12+12],[27 + 35,0],[5,0],[-3,24]];
            poly[1] = this.add.polygon(160, 750 - 90, ps, 0xffffff);
            poly[2] = this.add.polygon(230, 750 - 90, ps, 0xffffff);
            poly[5] = this.add.polygon(217, 750 - 50, ps, 0xffffff);
            poly[4] = this.add.polygon(147, 750 - 50, ps, 0xffffff);
            poly[3] = this.add.polygon(77, 750 - 50, ps, 0xffffff);
        }
        else {
            const f=0.4;
            var ps=[[(27+27)*f,(12+12)*f],[(27 + 35)*f,0],[5*f,0],[-3*f,24*f]];
            poly[1] = this.add.polygon(125, 750 - 110, ps, 0xffffff);
            poly[2] = this.add.polygon(125+31, 750 - 110, ps, 0xffffff);
            poly[3] = this.add.polygon(125+31*2, 750 - 110, ps, 0xffffff);
            poly[4] = this.add.polygon(125+31*3, 750 - 110, ps, 0xffffff);
            poly[5] = this.add.polygon(125+31*4, 750 - 110, ps, 0xffffff);
            super_count_txt=this.add.text(110,750-110+20,'Infected: 0/0',
            {fontSize: "20px", color: "#ffffff", fontStyle: "bold", fontFamily: 'Inconsolata'}
            ).setOrigin(0);
            super_state_txt=this.add.text(110,750-110+50,'Noninfectious',
            {fontSize: "22px", color: "#ffffff", fontStyle: "bold", fontFamily: 'Inconsolata'}
            ).setOrigin(0);
        }
        var a;
        if(!is_super) {
            a = this.add.image(70,750 - 100, 'hat');
        }
        else {
            a = this.add.image(70-10,750 - 100+20, 'vampire').setScale(0.5);
        }
        makeChatBox(this, socket, this.room, this.pscene);
    },
    update: function() {
        if(typeof(game_fully_finished)!=="undefined") {
            this.scene.stop();
            return;
        }
        if(is_super) {
            if(super_state==2) {
                super_state_txt.text='Infectious';
            }
            else if(super_state==3) {
                super_state_txt.text='Symptomatic';
            }
            else {
                super_state_txt.text='Noninfectious';
            }
        }
        else {
            if(infected) {
                this.super_rect.fillColor=0x8585ff;
            }
            else {
                this.super_rect.fillColor=0xadadff;
            }
        }
    }
});