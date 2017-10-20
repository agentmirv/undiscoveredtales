//=========================================================
function HudGroup(game) {
    Phaser.Group.call(this, game);

    // Enemy Phase Background
    this._enemyPhaseBGImage = game.make.tileSprite(0, 0, game.stageViewRect.width, game.stageViewRect.height, 'pixelWhite');
    this._enemyPhaseBGImage.tint = "0x000000";
    this._enemyPhaseBGImage.alpha = 0.9
    this._enemyPhaseBGImage.inputEnabled = true;
    this.addChild(this._enemyPhaseBGImage);
    this._enemyPhaseBGImage.kill()

    // End Phase (Green)
    this._endPhasePlayerImage = game.make.image(0, 0, Helper.getImage("endPhase-image-player"))
    this._endPhasePlayerImage.alignIn(game.stageViewRect, Phaser.BOTTOM_RIGHT, 0, 0)
    this.addChild(this._endPhasePlayerImage);

    // End Phase (Red)
    this._endPhaseEnemyImage = game.make.image(0, 0, Helper.getImage("endPhase-image-enemy"))
    this._endPhaseEnemyImage.alignIn(game.stageViewRect, Phaser.BOTTOM_RIGHT, 0, 0)
    this.addChild(this._endPhaseEnemyImage);
    this._endPhaseEnemyImage.kill()

    // End Phase Button
    var endPhaseButton = game.make.sprite(this._endPhasePlayerImage.x, this._endPhasePlayerImage.y, 'pixelTransparent');
    endPhaseButton.width = this._endPhasePlayerImage.width;
    endPhaseButton.height = this._endPhasePlayerImage.height;
    endPhaseButton.inputEnabled = true;
    endPhaseButton.events.onInputUp.add(this.endPhaseClicked, this);
    this.addChild(endPhaseButton);

    // Monster Tray
    this._monsterTrayBgImage = game.make.tileSprite(0, 0, 96 * 8, 96, "hudButton")
    this._monsterTrayBgImage.alignIn(game.stageViewRect, Phaser.BOTTOM_LEFT, -96 * 3.5, 0)
    this._monsterTrayBgImage.tint = "0x044500"
    this._monsterTray = game.make.group()
    this._monsterTray.addChild(this._monsterTrayBgImage);
    this.addChild(this._monsterTray)
    this._monsterTray.y += 96

    // Monster Detail
    this._monsterDetail = this.makeMonsterDetailGroup(game)
    this.addChild(this._monsterDetail)
    this._monsterDetail.x -= 96 * 4

    // Monster (Green)
    this._monsterPlayerImage = game.make.image(0, 0, Helper.getImage("monster-image-player"))
    this._monsterPlayerImage.alignIn(game.stageViewRect, Phaser.BOTTOM_LEFT, -96, 0)
    this.addChild(this._monsterPlayerImage);

    // Monster (Red)
    this._monsterEnemyImage = game.make.image(0, 0, Helper.getImage("monster-image-enemy"))
    this._monsterEnemyImage.alignIn(game.stageViewRect, Phaser.BOTTOM_LEFT, -96, 0)
    this.addChild(this._monsterEnemyImage);
    this._monsterEnemyImage.kill()

    // End Phase Button
    var monsterButton = game.make.sprite(this._monsterPlayerImage.x, this._monsterPlayerImage.y, 'pixelTransparent');
    monsterButton.width = this._monsterPlayerImage.width;
    monsterButton.height = this._monsterPlayerImage.height;
    monsterButton.inputEnabled = true;
    monsterButton.events.onInputUp.add(this.showMonsterTrayClicked, this);
    this.addChild(monsterButton);

    this.monsterAttackDialog = null
    this.playerAttackPromptDialog = null
    this.playerAttackResolveDialog = null
    this.playerEvadeDialog = null
}

HudGroup.prototype = Object.create(Phaser.Group.prototype);
HudGroup.prototype.constructor = HudGroup;

HudGroup.prototype.discardCurrentMonster = function () {
    // Remove from List
    var oldList = game.gamedataInstances.monsters
    game.gamedataInstances.monsters = oldList.filter(function (value) { return value != game.hud.currentMonsterInstance })

    // Reposition remaining monsters in tray
    for (var i = 0; i < game.gamedataInstances.monsters.length; i++) {
        game.gamedataInstances.monsters[i].alignInTray(i)
    }

    game.hud.currentMonsterInstance.discard()
    game.hud.currentMonsterInstance = null
}

