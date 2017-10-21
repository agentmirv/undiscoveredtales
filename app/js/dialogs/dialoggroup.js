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
