// JavaScript source code
var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'phaser-app')

var GameState = {
    preload: function () {
        game.load.image('background', 'assets/images/debug-grid-1920x1920.png')
        game.load.image('pixelWhite', 'assets/images/FFFFFF-1.png')
        game.load.image('pixelBlack', 'assets/images/000000-1.png')
        game.load.image('pixelTransparent', 'assets/images/1x1.png')
        game.load.image('circleToken', 'assets/images/CircleToken.png');
        game.load.image('squareToken', 'assets/images/SquareToken.png');
        game.load.image('investigator', 'assets/images/run.png');
        game.load.image('search', 'assets/images/uncertainty.png');
        game.load.image('explore', 'assets/images/lantern-flame.png');
        game.load.image('revealPointer', 'assets/images/RevealPointer.png');
        game.load.image('wall', 'assets/images/WallTokenN.png');
        game.load.image('debugCircle', 'assets/images/DebugCircle.png');
        game.load.image('debugSquare', 'assets/images/DebugSquare.png');
        game.load.image('pentacle', 'assets/images/pentacle.png');
        game.load.image('bird', 'assets/images/raven.png');
        game.load.image('hudButton', 'assets/images/HudButton.png');
        game.load.image('arrow', 'assets/images/plain-arrow.png');
        game.load.image('deepOne', 'assets/images/toad-teeth.png');
        game.load.image('squareBackground', 'assets/images/SquareBackground.png');
        game.load.image('monsterMask', 'assets/images/MonsterMask.png');
        game.load.image('interlaced-tentacles', 'assets/images/interlaced-tentacles.png');

        game.load.spritesheet('tileWallsSheet', 'assets/images/TileWalls.png', 96, 96);

        game.load.json('gamedata', 'data/gamedata.json');
    },

    create: function () {
        //=================================================
        // Initialize game data
        game.gamedata = game.cache.getJSON('gamedata');
        game.gamedataInstances = {};
        game.gamedataInstances.mapTiles = []
        game.gamedataInstances.mapTokens = [] 
        game.gamedataInstances.monsters = []
        game.customStates = []; // This is used in skill test dialogs
        game.revealList = {};
        game.revealList.dialogs = [];
        game.hud = {};
        game.hud.activePhase = "player";
        game.hud.activeStep = "";
        game.hud.fireSet = false;
        game.hud.randomEventDeck = []
        game.hud.randomMonsterAttackDeck = []
        game.hud.randomMonsterHorrorCheckDeck = []
        game.hud.showEnemyPhaseBG = false
        game.hud.monsterTrayOpen = false
        game.hud.monsterTrayDetail = false
        game.hud.currentMonsterIndex = -1
        game.hud.currentMonsterInstance = null
        game.hudInstance = {};

        //=================================================
        // Hud images
        var hudBmd = game.make.bitmapData(96, 96)
        var endHudBgImage = game.make.image(0, 0, "hudButton")

        // End Phase
        var endPhaseButtonImage = game.make.image(0, 0, "arrow")
        endPhaseButtonImage.tint = "0xFFFFFF"
        endHudBgImage.tint = "0x044500"
        hudBmd.copy(endHudBgImage)
        hudBmd.copy(endPhaseButtonImage, 0, 0, 64, 64, 16, 16)
        game.cache.addBitmapData("endPhase-image-player", hudBmd)

        hudBmd = game.make.bitmapData(96, 96)
        endHudBgImage.tint = "0x450000"
        hudBmd.copy(endHudBgImage)
        hudBmd.copy(endPhaseButtonImage, 0, 0, 64, 64, 16, 16)
        game.cache.addBitmapData("endPhase-image-enemy", hudBmd)

        // Monster
        hudBmd = game.make.bitmapData(96, 96)
        var monsterButtonImage = game.make.image(0, 0, "interlaced-tentacles")
        monsterButtonImage.tint = "0xFFFFFF"
        endHudBgImage.tint = "0x044500"
        hudBmd.copy(endHudBgImage)
        hudBmd.copy(monsterButtonImage, 0, 0, 64, 64, 16, 16)
        game.cache.addBitmapData("monster-image-player", hudBmd)

        hudBmd = game.make.bitmapData(96, 96)
        endHudBgImage.tint = "0x450000"
        hudBmd.copy(endHudBgImage)
        hudBmd.copy(monsterButtonImage, 0, 0, 64, 64, 16, 16)
        game.cache.addBitmapData("monster-image-enemy", hudBmd)

        //=================================================
        // ImageTokens BitmapData
        for (var i = 0; i < game.gamedata.imageTokens.length; i++) {
            var gridWidth = 96
            var imageTokenData = game.gamedata.imageTokens[i]
            var tokenBmd = game.make.bitmapData(gridWidth, gridWidth)

            if (imageTokenData.backgroundImageKey != null) {
                if (imageTokenData.backgroundImageAngle == null) {
                    var backgroundImage = game.make.image(0, 0, imageTokenData.backgroundImageKey)
                    if (imageTokenData.backgroundColor != null) {
                        backgroundImage.tint = imageTokenData.backgroundColor
                    }
                    tokenBmd.copy(backgroundImage)
                } else {
                    var degToRad = imageTokenData.backgroundImageAngle * (Math.PI / 180);
                    if (imageTokenData.backgroundImageAngle == 90) {
                        tokenBmd.copy(imageTokenData.backgroundImageKey, null, null, null, null, null, null, null, null, degToRad, 0, 1);
                    } else if (imageTokenData.backgroundImageAngle == 270) {
                        tokenBmd.copy(imageTokenData.backgroundImageKey, null, null, null, null, null, null, null, null, degToRad, 1, 0);
                    } else if (imageTokenData.backgroundImageAngle == 180) {
                        tokenBmd.copy(imageTokenData.backgroundImageKey, null, null, null, null, null, null, null, null, degToRad, 1, 1);
                    } else {
                        tokenBmd.copy(imageTokenData.backgroundImageKey);
                    }
                }
            }

            if (imageTokenData.primaryImageKey != null) {
                var primaryImage = game.make.image(0, 0, imageTokenData.primaryImageKey)

                if (imageTokenData.imageShadowColor != null) {
                    primaryImage.tint = imageTokenData.imageShadowColor
                    tokenBmd.copy(primaryImage, 0, 0, 64, 64, 16 + 2, 16 + 2)
                }

                if (imageTokenData.imagePrimaryColor != null) {
                    primaryImage.tint = imageTokenData.imagePrimaryColor
                }

                tokenBmd.copy(primaryImage, 0, 0, 64, 64, 16, 16)
            }

            if (imageTokenData.maskImageKey != null) {
                var maskImage = game.make.image(0, 0, imageTokenData.maskImageKey)
                if (imageTokenData.maskColor != null) {
                    maskImage.tint = imageTokenData.maskColor
                }
                tokenBmd.copy(maskImage)
            }

            game.cache.addBitmapData(imageTokenData.imageKey, tokenBmd)
        }

        //=================================================
        // ImageTiles bitmapData
        for (var k = 0; k < game.gamedata.imageTiles.length; k++) {
            var gridWidth = 96;
            var imageTileData = game.gamedata.imageTiles[k]
            var bmdWidth = imageTileData.width * gridWidth;
            var bmdHeight = imageTileData.height * gridWidth;
            var mapTileBmd = game.make.bitmapData(bmdWidth, bmdHeight);

            mapTileBmd.rect(0, 0, bmdWidth, bmdHeight, imageTileData.floorColor);

            for (var j = 0; j < imageTileData.height; j++) {
                for (var i = 0; i < imageTileData.width; i++) {
                    var localX = i * gridWidth;
                    var localY = j * gridWidth;
                    var wallIndex = i + j * 6;
                    var sprite = game.make.tileSprite(localX, localY, gridWidth, gridWidth, imageTileData.spritesheet, imageTileData.walls[wallIndex])
                    mapTileBmd.copy(sprite);
                }
            }

            game.cache.addBitmapData(imageTileData.imageKey, mapTileBmd)
        }

        //=================================================
        // Initialize Stuff
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.world.setBounds(0, 0, 2560, 2560);
        game.camera.bounds = null
        game.camera.focusOnXY(game.gamedata.playerStart.x, game.gamedata.playerStart.y)
        game.stageViewRect = new Phaser.Rectangle(0, 0, game.camera.view.width, game.camera.view.height)
        game.presentationOffsetY = 48
        cursors = game.input.keyboard.createCursorKeys();

        player = game.add.sprite(game.gamedata.playerStart.x, game.gamedata.playerStart.y, 'pixelTransparent');
        game.physics.p2.enable(player);
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);

        game.add.tileSprite(0, 0, 2560, 2560, 'background');

        //=================================================
        // Add HUD
        var hudInstance = new HudGroup(game)
        game.stage.addChild(hudInstance)
        game.hudInstance = hudInstance;

        //=================================================
        // Game Start
        //=================================================
        //MakeRevealList(game, game.gamedata.playerStart.firstReveal)
        MakeMonster(game, "deep-one")
        MakeMonster(game, "deep-one")
    },

    update: function () {
        if (!game.cutSceneCamera && game.hud.activePhase == "player") {
            var playerVelocity = 400;
            player.body.setZeroVelocity();

            if (cursors.up.isDown) {
                player.body.moveUp(playerVelocity)
            }
            else if (cursors.down.isDown) {
                player.body.moveDown(playerVelocity);
            }

            if (cursors.left.isDown) {
                player.body.velocity.x = -playerVelocity;
            }
            else if (cursors.right.isDown) {
                player.body.moveRight(playerVelocity);
            }

            if (game.input.activePointer.isDown) {
                if (game.origDragPoint) {
                    // move the camera by the amount the mouse has moved since last update	
                    player.body.x += game.origDragPoint.x - game.input.activePointer.position.x;
                    player.body.y += game.origDragPoint.y - game.input.activePointer.position.y;
                }
                // set new drag origin to current position	
                game.origDragPoint = game.input.activePointer.position.clone();
            } else {
                game.origDragPoint = null;
            }
        }
    },

    render: function () {
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
}

//=========================================================
function Helper() {
    // do nothing
}

Helper.getImage = function (imageKey) {
    return game.cache.getBitmapData(imageKey)
}

