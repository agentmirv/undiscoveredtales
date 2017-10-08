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
    this.onClick = new Phaser.Signal();
    
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
    button.events.onInputUp.add(function () {
        this.onClick.dispatch();
    }, this);
    this.addChild(button);
}

HudButton.prototype = Object.create(Phaser.Group.prototype);
HudButton.prototype.constructor = HudButton;

//=========================================================
function PlayerPhaseScene(game) {
    Phaser.Group.call(this, game);
    
    this.onStart = new Phaser.Signal();
    this.onFull = new Phaser.Signal();
    this.onComplete = new Phaser.Signal();

    var playerPhaseBgModalImage = game.make.tileSprite(0, 0, game.stageViewRect.width, game.stageViewRect.height, 'pixelTransparent');
    playerPhaseBgModalImage.inputEnabled = true;
    this.addChild(playerPhaseBgModalImage);

    var playerPhaseBgImage = game.make.tileSprite(0, 0, game.stageViewRect.width, game.stageViewRect.height, 'pixelWhite');
    playerPhaseBgImage.tint = "0x044500";
    this.addChild(playerPhaseBgImage);

    var text = "Player Phase"
    var textStyle = { font: "85px Times New Romans", fill: "#ffffff", fontStyle: "italic" };
    var messageText = game.make.text(0, 0, text, textStyle);
    messageText.autoRound = true
    messageText.alignIn(game.stageViewRect, Phaser.CENTER)
    this.addChild(messageText);

    var fadeInTween = game.add.tween(this).from({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 400, 0, false);
    fadeInTween.onStart.addOnce(function () {
        this.onStart.dispatch();
    }, this);
    fadeInTween.onComplete.addOnce(function () {
        this.onFull.dispatch();
    }, this);

    var fadeOutTween = game.add.tween(this).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, false, 700, 0, false);
    fadeOutTween.onComplete.addOnce(function () {
        this.onComplete.dispatch();
        //this.game.player.cutSceneCamera = false;
        this.destroy(true);
    }, this);

    var slideTween = game.add.tween(messageText).from({ x: messageText.x + 150 }, 2000, Phaser.Easing.Quadratic.Out, true, 400, 0, false);
    slideTween.chain(fadeOutTween)

    //game.cutSceneCamera = true
}

PlayerPhaseScene.prototype = Object.create(Phaser.Group.prototype);
PlayerPhaseScene.prototype.constructor = PlayerPhaseScene;
