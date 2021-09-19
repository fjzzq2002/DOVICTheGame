var credit = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "credit" });
    },
    init: function() {},
    preload: preload, 
    create: create, 
    update: update
});



function preload() {

}
function create() {
    this.add.text(1000/2,750/2-150,"HELLOWORLD!",{
        fontSize: 50, color: "#073642", fontStyle: "bold"
    }).setOrigin(0.5);
}
function update() {
    
}