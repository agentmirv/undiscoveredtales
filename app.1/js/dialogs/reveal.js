/* global Phaser */
//=========================================================
function MakeRevealDialog(game, revealDialogData, revealGroup, imageKey) {

    var dialogInstance = new RevealDialog(
        game,
        revealDialogData.text,
        imageKey,
        revealGroup);

    game.stage.addChild(dialogInstance);
    dialogInstance.open();
}

//=========================================================
function RevealDialog(game, messageText, imageKey, revealGroup) {
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
    data = { 
            "actions": [
                { 
                    "type": "reveal",
                    "revealGroup": revealGroup
                },
            ],
    };
    var dialogContinue = new DialogButtonThin(game, "Continue", 180);
    dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
    dialogContinue.buttonInput.events.onInputUp.add(this.processActions(data), this);
    this.addChild(dialogContinue);
}

RevealDialog.prototype = Object.create(BaseDialog.prototype);
RevealDialog.prototype.constructor = RevealDialog;
