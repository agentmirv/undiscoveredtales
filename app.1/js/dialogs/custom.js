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

        //var dialogContinueButton = game.make.sprite(dialogContinue.x, dialogContinue.y, 'pixelTransparent');
        //dialogContinueButton.width = dialogContinue.width;
        //dialogContinueButton.height = dialogContinue.height;
        //dialogContinueButton.inputEnabled = true;
        //dialogContinueButton.events.onInputUp.add(this.buttonClicked, this);
        //dialogContinueButton.data = data
        //this.addChild(dialogContinueButton);
    }


    // Buttons for [Cancel] [Action]
    //data = null;
    //var dialogCancel = new DialogButtonThin(game, "Cancel", 280);
    //dialogCancel.alignTo(dialogMessage, Phaser.BOTTOM_LEFT, -10, 10);
    //dialogCancel.buttonInput.events.onInputUp.add(this.processActions(data), this);
    //this.addChild(dialogCancel);

    //data = dialogData.buttons[0] || {};
    //data.dialogGroup = dialogGroup;
    //var dialogAction = new DialogButtonThin(game, data.text, 280);
    //dialogAction.alignTo(dialogMessage, Phaser.BOTTOM_RIGHT, -10, 10)
    //dialogAction.buttonInput.events.onInputUp.add(this.processActions(data), this);
    //this.addChild(dialogAction);
}

CustomDialog.prototype = Object.create(BaseDialog.prototype);
CustomDialog.prototype.constructor = CustomDialog;
