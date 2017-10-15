/* global Phaser */
//=========================================================
function MakeHorrorDialog(game) {
    var dialogInstance = new HorrorDialog(game);

    game.stage.addChild(dialogInstance);
    dialogInstance.open();
}

//=========================================================
function HorrorDialog(game, dialogData, dialogGroup) { 
    BaseDialog.call(this, game);

    //this.onContinue = Phaser.Signal();

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
        //this.onClose.addOnce(function () {
        //    this.onContinue.dispatch();
        //}, this);
        this.close();
    }, this);
    this.addChild(dialogContinue);
}

HorrorDialog.prototype = Object.create(BaseDialog.prototype);
HorrorDialog.prototype.constructor = HorrorDialog;
