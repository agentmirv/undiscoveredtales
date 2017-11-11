var GameState = {

    init: function () {
        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
        this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    },

    resize: function (width, height) {
        //console.log("resize: ", width, height);
    },

    preload: function () {
        ImageHelper.preload(this.game);
    },

    tokens: [],

    create: function () {
        //=================================================
        // Initialize game data
        this.game.gamedata = this.game.cache.getJSON('gamedata');
        this.game.gamedataInstances = {
            "mapTiles": [],
            "mapTokens": []
        };

        ImageHelper.create(this.game)

        //=================================================
        // Initialize Stuff
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.world.setBounds(0, 0, 2560, 2560);
        this.game.camera.bounds = null; // leave this until the world dimensions are determined via the map tile coordinates and dimensions
        this.game.camera.focusOnXY(this.game.gamedata.playerStart.x, this.game.gamedata.playerStart.y);
        this.game.stageViewRect = new Phaser.Rectangle(0, 0, this.game.camera.view.width, this.game.camera.view.height);
        this.game.presentationOffsetY = 48;
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.game.player = new PlayerSprite(this.game, this.game.gamedata.playerStart.x, this.game.gamedata.playerStart.y);

        this.game.add.tileSprite(0, 0, 2560, 2560, 'backgroundDebug');

        //=================================================
        this.tokens = this.game.gamedata.imageTokens;
        this.host._gameCreateDone();
    },

    update: function () {
        var playerVelocity = 400;
        this.game.player.body.setZeroVelocity();

        if (this.game.input.activePointer.rightButton.isDown) {
            if (this.game.origDragPoint) {
                // move the camera by the amount the mouse has moved since last update	
                this.game.player.body.x += this.game.origDragPoint.x - this.game.input.activePointer.position.x;
                this.game.player.body.y += this.game.origDragPoint.y - this.game.input.activePointer.position.y;
            }
            // set new drag origin to current position	
            this.game.origDragPoint = this.game.input.activePointer.position.clone();
        } else {
            this.game.origDragPoint = null;
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

//TODO Polyfill for array.find?
//TODO Polyfill for array.filter?

