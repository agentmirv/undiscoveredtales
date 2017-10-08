//=========================================================
function MakeScene(game, id) {
    var sceneData = game.gamedata.scenes.find(function (item) { return item.id == id });
    var sceneInstance = null;

    if (sceneData.id == "scene-player") {
        sceneInstance = new PlayerSceneGroup(game)
    } else if (sceneData.id == "scene-enemy") {
        sceneInstance = new EnemySceneGroup(game)
    }

    if (sceneInstance !== null) {
        game.stage.addChild(sceneInstance)
    }
}

//=========================================================
function PlayerSceneGroup(game) {
    Phaser.Group.call(this, game);

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
    var fadeOutTween = game.add.tween(this).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, false, 700, 0, false);
    var slideTween = game.add.tween(messageText).from({ x: messageText.x + 150 }, 2000, Phaser.Easing.Quadratic.Out, true, 400, 0, false);
    slideTween.chain(fadeOutTween)

    fadeInTween.onComplete.addOnce(this.updatePhase, this)
    fadeOutTween.onComplete.addOnce(this.destroyScene, this)

    game.cutSceneCamera = true
}

PlayerSceneGroup.prototype = Object.create(Phaser.Group.prototype);
PlayerSceneGroup.prototype.constructor = PlayerSceneGroup;

PlayerSceneGroup.prototype.updatePhase = function () {
    //game.hud.activePhase = "player"
    //game.hud.activeStep = ""
    //game.hudInstance.updatePhaseButtonImage()
}

PlayerSceneGroup.prototype.destroyScene = function () {
    game.cutSceneCamera = false
    this.destroy(true)
}

//=========================================================
function EnemySceneGroup(game) {
    Phaser.Group.call(this, game);

    var enemyPhaseBgModalImage = game.make.tileSprite(0, 0, game.stageViewRect.width, game.stageViewRect.height, 'pixelTransparent');
    enemyPhaseBgModalImage.inputEnabled = true;
    this.addChild(enemyPhaseBgModalImage);

    var enemyPhaseBgImage = game.make.tileSprite(0, 0, game.stageViewRect.width, game.stageViewRect.height, 'pixelWhite');
    enemyPhaseBgImage.tint = "0x450000";
    this.addChild(enemyPhaseBgImage);

    var text = "Enemy Phase"
    var textStyle = { font: "85px Times New Romans", fill: "#ffffff", fontStyle: "italic" };
    var messageText = game.make.text(0, 0, text, textStyle);
    messageText.autoRound = true
    messageText.alignIn(game.stageViewRect, Phaser.CENTER)
    this.addChild(messageText);

    var fadeInTween = game.add.tween(this).from({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 400, 0, false);
    var fadeOutTween = game.add.tween(this).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, false, 700, 0, false);
    var slideTween = game.add.tween(messageText).from({ x: messageText.x + 150 }, 2000, Phaser.Easing.Quadratic.Out, true, 400, 0, false);
    slideTween.chain(fadeOutTween)

    fadeInTween.onComplete.addOnce(this.updatePhase, this)
    fadeOutTween.onComplete.addOnce(this.beginEnemySteps, this)
    fadeOutTween.onComplete.addOnce(this.destroyScene, this)

    game.cutSceneCamera = true
}

EnemySceneGroup.prototype = Object.create(Phaser.Group.prototype);
EnemySceneGroup.prototype.constructor = EnemySceneGroup;

EnemySceneGroup.prototype.updatePhase = function () {
    game.hud.activePhase = "enemy"
    game.hud.activeStep = "events"
    game.hudInstance.updatePhaseButtonImage()
}

EnemySceneGroup.prototype.beginEnemySteps = function () {
    game.hud.currentMonsterIndex = -1
    game.hudInstance.fireEvent()
}

EnemySceneGroup.prototype.destroyScene = function () {
    game.cutSceneCamera = true
    this.destroy(true)
}
