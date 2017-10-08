//=========================================================
function Hud(game) {
    Phaser.Group.call(this, game);

    this.phase = "";
    this.isFireActive = false;

    var endPhaseButton = new HudButton(game, "endPhase-image-player", "endPhase-image-enemy");
    endPhaseButton.alignIn(game.stageViewRect, Phaser.BOTTOM_RIGHT, 0, 0);
    endPhaseButton.onClick.add(function () {
        // TODO Add the Confirm Dialog and phase change
        var phaseDialog = MakePhaseDialog(game, this.phase);
        phaseDialog.onConfirm.addOnce(function () {
            this.playerPhaseEnd.dispatch();
        }, this);
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

    // Player Phase Steps
    this.playerPhaseBegin = new Phaser.Signal();
    this.playerPhaseEnd = new Phaser.Signal();
    
    // Enemy Phase Steps
    this.enemyPhaseBegin = new Phaser.Signal();
    this.fireStepBegin = new Phaser.Signal();
    this.fireStepEnd = new Phaser.Signal();
    this.randomEventStepBegin = new Phaser.Signal();
    this.randomEventStepEnd = new Phaser.Signal();
    this.scenarioEventStepBegin = new Phaser.Signal();
    this.scenarioEventStepEnd = new Phaser.Signal();
    this.monsterStepBegin = new Phaser.Signal();
    this.monsterStepEnd = new Phaser.Signal();
    this.horrorStepBegin = new Phaser.Signal();
    this.horrorStepEnd = new Phaser.Signal();
    this.enemyPhaseEnd = new Phaser.Signal();
    
    //=========================================================
    // Player Phase
    this.playerPhaseBegin.add(function() {
        console.log("playerPhaseBegin");
    }, this);

    this.playerPhaseEnd.add(function () {
        console.log("playerPhaseEnd");
        // Create Scene and wire up
        var scene = this.togglePhase();
        scene.onComplete.addOnce(function () {
            this.enemyPhaseBegin.dispatch();
        }, this);
    }, this);
    
    //=========================================================
    // Enemy Phase
    this.enemyPhaseBegin.add(function() {
        console.log("enemyPhaseBegin");
        this.fireStepBegin.dispatch();
    }, this);
    
    // Fire Step
    this.fireStepBegin.add(function () {
        console.log("fireStepBegin");
        // Create Dialog and wire up
        var done = new Phaser.Signal();
        done.addOnce(function () {
            this.fireStepEnd.dispatch();
        }, this);
        this.fireStep(done);
    }, this);
    
    this.fireStepEnd.add(function () {
        console.log("fireStepEnd");
        this.randomEventStepBegin.dispatch();
    }, this);

    // Random Event Step
    this.randomEventStepBegin.add(function () {
        console.log("randomEventStepBegin");
        // Create Dialog(s) and wire up
        this.randomEventStepEnd.dispatch();
    }, this);
    
    this.randomEventStepEnd.add(function () {
        console.log("randomEventStepEnd");
        this.scenarioEventStepBegin.dispatch();
    }, this);

    // Scenario Event Step
    this.scenarioEventStepBegin.add(function () {
        console.log("scenarioEventStepBegin");
        // Create Dialog(s) and wire up
        this.scenarioEventStepEnd.dispatch();
    }, this);
    
    this.scenarioEventStepEnd.add(function () {
        console.log("scenarioEventStepEnd");
        this.monsterStepBegin.dispatch();
    }, this);

    // Monster Step
    this.monsterStepBegin.add(function () {
        console.log("monsterStepBegin");
        // Create Dialog(s) and wire up
        // If no monsters, then call this.monsterStepEnd.dispatch();
        this.monsterStepEnd.dispatch();
    }, this);
    
    this.monsterStepEnd.add(function () {
        console.log("monsterStepEnd");
        this.horrorStepBegin.dispatch();
    }, this);

    // Horror Step
    this.horrorStepBegin.add(function () {
        console.log("horrorStepBegin");
        // Create Dialog(s) and wire up
        // If no monsters, then call this.horrorStepEnd.dispatch();
        this.horrorStepEnd.dispatch();
    }, this);
    
    this.horrorStepEnd.add(function () {
        console.log("horrorStepEnd");
        this.enemyPhaseEnd.dispatch();
    }, this);
    
    this.enemyPhaseEnd.add(function() {
        console.log("enemyPhaseEnd");
        // Create Scene and wire up
        var scene = this.togglePhase();
        scene.onComplete.addOnce(function () {
            this.playerPhaseBegin.dispatch();
        }, this);
    }, this);
}

Hud.prototype = Object.create(Phaser.Group.prototype);
Hud.prototype.constructor = Hud;

Hud.prototype.togglePhase = function() {
    var scene = null;
    
    if (this.phase == "player") {
        this.phase = "enemy";
        scene = new EnemyPhaseScene(this.game);
    } else {
        this.phase = "player";
        scene = new PlayerPhaseScene(this.game);
    }

    scene.onStart.addOnce(function () {
        this.game.player.cutSceneCamera = true;
    }, this);

    scene.onFull.addOnce(function () {
        // switch the color of the main buttons
    }, this);
    
    scene.onComplete.addOnce(function () {
        this.game.player.cutSceneCamera = false;
    }, this);
    
    this.game.stage.addChild(scene);
    
    return scene;
}

Hud.prototype.startPlayerPhase = function () {
    var scene = this.togglePhase();
    scene.onComplete.addOnce(function () {
        this.playerPhaseBegin.dispatch();
    }, this);
}

Hud.prototype.fireStep = function (doneSignal) {
    if (this.isFireActive) {
        // Create Dialog and Wire up
        var fireDialog = MakeFireDialog(game);
        
        fireDialog.onExtinguished.addOnce(function () {
            this.isFireActive = false;
            doneSignal.dispatch();
        }, this);
        
        fireDialog.onSpreads.addOnce(function () {
            doneSignal.dispatch();
        }, this);
    } else {
        doneSignal.dispatch();
    }
}