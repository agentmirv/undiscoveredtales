//=========================================================
function Hud(game) {
    Phaser.Group.call(this, game);

    var endPhaseButton = new HudButton(game, "endPhase-image-player", "endPhase-image-enemy");
    endPhaseButton.alignIn(game.stageViewRect, Phaser.BOTTOM_RIGHT, 0, 0);
    this.addChild(endPhaseButton);

    var inventoryButton = new HudButton(game, "inventory-image-player", "inventory-image-enemy");
    inventoryButton.alignIn(game.stageViewRect, Phaser.BOTTOM_LEFT, -192, 0);
    this.addChild(inventoryButton);

    var monsterButton = new HudButton(game, "monster-image-player", "monster-image-enemy");
    monsterButton.alignIn(game.stageViewRect, Phaser.BOTTOM_LEFT, -96, 0);
    this.addChild(monsterButton);

    var menuButton = new HudButton(game, "menu-image-player", "menu-image-enemy");
    menuButton.alignIn(game.stageViewRect, Phaser.BOTTOM_LEFT, 0, 0);
    this.addChild(menuButton);
}

Hud.prototype = Object.create(Phaser.Group.prototype);
Hud.prototype.constructor = Hud;
