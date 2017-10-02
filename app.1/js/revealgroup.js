//=========================================================
function StartRevealGroup(game, id) {
    var revealGroup = game.gamedata.revealGroups.find(function (item) { return item.id == id });
    
    if (revealGroup.dialogs.length > 0) {
        var revealDialogData = revealGroup.dialogs.shift();
        MakeRevealDialogData(game, revealDialogData, revealGroup);
    }
}

function ContinueRevealGroup(game, revealGroup) {
    if (revealGroup.dialogs.length > 0) {
        var revealDialogData = revealGroup.dialogs.shift();
        MakeRevealDialogData(game, revealDialogData, revealGroup);
    }
}

//=========================================================
function MakeRevealDialogData(game, revealDialogData, revealGroup) {
    var revealDialogData = revealDialogData;
    var movePlayer = new Phaser.Point()
    var imageKey = null;

    if (revealDialogData.mapTiles != null) {
        var calculateCenter = new Phaser.Point(0, 0)
        // Add Map Tiles
        for (var i = 0; i < revealDialogData.mapTiles.length; i++) {
            var mapTileId = revealDialogData.mapTiles[i];
            var mapTileInstance = MakeMapTile(game, mapTileId);

            calculateCenter.x += mapTileInstance.centerX
            calculateCenter.y += mapTileInstance.centerY
        }

        imageKey = null;
        movePlayer.x = Math.floor(calculateCenter.x / revealDialogData.mapTiles.length)
        movePlayer.y = Math.floor(calculateCenter.y / revealDialogData.mapTiles.length) + game.presentationOffsetY

    } else if (revealDialogData.addSingleToken != null) {
        // Show image at the top of the Dialog
        var tokenInstance = MakeToken(game, revealDialogData.addSingleToken);

        imageKey = tokenInstance.imageKey;
        movePlayer.x = tokenInstance.x + 48
        movePlayer.y = tokenInstance.y + 208 + game.presentationOffsetY

    } else if (revealDialogData.showSingleToken != null) {
        // Show image at the top of the Dialog
        var tokenInstance = game.gamedataInstances.mapTokens.find(function (item) { return item.id == revealDialogData.showSingleToken })

        imageKey = tokenInstance.imageKey;
        movePlayer.x = tokenInstance.x + 48
        movePlayer.y = tokenInstance.y + 208 + game.presentationOffsetY

    } else {
        imageKey = null;
        movePlayer.x = game.player.body.x
        movePlayer.y = game.player.body.y
    }

    var playerMove = this.game.player.Move(movePlayer);

    playerMove.onComplete.addOnce(function () {
        MakeRevealDialog(game, revealDialogData, revealGroup, imageKey)
        
        if (revealDialogData.addMultipleTokens != null) {
            // Show images with the Dialog in the middle of the room
            for (var i = 0; i < revealDialogData.addMultipleTokens.length; i++) {
                var tokenId = revealDialogData.addMultipleTokens[i];
                var tokenInstance = MakeToken(game, tokenId);
            }
        }
    }, this);
    
    playerMove.Start();
}
