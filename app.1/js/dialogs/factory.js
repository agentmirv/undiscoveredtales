//=========================================================
function MakeProcessActions(game) {
    return function (buttonData) {
        if (buttonData) {
            // Process all actions
            // Look for button data and action aray
            if (buttonData != null && buttonData.hasOwnProperty("actions")) {
                // Loop on actions array
                for (var i = 0; i < buttonData.actions.length; i++) {
                    // Process each action
                    var action = buttonData.actions[i];

                    // Actions
                    if (action.type == "setGlobal") {
                        //=========================================================
                        // Set Global
                        var globalVar = game.gamedata.globalVars.find(function (item) { return item.id == action.globalId });
                        globalVar.value = action.value
                        
                    } else if (action.type == "removeTokens") {
                        //=========================================================
                        // Remove Tokens
                        // Loop on tokenIds array
                        for (var j = 0; j < action.tokenIds.length; j++) {
                            var id = action.tokenIds[j];
                            // Remove Id
                            var token = game.gamedataInstances.mapTokens.find(function (item) { return item.id == id })
                            if (token != null) {
                                token.fadeOut();
                            }
                        }
                    } else if (action.type == "reveal") {
                        //=========================================================
                        // Continue Reveal
                        ContinueRevealGroup(game, action.revealGroup)
                    } else if (action.type == "scene") {
                        //=========================================================
                        // Scene
                        MakeScene(game, action.sceneId)
                    }
                }
            }
        }
    }
}

//=========================================================
function MakeDialogGroup(game, id) {
    var dialogGroupData = game.gamedata.dialogGroups.find(function (item) { return item.id == id });
    
    // Examine conditions on the dialogs
    // Select the dialog based on conditions
    // Or select the first one
    var dialogData = dialogGroupData.dialogs[0];
    if (dialogGroupData.startConditions != null && Array.isArray(dialogGroupData.startConditions)) {
        for (var i = 0; i < dialogGroupData.startConditions.length; i++) {
            var condition = dialogGroupData.startConditions[i];
            var globalVar = game.gamedata.globalVars.find(function (item) { return item.id == condition.globalId })
            if (globalVar != null && globalVar.value == condition.value) {
                dialogData = dialogGroupData.dialogs.find(function (item) { return item.id == condition.dialogId });
            }
        }
    } 
    
    switch(dialogData.type) {
        case "action":
            MakeActionDialog(game, dialogGroupData, dialogData.id);
            break;
        case "statement":
            MakeStatementDialog(game, dialogGroupData, dialogData.id);
            break;
    }
}

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
