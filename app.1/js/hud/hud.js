//=========================================================
function Hud(game) {
    Phaser.Group.call(this, game);

    this.phase = "";
    this.step = "";
    this.isFireActive = false;
    this.randomEventDeck = [];
    this.monsterInstances = [];
    this.monsterIndex = -1;
    this.monsterSelected = null;
    this.attacks = {};
    this.monsterDialogLayer = game.make.group();
    this.discardDialogLayer = game.make.group();
    this.evadeActive = false;
    this.attackActive = false;
    this.discardActive = false;
    
    //=========================================================
    // Dark Background
    this.darkBackground = new DarkBackground(game);
    this.addChild(this.darkBackground);
    
    //=========================================================
    // Monster Tray
    this.monsterTray = new MonsterTray(game);
    this.monsterTray.onClose.add(function () {
        this.monsterSelected = null;
    }, this);
    this.addChild(this.monsterTray);

    //=========================================================
    // Monster Detail
    this.monsterDetail = new MonsterDetail(game);
    this.monsterDetail.onAdd.add(function () {
        if (!this.discardActive) {
            this.monsterSelected.addDamage();
            this.monsterDetail.setDamage(this.monsterSelected);
        }
    }, this);
    this.monsterDetail.onSubtract.add(function () {
        if (!this.discardActive) {
            this.monsterSelected.subtractDamage();
            this.monsterDetail.setDamage(this.monsterSelected);
        }
    }, this);
    this.monsterDetail.onAttack.add(function () {
        if (this.phase == "player" && !this.attackActive) {
            this.attackActive = true;
            var doneSignal = new Phaser.Signal();
            doneSignal.addOnce(function () {
                this.attackActive =  false;
            }, this);
            MakePlayerAttackDialog(game, doneSignal, this.monsterDialogLayer);
        }
    }, this);
    this.monsterDetail.onEvade.add(function () {
        if (this.phase == "player" && !this.evadeActive) {
            this.evadeActive = true;
            if (!this.monsterSelected.source.hasOwnProperty("evadeDeck") || this.monsterSelected.source.evadeDeck.length == 0)
            {
                this.monsterSelected.source.evadeDeck = Helper.shuffle(this.monsterSelected.source.evades.slice(0));
            }
            var evadeData = this.monsterSelected.source.evadeDeck.pop();
            var doneSignal = new Phaser.Signal();
            doneSignal.addOnce(function () {
                this.evadeActive =  false;
            }, this);
            MakeEvadeConfirmDialog(game, evadeData, doneSignal, this.monsterDialogLayer);
        }
    }, this);
    this.addChild(this.monsterDetail);

    //=========================================================
    // End Phase Button
    this.endPhaseButton = new HudButton(game, "endPhase-image-player", "endPhase-image-enemy");
    this.endPhaseButton.alignIn(game.stageViewRect, Phaser.BOTTOM_RIGHT, 0, 0);
    this.endPhaseButton.onClick.add(function () {
        var monsterTrayDoneSignal = new Phaser.Signal();
        monsterTrayDoneSignal.addOnce(function () {
            var phaseDialog = MakePhaseDialog(game, this.phase);
            phaseDialog.onConfirm.addOnce(function () {
                if (this.phase == "player") {
                    this.playerPhaseEnd.dispatch();
                } else {
                    this.horrorStepEnd.dispatch();
                }
            }, this);
        }, this);
        this.monsterTray.hide(monsterTrayDoneSignal);
        this.darkBackground.hide();
        this.monsterDetail.hide();
    }, this);
    this.addChild(this.endPhaseButton);

    //=========================================================
    // Inventory Button
    this.inventoryButton = new HudButton(game, "inventory-image-player", "inventory-image-enemy");
    this.inventoryButton.alignIn(game.stageViewRect, Phaser.BOTTOM_LEFT, -192, 0);
    this.inventoryButton.onClick.add(function () {
        // TODO
    }, this);
    this.addChild(this.inventoryButton);

    //=========================================================
    // Monster Button
    this.monsterButton = new HudButton(game, "monster-image-player", "monster-image-enemy");
    this.monsterButton.alignIn(game.stageViewRect, Phaser.BOTTOM_LEFT, -96, 0);
    var monsterButtonPressed = false;
    this.monsterButton.onClick.add(function () {
        if ((this.phase == "player" || this.step == "horror") && !monsterButtonPressed) {
            monsterButtonPressed = true;
            var monsterTrayDoneSignal = new Phaser.Signal();
            monsterTrayDoneSignal.addOnce(function () {
                monsterButtonPressed = false;
            }, this);
            if (this.monsterTray.isOpen) {
                this.monsterTray.hide(monsterTrayDoneSignal);
                this.darkBackground.hide();
                this.monsterDetail.hide();
            } else {
                this.monsterTray.show(monsterTrayDoneSignal);
                this.darkBackground.show();
            }
        }
    }, this);
    this.addChild(this.monsterButton);

    //=========================================================
    // Menu Button
    this.menuButton = new HudButton(game, "menu-image-player", "menu-image-enemy");
    this.menuButton.alignIn(game.stageViewRect, Phaser.BOTTOM_LEFT, 0, 0);
    this.menuButton.onClick.add(function () {
        // TODO
    }, this);
    this.addChild(this.menuButton);

    //=========================================================
    // Dialog Layers
    this.addChild(this.monsterDialogLayer);
    this.addChild(this.discardDialogLayer);

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
        if(this.monsterInstances.length > 0) {
            var monsterTrayDoneSignal = new Phaser.Signal();
            monsterTrayDoneSignal.addOnce(function () {
                var doneSignal = new Phaser.Signal();
                doneSignal.addOnce(function () {
                    this.monsterStepEnd.dispatch();
                }, this);
                this.monsterStep(doneSignal);
            }, this);
            this.monsterTray.show(monsterTrayDoneSignal);
            this.darkBackground.show();
            this.monsterDetail.show();
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
        if(this.monsterInstances.length > 0) {
            var monsterTrayDoneSignal = new Phaser.Signal();
            monsterTrayDoneSignal.addOnce(function () {
                var horrorDialog = MakeHorrorDialog(game);
            }, this);
            this.monsterTray.show(monsterTrayDoneSignal);
            this.darkBackground.show();
        } else {
            this.horrorStepEnd.dispatch();
        }
    }, this);
    
    this.horrorStepEnd.add(function () {
        console.log("horrorStepEnd");
        this.enemyPhaseEnd.dispatch();
    }, this);
    
    //=========================================================
    // Enemy Phase End
    this.enemyPhaseEnd.add(function() {
        console.log("enemyPhaseEnd");
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
        if (this.phase == "player") {
            this.menuButton.playerPhase();
            this.monsterButton.playerPhase();
            this.inventoryButton.playerPhase();
            this.endPhaseButton.playerPhase();
        } else {
            this.menuButton.enemyPhase();
            this.monsterButton.enemyPhase();
            this.inventoryButton.enemyPhase();
            this.endPhaseButton.enemyPhase();
        }
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
            // Check if the target MapTile is revealed
            if (visibleMapTileIds.indexOf(drawRandomEvent.mapTile) >= 0) {
                randomEventData = drawRandomEvent;
                randomEventData.doneSignal = doneSignal;
            }
        } else if (drawRandomEvent.hasOwnProperty("target") && drawRandomEvent.target == "investigator") {
            // Get random investigator
            var mathRandom = Math.random();
            var randomIndex = Math.floor(mathRandom * this.game.gamedata.investigators.length);
            var investigator = this.game.gamedata.investigators[randomIndex];

            randomEventData = drawRandomEvent;
            randomEventData.investigator = investigator;
            randomEventData.doneSignal = doneSignal;
            
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

                // Only supporting reveals now, since we know when those are completed
                if (scenarioEvent.action.type == "startReveal" && scenarioEvent.action.revealGroupId != null) {
                    StartRevealGroup(game, scenarioEvent.action.revealGroupId, doneSignal);
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
    // Set Tray Sprite (Place in Monster Tray)
    this.monsterTray.putMonster(monsterInstance, this.monsterInstances.length);
    // Set Detail Sprite (Place in Monster Detail)
    this.monsterDetail.setDetailImage(monsterInstance);
    this.monsterDetail.setDetailText(monsterInstance);
    // Add Monster to instance list
    this.monsterInstances.push(monsterInstance);
    
    // Wire up Monster Selection Signal
    monsterInstance.onSelected.add(function (monster) {
        console.log(monster);
        if (this.phase == "player") {
            if (this.monsterSelected == null) {
                this.monsterSelected = monster;
                this.monsterSelected.showDetail();
                this.monsterDetail.setDetailText(monster);
                this.monsterDetail.show();
            } else if (this.monsterSelected == monster) {
                this.monsterSelected.hideDetail();
                this.monsterSelected = null;
                this.monsterDetail.hide();
            } else {
                this.monsterSelected.hideDetail();
                this.monsterSelected = monster;
                this.monsterSelected.showDetail();
                this.monsterSelected.showDetail();
                this.monsterDetail.setDetailText(monster);
            }
        } else {
            // Horror Check Dialogs
            var horrorCheckDialog = MakeHorrorCheckConfirmDialog(game);
            horrorCheckDialog.onConfirm.addOnce(function () {
                this.monsterSelected = monster;
                if (!this.monsterSelected.source.hasOwnProperty("horrorDeck") || this.monsterSelected.source.horrorDeck.length == 0)
                {
                    this.monsterSelected.source.horrorDeck = Helper.shuffle(this.monsterSelected.source.horrors.slice(0));
                }
                var horrorData = this.monsterSelected.source.horrorDeck.pop();
                MakeHorrorCheckDialog(this.game, horrorData.text);
            }, this);
        }
    }, this);
    
    // Wire up Monster Discard Signal
    monsterInstance.onDiscard.add(function () {
        this.discardActive = true;
        this.monsterDialogLayer.visible = false;
        
        var dialogInstance = MakeDiscardDialog(game, this.monsterSelected, this.discardDialogLayer);
        dialogInstance.onConfirm.addOnce(function () {
            this.discardMonster();
            this.monsterDetail.hide();
            this.discardActive = false;
            this.monsterDialogLayer.visible = true;
        }, this);
        dialogInstance.onCancel.addOnce(function () {
            this.monsterSelected.subtractDamage();
            this.monsterDetail.setDamage(this.monsterSelected);
            this.discardActive = false;
            this.monsterDialogLayer.visible = true;
        }, this);
    }, this);
    
}

//=========================================================
// Monster Step
Hud.prototype.monsterStep = function (doneSignal) {
    // Select next monster
    this.monsterIndex++;
    
    if (this.monsterIndex < this.monsterInstances.length) {
        // Get Next Monster
        this.monsterSelected = this.monsterInstances[this.monsterIndex];
        this.monsterSelected.showDetail();
        if (this.monsterIndex > 0) {
            this.monsterInstances[this.monsterIndex - 1].hideDetail();
        }

        // TODO The Innsmouth Mob does not always have an attack, while still being in the monster tray
        // Get Random Attack
        if (!this.monsterSelected.source.hasOwnProperty("attackDeck") || this.monsterSelected.source.attackDeck.length == 0)
        {
            this.monsterSelected.source.attackDeck = Helper.shuffle(this.monsterSelected.source.attacks.slice(0))
        }
        var attackData = this.monsterSelected.source.attackDeck.pop();

        // Display monster attack dialog
        var nextSignal = new Phaser.Signal();
        var dialog = MakeMonsterAttackDialog(this.game, attackData, nextSignal, this.monsterDialogLayer);
        nextSignal.addOnce(function () {
            this.monsterStep(doneSignal);
        }, this);
        
    } else {
        this.monsterIndex = -1;
        var monsterTrayDoneSignal = new Phaser.Signal();
        monsterTrayDoneSignal.addOnce(function () {
            doneSignal.dispatch();        
        }, this);
        this.monsterTray.hide(monsterTrayDoneSignal);
        this.darkBackground.hide();
        this.monsterDetail.hide();
    }
}

//=========================================================
// Discard Monster
Hud.prototype.discardMonster = function () {
    // Remove from List
    this.monsterInstances = this.monsterInstances.filter(function (value) { return value != this.monsterSelected });

    // Reposition remaining monsters in tray
    for (var i = 0; i < this.monsterInstances.length; i++) {
        this.monsterTray.putMonster(this.monsterInstances[i], i);
    }

    this.monsterSelected.discard();
    this.monsterSelected = null;
}
