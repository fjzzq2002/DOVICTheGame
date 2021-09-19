var final_scene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, {"key": "final_scene"});
    },
    init: function(data) {
        console.log('hello final_scene');
        this.info=data.info;
    },
    preload: function() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    },
    create: function() {
        game_fully_finished=true;
        for(var x of all_quitters) x();
        all_quitters=[];
        voting=true;
        ingame+=10000;
        var winner=this.info.end_info;
        var spreader=null;
        for(var g of Object.keys(this.info.player_info)) {
            if(this.info.player_info[g].is_super) spreader=this.info.player_info[g].name;
        }
        this.add.text(1000/2,100,'The evil',{
            fontSize: 40, color: "#000000",
            fontFamily: 'Montserrat'
        }).setOrigin(0.5);
        this.add.text(1000/2,180,spreader,{
            fontSize: 60, color: "#000000",
            fontFamily: 'Montserrat'
        }).setOrigin(0.5);
        this.add.text(1000/2,260,(winner==1)?'was defeated by the diligent students!':'had the last laugh!',{
            fontSize: 40, color: "#000000",
            fontFamily: 'Montserrat'
        }).setOrigin(0.5);
        console.log(this.info.votes_info);
        this.add.text(100,520,'Voting: skip '+this.info.votes_info.skip+'  correct '+this.info.votes_info.correct+'  wrong '+this.info.votes_info.wrong,{
            fontSize: 30, color: "#000000",
            fontFamily: 'Inconsolata'
        }).setOrigin(0);
        var count_prog=new Array(6);
        for(var i=0;i<=5;++i) count_prog[i]=0;
        for(var g of Object.keys(this.info.player_info)) {
            if(!this.info.player_info[g].is_super) ++count_prog[Math.min(this.info.player_info[g].tot_psets,5)];
        }
        var pset_stat='PSet: ';
        for(var i=0;i<=5;++i) {
            if(i) pset_stat+='/';
            pset_stat+=count_prog[i];
        }
        this.add.text(100,560,pset_stat,{
            fontSize: 30, color: "#000000",
            fontFamily: 'Inconsolata'
        }).setOrigin(0);
        this.add.text(100,600,'Infected: '+this.info.tot_infects+'/'+this.info.infects_to_win,{
            fontSize: 30, color: "#000000",
            fontFamily: 'Inconsolata'
        }).setOrigin(0);
    },
    update: function() {}
});