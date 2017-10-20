/* global Phaser */
//=========================================================
function MakeHorrorDialog(game) {
    var dialogInstance = new HorrorDialog(game);

    game.stage.addChild(dialogInstance);
    dialogInstance.open();
}

//=========================================================
function HorrorDialog(game) { 
    BaseDialog.call(this, game);

    var text = "Each investigator must resolve a horror check against the monster within range with the highest horror rating. After all horror checks have been resolved, tap the end phase button to continue."

    // Modal
    var modalBackground = new DialogModalBackground(game);
    this.addChild(modalBackground);

    // Message
    var dialogMessage = new DialogMessage(game, text, null);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    this.addChild(dialogMessage);

     // Button for [Continue]
    var dialogContinue = new DialogButtonThin(game, "Continue", 180);
    dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
    dialogContinue.buttonInput.events.onInputUp.add(function () {
        this.close();
    }, this);
    this.addChild(dialogContinue);
}

HorrorDialog.prototype = Object.create(BaseDialog.prototype);
HorrorDialog.prototype.constructor = HorrorDialog;

/* global Phaser */
//=========================================================
function MakeHorrorCheckConfirmDialog(game) {
    var dialogInstance = new HorrorCheckConfirmDialog(game);

    game.stage.addChild(dialogInstance);
    dialogInstance.open();
    
    return dialogInstance;
}

//=========================================================
function HorrorCheckConfirmDialog(game) {
    BaseDialog.call(this, game);

    this.onCancel = new Phaser.Signal();
    this.onConfirm = new Phaser.Signal();
    
    var text = "Resolve a Horror check?";
    
    // Modal
    var modalBackground = new DialogModalBackground(game);
    this.addChild(modalBackground);

    // Message
    var dialogMessage = new DialogMessage(game, text, null);
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

HorrorCheckConfirmDialog.prototype = Object.create(BaseDialog.prototype);
HorrorCheckConfirmDialog.prototype.constructor = HorrorCheckConfirmDialog;

//=========================================================
function MakeHorrorCheckDialog(game, text) {
    var dialogInstance = new HorrorCheckDialog(game, text);

    game.stage.addChild(dialogInstance);
    dialogInstance.open();
}

//=========================================================
function HorrorCheckDialog(game, text) { 
    BaseDialog.call(this, game);

    // Modal
    var modalBackground = new DialogModalBackground(game);
    this.addChild(modalBackground);

    // Message
    var dialogMessage = new DialogMessage(game, text, null);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    this.addChild(dialogMessage);

     // Button for [Continue]
    var dialogContinue = new DialogButtonThin(game, "Continue", 180);
    dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
    dialogContinue.buttonInput.events.onInputUp.add(function () {
        this.close();
    }, this);
    this.addChild(dialogContinue);
}

HorrorCheckDialog.prototype = Object.create(BaseDialog.prototype);
HorrorCheckDialog.prototype.constructor = HorrorCheckDialog;
