function Monster(game, id) {
    var data = game.gamedata.monsters.find(function (item) { return item.id == id });
    this.onSelected = new Phaser.Signal();
    this.onDiscard = new Phaser.Signal();

    // Monster Instance
    this.id = data.id
    this.source = game.gamedata.monsterSource.find(function (item) { return item.id == data.sourceId });
    this.trayIndex = -1;

    // Monster Source
    this.name = data.name || this.source.name;
    this.imageKey = data.imageKey || this.source.imageKey;
    this.hitPoints = game.gamedata.investigators.length + parseInt(data.baseHitPoints || this.source.baseHitPoints);
    this.damage = 0;
    this.color = "";

    // Set Detail Sprite (Place in Monster Detail)
    this.detailSprite = game.make.sprite(0, 0, ImageHelper.getImage(game, this.imageKey));
    this.detailSprite.kill();

    // Set Tray Sprite (Place in Monster Tray)
    this.traySprite = game.make.sprite(0, 0, ImageHelper.getImage(game, this.imageKey));
    this.traySprite.inputEnabled = true;
    this.traySprite.events.onInputUp.add(function () {
        this.onSelected.dispatch(this);
     }, this);

    // Set Tray Sprite Hit Points
    this._trayHPBox = new OutlineBox(game, 32, 32);
    this.traySprite.addChild(this._trayHPBox);
    this._trayHPBox.x += 4;
    this._trayHPBox.y += 60;

    var textStyle = { font: "20px Times New Romans", fill: "#ffffff", align: "center" };
    this._trayHPText = game.make.text(0, 0, "0", textStyle);
    this._trayHPText.alignIn(this._trayHPBox, Phaser.CENTER, 0, 3);
    this.traySprite.addChild(this._trayHPText);
}

Monster.prototype.showDetail = function () {
    this.detailSprite.revive();
}

Monster.prototype.hideDetail = function () {
    this.detailSprite.kill();
}

Monster.prototype.addDamage = function () {
    this.damage++;
    this.updateDamage();
    if (this.damage == this.hitPoints) {
        this.onDiscard.dispatch();
    }
}

Monster.prototype.subtractDamage = function () {
    if (this.damage > 0) {
        this.damage--;
        this.updateDamage();
    }
}

Monster.prototype.updateDamage = function () {
    this._trayHPText.setText(this.damage);
    this._trayHPText.alignIn(this._trayHPBox, Phaser.CENTER, 0, 3);
    this._trayHPText.x = Math.floor(this._trayHPText.x);
    this._trayHPText.y = Math.floor(this._trayHPText.y);
}

Monster.prototype.discard = function () {
    this.traySprite.destroy(true);
    this.detailSprite.destroy(true);
}