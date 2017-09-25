//=========================================================
function MakePlayerEvadeDialog(game) {
    var evadeData = game.gamedata.evadeChecks.find(function (item) { return item.monster == game.hud.currentMonsterInstance.monster });

    var playerEvadeDialogGroup = new PlayerEvadeDialogGroup(
        game,
        evadeData.text
    )

    game.add.tween(playerEvadeDialogGroup).from({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
    game.stage.addChild(playerEvadeDialogGroup)

    return playerEvadeDialogGroup
}

function PlayerEvadeDialogGroup(game, text) {
    Phaser.Group.call(this, game);
    var dialogRect = new Phaser.Rectangle(96 * 3, 16, game.stageViewRect.width - 96 * 3, game.stageViewRect.height)
    this._evadeResolved = false;

    // Move Text
    var textDialog = new DialogMessageMonster(game, "Resolve an Evade check?", 600);
    textDialog.alignIn(dialogRect, Phaser.TOP_CENTER, 0, 0)
    this.addChild(textDialog);

    // Confirm Button
    var confirmButtonTextGroup = new DialogButtonMedium(game, "Confirm", 520)
    confirmButtonTextGroup.alignTo(textDialog, Phaser.BOTTOM_CENTER, 0, 28)
    this.addChild(confirmButtonTextGroup);

    var confirmButton = game.make.sprite(confirmButtonTextGroup.x, confirmButtonTextGroup.y, 'pixelTransparent');
    confirmButton.width = confirmButtonTextGroup.width;
    confirmButton.height = confirmButtonTextGroup.height;
    confirmButton.inputEnabled = true;
    confirmButton.events.onInputUp.add(this.confirmButtonClicked, this);
    this.addChild(confirmButton);

    // Cancel Button
    var cancelButtonTextGroup = new DialogButtonMedium(game, "Cancel", 520)
    cancelButtonTextGroup.alignTo(confirmButtonTextGroup, Phaser.BOTTOM_CENTER, 0, 28)
    this.addChild(cancelButtonTextGroup);

    var cancelButton = game.make.sprite(cancelButtonTextGroup.x, cancelButtonTextGroup.y, 'pixelTransparent');
    cancelButton.width = cancelButtonTextGroup.width;
    cancelButton.height = cancelButtonTextGroup.height;
    cancelButton.inputEnabled = true;
    cancelButton.events.onInputUp.add(this.cancelButtonClicked, this);
    this.addChild(cancelButton);

    this._mainGroup = game.make.group(this)
    this._mainGroup.addChild(textDialog)
    this._mainGroup.addChild(confirmButtonTextGroup)
    this._mainGroup.addChild(confirmButton)
    this._mainGroup.addChild(cancelButtonTextGroup)
    this._mainGroup.addChild(cancelButton)

    // Resolve Text
    var resolveTextDialog = new DialogMessageMonster(game, text, 600);
    resolveTextDialog.alignIn(dialogRect, Phaser.TOP_CENTER, 0, 0)
    this.addChild(resolveTextDialog);

    // Resolve Text Continue
    var resolveTextContinue = new DialogButtonThin(game, "Continue", 180);
    resolveTextContinue.alignTo(resolveTextDialog, Phaser.BOTTOM_CENTER, 0, 28)
    this.addChild(resolveTextContinue);

    var resolveTextContinueButton = game.make.sprite(resolveTextContinue.x, resolveTextContinue.y, 'pixelTransparent');
    resolveTextContinueButton.width = resolveTextContinue.width;
    resolveTextContinueButton.height = resolveTextContinue.height;
    resolveTextContinueButton.inputEnabled = true;
    resolveTextContinueButton.events.onInputUp.add(this.resolveContinueButtonClicked, this);
    this.addChild(resolveTextContinueButton);

    this._resolveGroup = game.make.group(this)
    this._resolveGroup.addChild(resolveTextDialog)
    this._resolveGroup.addChild(resolveTextContinue)
    this._resolveGroup.addChild(resolveTextContinueButton)
    this._resolveGroup.visible = false
}

PlayerEvadeDialogGroup.prototype = Object.create(Phaser.Group.prototype);
PlayerEvadeDialogGroup.prototype.constructor = PlayerEvadeDialogGroup;

PlayerEvadeDialogGroup.prototype.confirmButtonClicked = function (button, pointer) {
    if (!this._evadeResolved) {
        this._evadeResolved = true
        var dialog = this
        var fadeOutTween = game.add.tween(this._mainGroup).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
        var fadeInTween = game.add.tween(this._resolveGroup).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, false, 0, 0, false);
        fadeInTween.onStart.addOnce(function () { dialog._resolveGroup.visible = true })
        fadeOutTween.chain(fadeInTween)
    }
}

PlayerEvadeDialogGroup.prototype.cancelButtonClicked = function (button, pointer) {
    var fadeOutTween = game.add.tween(this._mainGroup).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    fadeOutTween.onComplete.addOnce(function () {
        //HudGroup.prototype.monsterAttack()
        game.hud.activeStep = "";
    })
}

PlayerEvadeDialogGroup.prototype.resolveContinueButtonClicked = function (button, pointer) {
    var fadeOutTween = game.add.tween(this._resolveGroup).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    fadeOutTween.onComplete.addOnce(function () {
        //HudGroup.prototype.monsterAttack()
        game.hud.activeStep = "";
    })
}

PlayerEvadeDialogGroup.prototype.hideDialog = function () {
    if (!this._evadeResolved) {
        this._mainGroup.visible = false
    } else {
        this._resolveGroup.visible = false
    }
}

PlayerEvadeDialogGroup.prototype.showDialog = function () {
    if (!this._evadeResolved) {
        this._mainGroup.visible = true
    } else {
        this._resolveGroup.visible = true
    }
}

//=========================================================
function WeaponAttackDialogGroup(game, attackText) {
    Phaser.Group.call(this, game);
    var dialogRect = new Phaser.Rectangle(96 * 3, 16, game.stageViewRect.width - 96 * 3, game.stageViewRect.height)

    // Attack Text
    var attackTextDialog = new DialogMessageMonster(game, attackText, 600);
    attackTextDialog.alignIn(dialogRect, Phaser.TOP_CENTER, 0, 0)
    this.addChild(attackTextDialog);

    // Attack Text Continue
    var attackTextContinue = new DialogButtonThin(game, "Continue", 180);
    attackTextContinue.alignTo(attackTextDialog, Phaser.BOTTOM_CENTER, 0, 28)
    this.addChild(attackTextContinue);

    var attackTextContinueButton = game.make.sprite(attackTextContinue.x, attackTextContinue.y, 'pixelTransparent');
    attackTextContinueButton.width = attackTextContinue.width;
    attackTextContinueButton.height = attackTextContinue.height;
    attackTextContinueButton.inputEnabled = true;
    attackTextContinueButton.events.onInputUp.add(this.contineuButtonClicked, this);
    this.addChild(attackTextContinueButton);
}

WeaponAttackDialogGroup.prototype = Object.create(Phaser.Group.prototype);
WeaponAttackDialogGroup.prototype.constructor = WeaponAttackDialogGroup;

WeaponAttackDialogGroup.prototype.contineuButtonClicked = function () {
    game.hud.activeStep = "";
    this.destroy(true);
}

//=========================================================
function MakePlayerAttackDialog(game) {

    var playerAttackDialogGroup = new PlayerAttackDialogGroup(
        game
    )

    game.add.tween(playerAttackDialogGroup).from({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
    game.stage.addChild(playerAttackDialogGroup)

    return playerAttackDialogGroup
}

function PlayerAttackDialogGroup(game) {
    Phaser.Group.call(this, game);
    var dialogRect = new Phaser.Rectangle(96 * 3, 16, game.stageViewRect.width - 96 * 3, game.stageViewRect.height)
    this._attackResolved = false;

    var moveText = "What type of weapon will you attack with?"

    // Weapon Select Text
    var weaponTextDialog = new DialogMessageMonster(game, moveText, 600);
    weaponTextDialog.alignIn(dialogRect, Phaser.TOP_CENTER, 0, 0)
    this.addChild(weaponTextDialog);

    var weaponButtonData = [
        {
            text: "@ Attack with a Heavy Weapon",
            weapon: "heavy-weapon"
        },
        {
            text: "@ Attack with a Bladed Weapon",
            weapon: "bladed-weapon"
        },
        {
            text: "@ Attack with a Firearm",
            weapon: "firearm"
        },
        {
            text: "@ Attack with a Spell",
            weapon: "spell"
        },
        {
            text: "@ Attack with a Unarmed",
            weapon: "unarmed"
        },
        {
            text: "Cancel",
            weapon: null
        }
    ]

    for (var i = 0; i < weaponButtonData.length; i++) {
        weaponData = weaponButtonData[i]

        var attackButtonTextGroup = new DialogButtonMedium(game, weaponData.text, 520)
        attackButtonTextGroup.alignTo(weaponTextDialog, Phaser.BOTTOM_CENTER, 0, 28 + (65 * i))
        this.addChild(attackButtonTextGroup);

        var attackButton = game.make.sprite(attackButtonTextGroup.x, attackButtonTextGroup.y, 'pixelTransparent');
        attackButton.width = attackButtonTextGroup.width;
        attackButton.height = attackButtonTextGroup.height;
        attackButton.inputEnabled = true;
        attackButton.weapon = weaponData.weapon
        attackButton.events.onInputUp.add(this.attackButtonClicked, this);
        this.addChild(attackButton);
    }
}

PlayerAttackDialogGroup.prototype = Object.create(Phaser.Group.prototype);
PlayerAttackDialogGroup.prototype.constructor = PlayerAttackDialogGroup;

PlayerAttackDialogGroup.prototype.attackButtonClicked = function (button, pointer) {
    if (this._attackResolved == false) {
        this._attackResolved = true
        var weaponAttack = null
        if (button.weapon != null) {
            // if the weapon attack deck is null, repopulate and reshuffle
            // draw weapon attack
            if (button.weapon == "heavy-weapon") {
                if (game.hud.randomAttackHeavyWeapon.length == 0) {
                    game.hud.randomAttackHeavyWeapon = game.gamedata.attacks.filter(function (item) { return item.type == "heavy-weapon" })
                    game.hud.randomAttackHeavyWeapon = Helper.shuffle(game.hud.randomAttackHeavyWeapon)
                }
                weaponAttack = game.hud.randomAttackHeavyWeapon.pop()
            } else if (button.weapon == "bladed-weapon") {
                if (game.hud.randomAttackBladedWeapon.length == 0) {
                    game.hud.randomAttackBladedWeapon = game.gamedata.attacks.filter(function (item) { return item.type == "bladed-weapon" })
                    game.hud.randomAttackBladedWeapon = Helper.shuffle(game.hud.randomAttackBladedWeapon)
                }
                weaponAttack = game.hud.randomAttackBladedWeapon.pop()
            } else if (button.weapon == "firearm") {
                if (game.hud.randomAttackFirearm.length == 0) {
                    game.hud.randomAttackFirearm = game.gamedata.attacks.filter(function (item) { return item.type == "firearm" })
                    game.hud.randomAttackFirearm = Helper.shuffle(game.hud.randomAttackFirearm)
                }
                weaponAttack = game.hud.randomAttackFirearm.pop()
            } else if (button.weapon == "spell") {
                if (game.hud.randomAttackSpell.length == 0) {
                    game.hud.randomAttackSpell = game.gamedata.attacks.filter(function (item) { return item.type == "spell" })
                    game.hud.randomAttackSpell = Helper.shuffle(game.hud.randomAttackSpell)
                }
                weaponAttack = game.hud.randomAttackSpell.pop()
            } else if (button.weapon == "unarmed") {
                if (game.hud.randomAttackUnarmed.length == 0) {
                    game.hud.randomAttackUnarmed = game.gamedata.attacks.filter(function (item) { return item.type == "unarmed" })
                    game.hud.randomAttackUnarmed = Helper.shuffle(game.hud.randomAttackUnarmed)
                }
                weaponAttack = game.hud.randomAttackUnarmed.pop()
            }
        }

        // destroy player attack dialog
        var fadeOutTween = game.add.tween(this).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
        fadeOutTween.onComplete.addOnce(function () {
            this.destroy(true);
            if (weaponAttack != null) {
                // create weapon dialog
                game.hudInstance.playerAttackResolveDialog = new WeaponAttackDialogGroup(game, weaponAttack.text)
                // fade in weapon dialog
                game.add.tween(game.hudInstance.playerAttackResolveDialog).from({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
                game.stage.addChild(game.hudInstance.playerAttackResolveDialog)
            } else {
                game.hud.activeStep = "";
            }
        }, this);
    }
}

//=========================================================
function MakeMonsterDiscardDialog(game) {
    var monsterDiscardDialogGroup = new MonsterDiscardDialogGroup(game)
    game.add.tween(monsterDiscardDialogGroup).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    game.stage.addChild(monsterDiscardDialogGroup)
}

function MonsterDiscardDialogGroup(game) {
    Phaser.Group.call(this, game);

    var dialogRect = new Phaser.Rectangle(96 * 3, 16, game.stageViewRect.width - 96 * 3, game.stageViewRect.height)

    // Modal
    var modalBackground = game.make.sprite(game.stageViewRect.x, game.stageViewRect.y, 'pixelTransparent');
    modalBackground.width = game.stageViewRect.width;
    modalBackground.height = game.stageViewRect.height;
    modalBackground.inputEnabled = true;
    this.addChild(modalBackground);

    // Message
    var messageText = "Are you sure you wish to discard the " + game.hud.currentMonsterInstance.name + "?"
    var dialogMessage = new DialogMessageMonster(game, messageText, 600);
    dialogMessage.alignIn(dialogRect, Phaser.TOP_CENTER, 0, 0)
    this.addChild(dialogMessage);

    // Confirm
    var buttonYOffset = 23;
    var dialogConfirm = new DialogButtonMedium(game, "Confirm", 500);
    dialogConfirm.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, buttonYOffset)
    this.addChild(dialogConfirm);

    var dialogConfirmButton = game.make.sprite(dialogConfirm.x, dialogConfirm.y, 'pixelTransparent');
    dialogConfirmButton.width = dialogConfirm.width;
    dialogConfirmButton.height = dialogConfirm.height;
    dialogConfirmButton.inputEnabled = true;
    dialogConfirmButton.events.onInputUp.add(this.confirmButtonClicked, this);
    this.addChild(dialogConfirmButton);

    // Cancel
    buttonYOffset += 63;
    var dialogCancel = new DialogButtonMedium(game, "Cancel", 500);
    dialogCancel.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, buttonYOffset)
    this.addChild(dialogCancel);

    var dialogCancelButton = game.make.sprite(dialogCancel.x, dialogCancel.y, 'pixelTransparent');
    dialogCancelButton.width = dialogCancel.width;
    dialogCancelButton.height = dialogCancel.height;
    dialogCancelButton.inputEnabled = true;
    dialogCancelButton.events.onInputUp.add(this.cancelButtonClicked, this);
    this.addChild(dialogCancelButton);
}

MonsterDiscardDialogGroup.prototype = Object.create(Phaser.Group.prototype);
MonsterDiscardDialogGroup.prototype.constructor = MonsterDiscardDialogGroup;

MonsterDiscardDialogGroup.prototype.confirmButtonClicked = function () {
    // destroy discard monster dialog
    this.destroy(true);
    // destroy monster
    game.hudInstance.discardCurrentMonster()

    if (game.hud.activePhase == "player") {
        // destroy player attack dialog
        game.hudInstance.destroyPlayerAttackDialog()
        // hide monster detail
        HudGroup.prototype.hideMonsterDetail()
    } else if (game.hud.activeStep == "monsterAttack") {
        // destroy monster attack dialog
        game.hudInstance.destroyMonsterAttackDialog()
        // next monster attack
        game.hud.currentMonsterIndex -= 1
        HudGroup.prototype.monsterAttack()
    }
}

MonsterDiscardDialogGroup.prototype.cancelButtonClicked = function () {
    // Subtract from Monster Damage
    game.hudInstance.monsterSubtractClicked()
    // show monster attack dialog
    game.hudInstance.showMonsterAttackDialog()
    // show player attack dialog
    game.hudInstance.showPlayerAttackDialog()
    // show player evade dialog
    game.hudInstance.showPlayerEvadeDialog()
    // destroy discard monster dialog
    this.destroy(true);
}

//=========================================================
function MakeMonsterHorrorCheckDialogGroup(game, id) {
    var horrorCheckData = game.gamedata.horrorChecks.find(function (item) { return item.id == id });

    var monsterHorrorCheckDialogGroup = new MonsterHorrorCheckDialogGroup(
        game,
        horrorCheckData.text
    )

    game.add.tween(monsterHorrorCheckDialogGroup).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    game.stage.addChild(monsterHorrorCheckDialogGroup)
}

function MonsterHorrorCheckDialogGroup(game, messageText) {
    Phaser.Group.call(this, game);

    // Modal
    var modalBackground = game.make.sprite(game.stageViewRect.x, game.stageViewRect.y, 'pixelTransparent');
    modalBackground.width = game.stageViewRect.width;
    modalBackground.height = game.stageViewRect.height;
    modalBackground.inputEnabled = true;
    this.addChild(modalBackground);

    // Message
    var dialogMessage = new DialogMessage(game, messageText, null);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    this.addChild(dialogMessage);

    // Button for [Continue]
    var dialogContinue = new DialogButtonThin(game, "Continue", 180);
    dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
    this.addChild(dialogContinue);

    var dialogContinueButton = game.make.sprite(dialogContinue.x, dialogContinue.y, 'pixelTransparent');
    dialogContinueButton.width = dialogContinue.width;
    dialogContinueButton.height = dialogContinue.height;
    dialogContinueButton.inputEnabled = true;
    dialogContinueButton.events.onInputUp.add(this.continueClicked, this);
    this.addChild(dialogContinueButton);
}

MonsterHorrorCheckDialogGroup.prototype = Object.create(Phaser.Group.prototype);
MonsterHorrorCheckDialogGroup.prototype.constructor = MonsterHorrorCheckDialogGroup;

MonsterHorrorCheckDialogGroup.prototype.continueClicked = function (button, pointer) {
    var fadeOutTween = game.add.tween(this).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    fadeOutTween.onComplete.addOnce(function () {
        this.destroy(true);
    }, this);
}

//=========================================================
function MakeHorrorCheckConfirmDialog(game, monsterInstance) {
    var horrorCheckConfirmDialogGroup = new HorrorCheckConfirmDialogGroup(game, monsterInstance)
    game.add.tween(horrorCheckConfirmDialogGroup).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    game.stage.addChild(horrorCheckConfirmDialogGroup)
}

function HorrorCheckConfirmDialogGroup(game, monsterInstance) {
    Phaser.Group.call(this, game);

    this._monsterInstance = monsterInstance

    // Modal
    var modalBackground = game.make.sprite(game.stageViewRect.x, game.stageViewRect.y, 'pixelTransparent');
    modalBackground.width = game.stageViewRect.width;
    modalBackground.height = game.stageViewRect.height;
    modalBackground.inputEnabled = true;
    this.addChild(modalBackground);

    var messageText = "Resolve a Horror check?"

    // Message
    var dialogMessage = new DialogMessage(game, messageText, null);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    this.addChild(dialogMessage);

    var dialogCancel = new DialogButtonThin(game, "Cancel", 280);
    dialogCancel.alignTo(dialogMessage, Phaser.BOTTOM_LEFT, -10, 10)
    this.addChild(dialogCancel);

    var dialogAction = new DialogButtonThin(game, "Confirm", 280);
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
    dialogActionButton.events.onInputUp.add(this.confirmClicked, this);
    this.addChild(dialogActionButton);
}

HorrorCheckConfirmDialogGroup.prototype = Object.create(Phaser.Group.prototype);
HorrorCheckConfirmDialogGroup.prototype.constructor = HorrorCheckConfirmDialogGroup;

HorrorCheckConfirmDialogGroup.prototype.cancelClicked = function (button, pointer) {
    var fadeOutTween = game.add.tween(this).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    fadeOutTween.onComplete.addOnce(function () {
        this.destroy(true);
    }, this);
}

HorrorCheckConfirmDialogGroup.prototype.confirmClicked = function (button, pointer) {
    var fadeOutTween = game.add.tween(this).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    fadeOutTween.onComplete.addOnce(function () {
        HudGroup.prototype.monsterHorrorCheck(this._monsterInstance)
        this.destroy(true);
    }, this);
}

//=========================================================
function MakeHorrorCheckDialog(game) {
    var horrorCheckDialogGroup = new HorrorCheckDialogGroup(game)
    game.add.tween(horrorCheckDialogGroup).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    game.stage.addChild(horrorCheckDialogGroup)
}

function HorrorCheckDialogGroup(game) {
    Phaser.Group.call(this, game);

    // Modal
    var modalBackground = game.make.sprite(game.stageViewRect.x, game.stageViewRect.y, 'pixelTransparent');
    modalBackground.width = game.stageViewRect.width;
    modalBackground.height = game.stageViewRect.height;
    modalBackground.inputEnabled = true;
    this.addChild(modalBackground);

    var messageText = "Each investigator must resolve a horror check against the monster within range with the highest horror rating. After all horror checks have been resolved, tap the end phase button to continue."

    // Message
    var dialogMessage = new DialogMessage(game, messageText, null);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    this.addChild(dialogMessage);

    // Button for [Continue]
    var dialogContinue = new DialogButtonThin(game, "Continue", 180);
    dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
    this.addChild(dialogContinue);

    var dialogContinueButton = game.make.sprite(dialogContinue.x, dialogContinue.y, 'pixelTransparent');
    dialogContinueButton.width = dialogContinue.width;
    dialogContinueButton.height = dialogContinue.height;
    dialogContinueButton.inputEnabled = true;
    dialogContinueButton.events.onInputUp.add(this.continueClicked, this);
    this.addChild(dialogContinueButton);
}

HorrorCheckDialogGroup.prototype = Object.create(Phaser.Group.prototype);
HorrorCheckDialogGroup.prototype.constructor = HorrorCheckDialogGroup;

HorrorCheckDialogGroup.prototype.continueClicked = function (button, pointer) {
    var fadeOutTween = game.add.tween(this).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    fadeOutTween.onComplete.addOnce(function () {
        this.destroy(true);
    }, this);
}

//=========================================================
function MakeMonsterAttackDialog(game, id) {
    var attackData = game.gamedata.monsterAttacks.find(function (item) { return item.id == id });

    var monsterAttackDialogGroup = new MonsterAttackDialogGroup(
        game,
        attackData.moveText,
        attackData.attackButtonText,
        attackData.nonAttackButtonText,
        attackData.attackText,
        attackData.nonAttackText
    )

    game.add.tween(monsterAttackDialogGroup).from({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
    game.stage.addChild(monsterAttackDialogGroup)

    return monsterAttackDialogGroup
}

function MonsterAttackDialogGroup(game, moveText, attackButtonText, nonAttackButtonText, attackText, nonAttackText) {
    Phaser.Group.call(this, game);
    var dialogRect = new Phaser.Rectangle(96 * 3, 16, game.stageViewRect.width - 96 * 3, game.stageViewRect.height)
    this._attackResolved = false;
    this._nonAttackResolved = false;
    this._nonAttackExists = nonAttackText != null;

    // Move Text
    var moveTextDialog = new DialogMessageMonster(game, moveText, 600);
    moveTextDialog.alignIn(dialogRect, Phaser.TOP_CENTER, 0, 0)
    this.addChild(moveTextDialog);

    // Attack Button
    var attackButtonTextGroup = new DialogButtonMedium(game, attackButtonText, 520)
    attackButtonTextGroup.alignTo(moveTextDialog, Phaser.BOTTOM_CENTER, 0, 28)
    this.addChild(attackButtonTextGroup);

    var attackButton = game.make.sprite(attackButtonTextGroup.x, attackButtonTextGroup.y, 'pixelTransparent');
    attackButton.width = attackButtonTextGroup.width;
    attackButton.height = attackButtonTextGroup.height;
    attackButton.inputEnabled = true;
    attackButton.events.onInputUp.add(this.attackButtonClicked, this);
    this.addChild(attackButton);

    // Non Attack Button
    var nonAttackButtonTextGroup = new DialogButtonMedium(game, nonAttackButtonText, 520)
    nonAttackButtonTextGroup.alignTo(attackButtonTextGroup, Phaser.BOTTOM_CENTER, 0, 28)
    this.addChild(nonAttackButtonTextGroup);

    var nonAttackButton = game.make.sprite(nonAttackButtonTextGroup.x, nonAttackButtonTextGroup.y, 'pixelTransparent');
    nonAttackButton.width = nonAttackButtonTextGroup.width;
    nonAttackButton.height = nonAttackButtonTextGroup.height;
    nonAttackButton.inputEnabled = true;
    nonAttackButton.events.onInputUp.add(this.nonAttackButtonClicked, this);
    this.addChild(nonAttackButton);

    this._mainGroup = game.make.group(this)
    this._mainGroup.addChild(moveTextDialog)
    this._mainGroup.addChild(attackButtonTextGroup)
    this._mainGroup.addChild(attackButton)
    this._mainGroup.addChild(nonAttackButtonTextGroup)
    this._mainGroup.addChild(nonAttackButton)

    // Attack Text
    var attackTextDialog = new DialogMessageMonster(game, attackText, 600);
    attackTextDialog.alignIn(dialogRect, Phaser.TOP_CENTER, 0, 0)
    this.addChild(attackTextDialog);

    // Attack Text Continue
    var attackTextContinue = new DialogButtonThin(game, "Continue", 180);
    attackTextContinue.alignTo(attackTextDialog, Phaser.BOTTOM_CENTER, 0, 28)
    this.addChild(attackTextContinue);

    var attackTextContinueButton = game.make.sprite(attackTextContinue.x, attackTextContinue.y, 'pixelTransparent');
    attackTextContinueButton.width = attackTextContinue.width;
    attackTextContinueButton.height = attackTextContinue.height;
    attackTextContinueButton.inputEnabled = true;
    attackTextContinueButton.events.onInputUp.add(this.attackContinueButtonClicked, this);
    this.addChild(attackTextContinueButton);

    this._attackGroup = game.make.group(this)
    this._attackGroup.addChild(attackTextDialog)
    this._attackGroup.addChild(attackTextContinue)
    this._attackGroup.addChild(attackTextContinueButton)
    this._attackGroup.visible = false

    // NonAttack Text
    var nonAttackTextDialog = new DialogMessageMonster(game, nonAttackText, 600);
    nonAttackTextDialog.alignIn(dialogRect, Phaser.TOP_CENTER, 0, 0)
    this.addChild(nonAttackTextDialog);

    // NonAttack Text Continue
    var nonAttackTextContinue = new DialogButtonThin(game, "Continue", 180);
    nonAttackTextContinue.alignTo(nonAttackTextDialog, Phaser.BOTTOM_CENTER, 0, 28)
    this.addChild(nonAttackTextContinue);

    var nonAttackTextContinueButton = game.make.sprite(nonAttackTextContinue.x, nonAttackTextContinue.y, 'pixelTransparent');
    nonAttackTextContinueButton.width = nonAttackTextContinue.width;
    nonAttackTextContinueButton.height = nonAttackTextContinue.height;
    nonAttackTextContinueButton.inputEnabled = true;
    nonAttackTextContinueButton.events.onInputUp.add(this.nonAttackContinueButtonClicked, this);
    this.addChild(nonAttackTextContinueButton);

    this._nonAttackGroup = game.make.group(this)
    this._nonAttackGroup.addChild(nonAttackTextDialog)
    this._nonAttackGroup.addChild(nonAttackTextContinue)
    this._nonAttackGroup.addChild(nonAttackTextContinueButton)
    this._nonAttackGroup.visible = false
}

MonsterAttackDialogGroup.prototype = Object.create(Phaser.Group.prototype);
MonsterAttackDialogGroup.prototype.constructor = MonsterAttackDialogGroup;

MonsterAttackDialogGroup.prototype.attackButtonClicked = function (button, pointer) {
    if (!this._attackResolved && !this._nonAttackResolved) {
        this._attackResolved = true
        var dialog = this
        var fadeOutTween = game.add.tween(this._mainGroup).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
        var fadeInTween = game.add.tween(this._attackGroup).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, false, 0, 0, false);
        fadeInTween.onStart.addOnce(function () { dialog._attackGroup.visible = true })
        fadeOutTween.chain(fadeInTween)
    }
}

MonsterAttackDialogGroup.prototype.nonAttackButtonClicked = function (button, pointer) {
    if (!this._attackResolved && !this._nonAttackResolved) {
        this._nonAttackResolved = true
        var dialog = this
        var fadeOutTween = game.add.tween(this._mainGroup).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
        var fadeInTween = game.add.tween(this._nonAttackGroup).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, false, 0, 0, false);

        if (this._nonAttackExists) {
            fadeInTween.onStart.addOnce(function () { dialog._nonAttackGroup.visible = true })
            fadeOutTween.chain(fadeInTween)
        } else {
            fadeOutTween.onComplete.addOnce(function () { HudGroup.prototype.monsterAttack() })
        }
    }
}

MonsterAttackDialogGroup.prototype.attackContinueButtonClicked = function (button, pointer) {
    var fadeOutTween = game.add.tween(this._attackGroup).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    fadeOutTween.onComplete.addOnce(function () {
        HudGroup.prototype.monsterAttack()
    })
}

MonsterAttackDialogGroup.prototype.nonAttackContinueButtonClicked = function (button, pointer) {
    var fadeOutTween = game.add.tween(this._nonAttackGroup).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    fadeOutTween.onComplete.addOnce(function () {
        HudGroup.prototype.monsterAttack()
    })
}

MonsterAttackDialogGroup.prototype.hideDialog = function () {
    if (!this._attackResolved && !this._nonAttackResolved) {
        this._mainGroup.visible = false
    } else if (this._attackResolved) {
        this._attackGroup.visible = false
    } else if (this._nonAttackResolved) {
        this._nonAttackGroup.visible = false
    }
}

MonsterAttackDialogGroup.prototype.showDialog = function () {
    if (!this._attackResolved && !this._nonAttackResolved) {
        this._mainGroup.visible = true
    } else if (this._attackResolved) {
        this._attackGroup.visible = true
    } else if (this._nonAttackResolved) {
        this._nonAttackGroup.visible = true
    }
}

//=========================================================
function MakeRandomEvent(game, id) {
    var randomEventData = game.gamedata.randomEvents.find(function (element) { return element.id == id });

    var imageKey = null;
    var buttonType = null;
    var buttonData = null;
    var eventText = randomEventData.text

    if (randomEventData.hasOwnProperty("buttonType") && randomEventData.buttonType == "random-event-conditional") {
        buttonType = randomEventData.buttonType
        buttonData = [
          {
              "id": "no-effect",
              "actions": [{ "type": "randomEventDone" }]
          },
          {
              "id": "resolve-effect",
              "actions": [{ "type": "randomEventResolve" }]
          }
        ]
    } else if (randomEventData.hasOwnProperty("buttonType") && randomEventData.buttonType == "random-event-attribute") {
        buttonType = "continue";
        buttonData = [{ "actions": [{ "type": "randomEventResolve" }] }]
    } else {
        buttonType = "continue";
        buttonData = [{ "actions": [{ "type": "randomEventDone" }] }]
    }

    if (randomEventData.hasOwnProperty("target") && randomEventData.target == "investigator") {
        // Get random investigator
        var mathRandom = Math.random();
        var randomIndex = Math.floor(mathRandom * game.gamedata.investigators.length);
        var randomInvestigatorData = game.gamedata.investigators[randomIndex]

        // Replace investigator name
        eventText = eventText.replace(/<name>/g, randomInvestigatorData.name)

        // Replace investigator pronoun
        var reInvestigatorPronoun = new RegExp("<" + randomInvestigatorData.pronoun + ":(.+?)>", "g")
        eventText = eventText.replace(reInvestigatorPronoun, "$1")

        // Remove remaining pronoun
        eventText = eventText.replace(/<.+?:.+?>/g, "")
    }

    var dialogInstance = new DialogGroup(
        game,
        randomEventData.id,
        eventText,
        imageKey,
        buttonType,
        buttonData);

    return dialogInstance;
}

//=========================================================
function MakeRandomEventResolve(game, id) {
    var randomEventData = game.gamedata.randomEvents.find(function (element) { return element.id == id });

    var imageKey = null;
    var buttonType = null;
    var buttonData = null;
    var eventText = randomEventData.resolveText

    buttonType = "continue";
    buttonData = [{ "actions": [{ "type": "randomEventDone" }] }]

    var dialogInstance = new DialogGroup(
        game,
        randomEventData.id,
        eventText,
        imageKey,
        buttonType,
        buttonData);

    return dialogInstance;
}

//=========================================================
function MakeDialog(game, id) {
    var dialogData = game.gamedata.dialogs.find(function (item) { return item.id == id });

    var dialogInstance = new DialogGroup(
        game,
        dialogData.id,
        dialogData.text,
        dialogData.imageKey,
        dialogData.buttonType,
        dialogData.buttons,
        dialogData.skillTarget);

    return dialogInstance;
}

//=========================================================
function DialogGroup(game, id, messageText, imageKey, buttonType, buttonData, skillTarget) {
    Phaser.Group.call(this, game);

    this._id = id
    this._buttonData = buttonData;
    this._skillTarget = skillTarget;

    // Modal
    var modalBackground = game.make.sprite(game.stageViewRect.x, game.stageViewRect.y, 'pixelTransparent');
    modalBackground.width = game.stageViewRect.width;
    modalBackground.height = game.stageViewRect.height;
    modalBackground.inputEnabled = true;
    this.addChild(modalBackground);

    var messageImageKey = null;
    var revealImageKey = null;

    if (buttonType == "reveal") {
        revealImageKey = imageKey;
    } else {
        messageImageKey = imageKey;
    }

    if (buttonType == "reveal" && revealImageKey != null) {
        // Reveal Image
        var revealPointer = game.make.image(0, 0, Helper.getImage(imageKey))
        revealPointer.alignIn(game.stageViewRect, Phaser.CENTER, 0, -208 + 48 - game.presentationOffsetY)
        this.addChild(revealPointer);

        // Reveal Pointer
        var revealPointer = game.make.image(0, 0, 'revealPointer')
        revealPointer.alignIn(game.stageViewRect, Phaser.CENTER, 0, -48 - 48 + 4 - game.presentationOffsetY)
        this.addChild(revealPointer);
    }

    // Message
    var dialogMessage = new DialogMessage(game, messageText, messageImageKey);
    if (buttonType == "reveal" && imageKey != null) {
        dialogMessage.alignTo(revealPointer, Phaser.BOTTOM_CENTER, 0, 3)
    } else {
        dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    }
    this.addChild(dialogMessage);

    // Buttons
    if (buttonType == "cancel-action") {
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

    } else if (buttonType == "continue" || buttonType == "reveal") {
        // Button for [Continue]
        var data = this._buttonData[0]
        var dialogContinue = new DialogButtonThin(game, "Continue", 180);
        dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
        this.addChild(dialogContinue);

        var dialogContinueButton = game.make.sprite(dialogContinue.x, dialogContinue.y, 'pixelTransparent');
        dialogContinueButton.width = dialogContinue.width;
        dialogContinueButton.height = dialogContinue.height;
        dialogContinueButton.inputEnabled = true;
        dialogContinueButton.events.onInputUp.add(this.buttonClicked, this);
        dialogContinueButton.data = data; //dynamic property
        this.addChild(dialogContinueButton);

    } else if (buttonType == "skilltest") {
        // Button for [-][#][+]
        //            [Confirm]
        this._skillTestDisplay = 0;

        if (!(this._id in game.customStates)) {
            game.customStates.push({ "id": this._id, "successCount": 0 })
        }

        var skillTestGroup = game.add.group()

        // Display number
        this._numberBox = new OutlineBox(game, 50, 50)
        this._numberBox.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
        this.addChild(this._numberBox);

        var textStyle = { font: "30px Times New Romans", fill: "#ffffff", align: "center" };
        this._numberText = game.make.text(0, 0, this._skillTestDisplay, textStyle);
        this._numberText.alignIn(this._numberBox, Phaser.CENTER, 0, 3)
        this._numberText.x = Math.floor(this._numberText.x)
        this._numberText.y = Math.floor(this._numberText.y)
        this.addChild(this._numberText);

        // Subtract number
        var subtractNumber = new OutlineBox(game, 50, 50)
        subtractNumber.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, -60, 10)
        this.addChild(subtractNumber);

        var subtractText = game.make.text(0, 0, "-", textStyle);
        subtractText.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, -59, 16)
        this.addChild(subtractText);

        var subtractNumberButton = game.make.sprite(subtractNumber.x, subtractNumber.y, 'pixelTransparent');
        subtractNumberButton.width = subtractNumber.width;
        subtractNumberButton.height = subtractNumber.height;
        subtractNumberButton.inputEnabled = true;
        subtractNumberButton.events.onInputUp.add(this.skillSubtractClicked, this);
        this.addChild(subtractNumberButton);

        // Add number
        var addNumber = new OutlineBox(game, 50, 50)
        addNumber.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 60, 10)
        this.addChild(addNumber);

        var addText = game.make.text(0, 0, "+", textStyle);
        addText.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 61, 18)
        this.addChild(addText);

        var addNumberButton = game.make.sprite(addNumber.x, addNumber.y, 'pixelTransparent');
        addNumberButton.width = addNumber.width;
        addNumberButton.height = addNumber.height;
        addNumberButton.inputEnabled = true;
        addNumberButton.events.onInputUp.add(this.skillAddClicked, this);
        this.addChild(addNumberButton);

        // Confirm
        var dialogContinue = new DialogButtonThin(game, "Confirm", 150);
        dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 90)
        this.addChild(dialogContinue);

        var confirmButton = game.make.sprite(dialogContinue.x, dialogContinue.y, 'pixelTransparent');
        confirmButton.width = dialogContinue.width;
        confirmButton.height = dialogContinue.height;
        confirmButton.inputEnabled = true;
        confirmButton.events.onInputUp.add(this.skillConfirmClicked, this);
        this.addChild(confirmButton);

        this.addChild(skillTestGroup)

    } else if (buttonType == "custom") {
        // Custom Buttons
        var buttonYOffset = 10;
        for (var i = 0; i < this._buttonData.length; i++) {
            var data = this._buttonData[i]
            var dialogContinue = new DialogButtonMedium(game, buttonData[i].text, 500);
            dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, buttonYOffset)
            this.addChild(dialogContinue);
            buttonYOffset += 53;

            var dialogContinueButton = game.make.sprite(dialogContinue.x, dialogContinue.y, 'pixelTransparent');
            dialogContinueButton.width = dialogContinue.width;
            dialogContinueButton.height = dialogContinue.height;
            dialogContinueButton.inputEnabled = true;
            dialogContinueButton.events.onInputUp.add(this.buttonClicked, this);
            dialogContinueButton.data = data
            this.addChild(dialogContinueButton);
        }
    } if (buttonType == "fire-event") {
        // Buttons for [Fire Extinguished] [Fire Spreads]
        var dataExtinguished = this._buttonData.find(function (item) { return item.id == "extinguished" })
        var dialogExtinguished = new DialogButtonThin(game, "Fire Extinguished", 280);
        dialogExtinguished.alignTo(dialogMessage, Phaser.BOTTOM_LEFT, -10, 10)
        this.addChild(dialogExtinguished);

        var dataSpreads = this._buttonData.find(function (item) { return item.id == "spreads" })
        var dialogSpreads = new DialogButtonThin(game, "Fire Spreads", 280);
        dialogSpreads.alignTo(dialogMessage, Phaser.BOTTOM_RIGHT, -10, 10)
        this.addChild(dialogSpreads);

        var dialogExtinguishedButton = game.make.sprite(dialogExtinguished.x, dialogExtinguished.y, 'pixelTransparent');
        dialogExtinguishedButton.width = dialogExtinguished.width;
        dialogExtinguishedButton.height = dialogExtinguished.height;
        dialogExtinguishedButton.inputEnabled = true;
        dialogExtinguishedButton.events.onInputUp.add(this.buttonClicked, this);
        dialogExtinguishedButton.data = dataExtinguished
        this.addChild(dialogExtinguishedButton);

        var dialogSpreadsButton = game.make.sprite(dialogSpreads.x, dialogSpreads.y, 'pixelTransparent');
        dialogSpreadsButton.width = dialogSpreads.width;
        dialogSpreadsButton.height = dialogSpreads.height;
        dialogSpreadsButton.inputEnabled = true;
        dialogSpreadsButton.events.onInputUp.add(this.buttonClicked, this);
        dialogSpreadsButton.data = dataSpreads
        this.addChild(dialogSpreadsButton);

    } if (buttonType == "random-event-conditional") {
        // Buttons for [No Effect] [Resolve Effect]
        var dataNoEffect = this._buttonData.find(function (item) { return item.id == "no-effect" })
        var dialogNoEffect = new DialogButtonThin(game, "No Effect", 280);
        dialogNoEffect.alignTo(dialogMessage, Phaser.BOTTOM_LEFT, -10, 10)
        this.addChild(dialogNoEffect);

        var dataResolveEffect = this._buttonData.find(function (item) { return item.id == "resolve-effect" })
        var dialogResolveEffect = new DialogButtonThin(game, "Resolve Effect", 280);
        dialogResolveEffect.alignTo(dialogMessage, Phaser.BOTTOM_RIGHT, -10, 10)
        this.addChild(dialogResolveEffect);

        var dialogNoEffectButton = game.make.sprite(dialogNoEffect.x, dialogNoEffect.y, 'pixelTransparent');
        dialogNoEffectButton.width = dialogNoEffect.width;
        dialogNoEffectButton.height = dialogNoEffect.height;
        dialogNoEffectButton.inputEnabled = true;
        dialogNoEffectButton.events.onInputUp.add(this.buttonClicked, this);
        dialogNoEffectButton.data = dataNoEffect
        this.addChild(dialogNoEffectButton);

        var dialogResolveEffectButton = game.make.sprite(dialogResolveEffect.x, dialogResolveEffect.y, 'pixelTransparent');
        dialogResolveEffectButton.width = dialogResolveEffect.width;
        dialogResolveEffectButton.height = dialogResolveEffect.height;
        dialogResolveEffectButton.inputEnabled = true;
        dialogResolveEffectButton.events.onInputUp.add(this.buttonClicked, this);
        dialogResolveEffectButton.data = dataResolveEffect
        this.addChild(dialogResolveEffectButton);
    }
}

