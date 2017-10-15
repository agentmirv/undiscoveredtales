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
                    } else if (action.type == "startReveal") {
                        //=========================================================
                        // Continue Reveal
                        StartRevealGroup(game, action.revealGroupId)
                    } else if (action.type == "continueReveal") {
                        //=========================================================
                        // Continue Reveal
                        ContinueRevealGroup(game, buttonData.revealGroup)
                    } else if (action.type == "dialog") {
                        //=========================================================
                        // Continue Dialog
                        ContinueDialogGroup(game, action.dialogId, buttonData.dialogGroup)
                    } else if (action.type == "hud") {
                        //=========================================================
                        // Hud Commands                        
                        if (action.command == "startPlayerPhase") {
                            // Start Player Phase
                            game.hud.startPlayerPhase();
                        } else if (action.command == "scenarioEventEnd") {
                            // Scenario Event End
                            buttonData.dialogGroup.doneSignal.dispatch();
                        } else if (action.command == "makeMonster") {
                            // Make Monster
                            game.hud.makeMonster(action.monsterId);
                        }  
                    }  
                }
            }
        }
    }
}

//=========================================================
function StartDialogGroup(game, id, doneSignal) {
    var dialogGroup = game.gamedata.dialogGroups.find(function (item) { return item.id == id });
    
    if(doneSignal !== undefined) {
        dialogGroup.doneSignal = doneSignal;
    }
    
    // Examine conditions on the dialogs
    // Select the dialog based on conditions
    // Or select the first one
    var dialogData = dialogGroup.dialogs[0];
    if (dialogGroup.startConditions != null && Array.isArray(dialogGroup.startConditions)) {
        for (var i = 0; i < dialogGroup.startConditions.length; i++) {
            var condition = dialogGroup.startConditions[i];
            var globalVar = game.gamedata.globalVars.find(function (item) { return item.id == condition.globalId })
            if (globalVar != null && globalVar.value == condition.value) {
                dialogData = dialogGroup.dialogs.find(function (item) { return item.id == condition.dialogId });
            }
        }
    } 
    
    ProcessDialogType(game, dialogData, dialogGroup);
}

function ContinueDialogGroup(game, dialogId, dialogGroup) {
    var dialogData = dialogGroup.dialogs.find(function (item) { return item.id == dialogId });
    ProcessDialogType(game, dialogData, dialogGroup);
}

function ProcessDialogType(game, dialogData, dialogGroup) {
    switch(dialogData.type) {
        case "action":
            MakeActionDialog(game, dialogData, dialogGroup);
            break;
        case "statement":
            MakeStatementDialog(game, dialogData, dialogGroup);
            break;
        case "skilltest":
            MakeSkillTestDialog(game, dialogData, dialogGroup);
            break;
        case "custom":
            MakeCustomDialog(game, dialogData, dialogGroup);
            break;
    }
}
