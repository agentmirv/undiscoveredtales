//=========================================================
function Hud(game) {
    Phaser.Group.call(this, game);

    this.phase = "";
    this.step = "";
    this.isFireActive = false;
    this.randomEventDeck = [];
    this.monsterInstances = [];
    this.monsterIndex = -1;

    //=========================================================
    // Dark Background
    this.darkBackground = new DarkBackground(game);
    this.addChild(this.darkBackground);
    
    //=========================================================
    // Monster Tray
    this.monsterTray = new MonsterTray(game);
    this.addChild(this.monsterTray);

    //=========================================================
    // Monster Detail
    this.monsterDetail = new MonsterDetail(game);
    this.addChild(this.monsterDetail);

    //=========================================================
    // End Phase Button
    var endPhaseButton = new HudButton(game, "endPhase-image-player", "endPhase-image-enemy");
    endPhaseButton.alignIn(game.stageViewRect, Phaser.BOTTOM_RIGHT, 0, 0);
    endPhaseButton.onClick.add(function () {
        this.monsterTray.hide();
        this.darkBackground.hide();
        this.monsterDetail.hide();
        var phaseDialog = MakePhaseDialog(game, this.phase);
        phaseDialog.onConfirm.addOnce(function () {
            this.playerPhaseEnd.dispatch();
        }, this);
    }, this);
    this.addChild(endPhaseButton);

    //=========================================================
    // Inventory Button
    var inventoryButton = new HudButton(game, "inventory-image-player", "inventory-image-enemy");
    inventoryButton.alignIn(game.stageViewRect, Phaser.BOTTOM_LEFT, -192, 0);
    this.addChild(inventoryButton);

    //=========================================================
    // Monster Button
    var monsterButton = new HudButton(game, "monster-image-player", "monster-image-enemy");
    monsterButton.alignIn(game.stageViewRect, Phaser.BOTTOM_LEFT, -96, 0);
    monsterButton.onClick.add(function () {
        if (this.phase == "player" || this.step == "horror") {
            if (this.monsterTray.isOpen) {
                this.monsterTray.hide();
                this.darkBackground.hide();
                this.monsterDetail.hide();
            } else {
                this.monsterTray.show();
                this.darkBackground.show();
            }
        }
    }, this);
    this.addChild(monsterButton);

    //=========================================================
    // Menu Button
    var menuButton = new HudButton(game, "menu-image-player", "menu-image-enemy");
    menuButton.alignIn(game.stageViewRect, Phaser.BOTTOM_LEFT, 0, 0);
    menuButton.onClick.add(function () {
        // TODO
    }, this);
    this.addChild(menuButton);

    //=========================================================
    // Player Phase Steps
    this.playerPhaseBegin = new Phaser.Signal();
    this.playerPhaseEnd = new Phaser.Signal();
    
    //=========================================================
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
        this.step = "";
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
    // Enemy Phase Begin
    this.enemyPhaseBegin.add(function() {
        console.log("enemyPhaseBegin");
        this.fireStepBegin.dispatch();
    }, this);
    
    //=========================================================
    // Fire Step
    this.fireStepBegin.add(function () {
        console.log("fireStepBegin");
        this.step = "fire";
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

    //=========================================================
    // Random Event Step
    this.randomEventStepBegin.add(function () {
        console.log("randomEventStepBegin");
        this.step = "randomEvent";
        // Create Dialog(s) and wire up
        var doneSignal = new Phaser.Signal();
        doneSignal.addOnce(function () {
            this.randomEventStepEnd.dispatch();
        }, this);
        this.randomEventStep(doneSignal);
    }, this);
    
    this.randomEventStepEnd.add(function () {
        console.log("randomEventStepEnd");
        this.scenarioEventStepBegin.dispatch();
    }, this);

    //=========================================================
    // Scenario Event Step
    this.scenarioEventStepBegin.add(function () {
        console.log("scenarioEventStepBegin");
        this.step = "scenarioEvent";
        // Create Dialog(s) and wire up
        var doneSignal = new Phaser.Signal();
        doneSignal.addOnce(function () {
            this.scenarioEventStepEnd.dispatch();
        }, this);
        this.scenarioEventStep(doneSignal);
    }, this);
    
    this.scenarioEventStepEnd.add(function () {
        console.log("scenarioEventStepEnd");
        this.monsterStepBegin.dispatch();
    }, this);

    //=========================================================
    // Monster Step
    this.monsterStepBegin.add(function () {
        console.log("monsterStepBegin");
        this.step = "monster";
        // Create Dialog(s) and wire up
        // If no monsters, then call this.monsterStepEnd.dispatch();
        if(this.monsterInstances.length > 0) {
            this.monsterStep(doneSignal);
        } else {
            this.monsterStepEnd.dispatch();
        }
    }, this);
    
    this.monsterStepEnd.add(function () {
        console.log("monsterStepEnd");
        this.horrorStepBegin.dispatch();
    }, this);

    //=========================================================
    // Horror Step
    this.horrorStepBegin.add(function () {
        console.log("horrorStepBegin");
        this.step = "horror";
        // Create Dialog(s) and wire up
        // If no monsters, then call this.horrorStepEnd.dispatch();
        this.horrorStepEnd.dispatch();
    }, this);
    
    this.horrorStepEnd.add(function () {
        console.log("horrorStepEnd");
        this.enemyPhaseEnd.dispatch();
    }, this);
    
    //=========================================================
    // Enemy Phase End
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

//=========================================================
// Toggle Phase
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

//=========================================================
// Start Player Phase
Hud.prototype.startPlayerPhase = function () {
    var scene = this.togglePhase();
    scene.onComplete.addOnce(function () {
        this.playerPhaseBegin.dispatch();
    }, this);
}

//=========================================================
// Fire Step
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

//=========================================================
// Random Event Step
Hud.prototype.randomEventStep = function (doneSignal) {
    // TODO: certain scenario events can skip this step
    if (this.game.gamedata.randomEventGroups.length == 0 ){
        doneSignal.dispatch();
        return;
    }
    
    var visibleMapTileIds = [];
    for (var i = 0; i < this.game.gamedataInstances.mapTiles.length; i++) {
        visibleMapTileIds.push(this.game.gamedataInstances.mapTiles[i].id);
    }

    var randomEventData = null;
    while (randomEventData == null) {
        if (this.game.hud.randomEventDeck.length == 0) {
            this.game.hud.randomEventDeck = this.game.gamedata.randomEventGroups.slice(0); 
            this.game.hud.randomEventDeck = Helper.shuffle(this.game.hud.randomEventDeck);
        }

        var drawRandomEvent = this.game.hud.randomEventDeck.pop();
        
        if (drawRandomEvent.hasOwnProperty("target") && 
            drawRandomEvent.target == "mapTile" && 
            drawRandomEvent.hasOwnProperty("mapTile")) {
            if (visibleMapTileIds.indexOf(drawRandomEvent.mapTile) >= 0) {
                randomEventData = drawRandomEvent;
                randomEventData.doneSignal = doneSignal;
            }
        } else {
            randomEventData = drawRandomEvent;
            randomEventData.doneSignal = doneSignal;
        }
    }
    
    MakeRandomEventDialog(this.game, randomEventData.dialogs[0], randomEventData);
}

//=========================================================
// Scenario Event Step
Hud.prototype.scenarioEventStep = function (doneSignal) {
    var triggeredScenarioEvent = false
    // Evaluate all scenario events
    for (var i = 0; i < game.gamedata.scenarioEvents.length; i++) {
        var scenarioEvent = game.gamedata.scenarioEvents[i]
        // If the scenario event is not resolved
        if (!scenarioEvent.hasOwnProperty("resolved")) {
            var conditionResult = true
            // Evaluate all event conditions
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

            // If the conditions evaluate to true for this event
            if (conditionResult) {
                scenarioEvent.resolved = true
                triggeredScenarioEvent = true
                
                // The action is a dialog
                if (scenarioEvent.action.type == "dialog") {
                    StartDialogGroup(game, scenarioEvent.action.dialogGroupId, doneSignal)

                // The action is a reaveal
                } else if (scenarioEvent.action.type == "revealList" && scenarioEvent.action.revealGroupId != null) {
                    StartRevealGroup(game, scenarioEvent.action.revealListId, doneSignal);
                }

                break;
            }
        }
    }

    if (!triggeredScenarioEvent) {
        // If no scenario events were triggered, move on
        doneSignal.dispatch();
    }
}

//=========================================================
// Make Monster
Hud.prototype.makeMonster = function (id) {
    var monsterInstance = new Monster(this.game, id);
    this.monsterInstances.push(monsterInstance);
}

Hud.prototype.monsterStep = function (doneSignal) {
    // Select next monster
    this.monsterIndex++;
    
    if (this.monsterInstances.length >= this.monsterIndex) {
        // Get Next Monster
        var monsterInstance = this.monsterInstances[this.monsterIndex];
        // Set Detail Sprite (Place in Monster Detail)
        this.monsterDetail.setDetail(monsterInstance);
        // Set Tray Sprite (Place in Monster Tray)
        this.monsterTray.putMonster(monsterInstance, this.monsterIndex);
        
        this.monsterTray.show();
        this.darkBackground.show();
        this.monsterDetail.show();
    } else {
        this.monsterTray.show();
        this.darkBackground.hide();
        this.monsterDetail.hide();
        doneSignal.dispatch();        
    }
}

//=========================================================
// TODO Discard Monster
Hud.prototype.discardMonster = function () {
    // Remove from List
    var currentMonster = this.monsterInstances[this.monsterIndex];
    this.monsterInstances = this.monsterInstances.filter(function (value) { return value != currentMonster })

    // Reposition remaining monsters in tray
    for (var i = 0; i < this.monsterInstances.length; i++) {
        this.monsterInstances[i].alignInTray(i); // TODO move alignInTray to hud
    }

    game.hud.currentMonsterInstance.discard()
    game.hud.currentMonsterInstance = null
}