HudGroup.prototype.destroyPlayerEvadeDialog = function () {
    game.hud.activeStep = ""
    if (game.hudInstance.playerEvadeDialog != null) {
        game.hudInstance.playerEvadeDialog.destroy(true)
    }
}

HudGroup.prototype.hidePlayerEvadeDialog = function () {
    if (game.hudInstance.playerEvadeDialog != null) {
        game.hudInstance.playerEvadeDialog.hideDialog()
    }
}

HudGroup.prototype.showPlayerEvadeDialog = function () {
    if (game.hudInstance.playerEvadeDialog != null) {
        game.hudInstance.playerEvadeDialog.showDialog()
    }
}

HudGroup.prototype.destroyPlayerAttackDialog = function () {
    game.hud.activeStep = ""
    if (game.hudInstance.playerAttackPromptDialog != null) {
        game.hudInstance.playerAttackPromptDialog.destroy(true)
    }
    if (game.hudInstance.playerAttackResolveDialog != null) {
        game.hudInstance.playerAttackResolveDialog.destroy(true)
    }
}

HudGroup.prototype.hidePlayerAttackDialog = function () {
    if (game.hudInstance.playerAttackPromptDialog != null) {
        game.hudInstance.playerAttackPromptDialog.visible = false
    }
    if (game.hudInstance.playerAttackResolveDialog != null) {
        game.hudInstance.playerAttackResolveDialog.visible = false
    }
}

HudGroup.prototype.showPlayerAttackDialog = function () {
    if (game.hudInstance.playerAttackPromptDialog != null) {
        game.hudInstance.playerAttackPromptDialog.visible = true
    }
    if (game.hudInstance.playerAttackResolveDialog != null) {
        game.hudInstance.playerAttackResolveDialog.visible = true
    }
}

HudGroup.prototype.destroyMonsterAttackDialog = function () {
    if (game.hudInstance.monsterAttackDialog != null) {
        game.hudInstance.monsterAttackDialog.destroy(true)
    }
}

HudGroup.prototype.hideMonsterAttackDialog = function () {
    if (game.hudInstance.monsterAttackDialog != null) {
        game.hudInstance.monsterAttackDialog.hideDialog()
    }
}

HudGroup.prototype.showMonsterAttackDialog = function () {
    if (game.hudInstance.monsterAttackDialog != null) {
        game.hudInstance.monsterAttackDialog.showDialog()
    }
}

HudGroup.prototype.setMonsterDetail = function (monsterInstance) {
    if (game.hud.currentMonsterInstance != null) {
        game.hud.currentMonsterInstance.hideDetailImage()
    }
    monsterInstance.showDetailImage()

    game.hud.currentMonsterInstance = monsterInstance

    this._monsterHitPointsText.setText(game.hud.currentMonsterInstance.hitPoints)
    this._monsterHitPointsText.alignIn(this._hitPointsBox, Phaser.CENTER, 0, 3)

    this._monsterDamageText.setText(game.hud.currentMonsterInstance.damage)
    this._monsterDamageText.alignIn(this._damageBox, Phaser.CENTER, 0, 3)

    this._nameText.setText(game.hud.currentMonsterInstance.name)
    this._nameText.alignIn(this._nameBox, Phaser.CENTER, 0, 3)
    this._nameText.x = Math.floor(this._nameText.x)
    this._nameText.y = Math.floor(this._nameText.y)
}

