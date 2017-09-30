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

    game.stage.addChild(dialogInstance);
    dialogInstance.open();
    //return dialogInstance;
}

//=========================================================
function ActionDialog(game, id, messageText, imageKey, buttonData) {
    BaseDialog.call(this, game);

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
    var dialogCancel = new DialogButtonThin(game, "Cancel", 280);
    dialogCancel.alignTo(dialogMessage, Phaser.BOTTOM_LEFT, -10, 10)
    this.addChild(dialogCancel);

    var dialogCancelButton = game.make.sprite(dialogCancel.x, dialogCancel.y, 'pixelTransparent');
    dialogCancelButton.width = dialogCancel.width;
    dialogCancelButton.height = dialogCancel.height;
    dialogCancelButton.inputEnabled = true;
    //dialogCancelButton.events.onInputUp.add(this.cancelClicked, this);
    dialogCancelButton.events.onInputUp.add(function () { 
        this.onClose.addOnce(function () {
            ProcessActions(); 
        }, this);
        this.close();
    }, this);
    this.addChild(dialogCancelButton);

    var data = buttonData[0];
    var dialogAction = new DialogButtonThin(game, data.text, 280);
    dialogAction.alignTo(dialogMessage, Phaser.BOTTOM_RIGHT, -10, 10)
    this.addChild(dialogAction);

    var dialogActionButton = game.make.sprite(dialogAction.x, dialogAction.y, 'pixelTransparent');
    dialogActionButton.width = dialogAction.width;
    dialogActionButton.height = dialogAction.height;
    dialogActionButton.inputEnabled = true;
    //dialogActionButton.events.onInputUp.add(this.buttonClicked, this);
    //dialogActionButton.data = data; //dynamic property
    dialogActionButton.events.onInputUp.add(function () { 
        this.onClose.addOnce(function () {
            ProcessActions(data); 
        }, this);
        this.close();
    }, this);
    this.addChild(dialogActionButton);
}

ActionDialog.prototype = Object.create(BaseDialog.prototype);
ActionDialog.prototype.constructor = ActionDialog;
