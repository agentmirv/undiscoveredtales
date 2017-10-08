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

//=========================================================
function EnemyPhaseScene(game) {
    Phaser.Group.call(this, game);
    
    this.onStart = new Phaser.Signal();
    this.onFull = new Phaser.Signal();
    this.onComplete = new Phaser.Signal();

    var playerPhaseBgModalImage = game.make.tileSprite(0, 0, game.stageViewRect.width, game.stageViewRect.height, 'pixelTransparent');
    playerPhaseBgModalImage.inputEnabled = true;
    this.addChild(playerPhaseBgModalImage);

    var playerPhaseBgImage = game.make.tileSprite(0, 0, game.stageViewRect.width, game.stageViewRect.height, 'pixelWhite');
    playerPhaseBgImage.tint = "0x450000";
    this.addChild(playerPhaseBgImage);

    var text = "Enemy Phase"
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

EnemyPhaseScene.prototype = Object.create(Phaser.Group.prototype);
EnemyPhaseScene.prototype.constructor = EnemyPhaseScene;
