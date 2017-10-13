//=========================================================
function DarkBackground(game) {
    Phaser.Sprite.call(this, game, game.stageViewRect.x, game.stageViewRect.y, 'pixelBlack');
    
    this.width = game.stageViewRect.width;
    this.height = game.stageViewRect.height;
    this.alpha = 0.9
    this.inputEnabled = true;
    this.kill();
}

DarkBackground.prototype = Object.create(Phaser.Sprite.prototype);
DarkBackground.prototype.constructor = DarkBackground;

DarkBackground.prototype.show = function () {
    if (!this.visible) {
        this.alpha = 0.9;
        this.revive();
        var fadeTween = this.game.add.tween(this).from({ alpha: 0 }, 150, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}

DarkBackground.prototype.hide = function () {
    if (this.visible) {
        var fadeTween = this.game.add.tween(this).to({ alpha: 0 }, 150, Phaser.Easing.Linear.None, true, 0, 0, false);
        fadeTween.onComplete.addOnce(function () {
            this.alpha = 0;
            this.kill();
        }, this);
    }
}

//=========================================================
function HudButton(game, greenImageId, redImageId) {
    Phaser.Group.call(this, game);
    this.onClick = new Phaser.Signal();
    
    // End Phase (Green)
    this.greenbg = game.make.image(0, 0, Helper.getImage(greenImageId));
    this.addChild(this.greenbg);

    // End Phase (Red)
    this.redbg = game.make.image(0, 0, Helper.getImage(redImageId));
    this.addChild(this.redbg);
    this.redbg.kill();

    // End Phase Button
    var button = game.make.sprite(this.greenbg.x, this.greenbg.y, 'pixelTransparent');
    button.width = this.greenbg.width;
    button.height = this.greenbg.height;
    button.inputEnabled = true;
    button.events.onInputUp.add(function () {
        this.onClick.dispatch();
    }, this);
    this.addChild(button);
}

HudButton.prototype = Object.create(Phaser.Group.prototype);
HudButton.prototype.constructor = HudButton;

//=========================================================
function MonsterTray(game) {
    Phaser.Group.call(this, game);

    this.open = false;
    
    // Monster Tray
    var monsterTrayBgImage = game.make.tileSprite(0, 0, 96 * 8, 96, "hudButton")
    monsterTrayBgImage.alignIn(game.stageViewRect, Phaser.BOTTOM_LEFT, -96 * 3.7, 0)
    monsterTrayBgImage.tint = "0x044500"
    
    this.addChild(monsterTrayBgImage);
    
    this.y += 96;
}

MonsterTray.prototype = Object.create(Phaser.Group.prototype);
MonsterTray.prototype.constructor = MonsterTray;

MonsterTray.prototype.show = function () {
    if (!this.open) {
        this.open = true
        var slideTween = this.game.add.tween(this).to({ y: this.y - 96 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}

MonsterTray.prototype.hide = function () {
    if (this.open) {
        this.open = false
        var slideTween = this.game.add.tween(this).to({ y: this.y + 96 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}

//=========================================================
function MonsterDetail(game) {
    Phaser.Group.call(this, game);

    this.open = false;
    var textStyle = { font: "24px Times New Romans", fill: "#ffffff", align: "center" };

    //var monsterDetailGroup = game.make.group()
    var background = game.make.tileSprite(0, 0, 96 * 3, 96 * 4, "hudButton")
    background.alignIn(game.stageViewRect, Phaser.TOP_LEFT, 0, 0)
    background.tint = "0x044500"
    this.addChild(background);

    // Hit Points
    var hitPointBox = new OutlineBox(game, 50, 50)
    hitPointBox.alignIn(background, Phaser.TOP_LEFT, -10, -10)
    this.addChild(hitPointBox);

    var hitPointText = game.make.text(0, 0, "0", textStyle);
    hitPointText.alignIn(hitPointBox, Phaser.CENTER, 0, 3)
    this.addChild(hitPointText);

    // Name
    var nameBox = new OutlineBox(game, 200, 32)
    nameBox.alignIn(background, Phaser.CENTER, 0, 0)
    this.addChild(nameBox);

    var nameText = game.make.text(0, 0, "Name", textStyle);
    nameText.alignIn(nameBox, Phaser.CENTER, 0, 3)
    this.addChild(nameText);

    // Damage
    var damageBox = new OutlineBox(game, 50, 50)
    damageBox.alignTo(nameBox, Phaser.BOTTOM_CENTER, 0, 10)
    this.addChild(damageBox);

    var damageText = game.make.text(0, 0, "0", textStyle);
    damageText.alignIn(damageBox, Phaser.CENTER, 0, 3)
    this.addChild(damageText);

    // Subtract number
    var subtractBox = new OutlineBox(game, 50, 50)
    subtractBox.alignTo(nameBox, Phaser.BOTTOM_CENTER, -64, 10)
    this.addChild(subtractBox);

    var subtractText = game.make.text(0, 0, "-", textStyle);
    subtractText.alignIn(subtractBox, Phaser.CENTER, 0, 3)
    this.addChild(subtractText);

    var subtractButton = game.make.sprite(subtractBox.x, subtractBox.y, 'pixelTransparent');
    subtractButton.width = subtractBox.width;
    subtractButton.height = subtractBox.height;
    subtractButton.inputEnabled = true;
    //subtractButton.events.onInputUp.add(this.monsterSubtractClicked, this);
    this.addChild(subtractButton);

    // Add number
    var addNumber = new OutlineBox(game, 50, 50)
    addNumber.alignTo(nameBox, Phaser.BOTTOM_CENTER, 64, 10)
    this.addChild(addNumber);

    var addText = game.make.text(0, 0, "+", textStyle);
    addText.alignIn(addNumber, Phaser.CENTER, 0, 3)
    this.addChild(addText);

    var addButtom = game.make.sprite(addNumber.x, addNumber.y, 'pixelTransparent');
    addButtom.width = addNumber.width;
    addButtom.height = addNumber.height;
    addButtom.inputEnabled = true;
    //addButtom.events.onInputUp.add(this.monsterAddClicked, this);
    this.addChild(addButtom);

    // Attack
    var dialogAttack = new DialogButtonThin(game, "Attack", 200);
    dialogAttack.alignTo(nameBox, Phaser.BOTTOM_CENTER, 0, 82)
    this.addChild(dialogAttack);

    var attackButton = game.make.sprite(dialogAttack.x, dialogAttack.y, 'pixelTransparent');
    attackButton.width = dialogAttack.width;
    attackButton.height = dialogAttack.height;
    attackButton.inputEnabled = true;
    //attackButton.events.onInputUp.add(this.monsterAttackClicked, this);
    this.addChild(attackButton);

    // Evade
    var dialogEvade = new DialogButtonThin(game, "Evade", 200);
    dialogEvade.alignTo(nameBox, Phaser.BOTTOM_CENTER, 0, 130)
    this.addChild(dialogEvade);

    var evadeButton = game.make.sprite(dialogEvade.x, dialogEvade.y, 'pixelTransparent');
    evadeButton.width = dialogEvade.width;
    evadeButton.height = dialogEvade.height;
    evadeButton.inputEnabled = true;
    //evadeButton.events.onInputUp.add(this.monsterEvadeClicked, this);
    this.addChild(evadeButton);
    
    this.x -= 96 * 4
}

MonsterDetail.prototype = Object.create(Phaser.Group.prototype);
MonsterDetail.prototype.constructor = MonsterDetail;

MonsterDetail.prototype.show = function () {
    if (!this.open) {
        this.open = true;
        var slideTween = this.game.add.tween(this).to({ x: this.x + 96 * 4 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}

MonsterDetail.prototype.hide = function () {
    if (this.open) {
        this.open = false;
        var slideTween = this.game.add.tween(this).to({ x: this.x - 96 * 4 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}