HudGroup.prototype.makeMonsterDetailGroup = function (game) {
    var textStyle = { font: "24px Times New Romans", fill: "#ffffff", align: "center" };

    var monsterDetailGroup = game.make.group()
    this._monsterDetailBgImage = game.make.tileSprite(0, 0, 96 * 3, 96 * 4, "hudButton")
    this._monsterDetailBgImage.alignIn(game.stageViewRect, Phaser.TOP_LEFT, 0, 0)
    this._monsterDetailBgImage.tint = "0x044500"
    monsterDetailGroup.addChild(this._monsterDetailBgImage);

    // Hit Points
    this._hitPointsBox = new OutlineBox(game, 50, 50)
    this._hitPointsBox.alignIn(this._monsterDetailBgImage, Phaser.TOP_LEFT, -10, -10)
    monsterDetailGroup.addChild(this._hitPointsBox);

    this._monsterHitPointsText = game.make.text(0, 0, "0", textStyle);
    this._monsterHitPointsText.alignIn(this._hitPointsBox, Phaser.CENTER, 0, 3)
    monsterDetailGroup.addChild(this._monsterHitPointsText);

    // Name
    this._nameBox = new OutlineBox(game, 200, 32)
    this._nameBox.alignIn(this._monsterDetailBgImage, Phaser.CENTER, 0, 0)
    monsterDetailGroup.addChild(this._nameBox);

    this._nameText = game.make.text(0, 0, "Name", textStyle);
    this._nameText.alignIn(this._nameBox, Phaser.CENTER, 0, 3)
    monsterDetailGroup.addChild(this._nameText);

    // Damage
    this._damageBox = new OutlineBox(game, 50, 50)
    this._damageBox.alignTo(this._nameBox, Phaser.BOTTOM_CENTER, 0, 10)
    monsterDetailGroup.addChild(this._damageBox);

    this._monsterDamageText = game.make.text(0, 0, "0", textStyle);
    this._monsterDamageText.alignIn(this._damageBox, Phaser.CENTER, 0, 3)
    monsterDetailGroup.addChild(this._monsterDamageText);

    // Subtract number
    var subtractNumber = new OutlineBox(game, 50, 50)
    subtractNumber.alignTo(this._nameBox, Phaser.BOTTOM_CENTER, -64, 10)
    monsterDetailGroup.addChild(subtractNumber);

    var subtractText = game.make.text(0, 0, "-", textStyle);
    subtractText.alignIn(subtractNumber, Phaser.CENTER, 0, 3)
    monsterDetailGroup.addChild(subtractText);

    var subtractNumberButton = game.make.sprite(subtractNumber.x, subtractNumber.y, 'pixelTransparent');
    subtractNumberButton.width = subtractNumber.width;
    subtractNumberButton.height = subtractNumber.height;
    subtractNumberButton.inputEnabled = true;
    subtractNumberButton.events.onInputUp.add(this.monsterSubtractClicked, this);
    monsterDetailGroup.addChild(subtractNumberButton);

    // Add number
    var addNumber = new OutlineBox(game, 50, 50)
    addNumber.alignTo(this._nameBox, Phaser.BOTTOM_CENTER, 64, 10)
    monsterDetailGroup.addChild(addNumber);

    var addText = game.make.text(0, 0, "+", textStyle);
    addText.alignIn(addNumber, Phaser.CENTER, 0, 3)
    monsterDetailGroup.addChild(addText);

    var addNumberButton = game.make.sprite(addNumber.x, addNumber.y, 'pixelTransparent');
    addNumberButton.width = addNumber.width;
    addNumberButton.height = addNumber.height;
    addNumberButton.inputEnabled = true;
    addNumberButton.events.onInputUp.add(this.monsterAddClicked, this);
    monsterDetailGroup.addChild(addNumberButton);

    // Attack
    var dialogAttack = new DialogButtonThin(game, "Attack", 200);
    dialogAttack.alignTo(this._nameBox, Phaser.BOTTOM_CENTER, 0, 82)
    monsterDetailGroup.addChild(dialogAttack);

    var attackButton = game.make.sprite(dialogAttack.x, dialogAttack.y, 'pixelTransparent');
    attackButton.width = dialogAttack.width;
    attackButton.height = dialogAttack.height;
    attackButton.inputEnabled = true;
    attackButton.events.onInputUp.add(this.monsterAttackClicked, this);
    monsterDetailGroup.addChild(attackButton);

    // Evade
    var dialogEvade = new DialogButtonThin(game, "Evade", 200);
    dialogEvade.alignTo(this._nameBox, Phaser.BOTTOM_CENTER, 0, 130)
    monsterDetailGroup.addChild(dialogEvade);

    var evadeButton = game.make.sprite(dialogEvade.x, dialogEvade.y, 'pixelTransparent');
    evadeButton.width = dialogEvade.width;
    evadeButton.height = dialogEvade.height;
    evadeButton.inputEnabled = true;
    evadeButton.events.onInputUp.add(this.monsterEvadeClicked, this);
    monsterDetailGroup.addChild(evadeButton);

    return monsterDetailGroup
}

HudGroup.prototype.monsterEvadeClicked = function (button, pointer) {
    if (game.hud.activePhase == "player" && game.hud.activeStep == "") {
        game.hud.activeStep = "evade";
        this.playerEvadeDialog = MakePlayerEvadeDialog(game)
    }
}