// Fisher-Yates Shuffle
// https://bost.ocks.org/mike/shuffle/
Helper.shuffle = function (array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle
    while (m) {

        // Pick a remaining element
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

//TODO Polyfill for array.find?
//TODO Polyfill for array.filter?

//=========================================================
function MakeMonsterHorrorCheckDialogGroup(game, id) {
    var horrorCheckData = game.gamedata.horrorChecks.find(function (item) { return item.id == id });

    var monsterHorrorCheckDialogGroup = new MonsterHorrorCheckDialogGroup(
        game,
        horrorCheckData.text
    )

    game.add.tween(monsterHorrorCheckDialogGroup).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    game.stage.addChild(monsterHorrorCheckDialogGroup)
}

function MonsterHorrorCheckDialogGroup(game, messageText) {
    Phaser.Group.call(this, game);

    // Modal
    var modalBackground = game.make.sprite(game.stageViewRect.x, game.stageViewRect.y, 'pixelTransparent');
    modalBackground.width = game.stageViewRect.width;
    modalBackground.height = game.stageViewRect.height;
    modalBackground.inputEnabled = true;
    this.addChild(modalBackground);

    // Message
    var dialogMessage = new DialogMessage(game, messageText, null);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    this.addChild(dialogMessage);

    // Button for [Continue]
    var dialogContinue = new DialogButtonThin(game, "Continue", 180);
    dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
    this.addChild(dialogContinue);

    var dialogContinueButton = game.make.sprite(dialogContinue.x, dialogContinue.y, 'pixelTransparent');
    dialogContinueButton.width = dialogContinue.width;
    dialogContinueButton.height = dialogContinue.height;
    dialogContinueButton.inputEnabled = true;
    dialogContinueButton.events.onInputUp.add(this.continueClicked, this);
    this.addChild(dialogContinueButton);
}

MonsterHorrorCheckDialogGroup.prototype = Object.create(Phaser.Group.prototype);
MonsterHorrorCheckDialogGroup.prototype.constructor = MonsterHorrorCheckDialogGroup;

MonsterHorrorCheckDialogGroup.prototype.continueClicked = function (button, pointer) {
    var fadeOutTween = game.add.tween(this).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    fadeOutTween.onComplete.addOnce(function () {
        this.destroy(true);
    }, this);
}

//=========================================================
function MakeHorrorCheckConfirmDialog(game, monsterInstance) {
    var horrorCheckConfirmDialogGroup = new HorrorCheckConfirmDialogGroup(game, monsterInstance)
    game.add.tween(horrorCheckConfirmDialogGroup).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    game.stage.addChild(horrorCheckConfirmDialogGroup)
}

function HorrorCheckConfirmDialogGroup(game, monsterInstance) {
    Phaser.Group.call(this, game);

    this._monsterInstance = monsterInstance

    // Modal
    var modalBackground = game.make.sprite(game.stageViewRect.x, game.stageViewRect.y, 'pixelTransparent');
    modalBackground.width = game.stageViewRect.width;
    modalBackground.height = game.stageViewRect.height;
    modalBackground.inputEnabled = true;
    this.addChild(modalBackground);

    var messageText = "Resolve a Horror check?"

    // Message
    var dialogMessage = new DialogMessage(game, messageText, null);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    this.addChild(dialogMessage);

    var dialogCancel = new DialogButtonThin(game, "Cancel", 280);
    dialogCancel.alignTo(dialogMessage, Phaser.BOTTOM_LEFT, -10, 10)
    this.addChild(dialogCancel);

    var dialogAction = new DialogButtonThin(game, "Confirm", 280);
    dialogAction.alignTo(dialogMessage, Phaser.BOTTOM_RIGHT, -10, 10)
    this.addChild(dialogAction);

    var dialogCancelButton = game.make.sprite(dialogCancel.x, dialogCancel.y, 'pixelTransparent');
    dialogCancelButton.width = dialogCancel.width;
    dialogCancelButton.height = dialogCancel.height;
    dialogCancelButton.inputEnabled = true;
    dialogCancelButton.events.onInputUp.add(this.cancelClicked, this);
    this.addChild(dialogCancelButton);

    var dialogActionButton = game.make.sprite(dialogAction.x, dialogAction.y, 'pixelTransparent');
    dialogActionButton.width = dialogAction.width;
    dialogActionButton.height = dialogAction.height;
    dialogActionButton.inputEnabled = true;
    dialogActionButton.events.onInputUp.add(this.confirmClicked, this);
    this.addChild(dialogActionButton);
}

HorrorCheckConfirmDialogGroup.prototype = Object.create(Phaser.Group.prototype);
HorrorCheckConfirmDialogGroup.prototype.constructor = HorrorCheckConfirmDialogGroup;

HorrorCheckConfirmDialogGroup.prototype.cancelClicked = function (button, pointer) {
    var fadeOutTween = game.add.tween(this).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    fadeOutTween.onComplete.addOnce(function () {
        this.destroy(true);
    }, this);
}

HorrorCheckConfirmDialogGroup.prototype.confirmClicked = function (button, pointer) {
    var fadeOutTween = game.add.tween(this).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    fadeOutTween.onComplete.addOnce(function () {
        HudGroup.prototype.monsterHorrorCheck(this._monsterInstance)
        this.destroy(true);
    }, this);
}

//=========================================================
function MakeHorrorCheckDialog(game) {
    var horrorCheckDialogGroup = new HorrorCheckDialogGroup(game)
    game.add.tween(horrorCheckDialogGroup).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    game.stage.addChild(horrorCheckDialogGroup)
}

function HorrorCheckDialogGroup(game) {
    Phaser.Group.call(this, game);

    // Modal
    var modalBackground = game.make.sprite(game.stageViewRect.x, game.stageViewRect.y, 'pixelTransparent');
    modalBackground.width = game.stageViewRect.width;
    modalBackground.height = game.stageViewRect.height;
    modalBackground.inputEnabled = true;
    this.addChild(modalBackground);

    var messageText = "Each investigator must resolve a horror check against the monster within range with the highest horror rating. After all horror checks have been resolved, tap the end phase button to continue."

    // Message
    var dialogMessage = new DialogMessage(game, messageText, null);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    this.addChild(dialogMessage);

    // Button for [Continue]
    var dialogContinue = new DialogButtonThin(game, "Continue", 180);
    dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
    this.addChild(dialogContinue);

    var dialogContinueButton = game.make.sprite(dialogContinue.x, dialogContinue.y, 'pixelTransparent');
    dialogContinueButton.width = dialogContinue.width;
    dialogContinueButton.height = dialogContinue.height;
    dialogContinueButton.inputEnabled = true;
    dialogContinueButton.events.onInputUp.add(this.continueClicked, this);
    this.addChild(dialogContinueButton);
}

HorrorCheckDialogGroup.prototype = Object.create(Phaser.Group.prototype);
HorrorCheckDialogGroup.prototype.constructor = HorrorCheckDialogGroup;

HorrorCheckDialogGroup.prototype.continueClicked = function (button, pointer) {
    var fadeOutTween = game.add.tween(this).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    fadeOutTween.onComplete.addOnce(function () {
        this.destroy(true);
    }, this);
}

//=========================================================
function MakeMonsterAttackDialog(game, id) {
    var attackData = game.gamedata.monsterAttacks.find(function (item) { return item.id == id });
    
    var monsterAttackDialogGroup = new MonsterAttackDialogGroup(
        game,
        attackData.moveText,
        attackData.attackButtonText,
        attackData.nonAttackButtonText,
        attackData.attackText,
        attackData.nonAttackText
    )

    game.stage.addChild(monsterAttackDialogGroup)
}

function MonsterAttackDialogGroup(game, moveText, attackButtonText, nonAttackButtonText, attackText, nonAttackText) {
    Phaser.Group.call(this, game);
    var dialogRect = new Phaser.Rectangle(96 * 3, 16, game.stageViewRect.width -96 * 3, game.stageViewRect.height)
    this._attackResolved = false;
    this._nonAttackExists = nonAttackText != null;

    // Move Text
    var moveTextDialog = new DialogMessageMonster(game, moveText, 600);
    moveTextDialog.alignIn(dialogRect, Phaser.TOP_CENTER, 0, 0)
    this.addChild(moveTextDialog);

    // Attack Button
    var attackButtonTextGroup = new DialogButtonMedium(game, attackButtonText, 520)
    attackButtonTextGroup.alignTo(moveTextDialog, Phaser.BOTTOM_CENTER, 0, 28)
    this.addChild(attackButtonTextGroup);

    var attackButton = game.make.sprite(attackButtonTextGroup.x, attackButtonTextGroup.y, 'pixelTransparent');
    attackButton.width = attackButtonTextGroup.width;
    attackButton.height = attackButtonTextGroup.height;
    attackButton.inputEnabled = true;
    attackButton.events.onInputUp.add(this.attackButtonClicked, this);
    this.addChild(attackButton);

    // Non Attack Button
    var nonAttackButtonTextGroup = new DialogButtonMedium(game, nonAttackButtonText, 520)
    nonAttackButtonTextGroup.alignTo(attackButtonTextGroup, Phaser.BOTTOM_CENTER, 0, 28)
    this.addChild(nonAttackButtonTextGroup);
    
    var nonAttackButton = game.make.sprite(nonAttackButtonTextGroup.x, nonAttackButtonTextGroup.y, 'pixelTransparent');
    nonAttackButton.width = nonAttackButtonTextGroup.width;
    nonAttackButton.height = nonAttackButtonTextGroup.height;
    nonAttackButton.inputEnabled = true;
    nonAttackButton.events.onInputUp.add(this.nonAttackButtonClicked, this);
    this.addChild(nonAttackButton);

    this._mainGroup = game.make.group(this)
    this._mainGroup.addChild(moveTextDialog)
    this._mainGroup.addChild(attackButtonTextGroup)
    this._mainGroup.addChild(attackButton)
    this._mainGroup.addChild(nonAttackButtonTextGroup)
    this._mainGroup.addChild(nonAttackButton)

    // Attack Text
    var attackTextDialog = new DialogMessageMonster(game, attackText, 600);
    attackTextDialog.alignIn(dialogRect, Phaser.TOP_CENTER, 0, 0)
    this.addChild(attackTextDialog);

    // Attack Text Continue
    var attackTextContinue = new DialogButtonThin(game, "Continue", 180);
    attackTextContinue.alignTo(attackTextDialog, Phaser.BOTTOM_CENTER, 0, 28)
    this.addChild(attackTextContinue);

    var attackTextContinueButton = game.make.sprite(attackTextContinue.x, attackTextContinue.y, 'pixelTransparent');
    attackTextContinueButton.width = attackTextContinue.width;
    attackTextContinueButton.height = attackTextContinue.height;
    attackTextContinueButton.inputEnabled = true;
    attackTextContinueButton.events.onInputUp.add(this.attackContinueButtonClicked, this);
    this.addChild(attackTextContinueButton);

    this._attackGroup = game.make.group(this)
    this._attackGroup.addChild(attackTextDialog)
    this._attackGroup.addChild(attackTextContinue)
    this._attackGroup.addChild(attackTextContinueButton)
    this._attackGroup.visible = false

    // NonAttack Text
    var nonAttackTextDialog = new DialogMessageMonster(game, nonAttackText, 600);
    nonAttackTextDialog.alignIn(dialogRect, Phaser.TOP_CENTER, 0, 0)
    this.addChild(nonAttackTextDialog);

    // NonAttack Text Continue
    var nonAttackTextContinue = new DialogButtonThin(game, "Continue", 180);
    nonAttackTextContinue.alignTo(nonAttackTextDialog, Phaser.BOTTOM_CENTER, 0, 28)
    this.addChild(nonAttackTextContinue);

    var nonAttackTextContinueButton = game.make.sprite(nonAttackTextContinue.x, nonAttackTextContinue.y, 'pixelTransparent');
    nonAttackTextContinueButton.width = nonAttackTextContinue.width;
    nonAttackTextContinueButton.height = nonAttackTextContinue.height;
    nonAttackTextContinueButton.inputEnabled = true;
    nonAttackTextContinueButton.events.onInputUp.add(this.nonAttackContinueButtonClicked, this);
    this.addChild(nonAttackTextContinueButton);

    this._nonAttackGroup = game.make.group(this)
    this._nonAttackGroup.addChild(nonAttackTextDialog)
    this._nonAttackGroup.addChild(nonAttackTextContinue)
    this._nonAttackGroup.addChild(nonAttackTextContinueButton)
    this._nonAttackGroup.visible = false
}

MonsterAttackDialogGroup.prototype = Object.create(Phaser.Group.prototype);
MonsterAttackDialogGroup.prototype.constructor = MonsterAttackDialogGroup;

MonsterAttackDialogGroup.prototype.attackButtonClicked = function (button, pointer) {
    if (!this._attackResolved) {
        this._attackResolved = true
        var dialog = this
        var fadeOutTween = game.add.tween(this._mainGroup).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
        var fadeInTween = game.add.tween(this._attackGroup).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, false, 0, 0, false);
        fadeInTween.onStart.addOnce(function () { dialog._attackGroup.visible = true })
        fadeOutTween.chain(fadeInTween)
    }
}

MonsterAttackDialogGroup.prototype.nonAttackButtonClicked = function (button, pointer) {
    if (!this._attackResolved) {
        this._attackResolved = true
        var dialog = this
        var fadeOutTween = game.add.tween(this._mainGroup).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
        var fadeInTween = game.add.tween(this._nonAttackGroup).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, false, 0, 0, false);

        if (this._nonAttackExists)
        {
            fadeInTween.onStart.addOnce(function () { dialog._nonAttackGroup.visible = true })
            fadeOutTween.chain(fadeInTween)
        } else {
            fadeOutTween.onComplete.addOnce(function () { HudGroup.prototype.monsterAttack() })
        }
    }
}

