//=========================================================
function Hud(game) {
    Phaser.Group.call(this, game);

    this.phase = "";

    var endPhaseButton = new HudButton(game, "endPhase-image-player", "endPhase-image-enemy");
    endPhaseButton.alignIn(game.stageViewRect, Phaser.BOTTOM_RIGHT, 0, 0);
    endPhaseButton.onClick.add(function () {
        // TODO Add the Confirm Dialog and phase change
    }, this);
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

Hud.prototype.startPlayerPhase = function() {
    // This can be called from: 1) After first Reveal, 2) Clicking the End Phase Button
    this.phase = "player";
    
    var scene = new PlayerPhaseScene(this.game);
    
    scene.onStart.addOnce(function () {
        this.game.player.cutSceneCamera = true;
    }, this);

    scene.onFull.addOnce(function () {
        // switch the color of the main buttons
    }, this);
    
    scene.onComplete.addOnce(function () {
        this.game.player.cutSceneCamera = false;
    }, this);
    
    this.game.stage.addChild(scene)
}

Hud.prototype.startEnemyPhase = function() {
    // This can be called from Clicking the End Phase Button
    this.phase = "enemy";
    
    var scene = new EnemyPhaseScene(this.game);
    
    scene.onStart.addOnce(function () {
        this.game.player.cutSceneCamera = true;
    }, this);

    scene.onFull.addOnce(function () {
        // switch the color of the main buttons
    }, this);
    
    scene.onComplete.addOnce(function () {
        this.game.player.cutSceneCamera = false;
        // Wire onComplete to start the Fire Step?
    }, this);
    
    this.game.stage.addChild(scene)
}
