function MakeMonsterAttackDialog(game, attackData) {
    var dialogInstance = new MonsterAttackDialog(game, attackData);

    game.stage.addChild(dialogInstance);
    dialogInstance.open();
    
    return dialogInstance;
}

function MonsterAttackDialog(game, attackData) {
    BaseDialog.call(this, game);
    this.onNext = new Phaser.Signal();
    
    var dialogRect = new Phaser.Rectangle(96 * 3, 16, game.stageViewRect.width - 96 * 3, game.stageViewRect.height);

    // Text
    var moveTextDialog = new DialogMessageMonster(game, attackData.text, 600);
    moveTextDialog.alignIn(dialogRect, Phaser.TOP_CENTER, 0, 0);
    this.addChild(moveTextDialog);

    var attackButton = new DialogButtonMedium(game, attackData.attack.button, 520);
    attackButton.alignTo(moveTextDialog, Phaser.BOTTOM_CENTER, 0, 28)
    attackButton.buttonInput.events.onInputUp.add(function () {
        this.onClose.addOnce(function () {
            this.onNext.dispatch();
        }, this);
        this.close();
    }, this);
    this.addChild(attackButton);

    var nonAttackButton = new DialogButtonMedium(game, attackData.nonAttack.button, 520);
    nonAttackButton.alignTo(attackButton, Phaser.BOTTOM_CENTER, 0, 28)
    nonAttackButton.buttonInput.events.onInputUp.add(function () {
        this.onClose.addOnce(function () {
            this.onNext.dispatch();
        }, this);
        this.close();
    }, this);
    this.addChild(nonAttackButton);
}

MonsterAttackDialog.prototype = Object.create(BaseDialog.prototype);
MonsterAttackDialog.prototype.constructor = MonsterAttackDialog;
