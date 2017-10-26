/* global Phaser */
//=========================================================
function MakeRevealDialog(game, revealDialogData, revealGroup, imageKey) {
    var dialogInstance = new RevealDialog(game, revealDialogData, revealGroup, imageKey);

    game.stage.addChild(dialogInstance);
    dialogInstance.open();
}

//=========================================================
function RevealDialog(game, revealDialogData, revealGroup, imageKey) {
    BaseDialog.call(this, game);

    var data = null;

    // Modal
    var modalBackground = new DialogModalBackground(game);
    this.addChild(modalBackground);

    if (imageKey != null) {
        // Reveal Image
        var revealPointer = game.make.image(0, 0, ImageHelper.getImage(game, imageKey))
        revealPointer.alignIn(game.stageViewRect, Phaser.CENTER, 0, -208 + 48 - game.presentationOffsetY)
        this.addChild(revealPointer);
    
        // Reveal Pointer
        var revealPointer = game.make.image(0, 0, 'revealPointer')
        revealPointer.alignIn(game.stageViewRect, Phaser.CENTER, 0, -48 - 48 + 4 - game.presentationOffsetY)
        this.addChild(revealPointer);
    }
    
    // Message
    var dialogMessage = new DialogMessage(game, revealDialogData.text, null);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    this.addChild(dialogMessage);
 
     // Button for [Continue]
    data = { "actions": [{  "type": "continueReveal" }], "revealGroup": revealGroup };
    if (Array.isArray(revealDialogData.actions)) {
        data.actions = revealDialogData.actions.concat(data.actions)
    }
    var dialogContinue = new DialogButtonThin(game, "Continue", 180);
    dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
    dialogContinue.buttonInput.events.onInputUp.add(this.processActions(data), this);
    this.addChild(dialogContinue);
}

RevealDialog.prototype = Object.create(BaseDialog.prototype);
RevealDialog.prototype.constructor = RevealDialog;
