/* global Phaser */
//=========================================================
function MakeStatementDialog(game, dialogGroupData, id) {
    var dialogData = dialogGroupData.dialogs.find(function (item) { return item.id == id });

    var dialogInstance = new StatementDialog(
        game,
        dialogData.id,
        dialogData.text,
        dialogData.imageKey,
        dialogData.buttons);

    game.stage.addChild(dialogInstance);
    dialogInstance.open();
}

//=========================================================
function StatementDialog(game, id, messageText, imageKey, buttonData) {
    BaseDialog.call(this, game);

    var data = null;

    // Modal
    var modalBackground = new DialogModalBackground(game);
    this.addChild(modalBackground);

    // Message
    var dialogMessage = new DialogMessage(game, messageText, imageKey);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    this.addChild(dialogMessage);

     // Button for [Continue]
    data = buttonData[0];
    var dialogContinue = new DialogButtonThin(game, "Continue", 180);
    dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
    dialogContinue.buttonInput.events.onInputUp.add(this.processActions(data), this);
    this.addChild(dialogContinue);
}

StatementDialog.prototype = Object.create(BaseDialog.prototype);
StatementDialog.prototype.constructor = StatementDialog;
