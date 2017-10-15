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
    this.greenbg = game.make.image(0, 0, ImageHelper.getImage(game, greenImageId));
    this.addChild(this.greenbg);

    // End Phase (Red)
    this.redbg = game.make.image(0, 0, ImageHelper.getImage(game, redImageId));
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

    this.isOpen = false;
    
    // Monster Tray
    this.monsterTrayBgImage = game.make.tileSprite(0, 0, 96 * 8, 96, "hudButton")
    this.monsterTrayBgImage.alignIn(game.stageViewRect, Phaser.BOTTOM_LEFT, -96 * 3.7, 0)
    this.monsterTrayBgImage.tint = "0x044500"
    
    this.addChild(this.monsterTrayBgImage);
    
    this.y += 96;
}

MonsterTray.prototype = Object.create(Phaser.Group.prototype);
MonsterTray.prototype.constructor = MonsterTray;

MonsterTray.prototype.show = function () {
    if (!this.isOpen) {
        this.isOpen = true
        var slideTween = this.game.add.tween(this).to({ y: this.y - 96 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}

MonsterTray.prototype.hide = function () {
    if (this.isOpen) {
        this.isOpen = false
        var slideTween = this.game.add.tween(this).to({ y: this.y + 96 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}

MonsterTray.prototype.putMonster = function (monsterInstance, position) {
    var xOffset = position * 96;
    monsterInstance.traySprite.alignIn(this.monsterTrayBgImage, Phaser.BOTTOM_LEFT, -xOffset, 0);
    this.addChild(monsterInstance.traySprite)
}


//=========================================================
function MonsterDetail(game) {
    Phaser.Group.call(this, game);

    this.onAdd = new Phaser.Signal();
    this.onSubtract = new Phaser.Signal();
    this.onAttack = new Phaser.Signal();
    this.onEvade = new Phaser.Signal();

    this.open = false;
    var textStyle = { font: "24px Times New Romans", fill: "#ffffff", align: "center" };

    var background = game.make.tileSprite(0, 0, 96 * 3, 96 * 4, "hudButton");
    background.alignIn(game.stageViewRect, Phaser.TOP_LEFT, 0, 0);
    background.tint = "0x044500";
    this.addChild(background);

    // Hit Points
    this.hitPointBox = new OutlineBox(game, 50, 50);
    this.hitPointBox.alignIn(background, Phaser.TOP_LEFT, -10, -10);
    this.addChild(this.hitPointBox);

    this.hitPointText = game.make.text(0, 0, "0", textStyle);
    this.hitPointText.alignIn(this.hitPointBox, Phaser.CENTER, 0, 3);
    this.addChild(this.hitPointText);

    // Name
    this.nameBox = new OutlineBox(game, 200, 32);
    this.nameBox.alignIn(background, Phaser.CENTER, 0, 0);
    this.addChild(this.nameBox);

    this.nameText = game.make.text(0, 0, "Name", textStyle);
    this.nameText.alignIn(this.nameBox, Phaser.CENTER, 0, 3);
    this.addChild(this.nameText);

    // Damage
    this.damageBox = new OutlineBox(game, 50, 50);
    this.damageBox.alignTo(this.nameBox, Phaser.BOTTOM_CENTER, 0, 10);
    this.addChild(this.damageBox);

    this.damageText = game.make.text(0, 0, "0", textStyle);
    this.damageText.alignIn(this.damageBox, Phaser.CENTER, 0, 3);
    this.addChild(this.damageText);

    // Subtract number
    var subtractBox = new OutlineBox(game, 50, 50);
    subtractBox.alignTo(this.nameBox, Phaser.BOTTOM_CENTER, -64, 10);
    this.addChild(subtractBox);

    var subtractText = game.make.text(0, 0, "-", textStyle);
    subtractText.alignIn(subtractBox, Phaser.CENTER, 0, 3);
    this.addChild(subtractText);

    var subtractButton = game.make.sprite(subtractBox.x, subtractBox.y, 'pixelTransparent');
    subtractButton.width = subtractBox.width;
    subtractButton.height = subtractBox.height;
    subtractButton.inputEnabled = true;
    subtractButton.events.onInputUp.add(function () {
        this.onSubtract.dispatch();
    }, this);
    this.addChild(subtractButton);

    // Add number
    var addNumber = new OutlineBox(game, 50, 50);
    addNumber.alignTo(this.nameBox, Phaser.BOTTOM_CENTER, 64, 10);
    this.addChild(addNumber);

    var addText = game.make.text(0, 0, "+", textStyle);
    addText.alignIn(addNumber, Phaser.CENTER, 0, 3);
    this.addChild(addText);

    var addButton = game.make.sprite(addNumber.x, addNumber.y, 'pixelTransparent');
    addButton.width = addNumber.width;
    addButton.height = addNumber.height;
    addButton.inputEnabled = true;
    addButton.events.onInputUp.add(function () {
        this.onAdd.dispatch();
    }, this);
    this.addChild(addButton);

    // Attack
    var dialogAttack = new DialogButtonThin(game, "Attack", 200);
    dialogAttack.alignTo(this.nameBox, Phaser.BOTTOM_CENTER, 0, 82);
    this.addChild(dialogAttack);

    var attackButton = game.make.sprite(dialogAttack.x, dialogAttack.y, 'pixelTransparent');
    attackButton.width = dialogAttack.width;
    attackButton.height = dialogAttack.height;
    attackButton.inputEnabled = true;
    attackButton.events.onInputUp.add(function () {
        this.onAttack.dispatch();
    }, this);
    this.addChild(attackButton);

    // Evade
    var dialogEvade = new DialogButtonThin(game, "Evade", 200);
    dialogEvade.alignTo(this.nameBox, Phaser.BOTTOM_CENTER, 0, 130);
    this.addChild(dialogEvade);

    var evadeButton = game.make.sprite(dialogEvade.x, dialogEvade.y, 'pixelTransparent');
    evadeButton.width = dialogEvade.width;
    evadeButton.height = dialogEvade.height;
    evadeButton.inputEnabled = true;
    evadeButton.events.onInputUp.add(function () {
        this.onEvade.dispatch();
    }, this);
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

MonsterDetail.prototype.setDetail = function (monsterInstance) {
    // Sprite
    monsterInstance.detailSprite.alignIn(this, Phaser.CENTER, 96 * 4, -72);
    this.addChild(monsterInstance.detailSprite);
    
    // Name
    this.nameText.setText(monsterInstance.name);
    this.nameText.alignIn(this.nameBox, Phaser.CENTER, 0, 3);
    this.nameText.x = Math.floor(this.nameText.x);
    this.nameText.y = Math.floor(this.nameText.y);
    
    // Hit Points    
    this.hitPointText.setText(monsterInstance.hitPoints);
    this.hitPointText.alignIn(this.hitPointBox, Phaser.CENTER, 0, 3);

    // Damage
    this.damageText.setText(monsterInstance.damage);
    this.damageText.alignIn(this.damageBox, Phaser.CENTER, 0, 3);
}

MonsterDetail.prototype.setDamage = function (monsterInstance) {
    this.damageText.setText(monsterInstance.damage)
    this.damageText.alignIn(this.damageBox, Phaser.CENTER, 0, 3)
    this.damageText.x = Math.floor(this.damageText.x)
}