DialogGroup.prototype = Object.create(Phaser.Group.prototype);
DialogGroup.prototype.constructor = DialogGroup;

DialogGroup.prototype.cancelClicked = function (button, pointer) {
    button.inputEnabled = false;
    game.cutSceneCamera = false;
    this.fadeOut();
}

DialogGroup.prototype.skillSubtractClicked = function (button, pointer) {
    if (this._skillTestDisplay > 0) {
        this._skillTestDisplay--
        this._numberText.setText(this._skillTestDisplay)
        this._numberText.alignIn(this._numberBox, Phaser.CENTER, 0, 3)
        this._numberText.x = Math.floor(this._numberText.x)
        this._numberText.y = Math.floor(this._numberText.y)
    }
}

DialogGroup.prototype.skillAddClicked = function (button, pointer) {
    this._skillTestDisplay++
    this._numberText.setText(this._skillTestDisplay)
    this._numberText.alignIn(this._numberBox, Phaser.CENTER, 0, 3)
    this._numberText.x = Math.floor(this._numberText.x)
    this._numberText.y = Math.floor(this._numberText.y)
}

DialogGroup.prototype.skillConfirmClicked = function (button, pointer) {
    button.inputEnabled = false;
    var dialogId = this._id;
    var customState = game.customStates.find(function (item) { return item.id == dialogId });

    if (customState.successCount + this._skillTestDisplay >= this._skillTarget) {
        button.data = this._buttonData.find(function (item) { return item.id == "success" })
        DialogGroup.prototype.buttonClicked.call(this, button);
    } else {
        customState.successCount += this._skillTestDisplay
        button.data = this._buttonData.find(function (item) { return item.id == "fail" })
        DialogGroup.prototype.buttonClicked.call(this, button);
    }
}

