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

        game.load.spritesheet('tileWallsSheet', 'assets/images/TileWalls.png', 96, 96);

        game.load.json('gamedata', 'data/gamedata.json');
    },

    create: function () {
        //=================================================
        // Initialize game data
        game.gamedata = game.cache.getJSON('gamedata');
        game.gamedataInstances = {};
        game.gamedataInstances.mapTiles = []
        game.gamedataInstances.mapTokens = [] // TODO fix this so it is like game.gamedataInstances.mapTiles
        game.customStates = []; // This is used in skill test dialogs
        // TODO consolidate the revealMap structure into game.customStates?
        game.revealList = {};
        game.revealList.dialogs = [];
        game.hud = {};
        game.hud.activePhase = "player";
        game.hud.fireSet = false;
        game.hud.randomEventDeck = []
        game.hudInstance = {};

        //=================================================
        // Hud images
        var hudBmd = game.make.bitmapData(96, 96)
        var endPhaseButtonImage = game.make.image(0, 0, "arrow")
        var endPhaseBgImage = game.make.image(0, 0, "hudButton")
        endPhaseButtonImage.tint = "0xFFFFFF"
        endPhaseBgImage.tint = "0x044500"
        hudBmd.copy(endPhaseBgImage)
        hudBmd.copy(endPhaseButtonImage, 0, 0, 64, 64, 16, 16)
        game.cache.addBitmapData("endPhase-image-player", hudBmd)

        hudBmd = game.make.bitmapData(96, 96)
        endPhaseBgImage.tint = "0x450000"
        hudBmd.copy(endPhaseBgImage)
        hudBmd.copy(endPhaseButtonImage, 0, 0, 64, 64, 16, 16)
        game.cache.addBitmapData("endPhase-image-enemy", hudBmd)

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
        game.stageViewRect = new Phaser.Rectangle(0, 0, game.camera.view.width, game.camera.view.height)
        cursors = game.input.keyboard.createCursorKeys();

        game.presentationOffsetY = 48
        game.walkLerp = 0.5;
        game.followLerp = 0.06;
        game.camera.focusOnXY(game.gamedata.playerStart.x, game.gamedata.playerStart.y)
        // Move Player
        player = game.add.sprite(game.gamedata.playerStart.x, game.gamedata.playerStart.y, 'pixelTransparent');
        game.physics.p2.enable(player);
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, game.walkLerp, game.walkLerp);

        game.add.tileSprite(0, 0, 2560, 2560, 'background');

        //=================================================
        // First Reveal
        MakeRevealList(game, 'reveal-lobby')

        //=================================================
        // Add HUD
        var hudInstance = new HudGroup(game)
        game.stage.addChild(hudInstance)
        game.hudInstance = hudInstance;
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

