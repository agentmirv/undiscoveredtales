//=========================================================
function BaseDialog(game) {
    Phaser.Group.call(this, game);
    this.onOpen = new Phaser.Signal();
    this.onClose = new Phaser.Signal();
    this._processActions = MakeProcessActions(game);
}

BaseDialog.prototype = Object.create(Phaser.Group.prototype);
BaseDialog.prototype.constructor = BaseDialog;

BaseDialog.prototype.open = function () {
    var fadeInTween = this.game.add.tween(this).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);

    fadeInTween.onComplete.addOnce(function () {
        this.onOpen.dispatch();
    }, this);

}

BaseDialog.prototype.close = function () {
    var fadeOutTween = this.game.add.tween(this).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);

    fadeOutTween.onComplete.addOnce(function () {
        this.onClose.dispatch();
        this.game.player.cutSceneCamera = false;
        this.destroy(true);
    }, this);
}

BaseDialog.prototype.closeImmediately = function () {
    this.onClose.dispatch();
    this.game.player.cutSceneCamera = false;
    this.destroy(true);
}

BaseDialog.prototype.processActions = function (buttonData) {
    return function () { 
        this.onClose.addOnce(function () {
            this._processActions(buttonData);
        }, this);
        this.close();
    }
}

//=========================================================
function MakeProcessActions(game) {
    return function (buttonData) {
        if (buttonData) {
            // Process all actions
            // Look for button data and action aray
            if (buttonData != null && buttonData.hasOwnProperty("actions")) {
                // Loop on actions array
                for (var i = 0; i < buttonData.actions.length; i++) {
                    // Process each action
                    var action = buttonData.actions[i];

                    // Actions
                    if (action.type == "setGlobal") {
                        //=========================================================
                        // Set Global
                        var globalVar = game.gamedata.globalVars.find(function (item) { return item.id == action.globalId });
                        globalVar.value = action.value
                        
                    } else if (action.type == "removeTokens") {
                        //=========================================================
                        // Remove Tokens
                        // Loop on tokenIds array
                        for (var j = 0; j < action.tokenIds.length; j++) {
                            var id = action.tokenIds[j];
                            // Remove Id
                            var token = game.gamedataInstances.mapTokens.find(function (item) { return item.id == id })
                            if (token != null) {
                                token.fadeOut();
                            }
                        }
                    } else if (action.type == "startReveal") {
                        //=========================================================
                        // Start Reveal
                        StartRevealGroup(game, action.revealGroupId)
                    } else if (action.type == "continueReveal") {
                        //=========================================================
                        // Continue Reveal
                        ContinueRevealGroup(game, buttonData.revealGroup)
                    } else if (action.type == "dialog") {
                        //=========================================================
                        // Continue Dialog
                        ContinueDialogGroup(game, action.dialogId, buttonData.dialogGroup)
                    } else if (action.type == "hud") {
                        //=========================================================
                        // Hud Commands                        
                        if (action.command == "startPlayerPhase") {
                            // Start Player Phase
                            game.hud.startPlayerPhase();
                        } else if (action.command == "scenarioEventEnd") {
                            // Scenario Event End
                            buttonData.dialogGroup.doneSignal.dispatch();
                        } else if (action.command == "makeMonster") {
                            // Make Monster
                            game.hud.makeMonster(action.monsterId);
                        }  
                    }  
                }
            }
        }
    }
}
