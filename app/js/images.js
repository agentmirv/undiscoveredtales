function ImageHelper () {
}

ImageHelper.preload = function(game) {
    //game.load.image('background', 'assets/images/debug-grid-1920x1920.png')
    game.load.image('background', 'assets/images/tilebackground.png')
    game.load.image('pixelWhite', 'assets/images/FFFFFF-1.png')
    game.load.image('pixelBlack', 'assets/images/000000-1.png')
    game.load.image('pixelOrange', 'assets/images/FF4D00-1.png')
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
    game.load.image('light-backpack', 'assets/images/light-backpack.png');
    game.load.image('bookmarklet', 'assets/images/bookmarklet.png');
    game.load.spritesheet('tileWallsSheet', 'assets/images/TileWalls.png', 96, 96);
    game.load.json('gamedata', 'data/gamedata.json');
}

ImageHelper.create = function (game) {
    //=================================================
    // Hud images
    //var hudBmd = game.make.bitmapData(96, 96)
    var endHudBgImage = game.make.image(0, 0, "hudButton")

    // End Phase
    ImageHelper.addMainButtonBMD(game, endHudBgImage, "arrow", "endPhase-image-player", "endPhase-image-enemy");
    
    // Inventory
    ImageHelper.addMainButtonBMD(game, endHudBgImage, "light-backpack", "inventory-image-player", "inventory-image-enemy");

    // Monster
    ImageHelper.addMainButtonBMD(game, endHudBgImage, "interlaced-tentacles", "monster-image-player", "monster-image-enemy");

    // Menu
    ImageHelper.addMainButtonBMD(game, endHudBgImage, "bookmarklet", "menu-image-player", "menu-image-enemy");

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
}

ImageHelper.getImage = function (game, imageKey) {
    return game.cache.getBitmapData(imageKey)
}

ImageHelper.addMainButtonBMD = function (game, endHudBgImage, iconImageId, greenImgId, redImgId) {
    var iconImage = game.make.image(0, 0, iconImageId);
    var hudBmd = game.make.bitmapData(96, 96);
    iconImage.tint = "0xFFFFFF";
    endHudBgImage.tint = "0x044500";
    hudBmd.copy(endHudBgImage, 0, 0, 92, 92, 2, 2);
    hudBmd.copy(iconImage, 0, 0, 64, 64, 16, 16);
    game.cache.addBitmapData(greenImgId, hudBmd);

    hudBmd = game.make.bitmapData(96, 96);
    endHudBgImage.tint = "0x450000";
    hudBmd.copy(endHudBgImage, 0, 0, 92, 92, 2, 2);
    hudBmd.copy(iconImage, 0, 0, 64, 64, 16, 16);
    game.cache.addBitmapData(redImgId, hudBmd);
}

