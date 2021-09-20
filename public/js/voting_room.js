var createFlexibleButton2 = function (scene, text, width, height, fontsize, align='center', font='Montserrat') {
    return scene.rexUI.add.label({
        width: width, height: height,
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x268bd2),
        text: scene.add.text(0, 0, text, {fontSize: fontsize,
            color: "#ffffff", fontStyle: "bold", fontFamily: font}).setResolution(2),
        space: {
            left: 10,
            right: 10,
        },
        align: align
    }).setOrigin(0);
};
var voting_room = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, {"key": "voting_room"});
    },
    init: function(data) {
        this.room=data.room;
        this.player_info = data.player_info;
        console.log('Lets vote!');
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
        for(var x of all_quitters) x();
        all_quitters=[];
        var self = this;
        // list of culprits
        var list_pl = this.player_info;
        console.log(list_pl);
        // background rectangle
        var r = self.add.rectangle(1000/2, 750/2 - 100, 1000, 650, 0xfdf6e3).setScrollFactor(0);
        // ask the server about the players
        buttons = [];
        nums = {};
        button_to_id = {};
        bars = [];
        // foreit button
        var skip_bt = createFlexibleButton2(self, "Skip Voting", 60, 44, 34, 'left', 'Inconsolata');
        buttons.push(skip_bt);
        for (var id of Object.keys(list_pl)) {
            var bt = createFlexibleButton2(self, list_pl[id].name, 60, 44, 34, 'left', 'Inconsolata');
            buttons.push(bt);
            button_to_id[id] = bt;
        }
        var button_ls = self.rexUI.add.buttons({
            x: 100, y: 125, width: 90,
            orientation: 'y',
            buttons: buttons,
            space: {item: 8},
            align: 'left'
        }).setOrigin(0).layout();
        nums[-3]=this.add.text(910,30,"Day  1",
        { fontSize: '32px', fill: '#000',
        fontFamily: 'Inconsolata',
        backgroundColor: '#FFDE93'}).setOrigin(0.5,0).setScrollFactor(0);
        nums[-4]=this.add.text(910,60,"00s",
        { fontSize: '32px', fill: '#000',
        fontFamily: 'Inconsolata',
        backgroundColor: '#FFDE93'}).setOrigin(0.5,0).setScrollFactor(0);
        nums[-1]=self.add.text(30, 40, "Let's Vote!", { fontSize: '34px', fill: '#000',
        fontFamily: 'Montserrat',align:'center', fontStyle: "bold"}).setOrigin(0);
        nums[-2]=self.add.text(30, 90, "You may change your vote after casting as long as someone else hasn't vote.",
        { fontSize: '20px', fill: '#000',
        fontFamily: 'Montserrat',align:'center'}).setOrigin(0);
        nums[-5]=self.add.text(30, 563, "", { fontSize: '20px', fill: '#000',
        fontFamily: 'Montserrat',align:'center'}).setOrigin(0);
        for(var bt of buttons) {
            console.log(bt);
            nums[bt._y]=self.add.text(bt._x - 20, bt._y+22, '?', { fontSize: '34px', fill: '#000',
                    fontFamily: 'Montserrat',align:'center'}).setOrigin(0.5);
        }
        var vote_open=true;
        button_ls
            .on('button.click', function (button, index, pointer, event) {
                if(!vote_open) return;
                console.log("You voted " + button.text);
                if(button.text=='Skip Voting') {
                    nums[-5].text="You skipped your vote.";
                    socket.emit('vote','');
                }
                else {
                    nums[-5].text="Your vote: "+button.text;
                    // find the correct id
                    var id;
                    for (id of Object.keys(list_pl)) {
                        if (list_pl[id].name == button.text) break;
                    }
                    socket.emit('vote', id);
                }
            })
            .on('button.over', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle(5, 0xb58900);
            })
            .on('button.out', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle();
            });
        for (var id of Object.keys(list_pl)) {
            var bt = button_to_id[id];
            console.log(bt);
        }
        // listen on the socket for end-of-vote
        bar_drawn = false;
        var passed_out=false;
        var check_info=function(info_dic) {
            if(passed_out) return;
            if(info_dic['phase']==1) {
                const zeroPad = (num, places) => String(num).padStart(places, '0');
                nums[-3].text='day '+info_dic.day;
                tim=Date.now()-info_dic.day_start_time;
                nums[-4].text=zeroPad(60-Math.floor(tim/1000),2)+'s';
            }
            else {
                nums[-3].text="";
                nums[-4].text="";
            }
            if (info_dic['phase'] == 2 && !bar_drawn) {
                if(nums[-5].text=='')
                    nums[-5].text="You skipped your vote.";
                vote_open=false;
                var sad_news=null;
                for(var a of Object.values(info_dic.player_info)) {
                    console.log(a);
                    if(a.is_sep) sad_news=a.name;
                }
                nums[-1].text='Results are out!';
                if(sad_news!=null) nums[-2].text=sad_news+' is voted guilty and will be imprisoned.';
                else nums[-2].text='No agreement was reached.';
                console.log('drawing');
                // add the bars for the result
                var skipped=Object.keys(list_pl).length;
                for (var id of Object.keys(list_pl)) {
                    var bt = button_to_id[id], vt = info_dic.player_info[id].get_votes;
                    skipped -= vt; nums[bt._y].text=vt;
                    var bar = self.add.rectangle(bt._x + 235, bt._y+22, vt * 50, bt.height *.9, "0xff0000").setOrigin(0, 0.5);
                    console.log(bar);
                    bars.push(bar);
                }
                {
                    var bt=skip_bt; nums[bt._y].text=skipped;
                    var bar = self.add.rectangle(bt._x + 235, bt._y+22, skipped * 50, bt.height *.9, "0xff0000").setOrigin(0, 0.5);
                    console.log(bar);
                    bars.push(bar);
                }
                bar_drawn = true;
            }
            // we are done, shut down the scene
            if (info_dic['phase'] == 0) {
                button_ls.destroy();
                for (var bar of bars) {
                    bar.destroy();
                }
                for(var bt of Object.values(nums)) {
                    bt.destroy();
                }
                passed_out=true;
                socket.off('update_info', check_info);
                r.destroy();
                self.scene.stop();
            }
        }
        socket.on('update_info', check_info);
    }
});