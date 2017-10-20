/* global Phaser */
//=========================================================
function MakeFireDialog(game) {
    var dialogInstance = new FireDialog(game);

    game.stage.addChild(dialogInstance);
    dialogInstance.open();
    
    return dialogInstance;
}

//=========================================================
function FireDialog(game) {
    BaseDialog.call(this, game);

    this.onExtinguished = new Phaser.Signal();
    this.onSpreads = new Phaser.Signal();
    
    var text = "The fire spreads out of control. Place Fire in a space adjacent to a space containing Fire.";
    
    // Modal
    var modalBackground = new DialogModalBackground(game);
    this.addChild(modalBackground);

    // Message
    var dialogMessage = new DialogMessage(game, text, null);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    this.addChild(dialogMessage);

    // Buttons for [Cancel] [Confirm]
    var dialogCancel = new DialogButtonThin(game, "Fire Extinguished", 280);
    dialogCancel.alignTo(dialogMessage, Phaser.BOTTOM_LEFT, -10, 10);
    dialogCancel.buttonInput.events.onInputUp.add(function () {
        this.onClose.addOnce(function () {
            this.onExtinguished.dispatch();
        }, this);
        this.close();
    }, this);
    this.addChild(dialogCancel);

    var dialogConfirm = new DialogButtonThin(game, "Fire Spreads", 280);
    dialogConfirm.alignTo(dialogMessage, Phaser.BOTTOM_RIGHT, -10, 10)
    dialogConfirm.buttonInput.events.onInputUp.add(function () {
        this.onClose.addOnce(function () {
            this.onSpreads.dispatch();
        }, this);
        this.close();
    }, this);
    this.addChild(dialogConfirm);
}

FireDialog.prototype = Object.create(BaseDialog.prototype);
FireDialog.prototype.constructor = FireDialog;
