function MakeDialogGroup(game, id) {
    var dialogGroupData = game.gamedata.dialogGroups.find(function (item) { return item.id == id });
    
    // Examine conditions on the dialogs
    // Select the dialog based on conditions
    // Or select the first one
    var dialogData = dialogGroupData.dialogs[0];

    switch(dialogData.type) {
        case "action":
            MakeActionDialog(game, dialogGroupData, dialogData.id);
            break;
    }
}