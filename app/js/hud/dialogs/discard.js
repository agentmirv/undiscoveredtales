//=========================================================
function MakeDiscardDialog(game, monster, dialogLayer) {
    var dialogInstance = new DiscardDialog(game, monster,  dialogLayer);

    dialogLayer.addChild(dialogInstance);
    dialogInstance.open();
    
    return dialogInstance;
}

//=========================================================
function DiscardDialog(game, monster, dialogLayer) {
    BaseDialog.call(this, game);
    this.onConfirm = new Phaser.Signal();
    this.onCancel = new Phaser.Signal();

    var dialogRect = new Phaser.Rectangle(96 * 3, 16, game.stageViewRect.width - 96 * 3, game.stageViewRect.height);

    // Text
    var textDialog = new DialogMessageMonster(game, "Are you sure you wish to discard the " + monster.name + "?", 600);
    textDialog.alignIn(dialogRect, Phaser.TOP_CENTER, 0, 0);
    this.addChild(textDialog);

    var confirmButton = new DialogButtonMedium(game, "Confirm", 520);
    confirmButton.alignTo(textDialog, Phaser.BOTTOM_CENTER, 0, 28)
    confirmButton.buttonInput.events.onInputUp.add(function () {
        this.onClose.addOnce(function () {
            this.onConfirm.dispatch();
        }, this);
        this.close();
    }, this);
    this.addChild(confirmButton);

    var cancelButton = new DialogButtonMedium(game, "Cancel", 520);
    cancelButton.alignTo(confirmButton, Phaser.BOTTOM_CENTER, 0, 28)
    cancelButton.buttonInput.events.onInputUp.add(function () {
        this.onClose.addOnce(function () {
            this.onCancel.dispatch();
        }, this);
        this.closeImmediately();
    }, this);
    this.addChild(cancelButton);
}

DiscardDialog.prototype = Object.create(BaseDialog.prototype);
DiscardDialog.prototype.constructor = DiscardDialog;
