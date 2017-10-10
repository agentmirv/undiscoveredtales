/* global Phaser */
//=========================================================
function MakeRandomEventDialog(game, dialogData, dialogGroup) {
    var dialogInstance = new RandomEventDialog(game, dialogData, dialogGroup);

    game.stage.addChild(dialogInstance);
    dialogInstance.open();
}

//=========================================================
function RandomEventDialog(game, dialogData, dialogGroup) {
    BaseDialog.call(this, game);

    var data = null;

    // Modal
    var modalBackground = new DialogModalBackground(game);
    this.addChild(modalBackground);

    // Message
    var dialogMessage = new DialogMessage(game, dialogData.text, dialogData.imageKey);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    this.addChild(dialogMessage);

    if (dialogData.type == "resolve") {
        // Buttons for [No Effect] [Resolve Effect]
        data = {};
        data.dialogGroup = dialogGroup;
        var dialogCancel = new DialogButtonThin(game, "No Effect", 280);
        dialogCancel.alignTo(dialogMessage, Phaser.BOTTOM_LEFT, -10, 10);
        dialogCancel.buttonInput.events.onInputUp.add(function () {
            this.onClose.addOnce(function () {
                dialogGroup.doneSignal.dispatch();
            }, this);
            this.close();
        }, this);
        this.addChild(dialogCancel);
    
        data = {};
        data.dialogGroup = dialogGroup;
        var dialogAction = new DialogButtonThin(game, "Resolve Effect", 280);
        dialogAction.alignTo(dialogMessage, Phaser.BOTTOM_RIGHT, -10, 10)
        dialogAction.buttonInput.events.onInputUp.add(function () {
            this.onClose.addOnce(function () {
                var randomEventDialog = dialogGroup.dialogs.find(function (item) { return item.id == "resolve" });
                MakeRandomEventDialog(this.game, randomEventDialog, dialogGroup);
            }, this);
            this.close();
        }, this);
        this.addChild(dialogAction);
        
    } else {
        // Button for [Continue]
        data = {};
        data.dialogGroup = dialogGroup;
        var dialogContinue = new DialogButtonThin(game, "Continue", 180);
        dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
        dialogContinue.buttonInput.events.onInputUp.add(function () {
            this.onClose.addOnce(function () {
                dialogGroup.doneSignal.dispatch();
            }, this);
            this.close();
        }, this);
        this.addChild(dialogContinue);
    }
}

RandomEventDialog.prototype = Object.create(BaseDialog.prototype);
RandomEventDialog.prototype.constructor = RandomEventDialog;
