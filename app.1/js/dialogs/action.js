/* global Phaser */
//=========================================================
function MakeActionDialog(game, dialogGroupData, id) {
    var dialogData = dialogGroupData.dialogs.find(function (item) { return item.id == id });

    var dialogInstance = new ActionDialog(
        game,
        dialogData.id,
        dialogData.text,
        dialogData.imageKey,
        dialogData.buttons);

    game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    game.stage.addChild(dialogInstance);
    //return dialogInstance;
}

//=========================================================
function ActionDialog(game, id, messageText, imageKey, buttonData) {
    Phaser.Group.call(this, game);

    this._id = id
    this._buttonData = buttonData;

    // Modal
    var modalBackground = game.make.sprite(game.stageViewRect.x, game.stageViewRect.y, 'pixelTransparent');
    modalBackground.width = game.stageViewRect.width;
    modalBackground.height = game.stageViewRect.height;
    modalBackground.inputEnabled = true;
    this.addChild(modalBackground);

    // Message
    var dialogMessage = new DialogMessage(game, messageText, imageKey);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    this.addChild(dialogMessage);

     // Buttons for [Cancel] [Action]
    var data = this._buttonData[0]
    var dialogCancel = new DialogButtonThin(game, "Cancel", 280);
    dialogCancel.alignTo(dialogMessage, Phaser.BOTTOM_LEFT, -10, 10)
    this.addChild(dialogCancel);

    var dialogAction = new DialogButtonThin(game, data.text, 280);
    dialogAction.alignTo(dialogMessage, Phaser.BOTTOM_RIGHT, -10, 10)
    this.addChild(dialogAction);

    var dialogCancelButton = game.make.sprite(dialogCancel.x, dialogCancel.y, 'pixelTransparent');
    dialogCancelButton.width = dialogCancel.width;
    dialogCancelButton.height = dialogCancel.height;
    dialogCancelButton.inputEnabled = true;
    dialogCancelButton.events.onInputUp.add(this.cancelClicked, this);
    this.addChild(dialogCancelButton);

    var dialogActionButton = game.make.sprite(dialogAction.x, dialogAction.y, 'pixelTransparent');
    dialogActionButton.width = dialogAction.width;
    dialogActionButton.height = dialogAction.height;
    dialogActionButton.inputEnabled = true;
    dialogActionButton.events.onInputUp.add(this.buttonClicked, this);
    dialogActionButton.data = data; //dynamic property
    this.addChild(dialogActionButton);
}

ActionDialog.prototype = Object.create(Phaser.Group.prototype);
ActionDialog.prototype.constructor = ActionDialog;
