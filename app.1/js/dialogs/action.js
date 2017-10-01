/* global Phaser */
//=========================================================
function MakeActionDialog(game, dialogGroupData, id) {
    var dialogData = dialogGroupData.dialogs.find(function (item) { return item.id == id });

    var dialogInstance = new ActionDialog(
        game,
        dialogData.id,
        dialogData.text,
        dialogData.imageKey,
        dialogData.buttons);

    game.stage.addChild(dialogInstance);
    dialogInstance.open();
    //return dialogInstance;
}

//=========================================================
function ActionDialog(game, id, messageText, imageKey, buttonData) {
    BaseDialog.call(this, game);

    var data = null;

    // Modal
    var modalBackground = new DialogModalBackground(game);
    this.addChild(modalBackground);

    // Message
    var dialogMessage = new DialogMessage(game, messageText, imageKey);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    this.addChild(dialogMessage);

     // Buttons for [Cancel] [Action]
    data = null;
    var dialogCancel = new DialogButtonThin(game, "Cancel", 280);
    dialogCancel.alignTo(dialogMessage, Phaser.BOTTOM_LEFT, -10, 10);
    dialogCancel.buttonInput.events.onInputUp.add(this.processAction(null), this);
    this.addChild(dialogCancel);

    data = buttonData[0];
    var dialogAction = new DialogButtonThin(game, data.text, 280);
    dialogAction.alignTo(dialogMessage, Phaser.BOTTOM_RIGHT, -10, 10)
    dialogAction.buttonInput.events.onInputUp.add(this.processAction(data), this);
    this.addChild(dialogAction);
}

ActionDialog.prototype = Object.create(BaseDialog.prototype);
ActionDialog.prototype.constructor = ActionDialog;