// Fisher�Yates Shuffle
// https://bost.ocks.org/mike/shuffle/
Helper.shuffle = function (array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle�
    while (m) {

        // Pick a remaining element�
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
}

PlayerSceneGroup.prototype = Object.create(Phaser.Group.prototype);
PlayerSceneGroup.prototype.constructor = PlayerSceneGroup;

PlayerSceneGroup.prototype.updatePhase = function () {
    game.hud.activePhase = "player"
    game.hudInstance.updatePhaseButtonImage()
}

PlayerSceneGroup.prototype.destroyScene = function () {
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
}

EnemySceneGroup.prototype = Object.create(Phaser.Group.prototype);
EnemySceneGroup.prototype.constructor = EnemySceneGroup;

EnemySceneGroup.prototype.updatePhase = function () {
    game.hud.activePhase = "enemy"
    game.hudInstance.updatePhaseButtonImage()
}

EnemySceneGroup.prototype.beginEnemySteps = function () {
    game.hudInstance.fireEvent()
}

EnemySceneGroup.prototype.destroyScene = function () {
    this.destroy(true)
}

//=========================================================
function HudGroup(game) {
    Phaser.Group.call(this, game);

    // Enemy Phase Background
    this._enemyPhaseBGImage = game.make.tileSprite(0, 0, game.stageViewRect.width, game.stageViewRect.height, 'pixelWhite');
    this._enemyPhaseBGImage.tint = "0x000000";
    this._enemyPhaseBGImage.alpha = 0.7
    this._enemyPhaseBGImage.inputEnabled = true;
    this.addChild(this._enemyPhaseBGImage);
    this._enemyPhaseBGImage.kill()

    // End Phase Button 
    this._endPhasePlayerImage = game.make.image(0, 0, Helper.getImage("endPhase-image-player"))
    this._endPhasePlayerImage.alignIn(game.stageViewRect, Phaser.BOTTOM_RIGHT, 0, 0)
    this.addChild(this._endPhasePlayerImage);

    this._endPhaseEnemyImage = game.make.image(0, 0, Helper.getImage("endPhase-image-enemy"))
    this._endPhaseEnemyImage.alignIn(game.stageViewRect, Phaser.BOTTOM_RIGHT, 0, 0)
    this.addChild(this._endPhaseEnemyImage);
    this._endPhaseEnemyImage.kill()

    var endPhaseButton = game.make.sprite(this._endPhasePlayerImage.x, this._endPhasePlayerImage.y, 'pixelTransparent');
    endPhaseButton.width = this._endPhasePlayerImage.width;
    endPhaseButton.height = this._endPhasePlayerImage.height;
    endPhaseButton.inputEnabled = true;
    endPhaseButton.events.onInputUp.add(this.endPhaseClicked, this);
    this.addChild(endPhaseButton);
}

HudGroup.prototype = Object.create(Phaser.Group.prototype);
HudGroup.prototype.constructor = HudGroup;

HudGroup.prototype.endPhaseClicked = function (button, pointer) {
    var dialogInstance
    if (game.hud.activePhase == "player") {
        dialogInstance = MakeDialog(game, "dialog-hud-endphase-player")
    } else {
        // TODO only allow if no dialog (no modal)
        return
        dialogInstance = MakeDialog(game, "dialog-hud-endphase-enemy")
    }

    // TODO add fadeIn()
    game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    game.stage.addChild(dialogInstance)
}

HudGroup.prototype.updatePhaseButtonImage = function () {
    if (game.hud.activePhase == "player") {
        this._endPhasePlayerImage.revive()
        this._endPhaseEnemyImage.kill()
        //this._enemyPhaseBGImage.kill()
    } else {
        this._endPhasePlayerImage.kill()
        this._endPhaseEnemyImage.revive()
        //this._enemyPhaseBGImage.revive()
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
    if (game.hud.randomEventDeck.length == 0) {
        // get list of visible map tiles
        var visibleMapTileIds = []
        for (var i = 0; i < game.gamedataInstances.mapTiles.length; i++) {
            visibleMapTileIds.push(game.gamedataInstances.mapTiles[i].id)
        }

        // populate random events based on mapTile requirement
        game.hud.randomEventDeck = game.gamedata.randomEvents.filter(function (element) {
            var mapTileMissing = false
            if (element.hasOwnProperty("target") && element.target == "mapTile" && element.hasOwnProperty("mapTile")) {
                mapTileMissing = visibleMapTileIds.indexOf(element.mapTile) < 0
            }

            return !mapTileMissing
        })

        game.hud.randomEventDeck = Helper.shuffle(game.hud.randomEventDeck)
    }

    var randomEventData = game.hud.randomEventDeck.pop()

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
            }
        }
    }

    if (!triggeredScenarioEvent) {
        // If no scenario events were triggered, move on
        HudGroup.prototype.scenarioEventDone()
    }
}

HudGroup.prototype.scenarioEventDone = function () {
    var monsterCount = 0 //TODO monster drawer

    if (monsterCount > 0) {
        // Monsters Attack
    } else {
        MakeScene(game, "scene-player")
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

    if (revealDialog.continueToPlayerPhase) {
        buttonData = [{ "text": "Continue", "actions": [{ "type": "reveal" }, { "type": "scene", "sceneId": "scene-player" }] }];
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
        var displayNumber = new OutlineBox(game, 50, 50)
        displayNumber.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
        this.addChild(displayNumber);

        var textStyle = { font: "30px Times New Romans", fill: "#ffffff", align: "center" };
        this._numberText = game.make.text(0, 0, this._skillTestDisplay, textStyle);
        this._numberText.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 1, 18)
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
    game.cutSceneCamera = false;
    this.fadeOut();
}

DialogGroup.prototype.skillSubtractClicked = function (button, pointer) {
    if (this._skillTestDisplay > 0) {
        this._skillTestDisplay--
        this._numberText.setText(this._skillTestDisplay)
    }
}

DialogGroup.prototype.skillAddClicked = function (button, pointer) {
    this._skillTestDisplay++
    this._numberText.setText(this._skillTestDisplay)
}

DialogGroup.prototype.skillConfirmClicked = function (button, pointer) {
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