MonsterAttackDialogGroup.prototype.attackContinueButtonClicked = function (button, pointer) {
    var fadeOutTween = game.add.tween(this._attackGroup).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    fadeOutTween.onComplete.addOnce(function () {
        HudGroup.prototype.monsterAttack()
    })
}

MonsterAttackDialogGroup.prototype.nonAttackContinueButtonClicked = function (button, pointer) {
    var fadeOutTween = game.add.tween(this._nonAttackGroup).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    fadeOutTween.onComplete.addOnce(function () {
        HudGroup.prototype.monsterAttack()
    })
}

//=========================================================
function MakeMonster(game, id) {
    var monsterData = game.gamedata.monsters.find(function (item) { return item.id == id });
    var textStyle = { font: "20px Times New Romans", fill: "#ffffff", align: "center" };

    // Set Instance
    var monsterInstance = new Monster()
    monsterInstance.id = monsterData.id
    monsterInstance.type = monsterData.type
    monsterInstance.name = monsterData.name
    monsterInstance.imageKey = monsterData.imageKey
    monsterInstance.hitPoints = parseInt(monsterData.baseHitPoints) + game.gamedata.investigators.length
    monsterInstance.damage = 0
    monsterInstance.color = ""

    // Set Tray Sprite
    var xOffset = game.gamedataInstances.monsters.length * 96
    monsterInstance.traySprite = game.make.sprite(0, 0, Helper.getImage(monsterInstance.imageKey))
    monsterInstance.traySprite.alignIn(game.hudInstance._monsterTrayBgImage, Phaser.BOTTOM_LEFT, xOffset, 0)
    monsterInstance.traySprite.inputEnabled = true
    monsterInstance.traySprite.events.onInputUp.add(Monster.prototype.monsterClicked, monsterInstance);

    // Set Tray Sprite Hit Points
    monsterInstance._hitPointsBox = new OutlineBox(game, 32, 32)
    monsterInstance.traySprite.addChild(monsterInstance._hitPointsBox)
    monsterInstance._hitPointsBox.x += 4
    monsterInstance._hitPointsBox.y += 60
    monsterInstance._monsterDamageText = game.make.text(0, 0, "0", textStyle);
    monsterInstance._monsterDamageText.alignIn(monsterInstance._hitPointsBox, Phaser.CENTER, 0, 3)
    monsterInstance.traySprite.addChild(monsterInstance._monsterDamageText)

    game.hudInstance._monsterTray.addChild(monsterInstance.traySprite)

    game.gamedataInstances.monsters.push(monsterInstance);
}

function Monster() {
    ///
}

Monster.prototype.monsterClicked = function () {
    if (game.hud.activePhase == "player") {
        HudGroup.prototype.showEnemyPhaseBG()
        if (game.hud.monsterDetailOpen && game.hud.currentMonsterInstance == this) {
            HudGroup.prototype.hideMonsterDetail()
        } else {
            HudGroup.prototype.showMonsterDetail()
        }
        game.hudInstance.setMonsterDetail(this)
    } else if (game.hud.activeStep == "horrorCheck") {
        MakeHorrorCheckConfirmDialog(game, this)
    }
}

Monster.prototype.updateDamage = function() {
    this._monsterDamageText.setText(this.damage)
    this._monsterDamageText.alignIn(this._hitPointsBox, Phaser.CENTER, 0, 3)
    this._monsterDamageText.x = Math.floor(this._monsterDamageText.x)
    this._monsterDamageText.y = Math.floor(this._monsterDamageText.y)
}

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
    game.hud.activePhase = "player"
    game.hud.activeStep = ""
    game.hudInstance.updatePhaseButtonImage()
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

//=========================================================
function HudGroup(game) {
    Phaser.Group.call(this, game);

    // Enemy Phase Background
    this._enemyPhaseBGImage = game.make.tileSprite(0, 0, game.stageViewRect.width, game.stageViewRect.height, 'pixelWhite');
    this._enemyPhaseBGImage.tint = "0x000000";
    this._enemyPhaseBGImage.alpha = 0.9
    this._enemyPhaseBGImage.inputEnabled = true;
    this.addChild(this._enemyPhaseBGImage);
    this._enemyPhaseBGImage.kill()

    // End Phase (Green)
    this._endPhasePlayerImage = game.make.image(0, 0, Helper.getImage("endPhase-image-player"))
    this._endPhasePlayerImage.alignIn(game.stageViewRect, Phaser.BOTTOM_RIGHT, 0, 0)
    this.addChild(this._endPhasePlayerImage);

    // End Phase (Red)
    this._endPhaseEnemyImage = game.make.image(0, 0, Helper.getImage("endPhase-image-enemy"))
    this._endPhaseEnemyImage.alignIn(game.stageViewRect, Phaser.BOTTOM_RIGHT, 0, 0)
    this.addChild(this._endPhaseEnemyImage);
    this._endPhaseEnemyImage.kill()

    // End Phase Button
    var endPhaseButton = game.make.sprite(this._endPhasePlayerImage.x, this._endPhasePlayerImage.y, 'pixelTransparent');
    endPhaseButton.width = this._endPhasePlayerImage.width;
    endPhaseButton.height = this._endPhasePlayerImage.height;
    endPhaseButton.inputEnabled = true;
    endPhaseButton.events.onInputUp.add(this.endPhaseClicked, this);
    this.addChild(endPhaseButton);

    // Monster Tray
    this._monsterTrayBgImage = game.make.tileSprite(0, 0, 96 * 7, 96, "hudButton")
    this._monsterTrayBgImage.alignIn(game.stageViewRect, Phaser.BOTTOM_LEFT, -96 * 4.5, 0)
    this._monsterTrayBgImage.tint = "0x044500"
    this._monsterTray = game.make.group()
    this._monsterTray.addChild(this._monsterTrayBgImage);
    this.addChild(this._monsterTray)
    this._monsterTray.y += 96

    // Monster Detail
    this._monsterDetail = this.makeMonsterDetailGroup(game)
    this.addChild(this._monsterDetail)
    this._monsterDetail.x -= 96 * 4

    // Monster (Green)
    this._monsterPlayerImage = game.make.image(0, 0, Helper.getImage("monster-image-player"))
    this._monsterPlayerImage.alignIn(game.stageViewRect, Phaser.BOTTOM_LEFT, -96, 0)
    this.addChild(this._monsterPlayerImage);

    // Monster (Red)
    this._monsterEnemyImage = game.make.image(0, 0, Helper.getImage("monster-image-enemy"))
    this._monsterEnemyImage.alignIn(game.stageViewRect, Phaser.BOTTOM_LEFT, -96, 0)
    this.addChild(this._monsterEnemyImage);
    this._monsterEnemyImage.kill()

    // End Phase Button
    var monsterButton = game.make.sprite(this._monsterPlayerImage.x, this._monsterPlayerImage.y, 'pixelTransparent');
    monsterButton.width = this._monsterPlayerImage.width;
    monsterButton.height = this._monsterPlayerImage.height;
    monsterButton.inputEnabled = true;
    monsterButton.events.onInputUp.add(this.showMonsterTrayClicked, this);
    this.addChild(monsterButton);
}

HudGroup.prototype = Object.create(Phaser.Group.prototype);
HudGroup.prototype.constructor = HudGroup;

HudGroup.prototype.setMonsterDetail = function (monsterInstance) {
    game.hud.currentMonsterInstance = monsterInstance

    this._monsterHitPointsText.setText(game.hud.currentMonsterInstance.hitPoints)
    this._monsterHitPointsText.alignIn(this._hitPointsBox, Phaser.CENTER, 0, 3)

    this._monsterDamageText.setText(game.hud.currentMonsterInstance.damage)
    this._monsterDamageText.alignIn(this._damageBox, Phaser.CENTER, 0, 3)

    this._nameText.setText(game.hud.currentMonsterInstance.name)
    this._nameText.alignIn(this._nameBox, Phaser.CENTER, 0, 3)
    this._nameText.x = Math.floor(this._nameText.x)
    this._nameText.y = Math.floor(this._nameText.y)
}

