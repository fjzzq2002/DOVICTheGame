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
            url: 'js/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    },
    create: function() {
        var self=this;
    },
    update: function() {}
});