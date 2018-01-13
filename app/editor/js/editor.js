//=========================================================
//TODO Polyfill for array.find?
//TODO Polyfill for array.filter?

var loadDataState = {
    preload: function () {
        this.game.load.json('gamedata', '../data/gamedata.json');        
    },

    create: function () {
        this.game.state.start('loadImages');
    }
}

var loadImagesState = {
    preload: function () {
        this.game.gamedata = this.game.cache.getJSON('gamedata');
        var imageDictionary = {};

        // Tiles
        for (var i = 0; i < this.game.gamedata.imageTiles.length; i++) {
            var imageTile = this.game.gamedata.imageTiles[i];
            if (imageTile.hasOwnProperty("imageSrc")) {
                if (!imageDictionary.hasOwnProperty(imageTile.imageSrc)) {
                    imageDictionary[imageTile.imageSrc] = imageTile.imageSrc;
                }
            }
        }

        // Tokens
        for (var i = 0; i < this.game.gamedata.imageTokens.length; i++) {
            var imageToken = this.game.gamedata.imageTokens[i];
            if (imageToken.hasOwnProperty("src")) {
                if (!imageDictionary.hasOwnProperty(imageToken.src)) {
                    imageDictionary[imageToken.src] = imageToken.src;
                }
            }
        }

        this.game.load.baseURL = "../";

        for(var key in imageDictionary) {
            var imgSrc = imageDictionary[key];
            this.game.load.image(key, imgSrc);
        }
        
        this.game.load.image('pixelWhite', 'assets/images/FFFFFF-1.png');
    },

    create: function () {
        this.game.state.start('buildImages');
    }
}

var buildImagesState = {
    preload: function () {
        //=================================================
        // ImageTiles bitmapData
        for (var k = 0; k < this.game.gamedata.imageTiles.length; k++) {
            var imageTileData = this.game.gamedata.imageTiles[k];
            var image = this.game.make.image(0, 0, imageTileData.imageSrc);
            var mapTileBmd = this.game.make.bitmapData(image.width, image.height);
            
            var backgroundImage = this.game.make.image(0, 0, 'pixelWhite');
            if (imageTileData.floorColor != null) {
                backgroundImage.tint = imageTileData.floorColor;
                console.log(imageTileData.floorColor);
            }
            mapTileBmd.copy(backgroundImage, 0, 0, 1, 1, 0, 0, image.width, image.height);
            
            mapTileBmd.copy(image);
            this.game.cache.addBitmapData(imageTileData.imageKey, mapTileBmd);
        }

        //=================================================
        // ImageTokens BitmapData
        for (var i = 0; i < this.game.gamedata.imageTokens.length; i++) {
            var gridWidth = 96;
            var imageTokenData = this.game.gamedata.imageTokens[i];
            var tokenBmd = this.game.make.bitmapData(gridWidth, gridWidth);

            if (imageTokenData.src != null) {
                // Make Image From Cache reference string
                var primaryImage = this.game.make.image(0, 0, imageTokenData.src);
                tokenBmd.copy(primaryImage, 0, 0, primaryImage.width, primaryImage.height, 0, 0, 96, 96);
            }

            this.game.cache.addBitmapData(imageTokenData.imageKey, tokenBmd);
        }
    },

    create: function () {
        this.game.state.start('main');
    }
}

var mainState = {

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
        this.game.add.tileSprite(0, 0, 2560, 2560, 'backgroundDebug');

        this.game.player = new PlayerSprite(this.game, this.game.gamedata.playerStart.x, this.game.gamedata.playerStart.y);

        this.game.mapTileLayer = this.game.add.group();
        this.game.tokenLayer = this.game.add.group();

        //=================================================
        this.tokens = this.game.gamedata.imageTokens;
        this.tiles = this.game.gamedata.imageTiles;
        this.host._gameCreateDone();
    },

    update: function () {
        var playerVelocity = 400;
        this.game.player.body.setZeroVelocity();

        if (this.cursors.up.isDown) {
            this.game.player.body.moveUp(playerVelocity)
        }
        else if (this.cursors.down.isDown) {
            this.game.player.body.moveDown(playerVelocity);
        }

        if (this.cursors.left.isDown) {
            this.game.player.body.velocity.x = -playerVelocity;
        }
        else if (this.cursors.right.isDown) {
            this.game.player.body.moveRight(playerVelocity);
        }

        /*
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
        */
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
    },
    
    addTile: function(imageKey) {
        var newTileData = {
            "x": this.game.player.x,
            "y": this.game.player.y,
            "imageKey": imageKey,
            "id": imageKey,
            "angle": 0,
            "entryTokenIds": []
        }
        
        var mapTileInstance = new MapTile(this.game, newTileData);
        this.game.mapTileLayer.addChild(mapTileInstance);
        var fadeInTween = this.game.add.tween(mapTileInstance).from({ alpha: 0 }, 600, Phaser.Easing.Linear.None, true, 0, 0, false);

        mapTileInstance.inputEnabled = true;
        mapTileInstance.input.enableDrag();
        //newTile.events.onDragStart.add(onDragStart, this);
        //newTile.events.onDragStop.add(onDragStop, this);
    }
}
