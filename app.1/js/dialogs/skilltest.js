/* global Phaser */
//=========================================================
function MakeSkillTestDialog(game, dialogData, dialogGroup) {
    var dialogInstance = new SkillTestDialog(game, dialogData, dialogGroup);

    game.stage.addChild(dialogInstance);
    dialogInstance.open();
}

//=========================================================
function SkillTestDialog(game, dialogData, dialogGroup) {
    BaseDialog.call(this, game);

    if (!dialogData.hasOwnProperty("savedSuccesses"))
    {
        dialogData.savedSuccesses = 0;
    }

    // Modal
    var modalBackground = new DialogModalBackground(game);
    this.addChild(modalBackground);

    // Message
    var dialogMessage = new DialogMessage(game, dialogData.text, dialogData.imageKey);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY);
    this.addChild(dialogMessage);

    var successCount = 0;
    
    //=========================================================
    // Display number
    var numberBox = new OutlineBox(game, 50, 50)
    numberBox.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10);
    this.addChild(numberBox);

    var textStyle = { font: "30px Times New Romans", fill: "#ffffff", align: "center" };
    var numberText = game.make.text(0, 0, successCount, textStyle);
    this.redrawCount(successCount, numberText, numberBox);
    this.addChild(numberText);

    //=========================================================
    // Subtract number
    var subtractNumber = new OutlineBox(game, 50, 50)
    subtractNumber.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, -60, 10);
    this.addChild(subtractNumber);

    var subtractText = game.make.text(0, 0, "-", textStyle);
    subtractText.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, -59, 16);
    this.addChild(subtractText);

    var subtractNumberButton = new DialogButtonInput(game, subtractNumber);
    subtractNumberButton.events.onInputUp.add(function () {
        if(successCount > 0) {
            successCount--;
            this.redrawCount(successCount, numberText, numberBox);
        }
    }, this);
    this.addChild(subtractNumberButton);

    //=========================================================
    // Add number
    var addNumber = new OutlineBox(game, 50, 50)
    addNumber.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 60, 10);
    this.addChild(addNumber);

    var addText = game.make.text(0, 0, "+", textStyle);
    addText.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 61, 18);
    this.addChild(addText);

    var addNumberButton = new DialogButtonInput(game, addNumber);
    addNumberButton.events.onInputUp.add(function () {
        successCount++;
        this.redrawCount(successCount, numberText, numberBox);
    }, this);
    this.addChild(addNumberButton);

    //=========================================================
    // Confirm
    var dialogContinue = new DialogButtonThin(game, "Confirm", 150);
    dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 90);
    this.addChild(dialogContinue);

    var confirmButton = game.make.sprite(dialogContinue.x, dialogContinue.y, 'pixelTransparent');
    confirmButton.width = dialogContinue.width;
    confirmButton.height = dialogContinue.height;
    confirmButton.inputEnabled = true;
    confirmButton.events.onInputUp.add(function () {
        var data = { "actions": [], "dialogGroup": dialogGroup };
        dialogData.savedSuccesses += successCount;
        if (dialogData.savedSuccesses >= dialogData.skillTarget) {
            data.actions = dialogData.successActions;
            this.processActions(data).call(this);
        } else { 
            data.actions = dialogData.failActions;
            this.processActions(data).call(this);;
        }
    }, this);
    this.addChild(confirmButton);
}

SkillTestDialog.prototype = Object.create(BaseDialog.prototype);
SkillTestDialog.prototype.constructor = SkillTestDialog;

SkillTestDialog.prototype.redrawCount = function(count, text, box) {
    text.setText(count);
    text.alignIn(box, Phaser.CENTER, 0, 3);
    text.x = Math.floor(text.x);
    text.y = Math.floor(text.y);
}