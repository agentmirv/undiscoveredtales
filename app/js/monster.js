//=========================================================
function MakeMonster(game, id) {
    var monsterData = game.gamedata.monsters.find(function (item) { return item.id == id });
    var textStyle = { font: "20px Times New Romans", fill: "#ffffff", align: "center" };

    // Set Instance
    var monsterInstance = new Monster()
    monsterInstance.id = monsterData.id
    monsterInstance.monster = monsterData.monster
    monsterInstance.name = monsterData.name
    monsterInstance.imageKey = monsterData.imageKey
    monsterInstance.hitPoints = parseInt(monsterData.baseHitPoints) + game.gamedata.investigators.length
    monsterInstance.damage = 0
    monsterInstance.color = ""

    // Set Tray Sprite
    monsterInstance.traySprite = game.make.sprite(0, 0, Helper.getImage(monsterInstance.imageKey))
    monsterInstance.alignInTray(game.gamedataInstances.monsters.length)
    monsterInstance.traySprite.inputEnabled = true
    monsterInstance.traySprite.events.onInputUp.add(Monster.prototype.trayClicked, monsterInstance);

    // Set Detail Sprite
    monsterInstance.detailSprite = game.make.sprite(0, 0, Helper.getImage(monsterInstance.imageKey))
    monsterInstance.detailSprite.alignIn(game.hudInstance._monsterDetailBgImage, Phaser.CENTER, 0, -72)
    game.hudInstance._monsterDetail.addChild(monsterInstance.detailSprite)

    // Set Tray Sprite Hit Points
    monsterInstance._hitPointsBox = new OutlineBox(game, 32, 32)
    monsterInstance.traySprite.addChild(monsterInstance._hitPointsBox)
    monsterInstance._hitPointsBox.x += 4
    monsterInstance._hitPointsBox.y += 60
    monsterInstance._monsterDamageText = game.make.text(0, 0, "0", textStyle);
    monsterInstance._monsterDamageText.alignIn(monsterInstance._hitPointsBox, Phaser.CENTER, 0, 3)
    monsterInstance.traySprite.addChild(monsterInstance._monsterDamageText)

    game.hudInstance._monsterTray.addChild(monsterInstance.traySprite)

    game.gamedataInstances.monsters.push(monsterInstance);
}

function Monster() {
    ///
}

Monster.prototype.alignInTray = function (position) {
    var xOffset = position * 96
    this.traySprite.alignIn(game.hudInstance._monsterTrayBgImage, Phaser.BOTTOM_LEFT, -xOffset, 0)
}

Monster.prototype.trayClicked = function () {
    if (game.hud.activePhase == "player" && game.hud.activeStep == "") {
        HudGroup.prototype.showEnemyPhaseBG()
        if (game.hud.monsterDetailOpen && game.hud.currentMonsterInstance == this) {
            HudGroup.prototype.hideMonsterDetail()
        } else {
            HudGroup.prototype.showMonsterDetail()
        }
        game.hudInstance.setMonsterDetail(this)
    } else if (game.hud.activeStep == "horrorCheck") {
        MakeHorrorCheckConfirmDialog(game, this)
    }
}

Monster.prototype.updateDamage = function () {
    this._monsterDamageText.setText(this.damage)
    this._monsterDamageText.alignIn(this._hitPointsBox, Phaser.CENTER, 0, 3)
    this._monsterDamageText.x = Math.floor(this._monsterDamageText.x)
    this._monsterDamageText.y = Math.floor(this._monsterDamageText.y)
}

Monster.prototype.showDetailImage = function () {
    this.detailSprite.revive()
}

Monster.prototype.hideDetailImage = function () {
    this.detailSprite.kill()
}

Monster.prototype.discard = function () {
    this.traySprite.destroy(true)
    this.detailSprite.destroy(true)
}
