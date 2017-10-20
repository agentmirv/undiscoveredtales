/* global Phaser */
//=========================================================
function MakeStatementDialog(game, dialogData, dialogGroup) {
    var dialogInstance = new StatementDialog(game, dialogData, dialogGroup);

    game.stage.addChild(dialogInstance);
    dialogInstance.open();
}

//=========================================================
function StatementDialog(game, dialogData, dialogGroup) { 
    BaseDialog.call(this, game);

    var data = null;

    // Modal
    var modalBackground = new DialogModalBackground(game);
    this.addChild(modalBackground);

    // Message
    var dialogMessage = new DialogMessage(game, dialogData.text, dialogData.imageKey);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    this.addChild(dialogMessage);

     // Button for [Continue]
    data = dialogData.buttons[0] || {};
    data.dialogGroup = dialogGroup;
    var dialogContinue = new DialogButtonThin(game, "Continue", 180);
    dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
    dialogContinue.buttonInput.events.onInputUp.add(this.processActions(data), this);
    this.addChild(dialogContinue);
}

StatementDialog.prototype = Object.create(BaseDialog.prototype);
StatementDialog.prototype.constructor = StatementDialog;