HudGroup.prototype.monsterAttackClicked = function (button, pointer) {
    if (game.hud.activePhase == "player" && game.hud.activeStep == "") {
        game.hud.activeStep = "attack";
        this.playerAttackPromptDialog = MakePlayerAttackDialog(game)
    }
}

HudGroup.prototype.monsterSubtractClicked = function (button, pointer) {
    if (game.hud.currentMonsterInstance.damage > 0) {
        game.hud.currentMonsterInstance.damage--
        game.hud.currentMonsterInstance.updateDamage()
        this._monsterDamageText.setText(game.hud.currentMonsterInstance.damage)
        this._monsterDamageText.alignIn(this._damageBox, Phaser.CENTER, 0, 3)
    }
}

HudGroup.prototype.monsterAddClicked = function (button, pointer) {
    game.hud.currentMonsterInstance.damage++
    game.hud.currentMonsterInstance.updateDamage()
    this._monsterDamageText.setText(game.hud.currentMonsterInstance.damage)
    this._monsterDamageText.alignIn(this._damageBox, Phaser.CENTER, 0, 3)
    this._monsterDamageText.x = Math.floor(this._monsterDamageText.x)

    if (game.hud.currentMonsterInstance.damage == game.hud.currentMonsterInstance.hitPoints) {
        // hide monster attack dialog (if present)
        game.hudInstance.hideMonsterAttackDialog()
        // hide player attack dialog (if present)
        game.hudInstance.hidePlayerAttackDialog()
        // hide player evade dialog (if present)
        game.hudInstance.hidePlayerEvadeDialog()
        // create discard monster dialog
        MakeMonsterDiscardDialog(game)
    }
}

HudGroup.prototype.showMonsterTrayClicked = function (button, pointer) {
    if ((game.hud.activePhase == "player" && game.hud.activeStep == "") || game.hud.activeStep == "horrorCheck") {
        if (game.hud.monsterTrayOpen) {
            HudGroup.prototype.hideEnemyPhaseBG()
            HudGroup.prototype.hideMonsterTray()
            HudGroup.prototype.hideMonsterDetail()
        } else {
            HudGroup.prototype.showEnemyPhaseBG()
            HudGroup.prototype.showMonsterTray()
        }
    }
}

HudGroup.prototype.endPhaseClicked = function (button, pointer) {
    var dialogInstance
    if (game.hud.activePhase == "player" && game.hud.activeStep == "") {
        dialogInstance = MakeDialog(game, "dialog-hud-endphase-player")
        HudGroup.prototype.hideEnemyPhaseBG()
        HudGroup.prototype.hideMonsterTray()
        HudGroup.prototype.hideMonsterDetail()
    } else if (game.hud.activeStep == "horrorCheck") {
        dialogInstance = MakeDialog(game, "dialog-hud-endphase-enemy")
        HudGroup.prototype.hideEnemyPhaseBG()
        HudGroup.prototype.hideMonsterTray()
        HudGroup.prototype.hideMonsterDetail()
    }

    // TODO add fadeIn()
    game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    // Because I'm adding this immediately, the modal prevents the double-click?
    game.stage.addChild(dialogInstance)
}

HudGroup.prototype.updatePhaseButtonImage = function () {
    if (game.hud.activePhase == "player") {
        this._endPhasePlayerImage.revive()
        this._endPhaseEnemyImage.kill()
        this._monsterPlayerImage.revive()
        this._monsterEnemyImage.kill()
    } else {
        this._endPhasePlayerImage.kill()
        this._endPhaseEnemyImage.revive()
        this._monsterPlayerImage.kill()
        this._monsterEnemyImage.revive()
    }
}

HudGroup.prototype.fireEvent = function () {
    if (game.hud.fireSet) {
        var dialogData = game.gamedata.dialogs.find(function (item) { return item.id == "dialog-hud-fire-event" });

        // Dialog Info
        var imageKey = null;
        var buttonType = "fire-event";
        var buttonData = [
          { "id": "extinguished", "actions": [{ "type": "fireExtinguished" }] },
          { "id": "spreads", "actions": [{ "type": "fireSpreads" }] }
        ]

        var dialogInstance = new DialogGroup(
            game,
            dialogData.id,
            dialogData.text,
            imageKey,
            buttonType,
            buttonData);

        // TODO add fadeIn()
        game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
        game.stage.addChild(dialogInstance)

    } else {
        // do random event
        game.hudInstance.randomEvent()
    }
}

