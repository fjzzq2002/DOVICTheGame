var main_scene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, {"key": "main_scene"});
    },
    init: function() {
        console.log('hello main_scene');
    },
    preload: function() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    },
    create: function() {
        var self=this;
    },
    update: function() {}
});