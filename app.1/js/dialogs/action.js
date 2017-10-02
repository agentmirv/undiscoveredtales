/* global Phaser */
//=========================================================
function MakeActionDialog(game, dialogData, dialogGroup) {
    var dialogInstance = new ActionDialog(game, dialogData, dialogGroup);

    game.stage.addChild(dialogInstance);
    dialogInstance.open();
}

//=========================================================
function ActionDialog(game, dialogData, dialogGroup) {
    BaseDialog.call(this, game);

    var data = null;

    // Modal
    var modalBackground = new DialogModalBackground(game);
    this.addChild(modalBackground);

    // Message
    var dialogMessage = new DialogMessage(game, dialogData.text, dialogData.imageKey);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    this.addChild(dialogMessage);

     // Buttons for [Cancel] [Action]
    data = null;
    var dialogCancel = new DialogButtonThin(game, "Cancel", 280);
    dialogCancel.alignTo(dialogMessage, Phaser.BOTTOM_LEFT, -10, 10);
    dialogCancel.buttonInput.events.onInputUp.add(this.processActions(data), this);
    this.addChild(dialogCancel);

    data = dialogData.buttons[0];
    data.dialogGroup = dialogGroup;
    var dialogAction = new DialogButtonThin(game, data.text, 280);
    dialogAction.alignTo(dialogMessage, Phaser.BOTTOM_RIGHT, -10, 10)
    dialogAction.buttonInput.events.onInputUp.add(this.processActions(data), this);
    this.addChild(dialogAction);
}

ActionDialog.prototype = Object.create(BaseDialog.prototype);
ActionDialog.prototype.constructor = ActionDialog;
