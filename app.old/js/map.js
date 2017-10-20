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

TokenSprite.prototype.openDialog = function () {
    var clickId = null
    if (this.clickConditions != null && Array.isArray((this.clickConditions))) {
        for (var i = 0; i < this.clickConditions.length; i++) {
            var condition = this.clickConditions[i]
            var globalVar = game.gamedata.globalVars.find(function (item) { return item.id == condition.globalId })
            if (globalVar.value == condition.value) {
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