DialogGroup.prototype.buttonClicked = function (button, pointer) {
    // this = DialogGroup
    button.inputEnabled = false;
    var restoreControl = true;
    var fadeOutCallback = null;

    // Look for button data and action aray
    if (button.data != null && button.data.hasOwnProperty("actions")) {
        // Loop on actions array
        for (var i = 0; i < button.data.actions.length; i++) {
            // Process each action
            var action = button.data.actions[i];
            if (action.type == "removeTokens") {
                // Loop on tokenIds array
                for (var j = 0; j < action.tokenIds.length; j++) {
                    var id = action.tokenIds[j];

                    // Remove Id
                    var instance = game.gamedataInstances.mapTokens.find(function (item) { return item.id == id })
                    if (instance != null) {
                        instance.fadeOut(function () {
                            instance = null;
                            game.world.removeChild(instance);
                            //instance.destroy();
                        })
                    }
                }
            } else if (action.type == "dialog") {
                // Make a new Dialog
                fadeOutCallback = function () {
                    var dialogInstance = MakeDialog(game, action.dialogId)
                    // TODO add fadeIn()
                    game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
                    game.stage.addChild(dialogInstance)
                }
                restoreControl = false;

            } else if (action.type == "reveal") {
                //Go to next reveal dialog
                if (game.revealList.dialogs.length > 0) {
                    fadeOutCallback = function () {
                        var revealDialog = game.revealList.dialogs.shift();
                        MakeRevealDialog(game, revealDialog);
                    }
                    restoreControl = false;

                } else if (game.hud.activePhase == "enemy") {
                    // TODO not sure if there is a cleaner way of doing this
                    HudGroup.prototype.scenarioEvent()
                }
            } else if (action.type == "revealList") {
                //Reveal map tiles
                if (action.revealListId != null) {
                    fadeOutCallback = function () {
                        MakeRevealList(game, action.revealListId);
                    }
                    restoreControl = false;
                }
            } else if (action.type == "scene") {
                MakeScene(game, action.sceneId)
            } else if (action.type == "fireExtinguished") {
                fadeOutCallback = function () {
                    game.hudInstance.fireExtinguished()
                }
                restoreControl = false;
            } else if (action.type == "fireSpreads") {
                fadeOutCallback = function () {
                    game.hudInstance.fireSpreads()
                }
                restoreControl = false;
            } else if (action.type == "randomEventDone") {
                fadeOutCallback = function () {
                    game.hudInstance.randomEventDone()
                }
                restoreControl = false;
            } else if (action.type == "randomEvent") {
                fadeOutCallback = function () {
                    //MakeRandomEvent(game, action.randomEventId);
                    var dialogInstance = MakeRandomEvent(game, action.randomEventId);
                    game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
                    game.stage.addChild(dialogInstance)
                }
                restoreControl = false;
            } else if (action.type == "randomEventResolve") {
                var randomEventId = this._id
                fadeOutCallback = function () {
                    //MakeRandomEventResolve(game, randomEventId);
                    var dialogInstance = MakeRandomEventResolve(game, randomEventId);
                    game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
                    game.stage.addChild(dialogInstance)
                }
                restoreControl = false;
            } else if (action.type == "setGlobal") {
                var globalVar = game.gamedata.globalVars.find(function (item) { return item.id == action.globalId });
                globalVar.value = action.value
            } else if (action.type == "scenarioEvent") {
                HudGroup.prototype.scenarioEvent()
            } else if (action.type == "monster") {
                MakeMonster(game, action.monsterId)
            }
        }
    }

    if (restoreControl) {
        game.cutSceneCamera = false;
    }

    this.fadeOut(fadeOutCallback);
}

