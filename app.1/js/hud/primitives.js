//=========================================================
function DarkBackground(game) {
    Phaser.Sprite.call(this, game, game.stageViewRect.x, game.stageViewRect.y, 'pixelTransparent');
    
    this.width = game.stageViewRect.width;
    this.height = game.stageViewRect.height;
    this.tint = "0x000000";
    this.alpha = 0.9
    this.inputEnabled = true;
    this._visible = false;
    this.kill();
}

DarkBackground.prototype = Object.create(Phaser.Sprite.prototype);
DarkBackground.prototype.constructor = DarkBackground;

DarkBackground.prototype.show = function () {
    if (!this._visible) {
        this.game.hudInstance._enemyPhaseBGImage.alpha = 0.9;
        this.game.hudInstance._enemyPhaseBGImage.revive();
        var fadeTween = this.game.add.tween(this).from({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}

DarkBackground.prototype.hide = function () {
    if (this._visible) {
        var fadeTween = this.game.add.tween(this).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
        fadeTween.onComplete.addOnce(function () {
            this.alpha = 0;
            this.kill();
        });
    }
}

//=========================================================
function HudButton(game, greenImageId, redImageId) {
    Phaser.Group.call(this, game);
    
    // End Phase (Green)
    this.greenbg = game.make.image(0, 0, Helper.getImage(greenImageId));
    this.addChild(this.greenbg);

    // End Phase (Red)
    this.redbg = game.make.image(0, 0, Helper.getImage(redImageId));
    this.addChild(this.redbg);
    this.redbg.kill();

    // End Phase Button
    var button = game.make.sprite(this.greenbg.x, this.greenbg.y, 'pixelTransparent');
    button.width = this.greenbg.width;
    button.height = this.greenbg.height;
    button.inputEnabled = true;
    //endPhaseButton.events.onInputUp.add(this.endPhaseClicked, this);
    this.addChild(button);
}

HudButton.prototype = Object.create(Phaser.Group.prototype);
HudButton.prototype.constructor = HudButton;
