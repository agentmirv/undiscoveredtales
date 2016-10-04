var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.baseURL = 'http://examples.phaser.io/assets/';
    game.load.crossOrigin = 'anonymous';

    game.load.image('phaser', 'sprites/phaser-dude.png');

}

function create() {
    var sprite = game.add.sprite(100, 100, 'phaser');

    var testBmd = game.make.bitmapData(27, 40);
    testBmd.copy('phaser');
    testBmd.generateTexture('phaserTexture');
    game.add.sprite(160, 160, 'phaserTexture')
}

function update() {

}

function render() {
    //game.debug.cameraInfo(game.camera, 32, 32);
    //game.debug.spriteInfo(player, 32, 130);
    //game.debug.text(game.revealDialogs.length, 32, 230)
    //game.debug.text(cameraPoint.x, 32, 230)
    //game.debug.text(cameraPoint.y, 32, 250)
    //game.debug.text(playerPoint.x, 32, 270)
    //game.debug.text(playerPoint.y, 32, 290)

    //var targetRectLarge = new Phaser.Rectangle(player.body.x - 60, player.body.y - 60, 120, 120)
    //game.debug.geom(targetRectLarge, "#00FF00", false)
    //var targetRectSmall = new Phaser.Rectangle(player.body.x - 10, player.body.y - 10, 20, 20)
    //game.debug.geom(targetRectSmall, "#00FF00", false)
}