DialogGroup.prototype.fadeOut = function (callback) {
    var fadeOutTween = game.add.tween(this).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);

    fadeOutTween.onComplete.addOnce(function () {
        this.destroy(true);
    }, this);

    if (callback != null) {
        fadeOutTween.onComplete.addOnce(callback, this);
    }
}

//=========================================================
function DialogMessage(game, text, imageKey) {
    Phaser.Group.call(this, game, 0, 0);

    var totalWidth = 600;
    var leftMargin = 20;
    var imageWidth = 96;
    var imageHeight = 96;
    var middleMargin = 20
    var rightMargin = 20;
    var topMargin = 20;
    var bottomMargin = 20;
    var textAlign = "left"
    var widthOffset = 0

    if (imageKey == null) {
        imageWidth = 0;
        middleMargin = 0;
        textAlign = "center"
    }

    var textWidth = totalWidth - leftMargin - imageWidth - middleMargin - rightMargin;
    var textStyle = { font: "20px Times New Romans", fill: "#ffffff", align: textAlign, wordWrap: true, wordWrapWidth: textWidth };
    var messageText = game.make.text(0, 0, text, textStyle);

    if (imageKey == null) {
        widthOffset = Math.floor((textWidth - messageText.width) / 2);
    }
    messageText.x = leftMargin + imageWidth + middleMargin + widthOffset

    var textHeight = messageText.height
    if (textHeight >= imageHeight) {
        messageText.y = topMargin;
    } else {
        messageText.y = topMargin + Math.floor((imageHeight - textHeight) / 2)
        textHeight = imageHeight
    }

    var totalHeight = textHeight + topMargin + bottomMargin;
    var outlineBox = new OutlineBox(game, totalWidth, totalHeight);

    this.addChild(outlineBox);
    this.addChild(messageText);

    if (imageKey != null) {
        var imageBadgeSprite = game.make.sprite(leftMargin, Math.floor((totalHeight - imageHeight) / 2), Helper.getImage(imageKey))
        this.addChild(imageBadgeSprite);
    }
}