HudGroup.prototype.makeMonsterDetailGroup = function (game) {
    var textStyle = { font: "24px Times New Romans", fill: "#ffffff", align: "center" };

    var monsterDetailGroup = game.make.group()
    var monsterDetailBgImage = game.make.tileSprite(0, 0, 96 * 3, 96 * 4, "hudButton")
    monsterDetailBgImage.alignIn(game.stageViewRect, Phaser.TOP_LEFT, 0, 0)
    monsterDetailBgImage.tint = "0x044500"
    monsterDetailGroup.addChild(monsterDetailBgImage);

    // Hit Points
    this._hitPointsBox = new OutlineBox(game, 50, 50)
    this._hitPointsBox.alignIn(monsterDetailBgImage, Phaser.TOP_LEFT, -10, -10)
    monsterDetailGroup.addChild(this._hitPointsBox);

    this._monsterHitPointsText = game.make.text(0, 0, "0", textStyle);
    this._monsterHitPointsText.alignIn(this._hitPointsBox, Phaser.CENTER, 0, 3)
    monsterDetailGroup.addChild(this._monsterHitPointsText);

    // Name
    this._nameBox = new OutlineBox(game, 200, 32)
    this._nameBox.alignIn(monsterDetailBgImage, Phaser.CENTER, 0, 0)
    monsterDetailGroup.addChild(this._nameBox);

    this._nameText = game.make.text(0, 0, "Name", textStyle);
    this._nameText.alignIn(this._nameBox, Phaser.CENTER, 0, 3)
    monsterDetailGroup.addChild(this._nameText);

    // Damage
    this._damageBox = new OutlineBox(game, 50, 50)
    this._damageBox.alignTo(this._nameBox, Phaser.BOTTOM_CENTER, 0, 10)
    monsterDetailGroup.addChild(this._damageBox);

    this._monsterDamageText = game.make.text(0, 0, "0", textStyle);
    this._monsterDamageText.alignIn(this._damageBox, Phaser.CENTER, 0, 3)
    monsterDetailGroup.addChild(this._monsterDamageText);

    // Subtract number
    var subtractNumber = new OutlineBox(game, 50, 50)
    subtractNumber.alignTo(this._nameBox, Phaser.BOTTOM_CENTER, -64, 10)
    monsterDetailGroup.addChild(subtractNumber);

    var subtractText = game.make.text(0, 0, "-", textStyle);
    subtractText.alignIn(subtractNumber, Phaser.CENTER, 0, 3)
    monsterDetailGroup.addChild(subtractText);

    var subtractNumberButton = game.make.sprite(subtractNumber.x, subtractNumber.y, 'pixelTransparent');
    subtractNumberButton.width = subtractNumber.width;
    subtractNumberButton.height = subtractNumber.height;
    subtractNumberButton.inputEnabled = true;
    subtractNumberButton.events.onInputUp.add(this.monsterSubtractClicked, this);
    monsterDetailGroup.addChild(subtractNumberButton);

    // Add number
    var addNumber = new OutlineBox(game, 50, 50)
    addNumber.alignTo(this._nameBox, Phaser.BOTTOM_CENTER, 64, 10)
    monsterDetailGroup.addChild(addNumber);

    var addText = game.make.text(0, 0, "+", textStyle);
    addText.alignIn(addNumber, Phaser.CENTER, 0, 3)
    monsterDetailGroup.addChild(addText);

    var addNumberButton = game.make.sprite(addNumber.x, addNumber.y, 'pixelTransparent');
    addNumberButton.width = addNumber.width;
    addNumberButton.height = addNumber.height;
    addNumberButton.inputEnabled = true;
    addNumberButton.events.onInputUp.add(this.monsterAddClicked, this);
    monsterDetailGroup.addChild(addNumberButton);

    // Attack
    var dialogAttack = new DialogButtonThin(game, "Attack", 200);
    dialogAttack.alignTo(this._nameBox, Phaser.BOTTOM_CENTER, 0, 82)
    monsterDetailGroup.addChild(dialogAttack);

    var attackButton = game.make.sprite(dialogAttack.x, dialogAttack.y, 'pixelTransparent');
    attackButton.width = dialogAttack.width;
    attackButton.height = dialogAttack.height;
    attackButton.inputEnabled = true;
    //attackButton.events.onInputUp.add(this.skillConfirmClicked, this);
    monsterDetailGroup.addChild(attackButton);

    // Evade
    var dialogEvade = new DialogButtonThin(game, "Evade", 200);
    dialogEvade.alignTo(this._nameBox, Phaser.BOTTOM_CENTER, 0, 130)
    monsterDetailGroup.addChild(dialogEvade);

    var evadeButton = game.make.sprite(dialogEvade.x, dialogEvade.y, 'pixelTransparent');
    evadeButton.width = dialogEvade.width;
    evadeButton.height = dialogEvade.height;
    evadeButton.inputEnabled = true;
    //evadeButton.events.onInputUp.add(this.skillConfirmClicked, this);
    monsterDetailGroup.addChild(evadeButton);

    return monsterDetailGroup
}

HudGroup.prototype.monsterSubtractClicked = function (button, pointer) {
    if (game.hud.currentMonsterInstance.damage > 0) {
        game.hud.currentMonsterInstance.damage--
        game.hud.currentMonsterInstance.updateDamage()
        this._monsterDamageText.setText(game.hud.currentMonsterInstance.damage)
        this._monsterDamageText.alignIn(this._damageBox, Phaser.CENTER, 0, 3)
    }
}

HudGroup.prototype.monsterAddClicked = function (button, pointer) {
    game.hud.currentMonsterInstance.damage++
    game.hud.currentMonsterInstance.updateDamage()
    this._monsterDamageText.setText(game.hud.currentMonsterInstance.damage)
    this._monsterDamageText.alignIn(this._damageBox, Phaser.CENTER, 0, 3)
    this._monsterDamageText.x = Math.floor(this._monsterDamageText.x)
}

HudGroup.prototype.showMonsterTrayClicked = function (button, pointer) {
    if (game.hud.activePhase == "player" || game.hud.activeStep == "horrorCheck") {
        if (game.hud.monsterTrayOpen) {
            HudGroup.prototype.hideEnemyPhaseBG()
            HudGroup.prototype.hideMonsterTray()
            HudGroup.prototype.hideMonsterDetail()
        } else {
            HudGroup.prototype.showEnemyPhaseBG()
            HudGroup.prototype.showMonsterTray()
        }
    } 
}

HudGroup.prototype.endPhaseClicked = function (button, pointer) {
    var dialogInstance
    if (game.hud.activePhase == "player") {
        dialogInstance = MakeDialog(game, "dialog-hud-endphase-player")
        HudGroup.prototype.hideEnemyPhaseBG()
        HudGroup.prototype.hideMonsterTray()
        HudGroup.prototype.hideMonsterDetail()
    } else {
        dialogInstance = MakeDialog(game, "dialog-hud-endphase-enemy")
        HudGroup.prototype.hideEnemyPhaseBG()
        HudGroup.prototype.hideMonsterTray()
        HudGroup.prototype.hideMonsterDetail()
    }

    // TODO add fadeIn()
    game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    // Because I'm adding this immediately, the modal prevents the double-click?
    game.stage.addChild(dialogInstance)
}

HudGroup.prototype.updatePhaseButtonImage = function () {
    if (game.hud.activePhase == "player") {
        this._endPhasePlayerImage.revive()
        this._endPhaseEnemyImage.kill()
        this._monsterPlayerImage.revive()
        this._monsterEnemyImage.kill()
    } else {
        this._endPhasePlayerImage.kill()
        this._endPhaseEnemyImage.revive()
        this._monsterPlayerImage.kill()
        this._monsterEnemyImage.revive()
    }
}

HudGroup.prototype.fireEvent = function () {
    if (game.hud.fireSet) {
        var dialogData = game.gamedata.dialogs.find(function (item) { return item.id == "dialog-hud-fire-event" });

        // Dialog Info
        var imageKey = null;
        var buttonType = "fire-event";
        var buttonData = [
          { "id": "extinguished", "actions": [{ "type": "fireExtinguished" }] },
          { "id": "spreads", "actions": [{ "type": "fireSpreads" }] }
        ]

        var dialogInstance = new DialogGroup(
            game,
            dialogData.id,
            dialogData.text,
            imageKey,
            buttonType,
            buttonData);

        // TODO add fadeIn()
        game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
        game.stage.addChild(dialogInstance)

    } else {
        // do random event
        game.hudInstance.randomEvent()
    }
}

HudGroup.prototype.fireExtinguished = function () {
    game.hud.fireSet = false
    // do random event
    game.hudInstance.randomEvent()
}

HudGroup.prototype.fireSpreads = function () {
    game.hud.fireSet = true
    // do random event
    game.hudInstance.randomEvent()
}

HudGroup.prototype.randomEvent = function () {
    var randomEventData = null

    var visibleMapTileIds = []
    for (var i = 0; i < game.gamedataInstances.mapTiles.length; i++) {
        visibleMapTileIds.push(game.gamedataInstances.mapTiles[i].id)
    }
    
    while (randomEventData == null) {
        if (game.hud.randomEventDeck.length == 0) {
            game.hud.randomEventDeck = game.gamedata.randomEvents.slice(0)
            game.hud.randomEventDeck = Helper.shuffle(game.hud.randomEventDeck)
        }

        var drawRandomEvent = game.hud.randomEventDeck.pop()
        if (drawRandomEvent.hasOwnProperty("target") && drawRandomEvent.target == "mapTile" && drawRandomEvent.hasOwnProperty("mapTile")) {
            if (visibleMapTileIds.indexOf(drawRandomEvent.mapTile) >= 0) {
                randomEventData = drawRandomEvent
            }
        } else {
            randomEventData = drawRandomEvent
        }
    }

    var dialogInstance = new MakeRandomEvent(game, randomEventData.id)

    // TODO add fadeIn()
    game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    game.stage.addChild(dialogInstance)
}

HudGroup.prototype.randomEventDone = function () {
    HudGroup.prototype.scenarioEvent()
}

