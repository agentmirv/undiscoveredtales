/* global Phaser */
//=========================================================
function MakeCustomDialog(game, dialogData, dialogGroup) {
    var dialogInstance = new CustomDialog(game, dialogData, dialogGroup);

    game.stage.addChild(dialogInstance);
    dialogInstance.open();
}

//=========================================================
function CustomDialog(game, dialogData, dialogGroup) {
    BaseDialog.call(this, game);

    // Modal
    var modalBackground = new DialogModalBackground(game);
    this.addChild(modalBackground);

    // Message
    var dialogMessage = new DialogMessage(game, dialogData.text, dialogData.imageKey);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    this.addChild(dialogMessage);

    // Custom Buttons
    var buttonYOffset = 10;
    for (var i = 0; i < dialogData.buttons.length; i++) {
        var data = dialogData.buttons[i]
        data.dialogGroup = dialogGroup;
        var customButton = new DialogButtonMedium(game, data.text, 500);
        customButton.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, buttonYOffset)
        customButton.buttonInput.events.onInputUp.add(this.processActions(data), this);
        this.addChild(customButton);
        buttonYOffset += 53;
    }
}

CustomDialog.prototype = Object.create(BaseDialog.prototype);
CustomDialog.prototype.constructor = CustomDialog;
