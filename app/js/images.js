function ImageHelper () {
}

ImageHelper.preload = function(game) {
    game.load.image('backgroundDebug', 'assets/images/debug-grid-1920x1920.png');
    game.load.image('background', 'assets/images/tilebackground.png');
    //game.load.image('pixelWhite', 'assets/images/FFFFFF-1.png');
    game.load.image('pixelBlack', 'assets/images/000000-1.png');
    game.load.image('pixelOrange', 'assets/images/FF4D00-1.png');
    game.load.image('pixelTransparent', 'assets/images/1x1.png');
    game.load.image('revealPointer', 'assets/images/RevealPointer.png');
    game.load.image('hudButton', 'assets/images/HudButton.png');
    game.load.image('arrow', 'assets/images/plain-arrow.png');
    game.load.image('interlaced-tentacles', 'assets/images/interlaced-tentacles.png');
    game.load.image('light-backpack', 'assets/images/light-backpack.png');
    game.load.image('bookmarklet', 'assets/images/bookmarklet.png');
    game.load.spritesheet('tileWallsSheet', 'assets/images/TileWalls.png', 96, 96);
    game.load.spritesheet('tileWallsSheet2', 'assets/images/TileWalls2.png', 96, 96);
}

ImageHelper.create = function (game) {
    //=================================================
    // Hud Button images

    var endHudBgImage = game.make.image(0, 0, "hudButton");
    var hudButtonImages = [
        { iconImageId: "arrow", greenImgId: "endPhase-image-player", redImgId: "endPhase-image-enemy" },
        { iconImageId: "light-backpack", greenImgId: "inventory-image-player", redImgId: "inventory-image-enemy" },
        { iconImageId: "interlaced-tentacles", greenImgId: "monster-image-player", redImgId: "monster-image-enemy" },
        { iconImageId: "bookmarklet", greenImgId: "menu-image-player", redImgId: "menu-image-enemy" },
    ];

    for (var k = 0; k < hudButtonImages.length; k++) {
        var hudButtonImage = hudButtonImages[k];

        var iconImage = game.make.image(0, 0, hudButtonImage.iconImageId);
        var hudBmd = game.make.bitmapData(96, 96);
        iconImage.tint = "0xFFFFFF";
        endHudBgImage.tint = "0x044500";
        hudBmd.copy(endHudBgImage, 0, 0, 92, 92, 2, 2);
        hudBmd.copy(iconImage, 0, 0, 64, 64, 16, 16);
        game.cache.addBitmapData(hudButtonImage.greenImgId, hudBmd);
    
        hudBmd = game.make.bitmapData(96, 96);
        endHudBgImage.tint = "0x450000";
        hudBmd.copy(endHudBgImage, 0, 0, 92, 92, 2, 2);
        hudBmd.copy(iconImage, 0, 0, 64, 64, 16, 16);
        game.cache.addBitmapData(hudButtonImage.redImgId, hudBmd);    
    }
}

ImageHelper.getImage = function (game, imageKey) {
    return game.cache.getBitmapData(imageKey);
}
