//=========================================================
function MakePlayerAttackDialog(game) {
    var dialogInstance = new PlayerAttackDialog(game)

    game.stage.addChild(dialogInstance);
    dialogInstance.open();
    
    return dialogInstance;
}

//=========================================================
function PlayerAttackDialog(game) {
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
                // TODO
                console.log("Weapon: ", button.weaponType);
            }, this);
            this.close();
        }, this);
        this.addChild(attackButton);
    }
}

PlayerAttackDialog.prototype = Object.create(BaseDialog.prototype);
PlayerAttackDialog.prototype.constructor = PlayerAttackDialog;