DialogMessage.prototype = Object.create(Phaser.Group.prototype);
DialogMessage.prototype.constructor = DialogMessage;

//=========================================================
function DialogMessageMonster(game, text, width) {
    Phaser.Group.call(this, game, 0, 0);

    var totalWidth = width;
    var leftMargin = 10;
    var rightMargin = 10;
    var topMargin = 20;
    var bottomMargin = 15;

    var textWidth = totalWidth - leftMargin - rightMargin;
    var textStyle = {
        font: "20px Times New Romans", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: textWidth
    };
    var messageText = game.make.text(0, 0, text, textStyle);
    messageText.x = Math.floor((totalWidth - messageText.width) / 2)
    messageText.y = topMargin;

    var totalHeight = messageText.height + topMargin + bottomMargin;
    var outlineBox = new OutlineBox(game, totalWidth, totalHeight);

    this.addChild(outlineBox);
    this.addChild(messageText);
}

DialogMessageMonster.prototype = Object.create(Phaser.Group.prototype);
DialogMessageMonster.prototype.constructor = DialogButtonMedium;

//=========================================================
function DialogButtonThin(game, text, width) {
    Phaser.Group.call(this, game, 0, 0);

    var totalWidth = width;
    var leftMargin = 10;
    var rightMargin = 10;
    var topMargin = 4;
    var bottomMargin = 0;

    var textWidth = totalWidth - leftMargin - rightMargin;
    var textStyle = { font: "20px Times New Romans", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: textWidth };
    var messageText = game.make.text(0, 0, text, textStyle);
    messageText.x = Math.floor((totalWidth - messageText.width) / 2)
    messageText.y = topMargin;

    var totalHeight = messageText.height + topMargin + bottomMargin;
    var outlineBox = new OutlineBox(game, totalWidth, totalHeight);

    this.addChild(outlineBox);
    this.addChild(messageText);
}