HudGroup.prototype.scenarioEvent = function () {
    var triggeredScenarioEvent = false
    for (var i = 0; i < game.gamedata.scenarioEvents.length; i++) {
        var scenarioEvent = game.gamedata.scenarioEvents[i]
        if (!scenarioEvent.hasOwnProperty("resolved")) {
            var conditionResult = true
            for (var j = 0; j < scenarioEvent.conditions.length && conditionResult; j++) {
                var condition = scenarioEvent.conditions[j]
                conditionResult = false
                if (condition.type == "globalVar") {
                    var globalVar = game.gamedata.globalVars.find(function (item) { return item.id == condition.globalId })
                    if (condition.operator == "equals") {
                        conditionResult = condition.value == globalVar.value
                    }
                }
            }

            if (conditionResult) {
                scenarioEvent.resolved = true
                triggeredScenarioEvent = true
                if (scenarioEvent.action.type == "dialog") {
                    var dialogInstance = MakeDialog(game, scenarioEvent.action.dialogId)
                    // TODO add fadeIn()
                    game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
                    game.stage.addChild(dialogInstance)
                } else if (scenarioEvent.action.type == "revealList") {
                    //Reveal map tiles
                    if (scenarioEvent.action.revealListId != null) {
                        MakeRevealList(game, scenarioEvent.action.revealListId);
                    }
                }
                
                break;
            }
        }
    }

    if (!triggeredScenarioEvent) {
        // If no scenario events were triggered, move on
        HudGroup.prototype.scenarioEventDone()
    }
}

HudGroup.prototype.scenarioEventDone = function () {
    HudGroup.prototype.monsterAttack()
}

HudGroup.prototype.monsterAttack = function () {
    if (game.gamedataInstances.monsters.length > 0 && game.hud.currentMonsterIndex < game.gamedataInstances.monsters.length - 1) {
        game.hud.currentMonsterIndex += 1
        game.hud.activeStep = "monsterAttack"

        // Monsters Attack
        var monsterInstance = game.gamedataInstances.monsters[game.hud.currentMonsterIndex]
        game.hudInstance.setMonsterDetail(monsterInstance)

        HudGroup.prototype.showEnemyPhaseBG()
        HudGroup.prototype.showMonsterTray()
        HudGroup.prototype.showMonsterDetail()

        // TODO: Get random attack for monsterInstance (reshuffle if empty?)
        var randomMonsterAttackData = null

        while (randomMonsterAttackData == null) {
            if (game.hud.randomMonsterAttackDeck.length == 0) {
                game.hud.randomMonsterAttackDeck = Helper.shuffle(game.gamedata.monsterAttacks.slice(0))
            }

            var drawRandomMonsterAttack = game.hud.randomMonsterAttackDeck.pop()

            if (drawRandomMonsterAttack.monster == monsterInstance.id) {
                randomMonsterAttackData = drawRandomMonsterAttack
            }
        }

        // Display monster attack dialog
        MakeMonsterAttackDialog(game, randomMonsterAttackData.id)
    } else {
        HudGroup.prototype.hideMonsterDetail()
        HudGroup.prototype.horrorCheck()
    }
}

HudGroup.prototype.monsterHorrorCheck = function (monsterInstance) {
    var randomMonsterHorrorCheckData = null
 
    while (randomMonsterHorrorCheckData == null) {
        if (game.hud.randomMonsterHorrorCheckDeck.length == 0) {
            game.hud.randomMonsterHorrorCheckDeck = Helper.shuffle(game.gamedata.horrorChecks.slice(0))
        }

        var drawRandomMonsterHorrorCheck = game.hud.randomMonsterHorrorCheckDeck.pop()

        if (drawRandomMonsterHorrorCheck.monster == monsterInstance.id) {
            randomMonsterHorrorCheckData = drawRandomMonsterHorrorCheck
        }
    }

    MakeMonsterHorrorCheckDialogGroup(game, randomMonsterHorrorCheckData.id)
}

HudGroup.prototype.horrorCheck = function () {
    if (game.gamedataInstances.monsters.length > 0) {
        game.hud.activeStep = "horrorCheck"
        HudGroup.prototype.hideMonsterDetail()
        HudGroup.prototype.hideMonsterTray()
        HudGroup.prototype.hideEnemyPhaseBG(function () {
            HudGroup.prototype.showEnemyPhaseBG()
            HudGroup.prototype.showMonsterTray()
            // Horror Check Dialog
            MakeHorrorCheckDialog(game)
        })
    } else {
        HudGroup.prototype.enemyPhaseDone()
    }
}

HudGroup.prototype.enemyPhaseDone = function () {
    game.hud.activeStep = ""

    HudGroup.prototype.hideMonsterTray()
    HudGroup.prototype.hideMonsterDetail()
    HudGroup.prototype.hideEnemyPhaseBG(function () {
        MakeScene(game, "scene-player")
    })
}

