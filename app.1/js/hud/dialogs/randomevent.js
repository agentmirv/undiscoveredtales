/* global Phaser */
//=========================================================
function MakeRandomEventDialog(game, dialogData, dialogGroup) {
    var dialogInstance = new RandomEventDialog(game, dialogData, dialogGroup);

    game.stage.addChild(dialogInstance);
    dialogInstance.open();
}

//=========================================================
function RandomEventDialog(game, dialogData, dialogGroup) {
    BaseDialog.call(this, game);

    var data = null;

    var eventText = dialogData.text;

    if (dialogData.hasOwnProperty("target") && dialogData.target == "investigator") {
        // Get random investigator
        var mathRandom = Math.random();
        var randomIndex = Math.floor(mathRandom * game.gamedata.investigators.length);
        var randomInvestigatorData = game.gamedata.investigators[randomIndex];

        // Replace investigator name
        eventText = eventText.replace(/<name>/g, randomInvestigatorData.name);

        // Replace investigator pronoun
        var reInvestigatorPronoun = new RegExp("<" + randomInvestigatorData.pronoun + ":(.+?)>", "g");
        eventText = eventText.replace(reInvestigatorPronoun, "$1");

        // Remove remaining pronoun
        eventText = eventText.replace(/<.+?:.+?>/g, "");
    }

    // Modal
    var modalBackground = new DialogModalBackground(game);
    this.addChild(modalBackground);

    // Message
    var dialogMessage = new DialogMessage(game, eventText, dialogData.imageKey);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER, 0, -game.presentationOffsetY)
    this.addChild(dialogMessage);

    if (dialogData.type == "resolve") {
        // Button for [No Effect]
        var dialogCancel = new DialogButtonThin(game, "No Effect", 280);
        dialogCancel.alignTo(dialogMessage, Phaser.BOTTOM_LEFT, -10, 10);
        dialogCancel.buttonInput.events.onInputUp.add(function () {
            this.onClose.addOnce(function () {
                dialogGroup.doneSignal.dispatch();
            }, this);
            this.close();
        }, this);
        this.addChild(dialogCancel);
    
        // Button for [Resolve Effect]
        var dialogAction = new DialogButtonThin(game, "Resolve Effect", 280);
        dialogAction.alignTo(dialogMessage, Phaser.BOTTOM_RIGHT, -10, 10)
        dialogAction.buttonInput.events.onInputUp.add(function () {
            this.onClose.addOnce(function () {
                if (dialogGroup.dialogs.length > 1) {
                    MakeRandomEventDialog(this.game, dialogGroup.dialogs[1], dialogGroup);
                } else {
                    dialogGroup.doneSignal.dispatch();
                }
            }, this);
            this.close();
        }, this);
        this.addChild(dialogAction);
        
    } else {
        // Button for [Continue]
        var dialogContinue = new DialogButtonThin(game, "Continue", 180);
        dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
        dialogContinue.buttonInput.events.onInputUp.add(function () {
            this.onClose.addOnce(function () {
                dialogGroup.doneSignal.dispatch();
            }, this);
            this.close();
        }, this);
        this.addChild(dialogContinue);
    }
}

RandomEventDialog.prototype = Object.create(BaseDialog.prototype);
RandomEventDialog.prototype.constructor = RandomEventDialog;
