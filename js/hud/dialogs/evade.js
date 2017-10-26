//=========================================================
function MakeEvadeConfirmDialog(game, evadeData, doneSignal, dialogLayer) {
    var dialogInstance = new EvadeConfirmDialog(game, evadeData, doneSignal, dialogLayer);

    dialogLayer.addChild(dialogInstance);
    dialogInstance.open();
    
    return dialogInstance;
}

//=========================================================
function EvadeConfirmDialog(game, evadeData, doneSignal, dialogLayer) {
    BaseDialog.call(this, game);

    var dialogRect = new Phaser.Rectangle(96 * 3, 16, game.stageViewRect.width - 96 * 3, game.stageViewRect.height);

    // Text
    var textDialog = new DialogMessageMonster(game, "Resolve an Evade check?", 600);
    textDialog.alignIn(dialogRect, Phaser.TOP_CENTER, 0, 0);
    this.addChild(textDialog);

    var confirmButton = new DialogButtonMedium(game, "Confirm", 520);
    confirmButton.alignTo(textDialog, Phaser.BOTTOM_CENTER, 0, 28)
    confirmButton.buttonInput.events.onInputUp.add(function () {
        this.onClose.addOnce(function () {
            var dialogInstance = new EvadeDialog(game, evadeData.text);
            dialogLayer.addChild(dialogInstance);
            dialogInstance.open();
            dialogInstance.onClose.addOnce(function () {
                doneSignal.dispatch();
            }, this);
        }, this);
        this.close();
    }, this);
    this.addChild(confirmButton);

    var cancelButton = new DialogButtonMedium(game, "Cancel", 520);
    cancelButton.alignTo(confirmButton, Phaser.BOTTOM_CENTER, 0, 28)
    cancelButton.buttonInput.events.onInputUp.add(function () {
        this.onClose.addOnce(function () {
            doneSignal.dispatch();
        }, this);
        this.close();
    }, this);
    this.addChild(cancelButton);
}

EvadeConfirmDialog.prototype = Object.create(BaseDialog.prototype);
EvadeConfirmDialog.prototype.constructor = EvadeConfirmDialog;

//=========================================================
function EvadeDialog(game, text) { 
    BaseDialog.call(this, game);

    var dialogRect = new Phaser.Rectangle(96 * 3, 16, game.stageViewRect.width - 96 * 3, game.stageViewRect.height);

    // Text
    var textDialog = new DialogMessageMonster(game, text, 600);
    textDialog.alignIn(dialogRect, Phaser.TOP_CENTER, 0, 0);
    this.addChild(textDialog);

    var continueButton = new DialogButtonMedium(game, "Continue", 520);
    continueButton.alignTo(textDialog, Phaser.BOTTOM_CENTER, 0, 28)
    continueButton.buttonInput.events.onInputUp.add(function () {
        this.close();
    }, this);
    this.addChild(continueButton);
}

EvadeDialog.prototype = Object.create(BaseDialog.prototype);
EvadeDialog.prototype.constructor = EvadeDialog;