HudGroup.prototype.showEnemyPhaseBG = function () {
    if (!game.hud.showEnemyPhaseBG) {
        game.hud.showEnemyPhaseBG = true
        game.hudInstance._enemyPhaseBGImage.alpha = 0.9
        game.hudInstance._enemyPhaseBGImage.revive()
        var fadeTween = game.add.tween(game.hudInstance._enemyPhaseBGImage).from({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}

HudGroup.prototype.hideEnemyPhaseBG = function (callback) {
    if (game.hud.showEnemyPhaseBG) {
        game.hud.showEnemyPhaseBG = false
        var fadeTween = game.add.tween(game.hudInstance._enemyPhaseBGImage).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
        fadeTween.onComplete.addOnce(function () {
            game.hudInstance._enemyPhaseBGImage.alpha = 0
            game.hudInstance._enemyPhaseBGImage.kill()
            if (callback != null) {
                callback()
            }
        })
    }
}

HudGroup.prototype.showMonsterTray = function () {
    if (!game.hud.monsterTrayOpen) {
        game.hud.monsterTrayOpen = true
        var slideTween = game.add.tween(game.hudInstance._monsterTray).to({ y: game.hudInstance._monsterTray.y - 96 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}

HudGroup.prototype.hideMonsterTray = function () {
    if (game.hud.monsterTrayOpen) {
        game.hud.monsterTrayOpen = false
        var slideTween = game.add.tween(game.hudInstance._monsterTray).to({ y: game.hudInstance._monsterTray.y + 96 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}

HudGroup.prototype.showMonsterDetail = function () {
    if (!game.hud.monsterDetailOpen) {
        game.hud.monsterDetailOpen = true
        var slideTween = game.add.tween(game.hudInstance._monsterDetail).to({ x: game.hudInstance._monsterDetail.x + 96 * 4 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}

HudGroup.prototype.hideMonsterDetail = function () {
    if (game.hud.monsterDetailOpen) {
        game.hud.monsterDetailOpen = false
        var slideTween = game.add.tween(game.hudInstance._monsterDetail).to({ x: game.hudInstance._monsterDetail.x - 96 * 4 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}

//=========================================================
function MakeRandomEvent(game, id) {
    var randomEventData = game.gamedata.randomEvents.find(function (element) { return element.id == id });

    var imageKey = null;
    var buttonType = null;
    var buttonData = null;
    var eventText = randomEventData.text

    if (randomEventData.hasOwnProperty("buttonType") && randomEventData.buttonType == "random-event-conditional") {
        buttonType = randomEventData.buttonType
        buttonData = [
          {
              "id": "no-effect",
              "actions": [{ "type": "randomEventDone" }]
          },
          {
              "id": "resolve-effect",
              "actions": [{ "type": "randomEventResolve" }]
          }
        ]
    } else if (randomEventData.hasOwnProperty("buttonType") && randomEventData.buttonType == "random-event-attribute") {
        buttonType = "continue";
        buttonData = [{ "actions": [{ "type": "randomEventResolve" }] }]
    } else {
        buttonType = "continue";
        buttonData = [{ "actions": [{ "type": "randomEventDone" }] }]
    }

    if (randomEventData.hasOwnProperty("target") && randomEventData.target == "investigator") {
        // Get random investigator
        var mathRandom = Math.random();
        var randomIndex = Math.floor(mathRandom * game.gamedata.investigators.length);
        var randomInvestigatorData = game.gamedata.investigators[randomIndex]

        // Replace investigator name
        eventText = eventText.replace(/<name>/g, randomInvestigatorData.name)

        // Replace investigator pronoun
        var reInvestigatorPronoun = new RegExp("<" + randomInvestigatorData.pronoun + ":(.+?)>", "g")
        eventText = eventText.replace(reInvestigatorPronoun, "$1")

        // Remove remaining pronoun
        eventText = eventText.replace(/<.+?:.+?>/g, "")
    }

    var dialogInstance = new DialogGroup(
        game,
        randomEventData.id,
        eventText,
        imageKey,
        buttonType,
        buttonData);

    return dialogInstance;
}

//=========================================================
function MakeRandomEventResolve(game, id) {
    var randomEventData = game.gamedata.randomEvents.find(function (element) { return element.id == id });

    var imageKey = null;
    var buttonType = null;
    var buttonData = null;
    var eventText = randomEventData.resolveText

    buttonType = "continue";
    buttonData = [{ "actions": [{ "type": "randomEventDone" }] }]

    var dialogInstance = new DialogGroup(
        game,
        randomEventData.id,
        eventText,
        imageKey,
        buttonType,
        buttonData);

    return dialogInstance;
}

//=========================================================
function MakeRevealList(game, id) {
    var revealData = game.gamedata.revealLists.find(function (item) { return item.id == id });
    game.revealList.dialogs = revealData.revealDialogs; 

    if (game.revealList.dialogs.length > 0) {
        var revealDialog = game.revealList.dialogs.shift();
        MakeRevealDialog(game, revealDialog);
    }
}

//=========================================================
function MakeRevealDialog(game, id) {
    var revealDialog = game.gamedata.revealDialogs.find(function (item) { return item.id == id });
    var movePlayer = new Phaser.Point()
    var imageKey = null;
    var buttonType = "reveal";
    var buttonData = [{ "text": "Continue", "actions": [{ "type": "reveal" }] }];

    if (Array.isArray(revealDialog.actions)) {
        buttonData[0].actions = revealDialog.actions.concat(buttonData[0].actions)
    }

    if (revealDialog.mapTiles != null) {
        var calculateCenter = new Phaser.Point(0, 0)
        // Add Map Tiles
        for (var i = 0; i < revealDialog.mapTiles.length; i++) {
            var mapTileId = revealDialog.mapTiles[i];
            var mapTileInstance = MakeMapTile(game, mapTileId);

            calculateCenter.x += mapTileInstance.centerX
            calculateCenter.y += mapTileInstance.centerY

            if (!mapTileInstance.isRevealed) {
                var fadeInTween = game.add.tween(mapTileInstance).from({ alpha: 0 }, 600, Phaser.Easing.Linear.None, true, 0, 0, false);
                mapTileInstance.isRevealed = true
            }

            // Begin Remove Door tokens
            var mapTileData = game.gamedata.mapTiles.find(function (item) { return item.id == mapTileId });
            // Look at each entryTokenId of the room
            for (var j = 0; j < mapTileData.entryTokenIds.length; j++) {
                var removeToken = true;
                var tokenId = mapTileData.entryTokenIds[j];

                // Find this entryTokenId in all rooms
                for (var k = 0; k < game.gamedata.mapTiles.length; k++) {
                    var mapTileDataCheck = game.gamedata.mapTiles[k];
                    // Look for tokenId in mapTileData.entryTokenIds
                    if (mapTileDataCheck.entryTokenIds.indexOf(tokenId) >= 0) {
                        // Check if mapTileData.id in game.gamedataInstances.mapTiles
                        if (!game.gamedataInstances.mapTiles.some(function (item) { return item.id == mapTileDataCheck.id })) {
                            // If it is not in, then it is not revealed
                            removeToken = false
                        }
                    }
                }

                if (removeToken) {
                    var instance = game.gamedataInstances.mapTokens.find(function (item) { return item.id == tokenId })
                    if (instance != null) {
                        instance.fadeOut(function () {
                            instance = null;
                            game.world.removeChild(instance);
                            //instance.destroy();
                        })
                    }
                }
            }
            // End Remove Door tokens
        }

        calculateCenter.x = Math.floor(calculateCenter.x / revealDialog.mapTiles.length)
        calculateCenter.y = Math.floor(calculateCenter.y / revealDialog.mapTiles.length)

        movePlayer.x = calculateCenter.x
        movePlayer.y = calculateCenter.y + game.presentationOffsetY

    } else if (revealDialog.addSingleToken != null) {
        // Show image at the top of the Dialog
        var tokenInstance = MakeToken(game, revealDialog.addSingleToken);
        // TODO add fadeIn()
        game.add.tween(tokenInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);

        if (tokenInstance.addToWorld) {
            game.world.addChild(tokenInstance)
        }

        imageKey = tokenInstance.imageKey;
        movePlayer.x = tokenInstance.x + 48
        movePlayer.y = tokenInstance.y + 208 + game.presentationOffsetY

    } else if (revealDialog.showSingleToken != null) {
        // Show image at the top of the Dialog
        var tokenInstance = game.gamedataInstances.mapTokens.find(function (item) { return item.id == revealDialog.showSingleToken })

        imageKey = tokenInstance.imageKey;
        movePlayer.x = tokenInstance.x + 48
        movePlayer.y = tokenInstance.y + 208 + game.presentationOffsetY

    } else {
        movePlayer.x = player.body.x
        movePlayer.y = player.body.y 
    }

    var moveTween = game.add.tween(player.body).to({ x: movePlayer.x, y: movePlayer.y }, 1200, Phaser.Easing.Quadratic.Out, true, 0, 0, false);

    moveTween.onStart.addOnce(function () {
        game.cutSceneCamera = true;
    })

    moveTween.onComplete.addOnce(function () {
        var dialogInstance = new DialogGroup(
            game,
            revealDialog.id,
            revealDialog.text,
            imageKey,
            buttonType,
            buttonData);
        // TODO add fadeIn()
        game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
        game.stage.addChild(dialogInstance);

        if (revealDialog.addMultipleTokens != null) {
            // Show images with the Dialog in the middle of the room
            for (var i = 0; i < revealDialog.addMultipleTokens.length; i++) {
                var tokenId = revealDialog.addMultipleTokens[i];
                var tokenInstance = MakeToken(game, tokenId);

                // TODO add fadeIn()
                game.add.tween(tokenInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
                if (tokenInstance.addToWorld) {
                    game.world.addChild(tokenInstance)
                }
            }
        }
    })
}

//=========================================================
function MakeMapTile(game, id) {
    var mapTileData = game.gamedata.mapTiles.find(function (item) { return item.id == id });
    var mapTileInstance = null

    if (game.gamedataInstances.mapTiles.some(function (item) { return item.id == id })) {
        // This handles the case where a room needs revealed that is inside a tile
        // that is already revealed. The camera still needs to center on the existing tile.
        mapTileInstance = game.gamedataInstances.mapTiles.find(function (item) { return item.id == id })
    } else {
        mapTileInstance = new MapTileGroup(
            game,
            mapTileData.id,
            mapTileData.x,
            mapTileData.y,
            mapTileData.imageKey,
            mapTileData.angle);

        game.gamedataInstances.mapTiles.push(mapTileInstance);
    }

    return mapTileInstance;
}

//=========================================================
function MapTileGroup(game, id, x, y, imageKey, angle) {
    Phaser.Group.call(this, game);

    this.id = id
    this.isRevealed = false
    var mapTileSprite = game.make.sprite(x, y, Helper.getImage(imageKey))

    if (angle == 90) {
        mapTileSprite.anchor.setTo(0, 1)
    } else if (angle == 180) {
        mapTileSprite.anchor.setTo(1, 1)
    } else if (angle == 270) {
        mapTileSprite.anchor.setTo(1, 0)
    }

    mapTileSprite.angle = angle;

    this.addChild(mapTileSprite);
}

MapTileGroup.prototype = Object.create(Phaser.Group.prototype);
MapTileGroup.prototype.constructor = MapTileGroup;

//=========================================================
function MakeToken(game, id) {
    var tokenData = game.gamedata.mapTokens.find(function (item) { return item.id == id });
    
    var tokenInstance = new TokenSprite(
        game,
        tokenData.id,
        tokenData.x,
        tokenData.y,
        tokenData.imageKey,
        tokenData.clickId,
        tokenData.clickConditions,
        tokenData.addToWorld);

    game.gamedataInstances.mapTokens.push(tokenInstance);

    return tokenInstance;
}

//=========================================================
function MakeDialog(game, id) {
    var dialogData = game.gamedata.dialogs.find(function (item) { return item.id == id });

    var dialogInstance = new DialogGroup(
        game,
        dialogData.id,
        dialogData.text,
        dialogData.imageKey,
        dialogData.buttonType,
        dialogData.buttons,
        dialogData.skillTarget);

    return dialogInstance;
}

//=========================================================
function TokenSprite(game, id, x, y, imageKey, clickId, clickConditions, addToWorld) {
    Phaser.Sprite.call(this, game, x, y, Helper.getImage(imageKey));

    this.id = id
    this.imageKey = imageKey;
    this.clickId = clickId;
    this.clickConditions = clickConditions;
    this.addToWorld = addToWorld;

    if (this.clickId != null || this.clickConditions != null) {
        this.inputEnabled = true;
        this.events.onInputUp.add(this.tokenClicked, this);
    }
}

TokenSprite.prototype = Object.create(Phaser.Sprite.prototype);
TokenSprite.prototype.constructor = TokenSprite;

TokenSprite.prototype.tokenClicked = function (token, pointer) {
    if (game.cutSceneCamera) return;

    // this == token?
    var movePlayer = new Phaser.Point()
    movePlayer.x = token.centerX + 300 - 20 - 48 //half message width - left margin - half image width
    movePlayer.y = token.centerY + game.presentationOffsetY

    // Check if the positions are equal first (perhaps the last click did the tween)
    if (movePlayer.equals(new Phaser.Point(Math.floor(player.body.x), Math.floor(player.body.y)))) {
        TokenSprite.prototype.openDialog.call(token);
    } else {
        var moveTween = game.add.tween(player.body).to({ x: movePlayer.x, y: movePlayer.y }, 1200, Phaser.Easing.Quadratic.Out, true, 0, 0, false);

        moveTween.onStart.addOnce(function () {
            game.cutSceneCamera = true;
        })

        moveTween.onComplete.addOnce(function () {
            TokenSprite.prototype.openDialog.call(token);
        })
    }
}

TokenSprite.prototype.openDialog = function() {
    var clickId = null
    if(this.clickConditions != null && Array.isArray((this.clickConditions))) {
        for(var i = 0; i < this.clickConditions.length; i++){
            var condition = this.clickConditions[i]
            var globalVar = game.gamedata.globalVars.find(function (item){return item.id == condition.globalId})
            if(globalVar.value == condition.value) {
                clickId = condition.dialogId
            }
        }
    } else if (this.clickId != null) {
        clickId = this.clickId
    }
    
    var dialogInstance = MakeDialog(game, clickId)
    // TODO add fadeIn()
    game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    game.stage.addChild(dialogInstance)
}

TokenSprite.prototype.fadeOut = function (callback) {
    var fadeOutTween = game.add.tween(this).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);

    fadeOutTween.onComplete.addOnce(function () {
        this.destroy(true);
    }, this);

    if (callback != null) {
        fadeOutTween.onComplete.addOnce(callback, this);
    }
}

//=========================================================
function DialogGroup(game, id, messageText, imageKey, buttonType, buttonData, skillTarget) {
    Phaser.Group.call(this, game);

    this._id = id
    this._buttonData = buttonData;
    this._skillTarget = skillTarget;

    // Modal
    var modalBackground = game.make.sprite(game.stageViewRect.x, game.stageViewRect.y, 'pixelTransparent');
    modalBackground.width = game.stageViewRect.width;
    modalBackground.height = game.stageViewRect.height;
    modalBackground.inputEnabled = true;
    this.addChild(modalBackground);

    var messageImageKey = null;
    var revealImageKey = null;

    if (buttonType == "reveal") {
        revealImageKey = imageKey;
    } else {
        messageImageKey = imageKey;
    }

    if (buttonType == "reveal" && revealImageKey != null) {
        // Reveal Image
        var revealPointer = game.make.image(0, 0, Helper.getImage(imageKey))
        revealPointer.alignIn(game.stageViewRect, Phaser.CENTER, 0, -208 + 48 - game.presentationOffsetY)
        this.addChild(revealPointer);

        // Reveal Pointer
        var revealPointer = game.make.image(0, 0, 'revealPointer')
        revealPointer.alignIn(game.stageViewRect, Phaser.CENTER, 0, -48 - 48 + 4 - game.presentationOffsetY)
        this.addChild(revealPointer);
    }

    // Message
    var dialogMessage = new DialogMessage(game, messageText, messageImageKey);
    if (buttonType == "reveal" && imageKey != null) {
        dialogMessage.alignTo(revealPointer, Phaser.BOTTOM_CENTER, 0, 3)
    } else {
        dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    }
    this.addChild(dialogMessage);

    // Buttons
    if (buttonType == "cancel-action") {
        // Buttons for [Cancel] [Action]
        var data = this._buttonData[0]
        var dialogCancel = new DialogButtonThin(game, "Cancel", 280);
        dialogCancel.alignTo(dialogMessage, Phaser.BOTTOM_LEFT, -10, 10)
        this.addChild(dialogCancel);

        var dialogAction = new DialogButtonThin(game, data.text, 280);
        dialogAction.alignTo(dialogMessage, Phaser.BOTTOM_RIGHT, -10, 10)
        this.addChild(dialogAction);

        var dialogCancelButton = game.make.sprite(dialogCancel.x, dialogCancel.y, 'pixelTransparent');
        dialogCancelButton.width = dialogCancel.width;
        dialogCancelButton.height = dialogCancel.height;
        dialogCancelButton.inputEnabled = true;
        dialogCancelButton.events.onInputUp.add(this.cancelClicked, this);
        this.addChild(dialogCancelButton);

        var dialogActionButton = game.make.sprite(dialogAction.x, dialogAction.y, 'pixelTransparent');
        dialogActionButton.width = dialogAction.width;
        dialogActionButton.height = dialogAction.height;
        dialogActionButton.inputEnabled = true;
        dialogActionButton.events.onInputUp.add(this.buttonClicked, this);
        dialogActionButton.data = data; //dynamic property
        this.addChild(dialogActionButton);

    } else if (buttonType == "continue" || buttonType == "reveal") {
        // Button for [Continue]
        var data = this._buttonData[0]
        var dialogContinue = new DialogButtonThin(game, "Continue", 180);
        dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
        this.addChild(dialogContinue);

        var dialogContinueButton = game.make.sprite(dialogContinue.x, dialogContinue.y, 'pixelTransparent');
        dialogContinueButton.width = dialogContinue.width;
        dialogContinueButton.height = dialogContinue.height;
        dialogContinueButton.inputEnabled = true;
        dialogContinueButton.events.onInputUp.add(this.buttonClicked, this);
        dialogContinueButton.data = data; //dynamic property
        this.addChild(dialogContinueButton);

    } else if (buttonType == "skilltest") {
        // Button for [-][#][+]
        //            [Confirm]
        this._skillTestDisplay = 0;

        if (!(this._id in game.customStates)) {
            game.customStates.push({ "id": this._id, "successCount": 0 })
        }

        var skillTestGroup = game.add.group()

        // Display number
        this._numberBox = new OutlineBox(game, 50, 50)
        this._numberBox.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
        this.addChild(this._numberBox);

        var textStyle = { font: "30px Times New Romans", fill: "#ffffff", align: "center" };
        this._numberText = game.make.text(0, 0, this._skillTestDisplay, textStyle);
        this._numberText.alignIn(this._numberBox, Phaser.CENTER, 0, 3)
        this._numberText.x = Math.floor(this._numberText.x)
        this._numberText.y = Math.floor(this._numberText.y)
        this.addChild(this._numberText);

        // Subtract number
        var subtractNumber = new OutlineBox(game, 50, 50)
        subtractNumber.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, -60, 10)
        this.addChild(subtractNumber);

        var subtractText = game.make.text(0, 0, "-", textStyle);
        subtractText.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, -59, 16)
        this.addChild(subtractText);

        var subtractNumberButton = game.make.sprite(subtractNumber.x, subtractNumber.y, 'pixelTransparent');
        subtractNumberButton.width = subtractNumber.width;
        subtractNumberButton.height = subtractNumber.height;
        subtractNumberButton.inputEnabled = true;
        subtractNumberButton.events.onInputUp.add(this.skillSubtractClicked, this);
        this.addChild(subtractNumberButton);

        // Add number
        var addNumber = new OutlineBox(game, 50, 50)
        addNumber.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 60, 10)
        this.addChild(addNumber);

        var addText = game.make.text(0, 0, "+", textStyle);
        addText.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 61, 18)
        this.addChild(addText);

        var addNumberButton = game.make.sprite(addNumber.x, addNumber.y, 'pixelTransparent');
        addNumberButton.width = addNumber.width;
        addNumberButton.height = addNumber.height;
        addNumberButton.inputEnabled = true;
        addNumberButton.events.onInputUp.add(this.skillAddClicked, this);
        this.addChild(addNumberButton);

        // Confirm
        var dialogContinue = new DialogButtonThin(game, "Confirm", 150);
        dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 90)
        this.addChild(dialogContinue);

        var confirmButton = game.make.sprite(dialogContinue.x, dialogContinue.y, 'pixelTransparent');
        confirmButton.width = dialogContinue.width;
        confirmButton.height = dialogContinue.height;
        confirmButton.inputEnabled = true;
        confirmButton.events.onInputUp.add(this.skillConfirmClicked, this);
        this.addChild(confirmButton);

        this.addChild(skillTestGroup)

    } else if (buttonType == "custom") {
        // Custom Buttons
        var buttonYOffset = 10;
        for (var i = 0; i < this._buttonData.length; i++) {
            var data = this._buttonData[i]
            var dialogContinue = new DialogButtonMedium(game, buttonData[i].text, 500);
            dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, buttonYOffset)
            this.addChild(dialogContinue);
            buttonYOffset += 53;

            var dialogContinueButton = game.make.sprite(dialogContinue.x, dialogContinue.y, 'pixelTransparent');
            dialogContinueButton.width = dialogContinue.width;
            dialogContinueButton.height = dialogContinue.height;
            dialogContinueButton.inputEnabled = true;
            dialogContinueButton.events.onInputUp.add(this.buttonClicked, this);
            dialogContinueButton.data = data
            this.addChild(dialogContinueButton);
        }
    } if (buttonType == "fire-event") {
        // Buttons for [Fire Extinguished] [Fire Spreads]
        var dataExtinguished = this._buttonData.find(function (item) { return item.id == "extinguished" })
        var dialogExtinguished = new DialogButtonThin(game, "Fire Extinguished", 280);
        dialogExtinguished.alignTo(dialogMessage, Phaser.BOTTOM_LEFT, -10, 10)
        this.addChild(dialogExtinguished);

        var dataSpreads = this._buttonData.find(function (item) { return item.id == "spreads" })
        var dialogSpreads = new DialogButtonThin(game, "Fire Spreads", 280);
        dialogSpreads.alignTo(dialogMessage, Phaser.BOTTOM_RIGHT, -10, 10)
        this.addChild(dialogSpreads);

        var dialogExtinguishedButton = game.make.sprite(dialogExtinguished.x, dialogExtinguished.y, 'pixelTransparent');
        dialogExtinguishedButton.width = dialogExtinguished.width;
        dialogExtinguishedButton.height = dialogExtinguished.height;
        dialogExtinguishedButton.inputEnabled = true;
        dialogExtinguishedButton.events.onInputUp.add(this.buttonClicked, this);
        dialogExtinguishedButton.data = dataExtinguished
        this.addChild(dialogExtinguishedButton);

        var dialogSpreadsButton = game.make.sprite(dialogSpreads.x, dialogSpreads.y, 'pixelTransparent');
        dialogSpreadsButton.width = dialogSpreads.width;
        dialogSpreadsButton.height = dialogSpreads.height;
        dialogSpreadsButton.inputEnabled = true;
        dialogSpreadsButton.events.onInputUp.add(this.buttonClicked, this);
        dialogSpreadsButton.data = dataSpreads
        this.addChild(dialogSpreadsButton);

    } if (buttonType == "random-event-conditional") {
        // Buttons for [No Effect] [Resolve Effect]
        var dataNoEffect = this._buttonData.find(function (item) { return item.id == "no-effect" })
        var dialogNoEffect = new DialogButtonThin(game, "No Effect", 280);
        dialogNoEffect.alignTo(dialogMessage, Phaser.BOTTOM_LEFT, -10, 10)
        this.addChild(dialogNoEffect);

        var dataResolveEffect = this._buttonData.find(function (item) { return item.id == "resolve-effect" })
        var dialogResolveEffect = new DialogButtonThin(game, "Resolve Effect", 280);
        dialogResolveEffect.alignTo(dialogMessage, Phaser.BOTTOM_RIGHT, -10, 10)
        this.addChild(dialogResolveEffect);

        var dialogNoEffectButton = game.make.sprite(dialogNoEffect.x, dialogNoEffect.y, 'pixelTransparent');
        dialogNoEffectButton.width = dialogNoEffect.width;
        dialogNoEffectButton.height = dialogNoEffect.height;
        dialogNoEffectButton.inputEnabled = true;
        dialogNoEffectButton.events.onInputUp.add(this.buttonClicked, this);
        dialogNoEffectButton.data = dataNoEffect
        this.addChild(dialogNoEffectButton);

        var dialogResolveEffectButton = game.make.sprite(dialogResolveEffect.x, dialogResolveEffect.y, 'pixelTransparent');
        dialogResolveEffectButton.width = dialogResolveEffect.width;
        dialogResolveEffectButton.height = dialogResolveEffect.height;
        dialogResolveEffectButton.inputEnabled = true;
        dialogResolveEffectButton.events.onInputUp.add(this.buttonClicked, this);
        dialogResolveEffectButton.data = dataResolveEffect
        this.addChild(dialogResolveEffectButton);
    }
}

DialogGroup.prototype = Object.create(Phaser.Group.prototype);
DialogGroup.prototype.constructor = DialogGroup;

DialogGroup.prototype.cancelClicked = function (button, pointer) {
    button.inputEnabled = false;
    game.cutSceneCamera = false;
    this.fadeOut();
}

DialogGroup.prototype.skillSubtractClicked = function (button, pointer) {
    if (this._skillTestDisplay > 0) {
        this._skillTestDisplay--
        this._numberText.setText(this._skillTestDisplay)
        this._numberText.alignIn(this._numberBox, Phaser.CENTER, 0, 3)
        this._numberText.x = Math.floor(this._numberText.x)
        this._numberText.y = Math.floor(this._numberText.y)
    }
}

DialogGroup.prototype.skillAddClicked = function (button, pointer) {
    this._skillTestDisplay++
    this._numberText.setText(this._skillTestDisplay)
    this._numberText.alignIn(this._numberBox, Phaser.CENTER, 0, 3)
    this._numberText.x = Math.floor(this._numberText.x)
    this._numberText.y = Math.floor(this._numberText.y)
}

DialogGroup.prototype.skillConfirmClicked = function (button, pointer) {
    button.inputEnabled = false;
    var dialogId = this._id;
    var customState = game.customStates.find(function (item) { return item.id == dialogId });

    if (customState.successCount + this._skillTestDisplay >= this._skillTarget) {
        button.data = this._buttonData.find(function (item) { return item.id == "success" })
        DialogGroup.prototype.buttonClicked.call(this, button);
    } else {
        customState.successCount += this._skillTestDisplay
        button.data = this._buttonData.find(function (item) { return item.id == "fail" })
        DialogGroup.prototype.buttonClicked.call(this, button);
    }
}

DialogGroup.prototype.buttonClicked = function (button, pointer) {
    // this = DialogGroup
    button.inputEnabled = false;
    var restoreControl = true;
    var fadeOutCallback = null;

    // Look for button data and action aray
    if (button.data != null && button.data.hasOwnProperty("actions")) {
        // Loop on actions array
        for (var i = 0; i < button.data.actions.length; i++) {
            // Process each action
            var action = button.data.actions[i];
            if (action.type == "removeTokens") {
                // Loop on tokenIds array
                for (var j = 0; j < action.tokenIds.length; j++) {
                    var id = action.tokenIds[j];

                    // Remove Id
                    var instance = game.gamedataInstances.mapTokens.find(function (item) { return item.id == id })
                    if (instance != null) {
                        instance.fadeOut(function () {
                            instance = null;
                            game.world.removeChild(instance);
                            //instance.destroy();
                        })
                    }
                }
            } else if (action.type == "dialog") {
                // Make a new Dialog
                fadeOutCallback = function () {
                    var dialogInstance = MakeDialog(game, action.dialogId)
                    // TODO add fadeIn()
                    game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
                    game.stage.addChild(dialogInstance)
                }
                restoreControl = false;

            } else if (action.type == "reveal") {
                //Go to next reveal dialog
                if (game.revealList.dialogs.length > 0) {
                    fadeOutCallback = function () {
                        var revealDialog = game.revealList.dialogs.shift();
                        MakeRevealDialog(game, revealDialog);
                    }
                    restoreControl = false;

                } else if (game.hud.activePhase == "enemy") {
                    // TODO not sure if there is a cleaner way of doing this
                    HudGroup.prototype.scenarioEvent()
                }
            } else if (action.type == "revealList") {
                //Reveal map tiles
                if (action.revealListId != null) {
                    fadeOutCallback = function () {
                        MakeRevealList(game, action.revealListId);
                    }
                    restoreControl = false;
                }
            } else if (action.type == "scene") {
                MakeScene(game, action.sceneId)
            } else if (action.type == "fireExtinguished") {
                fadeOutCallback = function () {
                    game.hudInstance.fireExtinguished()
                }
                restoreControl = false;
            } else if (action.type == "fireSpreads") {
                fadeOutCallback = function () {
                    game.hudInstance.fireSpreads()
                }
                restoreControl = false;
            } else if (action.type == "randomEventDone") {
                fadeOutCallback = function () {
                    game.hudInstance.randomEventDone()
                }
                restoreControl = false;
            } else if (action.type == "randomEvent") {
                fadeOutCallback = function () {
                    //MakeRandomEvent(game, action.randomEventId);
                    var dialogInstance = MakeRandomEvent(game, action.randomEventId);
                    game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
                    game.stage.addChild(dialogInstance)
                }
                restoreControl = false;
            } else if (action.type == "randomEventResolve") {
                var randomEventId = this._id
                fadeOutCallback = function () {
                    //MakeRandomEventResolve(game, randomEventId);
                    var dialogInstance = MakeRandomEventResolve(game, randomEventId);
                    game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
                    game.stage.addChild(dialogInstance)
                }
                restoreControl = false;
            } else if (action.type == "setGlobal") {
                var globalVar = game.gamedata.globalVars.find(function (item) { return item.id == action.globalId });
                globalVar.value = action.value
            } else if (action.type == "scenarioEvent") {
                HudGroup.prototype.scenarioEvent()
            } else if (action.type == "monster") {
                MakeMonster(game, action.monsterId)
            }
        }
    }

    if (restoreControl) {
        game.cutSceneCamera = false;
    }

    this.fadeOut(fadeOutCallback);
}

DialogGroup.prototype.fadeOut = function (callback) {
    var fadeOutTween = game.add.tween(this).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);

    fadeOutTween.onComplete.addOnce(function () {
        this.destroy(true);
    }, this);

    if (callback != null) {
        fadeOutTween.onComplete.addOnce(callback, this);
    }
}

//=========================================================
function DialogMessage(game, text, imageKey) {
    Phaser.Group.call(this, game, 0, 0);

    var totalWidth = 600;
    var leftMargin = 20;
    var imageWidth = 96;
    var imageHeight = 96;
    var middleMargin = 20
    var rightMargin = 20;
    var topMargin = 20;
    var bottomMargin = 20;
    var textAlign = "left"
    var widthOffset = 0

    if (imageKey == null) {
        imageWidth = 0;
        middleMargin = 0;
        textAlign = "center"
    }

    var textWidth = totalWidth - leftMargin - imageWidth - middleMargin - rightMargin;
    var textStyle = { font: "20px Times New Romans", fill: "#ffffff", align: textAlign, wordWrap: true, wordWrapWidth: textWidth };
    var messageText = game.make.text(0, 0, text, textStyle);

    if (imageKey == null) {
        widthOffset = Math.floor((textWidth - messageText.width) / 2);
    }
    messageText.x = leftMargin + imageWidth + middleMargin + widthOffset

    var textHeight = messageText.height
    if (textHeight >= imageHeight) {
        messageText.y = topMargin;
    } else {
        messageText.y = topMargin + Math.floor((imageHeight - textHeight) / 2)
        textHeight = imageHeight
    }

    var totalHeight = textHeight + topMargin + bottomMargin;
    var outlineBox = new OutlineBox(game, totalWidth, totalHeight);

    this.addChild(outlineBox);
    this.addChild(messageText);

    if (imageKey != null) {
        var imageBadgeSprite = game.make.sprite(leftMargin, Math.floor((totalHeight - imageHeight) / 2), Helper.getImage(imageKey))
        this.addChild(imageBadgeSprite);
    }
}

DialogMessage.prototype = Object.create(Phaser.Group.prototype);
DialogMessage.prototype.constructor = DialogMessage;

//=========================================================
function DialogButtonThin(game, text, width) {
    Phaser.Group.call(this, game, 0, 0);

    var totalWidth = width;
    var leftMargin = 10;
    var rightMargin = 10;
    var topMargin = 4;
    var bottomMargin = 0;

    var textWidth = totalWidth - leftMargin - rightMargin;
    var textStyle = { font: "20px Times New Romans", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: textWidth };
    var messageText = game.make.text(0, 0, text, textStyle);
    messageText.x = Math.floor((totalWidth - messageText.width) / 2)
    messageText.y = topMargin;

    var totalHeight = messageText.height + topMargin + bottomMargin;
    var outlineBox = new OutlineBox(game, totalWidth, totalHeight);

    this.addChild(outlineBox);
    this.addChild(messageText);
}

DialogButtonThin.prototype = Object.create(Phaser.Group.prototype);
DialogButtonThin.prototype.constructor = DialogButtonThin;

//=========================================================
function DialogButtonMedium(game, text, width) {
    Phaser.Group.call(this, game, 0, 0);

    var totalWidth = width;
    var leftMargin = 10;
    var rightMargin = 10;
    var topMargin = 10;
    var bottomMargin = 5;

    var textWidth = totalWidth - leftMargin - rightMargin;
    var textStyle = { font: "20px Times New Romans", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: textWidth };
    var messageText = game.make.text(0, 0, text, textStyle);
    messageText.x = Math.floor((totalWidth - messageText.width) / 2)
    messageText.y = topMargin;

    var totalHeight = messageText.height + topMargin + bottomMargin;
    var outlineBox = new OutlineBox(game, totalWidth, totalHeight);

    this.addChild(outlineBox);
    this.addChild(messageText);
}

DialogButtonMedium.prototype = Object.create(Phaser.Group.prototype);
DialogButtonMedium.prototype.constructor = DialogButtonMedium;

//=========================================================
function DialogMessageMonster(game, text, width) {
    Phaser.Group.call(this, game, 0, 0);

    var totalWidth = width;
    var leftMargin = 10;
    var rightMargin = 10;
    var topMargin = 20;
    var bottomMargin = 15;

    var textWidth = totalWidth -leftMargin - rightMargin;
    var textStyle = { font: "20px Times New Romans", fill: "#ffffff", align: "center", wordWrap : true, wordWrapWidth: textWidth
    };
    var messageText = game.make.text(0, 0, text, textStyle);
    messageText.x = Math.floor((totalWidth -messageText.width) / 2)
    messageText.y = topMargin;

    var totalHeight = messageText.height +topMargin +bottomMargin;
    var outlineBox = new OutlineBox(game, totalWidth, totalHeight);

    this.addChild(outlineBox);
    this.addChild(messageText);
    }

DialogMessageMonster.prototype = Object.create(Phaser.Group.prototype);
DialogMessageMonster.prototype.constructor = DialogButtonMedium;

//=========================================================
function OutlineBox(game, width, height) {
    Phaser.Group.call(this, game, 0, 0);

    var localX = 0;
    var localY = 0;
    var edgeSize = 1;

    // Create all of our corners and edges
    var borders = [
        // background
        game.make.tileSprite(localX + edgeSize, localY + edgeSize, width - (edgeSize * 2), height - (edgeSize * 2), 'pixelBlack'),
        // top left
        game.make.image(localX, localY, 'pixelWhite'),
        // top right
        game.make.image(localX + width - edgeSize, localY, 'pixelWhite'),
        // bottom right
        game.make.image(localX + width - edgeSize, localY + height - edgeSize, 'pixelWhite'),
        // bottom left
        game.make.image(localX, localY + height - edgeSize, 'pixelWhite'),
        // top
        game.make.tileSprite(localX + edgeSize, localY, width - (edgeSize * 2), edgeSize, 'pixelWhite'),
        // bottom
        game.make.tileSprite(localX + edgeSize, localY + height - edgeSize, width - (edgeSize * 2), edgeSize, 'pixelWhite'),
        // left
        game.make.tileSprite(localX, localY + edgeSize, edgeSize, height - (edgeSize * 2), 'pixelWhite'),
        // right
        game.make.tileSprite(localX + width - edgeSize, localY + edgeSize, edgeSize, height - (edgeSize * 2), 'pixelWhite'),
    ];

    // Add all of the above to this group
    for (var b = 0, len = borders.length; b < len; b++) {
        this.addChild(borders[b]);
    }
}

OutlineBox.prototype = Object.create(Phaser.Group.prototype);
OutlineBox.prototype.constructor = OutlineBox;

//=========================================================
game.state.add('GameState', GameState)
game.state.start('GameState')
