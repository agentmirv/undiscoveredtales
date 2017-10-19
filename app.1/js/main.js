// JavaScript source code
var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'phaser-app')

var GameState = {
    preload: function () {
        ImageHelper.preload(game)
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

        ImageHelper.create(game)

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

        game.player = new PlayerSprite(game, game.gamedata.playerStart.x, game.gamedata.playerStart.y);
        //player = game.add.sprite(game.gamedata.playerStart.x, game.gamedata.playerStart.y, 'pixelTransparent');
        //game.physics.p2.enable(player);
        //game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.8, 0.8);

        game.add.tileSprite(0, 0, 2560, 2560, 'background');

        game.mapTileLayer = game.add.group();
        game.tokenLayer = game.add.group();

        //=================================================
        // Add HUD
        //var hudInstance = new HudGroup(game)
        //game.stage.addChild(hudInstance)
        //game.hudInstance = hudInstance;
        var hud = new Hud(game);
        game.hud = hud;
        game.stage.addChild(hud);

        //=================================================
        // Game Start
        //=================================================
        //StartRevealGroup(game, game.gamedata.playerStart.firstReveal)

        game.hud.phase = "player";
        hud.makeMonster("deep-one")
    },

    update: function () {
        if (!game.player.cutSceneCamera && game.hud.phase == "player") {
            var playerVelocity = 400;
            game.player.body.setZeroVelocity();

            if (cursors.up.isDown) {
                game.player.body.moveUp(playerVelocity)
            }
            else if (cursors.down.isDown) {
                game.player.body.moveDown(playerVelocity);
            }

            if (cursors.left.isDown) {
                game.player.body.velocity.x = -playerVelocity;
            }
            else if (cursors.right.isDown) {
                game.player.body.moveRight(playerVelocity);
            }

            if (game.input.activePointer.isDown) {
                if (game.origDragPoint) {
                    // move the camera by the amount the mouse has moved since last update	
                    game.player.body.x += game.origDragPoint.x - game.input.activePointer.position.x;
                    game.player.body.y += game.origDragPoint.y - game.input.activePointer.position.y;
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
        //game.debug.text(game.hud.monsterDetail.x, 32, 430)
        //game.debug.text(game.hud.monsterDetail.y, 32, 450)
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

//Helper.getImage = function (imageKey) {
//    return game.cache.getBitmapData(imageKey)
//}

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
