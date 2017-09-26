function MakeDialogGroup(game, id) {
    var dialogGroupData = game.gamedata.dialogGroups.find(function (item) { return item.id == id });
    var dialogData = dialogGroupData.dialogs[0];

    switch(dialogData.type) {
        case "action":
            MakeActionDialog(game, dialogGroupData, dialogData.id);
            break;
    }
}