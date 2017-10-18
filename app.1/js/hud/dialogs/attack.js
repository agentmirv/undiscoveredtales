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

    var weaponButtonData = [
        { text: "@ Attack with a Heavy Weapon", weapon: "heavy-weapon" },
        { text: "@ Attack with a Bladed Weapon", weapon: "bladed-weapon" },
        { text: "@ Attack with a Firearm", weapon: "firearm" },
        { text: "@ Attack with a Spell", weapon: "spell" },
        { text: "@ Attack with a Unarmed", weapon: "unarmed" },
        { text: "Cancel", weapon: null }
    ]

    for (var i = 0; i < weaponButtonData.length; i++) {
        weaponData = weaponButtonData[i];

        var attackButton = new DialogButtonMedium(game, weaponData.text, 520);
        attackButton.alignTo(textDialog, Phaser.BOTTOM_CENTER, 0, 28 + (65 * i));
        attackButton.buttonInput.events.onInputUp.add(function () {
            this.onClose.addOnce(function () {
                // TODO
            }, this);
            this.close();
        }, this);
        this.addChild(attackButton);
    }
}

PlayerAttackDialog.prototype = Object.create(BaseDialog.prototype);
PlayerAttackDialog.prototype.constructor = PlayerAttackDialog;
