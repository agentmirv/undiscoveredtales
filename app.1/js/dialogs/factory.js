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