HudGroup.prototype.fireExtinguished = function () {
    game.hud.fireSet = false
    // do random event
    game.hudInstance.randomEvent()
}

HudGroup.prototype.fireSpreads = function () {
    game.hud.fireSet = true
    // do random event
    game.hudInstance.randomEvent()
}

HudGroup.prototype.randomEvent = function () {
    var randomEventData = null

    var visibleMapTileIds = []
    for (var i = 0; i < game.gamedataInstances.mapTiles.length; i++) {
        visibleMapTileIds.push(game.gamedataInstances.mapTiles[i].id)
    }

    while (randomEventData == null) {
        if (game.hud.randomEventDeck.length == 0) {
            game.hud.randomEventDeck = game.gamedata.randomEvents.slice(0) // copy array?
            game.hud.randomEventDeck = Helper.shuffle(game.hud.randomEventDeck)
        }

        var drawRandomEvent = game.hud.randomEventDeck.pop()
        if (drawRandomEvent.hasOwnProperty("target") && drawRandomEvent.target == "mapTile" && drawRandomEvent.hasOwnProperty("mapTile")) {
            if (visibleMapTileIds.indexOf(drawRandomEvent.mapTile) >= 0) {
                randomEventData = drawRandomEvent
            }
        } else {
            randomEventData = drawRandomEvent
        }
    }

    var dialogInstance = new MakeRandomEvent(game, randomEventData.id)

    // TODO add fadeIn()
    game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    game.stage.addChild(dialogInstance)
}

HudGroup.prototype.randomEventDone = function () {
    HudGroup.prototype.scenarioEvent()
}

HudGroup.prototype.scenarioEvent = function () {
    var triggeredScenarioEvent = false
    for (var i = 0; i < game.gamedata.scenarioEvents.length; i++) {
        var scenarioEvent = game.gamedata.scenarioEvents[i]
        if (!scenarioEvent.hasOwnProperty("resolved")) {
            var conditionResult = true
            for (var j = 0; j < scenarioEvent.conditions.length && conditionResult; j++) {
                var condition = scenarioEvent.conditions[j]
                conditionResult = false
                if (condition.type == "globalVar") {
                    var globalVar = game.gamedata.globalVars.find(function (item) { return item.id == condition.globalId })
                    if (condition.operator == "equals") {
                        conditionResult = condition.value == globalVar.value
                    }
                }
            }

            if (conditionResult) {
                scenarioEvent.resolved = true
                triggeredScenarioEvent = true
                if (scenarioEvent.action.type == "dialog") {
                    var dialogInstance = MakeDialog(game, scenarioEvent.action.dialogId)
                    // TODO add fadeIn()
                    game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
                    game.stage.addChild(dialogInstance)
                } else if (scenarioEvent.action.type == "revealList") {
                    //Reveal map tiles
                    if (scenarioEvent.action.revealListId != null) {
                        MakeRevealList(game, scenarioEvent.action.revealListId);
                    }
                }

                break;
            }
        }
    }

    if (!triggeredScenarioEvent) {
        // If no scenario events were triggered, move on
        HudGroup.prototype.scenarioEventDone()
    }
}

HudGroup.prototype.scenarioEventDone = function () {
    HudGroup.prototype.monsterAttack()
}

HudGroup.prototype.monsterAttack = function () {
    if (game.gamedataInstances.monsters.length > 0 && game.hud.currentMonsterIndex < game.gamedataInstances.monsters.length - 1) {
        game.hud.currentMonsterIndex += 1
        game.hud.activeStep = "monsterAttack"

        // Monsters Attack
        var monsterInstance = game.gamedataInstances.monsters[game.hud.currentMonsterIndex]
        game.hudInstance.setMonsterDetail(monsterInstance)

        HudGroup.prototype.showEnemyPhaseBG()
        HudGroup.prototype.showMonsterTray()
        HudGroup.prototype.showMonsterDetail()

        // TODO: Get random attack for monsterInstance (reshuffle if empty?)
        var randomMonsterAttackData = null

        while (randomMonsterAttackData == null) {
            if (game.hud.randomMonsterAttackDeck.length == 0) {
                game.hud.randomMonsterAttackDeck = Helper.shuffle(game.gamedata.monsterAttacks.slice(0))
            }

            var drawRandomMonsterAttack = game.hud.randomMonsterAttackDeck.pop()

            if (drawRandomMonsterAttack.monster == monsterInstance.monster) {
                randomMonsterAttackData = drawRandomMonsterAttack
            }
        }

        // Display monster attack dialog
        game.hudInstance.monsterAttackDialog = MakeMonsterAttackDialog(game, randomMonsterAttackData.id)
    } else {
        HudGroup.prototype.hideMonsterDetail()
        HudGroup.prototype.horrorCheck()
    }
}

