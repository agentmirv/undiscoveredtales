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

        for (var i = 0; i < this.game.gamedata.imageTokens.length; i++) {
            var imageToken = this.game.gamedata.imageTokens[i];
            if (imageToken.hasOwnProperty("primaryImageSrc")) {
                if (!imageDictionary.hasOwnProperty(imageToken.primaryImageSrc)) {
                    imageDictionary[imageToken.primaryImageSrc] = imageToken.primaryImageSrc;
                }
            }

            if (imageToken.hasOwnProperty("backgroundImageSrc")) {
                if (!imageDictionary.hasOwnProperty(imageToken.backgroundImageSrc)) {
                    imageDictionary[imageToken.backgroundImageSrc] = imageToken.backgroundImageSrc;
                }
            }

            if (imageToken.hasOwnProperty("maskImageSrc")) {
                if (!imageDictionary.hasOwnProperty(imageToken.maskImageSrc)) {
                    imageDictionary[imageToken.maskImageSrc] = imageToken.maskImageSrc;
                }
            }            
        }

        this.game.load.baseURL = "/";

        for(var key in imageDictionary) {
            var imgSrc = imageDictionary[key];
                this.game.load.image(key, imgSrc);
          }
    },

    create: function () {
        this.game.state.start('buildImages');
    }
}

var buildImagesState = {
    preload: function () {
        //=================================================
        // ImageTokens BitmapData
        for (var i = 0; i < this.game.gamedata.imageTokens.length; i++) {
            var gridWidth = 96;
            var imageTokenData = this.game.gamedata.imageTokens[i];
            var tokenBmd = this.game.make.bitmapData(gridWidth, gridWidth);

            // Background Image
            if (imageTokenData.backgroundImageSrc != null) {
                if (imageTokenData.backgroundImageAngle == null) {
                    // Make Image From Cache reference string
                    var backgroundImage = this.game.make.image(0, 0, imageTokenData.backgroundImageSrc);
                    if (imageTokenData.backgroundColor != null) {
                        backgroundImage.tint = imageTokenData.backgroundColor;
                    }
                    tokenBmd.copy(backgroundImage);
                } else {
                    var degToRad = imageTokenData.backgroundImageAngle * (Math.PI / 180);
                    if (imageTokenData.backgroundImageAngle == 90) {
                        tokenBmd.copy(imageTokenData.backgroundImageSrc, null, null, null, null, null, null, null, null, degToRad, 0, 1);
                    } else if (imageTokenData.backgroundImageAngle == 270) {
                        tokenBmd.copy(imageTokenData.backgroundImageSrc, null, null, null, null, null, null, null, null, degToRad, 1, 0);
                    } else if (imageTokenData.backgroundImageAngle == 180) {
                        tokenBmd.copy(imageTokenData.backgroundImageSrc, null, null, null, null, null, null, null, null, degToRad, 1, 1);
                    } else {
                        tokenBmd.copy(imageTokenData.backgroundImageSrc);
                    }
                }
            }

            // Primary Image
            if (imageTokenData.primaryImageSrc != null) {
                // Make Image From Cache reference string
                var primaryImage = this.game.make.image(0, 0, imageTokenData.primaryImageSrc);

                if (imageTokenData.imageShadowColor != null) {
                    primaryImage.tint = imageTokenData.imageShadowColor;
                    tokenBmd.copy(primaryImage, 0, 0, 64, 64, 16 + 2, 16 + 2);
                }

                if (imageTokenData.imagePrimaryColor != null) {
                    primaryImage.tint = imageTokenData.imagePrimaryColor;
                }

                tokenBmd.copy(primaryImage, 0, 0, 64, 64, 16, 16);
            }

            // Mask Image
            if (imageTokenData.maskImageSrc != null) {
                // Make Image From Cache reference string
                var maskImage = this.game.make.image(0, 0, imageTokenData.maskImageSrc);
                if (imageTokenData.maskColor != null) {
                    maskImage.tint = imageTokenData.maskColor;
                }
                tokenBmd.copy(maskImage);
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
