function Monster(game, id) {
    var data = game.gamedata.monsters.find(function (item) { return item.id == id });

    // Monster Instance
    this.id = data.id
    this.source = game.gamedata.monsterSource.find(function (item) { return item.id == data.sourceId });

    // Monster Source
    this.name = data.name || this.source.name;
    this.imageKey = data.imageKey || this.source.imageKey;
    this.hitPoints = game.gamedata.investigators.length + parseInt(data.baseHitPoints || this.source.baseHitPoints);
    this.damage = 0;
    this.color = "";

    // Set Detail Sprite (Place in Monster Detail)
    this.detailSprite = game.make.sprite(0, 0, ImageHelper.getImage(game, this.imageKey));

    // Set Tray Sprite (Place in Monster Tray)
    this.traySprite = game.make.sprite(0, 0, ImageHelper.getImage(game, this.imageKey));
    //this.alignInTray(game.gamedataInstances.monsters.length)
    this.traySprite.inputEnabled = true;
    this.traySprite.events.onInputUp.add(function () {
        // dispatch signal?
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

    //game.hudInstance._monsterTray.addChild(this.traySprite)

    //game.gamedataInstances.monsters.push(this);
}
