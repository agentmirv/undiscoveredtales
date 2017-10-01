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
function MakeRevealGroup(game, id) {
    var revealGroupData = game.gamedata.revealGroups.find(function (item) { return item.id == id });
    
    var dialogData = revealGroupData.dialogs[0];
    
    MakeRevealDialog(game, dialogGroupData, dialogData.id);
}

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
                    }
                }
            }
        }
    }
}

//=========================================================
function MakeReveaGroup(game, id) {
    var revealGroup = game.gamedata.revealGroup.find(function (item) { return item.id == id });
    //game.revealList.dialogs = revealData.revealDialogs;

    //if (game.revealList.dialogs.length > 0) {
    //    var revealDialog = game.revealList.dialogs.shift();
    //    MakeRevealDialog(game, revealDialog);
    //}
}

//=========================================================
function MakeRevealDialog(game, id) {
    var revealDialog = game.gamedata.revealDialogs.find(function (item) { return item.id == id });
    var movePlayer = new Phaser.Point()
    var imageKey = null;
    
    //=========================================================
    // Make button action to continue to the next reveal dialog
    var buttonType = "reveal";
    var buttonData = [{ "text": "Continue", "actions": [{ "type": "reveal" }] }];

    if (Array.isArray(revealDialog.actions)) {
        buttonData[0].actions = revealDialog.actions.concat(buttonData[0].actions)
    }
    //=========================================================

    if (revealDialog.mapTiles != null) {
        var calculateCenter = new Phaser.Point(0, 0)
        // Add Map Tiles
        for (var i = 0; i < revealDialog.mapTiles.length; i++) {
            var mapTileId = revealDialog.mapTiles[i];
            var mapTileInstance = MakeMapTile(game, mapTileId);

            calculateCenter.x += mapTileInstance.centerX
            calculateCenter.y += mapTileInstance.centerY
        }

        imageKey = null;
        movePlayer.x = Math.floor(calculateCenter.x / revealDialog.mapTiles.length)
        movePlayer.y = Math.floor(calculateCenter.y / revealDialog.mapTiles.length) + game.presentationOffsetY

    } else if (revealDialog.addSingleToken != null) {
        // Show image at the top of the Dialog
        var tokenInstance = MakeToken(game, revealDialog.addSingleToken);
        tokenInstance.fadeIn();

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
        imageKey = null;
        movePlayer.x = player.body.x
        movePlayer.y = player.body.y
    }

    //=========================================================        
    // Replace with Player.Move
    var moveTween = game.add.tween(player.body).to({ x: movePlayer.x, y: movePlayer.y }, 1200, Phaser.Easing.Quadratic.Out, true, 0, 0, false);

    moveTween.onStart.addOnce(function () {
        game.cutSceneCamera = true;
    })
    //=========================================================        

    moveTween.onComplete.addOnce(function () {
        //=========================================================        
        // Replace with MakeDialogGroup
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
        //=========================================================

        if (revealDialog.addMultipleTokens != null) {
            // Show images with the Dialog in the middle of the room
            for (var i = 0; i < revealDialog.addMultipleTokens.length; i++) {
                var tokenId = revealDialog.addMultipleTokens[i];
                var tokenInstance = MakeToken(game, tokenId);
                tokenInstance.fadeIn();
            }
        }
    })
}