HudGroup.prototype.monsterHorrorCheck = function (monsterInstance) {
    var randomMonsterHorrorCheckData = null

    while (randomMonsterHorrorCheckData == null) {
        if (game.hud.randomMonsterHorrorCheckDeck.length == 0) {
            game.hud.randomMonsterHorrorCheckDeck = Helper.shuffle(game.gamedata.horrorChecks.slice(0))
        }

        var drawRandomMonsterHorrorCheck = game.hud.randomMonsterHorrorCheckDeck.pop()

        if (drawRandomMonsterHorrorCheck.monster == monsterInstance.monster) {
            randomMonsterHorrorCheckData = drawRandomMonsterHorrorCheck
        }
    }

    MakeMonsterHorrorCheckDialogGroup(game, randomMonsterHorrorCheckData.id)
}

HudGroup.prototype.horrorCheck = function () {
    if (game.gamedataInstances.monsters.length > 0) {
        game.hud.activeStep = "horrorCheck"
        HudGroup.prototype.hideMonsterDetail()
        HudGroup.prototype.hideMonsterTray()
        HudGroup.prototype.hideEnemyPhaseBG(function () {
            HudGroup.prototype.showEnemyPhaseBG()
            HudGroup.prototype.showMonsterTray()
            // Horror Check Dialog
            MakeHorrorCheckDialog(game)
        })
    } else {
        HudGroup.prototype.enemyPhaseDone()
    }
}

HudGroup.prototype.enemyPhaseDone = function () {
    game.hud.activeStep = ""

    HudGroup.prototype.hideMonsterTray()
    HudGroup.prototype.hideMonsterDetail()
    HudGroup.prototype.hideEnemyPhaseBG(function () {
        MakeScene(game, "scene-player")
    })
}

HudGroup.prototype.showEnemyPhaseBG = function () {
    if (!game.hud.showEnemyPhaseBG) {
        game.hud.showEnemyPhaseBG = true
        game.hudInstance._enemyPhaseBGImage.alpha = 0.9
        game.hudInstance._enemyPhaseBGImage.revive()
        var fadeTween = game.add.tween(game.hudInstance._enemyPhaseBGImage).from({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}

HudGroup.prototype.hideEnemyPhaseBG = function (callback) {
    if (game.hud.showEnemyPhaseBG) {
        game.hud.showEnemyPhaseBG = false
        var fadeTween = game.add.tween(game.hudInstance._enemyPhaseBGImage).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
        fadeTween.onComplete.addOnce(function () {
            game.hudInstance._enemyPhaseBGImage.alpha = 0
            game.hudInstance._enemyPhaseBGImage.kill()
            if (callback != null) {
                callback()
            }
        })
    } else {
        if (callback != null) {
            callback()
        }
    }
}

HudGroup.prototype.showMonsterTray = function () {
    if (!game.hud.monsterTrayOpen) {
        game.hud.monsterTrayOpen = true
        var slideTween = game.add.tween(game.hudInstance._monsterTray).to({ y: game.hudInstance._monsterTray.y - 96 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}

HudGroup.prototype.hideMonsterTray = function () {
    if (game.hud.monsterTrayOpen) {
        game.hud.monsterTrayOpen = false
        var slideTween = game.add.tween(game.hudInstance._monsterTray).to({ y: game.hudInstance._monsterTray.y + 96 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}

HudGroup.prototype.showMonsterDetail = function () {
    if (!game.hud.monsterDetailOpen) {
        game.hud.monsterDetailOpen = true
        var slideTween = game.add.tween(game.hudInstance._monsterDetail).to({ x: game.hudInstance._monsterDetail.x + 96 * 4 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}

HudGroup.prototype.hideMonsterDetail = function () {
    if (game.hud.monsterDetailOpen) {
        game.hud.monsterDetailOpen = false
        var slideTween = game.add.tween(game.hudInstance._monsterDetail).to({ x: game.hudInstance._monsterDetail.x - 96 * 4 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}