DialogButtonThin.prototype = Object.create(Phaser.Group.prototype);
DialogButtonThin.prototype.constructor = DialogButtonThin;

//=========================================================
function DialogButtonMedium(game, text, width) {
    Phaser.Group.call(this, game, 0, 0);

    var totalWidth = width;
    var leftMargin = 10;
    var rightMargin = 10;
    var topMargin = 10;
    var bottomMargin = 5;

    var textWidth = totalWidth - leftMargin - rightMargin;
    var textStyle = { font: "20px Times New Romans", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: textWidth };
    var messageText = game.make.text(0, 0, text, textStyle);
    messageText.x = Math.floor((totalWidth - messageText.width) / 2)
    messageText.y = topMargin;

    var totalHeight = messageText.height + topMargin + bottomMargin;
    var outlineBox = new OutlineBox(game, totalWidth, totalHeight);

    this.addChild(outlineBox);
    this.addChild(messageText);
}

DialogButtonMedium.prototype = Object.create(Phaser.Group.prototype);
DialogButtonMedium.prototype.constructor = DialogButtonMedium;

//=========================================================
function OutlineBox(game, width, height) {
    Phaser.Group.call(this, game, 0, 0);

    var localX = 0;
    var localY = 0;
    var edgeSize = 1;

    // Create all of our corners and edges
    var borders = [
        // background
        game.make.tileSprite(localX + edgeSize, localY + edgeSize, width - (edgeSize * 2), height - (edgeSize * 2), 'pixelBlack'),
        // top left
        game.make.image(localX, localY, 'pixelWhite'),
        // top right
        game.make.image(localX + width - edgeSize, localY, 'pixelWhite'),
        // bottom right
        game.make.image(localX + width - edgeSize, localY + height - edgeSize, 'pixelWhite'),
        // bottom left
        game.make.image(localX, localY + height - edgeSize, 'pixelWhite'),
        // top
        game.make.tileSprite(localX + edgeSize, localY, width - (edgeSize * 2), edgeSize, 'pixelWhite'),
        // bottom
        game.make.tileSprite(localX + edgeSize, localY + height - edgeSize, width - (edgeSize * 2), edgeSize, 'pixelWhite'),
        // left
        game.make.tileSprite(localX, localY + edgeSize, edgeSize, height - (edgeSize * 2), 'pixelWhite'),
        // right
        game.make.tileSprite(localX + width - edgeSize, localY + edgeSize, edgeSize, height - (edgeSize * 2), 'pixelWhite'),
    ];

    // Add all of the above to this group
    for (var b = 0, len = borders.length; b < len; b++) {
        this.addChild(borders[b]);
    }
}

OutlineBox.prototype = Object.create(Phaser.Group.prototype);
OutlineBox.prototype.constructor = OutlineBox;
