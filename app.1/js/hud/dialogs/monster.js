//=========================================================
function MakeMonsterAttackDialog(game, attackData, nextSignal, dialogLayer) {
    var dialogInstance = new MonsterAttackDialog(game, attackData, nextSignal, dialogLayer);

    dialogLayer.addChild(dialogInstance);
    dialogInstance.open();
    
    return dialogInstance;
}

//=========================================================
function MonsterAttackDialog(game, attackData, nextSignal, dialogLayer) {
    BaseDialog.call(this, game);

    var dialogRect = new Phaser.Rectangle(96 * 3, 16, game.stageViewRect.width - 96 * 3, game.stageViewRect.height);

    // Text
    var moveTextDialog = new DialogMessageMonster(game, attackData.text, 600);
    moveTextDialog.alignIn(dialogRect, Phaser.TOP_CENTER, 0, 0);
    this.addChild(moveTextDialog);

    var attackButton = new DialogButtonMedium(game, attackData.attack.button, 520);
    attackButton.alignTo(moveTextDialog, Phaser.BOTTOM_CENTER, 0, 28)
    attackButton.buttonInput.events.onInputUp.add(function () {
        this.onClose.addOnce(function () {
            if (attackData.attack.hasOwnProperty("text")) {
                var dialogInstance = new MonsterDialog(game, attackData.attack.text, nextSignal);
                dialogLayer.addChild(dialogInstance);
                dialogInstance.open();
            } else {
                nextSignal.dispatch();
            }
        }, this);
        this.close();
    }, this);
    this.addChild(attackButton);

    var nonAttackButton = new DialogButtonMedium(game, attackData.nonAttack.button, 520);
    nonAttackButton.alignTo(attackButton, Phaser.BOTTOM_CENTER, 0, 28)
    nonAttackButton.buttonInput.events.onInputUp.add(function () {
        this.onClose.addOnce(function () {
            if (attackData.nonAttack.hasOwnProperty("text")) {
                var dialogInstance = new MonsterDialog(game, attackData.nonAttack.text, nextSignal);
                dialogLayer.addChild(dialogInstance);
                dialogInstance.open();
            } else {
                nextSignal.dispatch();
            }
        }, this);
        this.close();
    }, this);
    this.addChild(nonAttackButton);
}

MonsterAttackDialog.prototype = Object.create(BaseDialog.prototype);
MonsterAttackDialog.prototype.constructor = MonsterAttackDialog;

//=========================================================
function MakeMonsterDialog(game, dialogData, dialogGroup) {
    // TODO: This is called from a reveal, like the Innsmouth Mob reveal.
    //var dialogInstance = new MonsterDialog(game, dialogData, dialogGroup);

    //game.stage.addChild(dialogInstance);
    //dialogInstance.open();
}

//=========================================================
function MonsterDialog(game, text, nextSignal) { 
    BaseDialog.call(this, game);

    var dialogRect = new Phaser.Rectangle(96 * 3, 16, game.stageViewRect.width - 96 * 3, game.stageViewRect.height);

    // Text
    var moveTextDialog = new DialogMessageMonster(game, text, 600);
    moveTextDialog.alignIn(dialogRect, Phaser.TOP_CENTER, 0, 0);
    this.addChild(moveTextDialog);

    var continueButton = new DialogButtonMedium(game, "Continue", 520);
    continueButton.alignTo(moveTextDialog, Phaser.BOTTOM_CENTER, 0, 28)
    continueButton.buttonInput.events.onInputUp.add(function () {
        this.onClose.addOnce(function () {
            nextSignal.dispatch();
        }, this);
        this.close();
    }, this);
    this.addChild(continueButton);
}

MonsterDialog.prototype = Object.create(BaseDialog.prototype);
MonsterDialog.prototype.constructor = MonsterDialog;
