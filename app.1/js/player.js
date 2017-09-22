/* global Phaser */

function PlayerSprite(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'pixelTransparent');
    game.world.addChild(this);
    game.physics.p2.enable(this);
    game.camera.follow(this, Phaser.Camera.FOLLOW_LOCKON, 0.8, 0.8);
    this.cutSceneCamera = false;
}

PlayerSprite.prototype = Object.create(Phaser.Sprite.prototype);
PlayerSprite.prototype.constructor = PlayerSprite;

PlayerSprite.prototype.Move = function (destinationPoint) {
    return new PlayerMove(this, destinationPoint);
}

function PlayerMove(player, destinationPoint) {
    this._player = player;
    this._destinationPoint = destinationPoint;
    this.onStart = new Phaser.Signal();
    this.onComplete = new Phaser.Signal();
}

PlayerMove.prototype.Start = function () {
    var playerPoint = new Phaser.Point(Math.floor(this._player.body.x), Math.floor(this._player.body.y));

    if (this._destinationPoint.equals(playerPoint)) {
        this.onStart.dispatch();
        this.onComplete.dispatch();
    } else {
        var moveTween = this._player.game.add.tween(this._player.body).to(
            { x: this._destinationPoint.x, y: this._destinationPoint.y }, 
            1200, Phaser.Easing.Quadratic.Out, true, 0, 0, false);
            
        moveTween.onStart.addOnce(function () {
            this.onStart.dispatch();
            this._player.cutSceneCamera = true;
        }, this);
        
        moveTween.onComplete.addOnce(function () {
            this.onComplete.dispatch();
        }, this);
    }
}
