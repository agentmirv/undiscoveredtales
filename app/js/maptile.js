//=========================================================
function MakeMapTile(game, id) {
    var mapTileData = game.gamedata.mapTiles.find(function (item) { return item.id == id });
    var mapTileInstance = null;

    if (game.gamedataInstances.mapTiles.some(function (item) { return item.id == id })) {
        // This handles the case where a room needs revealed that is inside a tile
        // that is already revealed. The camera still needs to center on the existing tile.
        mapTileInstance = game.gamedataInstances.mapTiles.find(function (item) { return item.id == id });
        
    } else {
        mapTileInstance = new MapTile(game, mapTileData);
        game.mapTileLayer.addChild(mapTileInstance);
        var fadeInTween = game.add.tween(mapTileInstance).from({ alpha: 0 }, 600, Phaser.Easing.Linear.None, true, 0, 0, false);
    }

    return mapTileInstance;
}

//=========================================================
function MapTile(game, mapTileData) {
    Phaser.Group.call(this, game);

    this.data = mapTileData;
    this.id = this.data.id;
    this.isRevealed = false;
    var sprite = game.make.sprite(this.data.x, this.data.y, ImageHelper.getImage(game, this.data.imageKey))

    // Set Sprite Anchor
    if (this.data.angle == 90) {
        sprite.anchor.setTo(0, 1);
    } else if (this.data.angle == 180) {
        sprite.anchor.setTo(1, 1);
    } else if (this.data.angle == 270) {
        sprite.anchor.setTo(1, 0);
    }

    // Set Sprite Angle
    sprite.angle = this.data.angle;
    
    this.addChild(sprite);
    game.gamedataInstances.mapTiles.push(this);
    
    // Remove Door Tokens when the connecting rooms are revealed
    this.removeDoorTokens();
}

MapTile.prototype = Object.create(Phaser.Group.prototype);
MapTile.prototype.constructor = MapTile;

MapTile.prototype.removeDoorTokens = function () {
    // Look at each entryTokenId of the room
    for (var i = 0; i < this.data.entryTokenIds.length; i++) {
        var tokenId = this.data.entryTokenIds[i];
        var removeToken = true;

        // Find this entryTokenId in all rooms in gamedata
        for (var j = 0; j < this.game.gamedata.mapTiles.length; j++) {
            var mapTileDataCheck = this.game.gamedata.mapTiles[j];
            // Find tokenId in mapTileData.entryTokenIds
            if (mapTileDataCheck.entryTokenIds.indexOf(tokenId) >= 0) {
                // Check if mapTileData.id in game.gamedataInstances.mapTiles
                // If the mapTile has the entryToken and the mapTile is not instanced, then don't remove the token
                if (!this.game.gamedataInstances.mapTiles.some(function (item) { return item.id == mapTileDataCheck.id })) {
                    // If it is not in, then it is not revealed
                    removeToken = false;
                }
            }
        }

        if (removeToken) {
            var instance = this.game.gamedataInstances.mapTokens.find(function (item) { return item.id == tokenId });
            if (instance != null) {
                instance.fadeOut();
            }
        }
    }
}
