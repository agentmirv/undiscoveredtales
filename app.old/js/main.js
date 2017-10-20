// JavaScript source code
var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'phaser-app')

var GameState = {
    preload: function () {
        //game.load.image('background', 'assets/images/debug-grid-1920x1920.png')
        game.load.image('background', 'assets/images/tilebackground.png')
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
        game.hud.randomAttackHeavyWeapon = []
        game.hud.randomAttackBladedWeapon = []
        game.hud.randomAttackFirearm = []
        game.hud.randomAttackSpell = []
        game.hud.randomAttackUnarmed = []
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
        // Make attack decks
        game.hud.randomAttackHeavyWeapon = game.gamedata.attacks.filter(function (item) { return item.type == "heavy-weapon" })
        game.hud.randomAttackBladedWeapon = game.gamedata.attacks.filter(function (item) { return item.type == "bladed-weapon" })
        game.hud.randomAttackFirearm = game.gamedata.attacks.filter(function (item) { return item.type == "firearm" })
        game.hud.randomAttackSpell = game.gamedata.attacks.filter(function (item) { return item.type == "spell" })
        game.hud.randomAttackUnarmed = game.gamedata.attacks.filter(function (item) { return item.type == "unarmed" })

        game.hud.randomAttackHeavyWeapon = Helper.shuffle(game.hud.randomAttackHeavyWeapon)
        game.hud.randomAttackBladedWeapon = Helper.shuffle(game.hud.randomAttackBladedWeapon)
        game.hud.randomAttackFirearm = Helper.shuffle(game.hud.randomAttackFirearm)
        game.hud.randomAttackSpell = Helper.shuffle(game.hud.randomAttackSpell)
        game.hud.randomAttackUnarmed = Helper.shuffle(game.hud.randomAttackUnarmed)

        //=================================================
        // Initialize Stuff
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.world.setBounds(0, 0, 2560, 2560);
        game.camera.bounds = null // leave this until the world dimensions are determined via the map tile coordinates and dimensions
        game.camera.focusOnXY(game.gamedata.playerStart.x, game.gamedata.playerStart.y)
        game.stageViewRect = new Phaser.Rectangle(0, 0, game.camera.view.width, game.camera.view.height)
        game.presentationOffsetY = 48
        cursors = game.input.keyboard.createCursorKeys();

        player = game.add.sprite(game.gamedata.playerStart.x, game.gamedata.playerStart.y, 'pixelTransparent');
        game.physics.p2.enable(player);
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.8, 0.8);

        game.add.tileSprite(0, 0, 2560, 2560, 'background');

        //=================================================
        // Add HUD
        var hudInstance = new HudGroup(game)
        game.stage.addChild(hudInstance)
        game.hudInstance = hudInstance;

        //=================================================
        // Game Start
        //=================================================
        MakeRevealList(game, game.gamedata.playerStart.firstReveal)
        //MakeMonster(game, "deep-one")
        //MakeMonster(game, "deep-one-2")
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
        //game.debug.text(game.hud.activeStep, 32, 500)
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
game.state.add('GameState', GameState)
game.state.start('GameState')
