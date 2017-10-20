//=========================================================
function MakePlayerAttackDialog(game, doneSignal, dialogLayer) {
    var dialogInstance = new PlayerAttackDialog(game, doneSignal, dialogLayer)

    dialogLayer.addChild(dialogInstance);
    dialogInstance.open();
    
    return dialogInstance;
}

//=========================================================
function PlayerAttackDialog(game, doneSignal, dialogLayer) {
    BaseDialog.call(this, game);
    var dialogRect = new Phaser.Rectangle(96 * 3, 16, game.stageViewRect.width - 96 * 3, game.stageViewRect.height)

    var text = "What type of weapon will you attack with?"

    // Weapon Select Text
    var textDialog = new DialogMessageMonster(game, text, 600);
    textDialog.alignIn(dialogRect, Phaser.TOP_CENTER, 0, 0);
    this.addChild(textDialog);

    var weaponList = [
        { text: "@ Attack with a Heavy Weapon", type: "heavy-weapon" },
        { text: "@ Attack with a Bladed Weapon", type: "bladed-weapon" },
        { text: "@ Attack with a Firearm", type: "firearm" },
        { text: "@ Attack with a Spell", type: "spell" },
        { text: "@ Attack with a Unarmed", type: "unarmed" },
        { text: "Cancel", type: null }
    ]

    for (var i = 0; i < weaponList.length; i++) {
        var weaponText = weaponList[i].text;
        var weaponType = weaponList[i].type;
        var attackButton = new DialogButtonMedium(game, weaponText, 520);
        attackButton.buttonInput.weaponType = weaponType;
        attackButton.alignTo(textDialog, Phaser.BOTTOM_CENTER, 0, 28 + (65 * i));
        attackButton.buttonInput.events.onInputUp.addOnce(function (button, pointer) {
            this.onClose.addOnce(function () {
                // TODO: Weapon -> Monster Type matrix?
                if (button.weaponType != null) {
                    var deckName = button.weaponType + "-deck"
                    if (!this.game.hud.attacks.hasOwnProperty(deckName) || this.game.hud.attacks[deckName].length == 0)
                    {
                        var attacks = game.gamedata.attacks.filter(function (item) { return item.type == button.weaponType });
                        this.game.hud.attacks[deckName] = Helper.shuffle(attacks.slice(0));
                    }
                    var attackData = this.game.hud.attacks[deckName].pop();
                    var dialogInstance = new AttackDialog(game, attackData.text);
                    dialogLayer.addChild(dialogInstance);
                    dialogInstance.open();
                    dialogInstance.onClose.addOnce(function () {
                        doneSignal.dispatch();
                    }, this);
                } else {
                    doneSignal.dispatch();
                }
            }, this);
            this.close();
        }, this);
        this.addChild(attackButton);
    }
}

PlayerAttackDialog.prototype = Object.create(BaseDialog.prototype);
PlayerAttackDialog.prototype.constructor = PlayerAttackDialog;

//=========================================================
function AttackDialog(game, text) { 
    BaseDialog.call(this, game);

    var dialogRect = new Phaser.Rectangle(96 * 3, 16, game.stageViewRect.width - 96 * 3, game.stageViewRect.height);

    // Text
    var textDialog = new DialogMessageMonster(game, text, 600);
    textDialog.alignIn(dialogRect, Phaser.TOP_CENTER, 0, 0);
    this.addChild(textDialog);

    var continueButton = new DialogButtonMedium(game, "Continue", 520);
    continueButton.alignTo(textDialog, Phaser.BOTTOM_CENTER, 0, 28)
    continueButton.buttonInput.events.onInputUp.add(function () {
        this.close();
    }, this);
    this.addChild(continueButton);
}

AttackDialog.prototype = Object.create(BaseDialog.prototype);
AttackDialog.prototype.constructor = AttackDialog;
