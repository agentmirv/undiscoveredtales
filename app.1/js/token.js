/* global Phaser */
//=========================================================
function MakeToken(game, id) {
    var tokenData = game.gamedata.mapTokens.find(function (item) { return item.id == id });

    var tokenInstance = new TokenSprite(
        game,
        tokenData.id,
        tokenData.x,
        tokenData.y,
        tokenData.imageKey,
        tokenData.dialogGroupId,
        tokenData.addToWorld);

    game.gamedataInstances.mapTokens.push(tokenInstance);
    game.add.tween(tokenInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    
    if (tokenInstance.addToWorld) {
        game.tokenLayer.addChild(tokenInstance);
    }

    return tokenInstance;
}

//=========================================================
function TokenSprite(game, id, x, y, imageKey, dialogGroupId, addToWorld) {
    Phaser.Sprite.call(this, game, x, y, ImageHelper.getImage(game, imageKey));

    this.id = id
    this.imageKey = imageKey;
    this.dialogGroupId = dialogGroupId;
    this.addToWorld = addToWorld;

    if (this.dialogGroupId != null) {
        this.inputEnabled = true;
        this.events.onInputUp.add(this.tokenClicked, this);
    }
}

TokenSprite.prototype = Object.create(Phaser.Sprite.prototype);
TokenSprite.prototype.constructor = TokenSprite;

TokenSprite.prototype.tokenClicked = function (token, pointer) {
    if (this.game.player.cutSceneCamera) return;

    var movePlayer = new Phaser.Point()
    movePlayer.x = token.centerX + 300 - 20 - 48 //half message width - left margin - half image width
    movePlayer.y = token.centerY + game.presentationOffsetY

    var playerMove = this.game.player.Move(movePlayer);
    
    playerMove.onStart.addOnce(function () {
        //console.log("move onStart");
    });

    playerMove.onComplete.addOnce(function () {
        //console.log("move onComplete");
        StartDialogGroup(game, this.dialogGroupId);
    }, this);
    
    playerMove.Start();
}

TokenSprite.prototype.fadeOut = function () {
    var fadeOutTween = this.game.add.tween(this).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    fadeOutTween.onComplete.addOnce(function () {
        this.removeInstance();
        this.game.tokenLayer.removeChild(this);
        this.destroy(true);
    }, this);
}

TokenSprite.prototype.removeInstance = function () {
    var instanceIndex = -1;
    this.game.gamedataInstances.mapTokens.find(function (item, index) { 
        var match = false;
        
        if (item.id == this.id) {
            match = true;
            instanceIndex = index;
        }
        
        return match;
    })
    
    if (instanceIndex >= 0) {
        this.game.gamedataInstances.mapTokens.splice(instanceIndex, 1);
    }
}    