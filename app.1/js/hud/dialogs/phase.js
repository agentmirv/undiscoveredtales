/* global Phaser */
//=========================================================
function MakePhaseDialog(game, phase) {
    var dialogInstance = new PhaseDialog(game, phase);

    game.stage.addChild(dialogInstance);
    dialogInstance.open();
    
    return dialogInstance;
}

//=========================================================
function PhaseDialog(game, phase) {
    BaseDialog.call(this, game);

    this.onCancel = new Phaser.Signal();
    this.onConfirm = new Phaser.Signal();

    // Modal
    var modalBackground = new DialogModalBackground(game);
    this.addChild(modalBackground);

    // Message
    var dialogMessage = new DialogMessage(game, "End the Player Phase?", null);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    this.addChild(dialogMessage);

    // Buttons for [Cancel] [Confirm]
    var dialogCancel = new DialogButtonThin(game, "Cancel", 280);
    dialogCancel.alignTo(dialogMessage, Phaser.BOTTOM_LEFT, -10, 10);
    dialogCancel.buttonInput.events.onInputUp.add(function () {
        this.onClose.addOnce(function () {
            this.onCancel.dispatch();
        }, this);
        this.close();
    }, this);
    this.addChild(dialogCancel);

    var dialogConfirm = new DialogButtonThin(game, "Confirm", 280);
    dialogConfirm.alignTo(dialogMessage, Phaser.BOTTOM_RIGHT, -10, 10)
    dialogConfirm.buttonInput.events.onInputUp.add(function () {
        this.onClose.addOnce(function () {
            this.onConfirm.dispatch();
        }, this);
        this.close();
    }, this);
    this.addChild(dialogConfirm);
}

PhaseDialog.prototype = Object.create(BaseDialog.prototype);
PhaseDialog.prototype.constructor = PhaseDialog;
