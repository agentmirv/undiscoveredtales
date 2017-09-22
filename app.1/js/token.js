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
        tokenData.clickId,
        tokenData.clickConditions,
        tokenData.addToWorld);

    game.gamedataInstances.mapTokens.push(tokenInstance);

    return tokenInstance;
}

//=========================================================
function TokenSprite(game, id, x, y, imageKey, clickId, clickConditions, addToWorld) {
    Phaser.Sprite.call(this, game, x, y, ImageHelper.getImage(game, imageKey));

    this.id = id
    this.imageKey = imageKey;
    this.clickId = clickId;
    this.clickConditions = clickConditions;
    this.addToWorld = addToWorld;

    if (this.clickId != null || this.clickConditions != null) {
        this.inputEnabled = true;
        this.events.onInputUp.add(this.tokenClicked, this);
    }
}

TokenSprite.prototype = Object.create(Phaser.Sprite.prototype);
TokenSprite.prototype.constructor = TokenSprite;

TokenSprite.prototype.tokenClicked = function (token, pointer) {
    if (this.game.player.cutSceneCamera) return;

    // this == token?
    var movePlayer = new Phaser.Point()
    movePlayer.x = token.centerX + 300 - 20 - 48 //half message width - left margin - half image width
    movePlayer.y = token.centerY + game.presentationOffsetY

    var playerMove = this.game.player.Move(movePlayer);
    
    playerMove.onStart.addOnce(function () {
        console.log("move onStart");
    });

    playerMove.onComplete.addOnce(function () {
        console.log("move onComplete");
    });
    
    playerMove.Start();

    // // Check if the positions are equal first (perhaps the last click did the tween)
    // if (movePlayer.equals(new Phaser.Point(Math.floor(player.body.x), Math.floor(player.body.y)))) {
    //     TokenSprite.prototype.openDialog.call(token);
    // } else {
    //     var moveTween = game.add.tween(player.body).to({ x: movePlayer.x, y: movePlayer.y }, 1200, Phaser.Easing.Quadratic.Out, true, 0, 0, false);

    //     moveTween.onStart.addOnce(function () {
    //         game.cutSceneCamera = true;
    //     })

    //     moveTween.onComplete.addOnce(function () {
    //         TokenSprite.prototype.openDialog.call(token);
    //     })
    // }
}

TokenSprite.prototype.openDialog = function () {
    var clickId = null
    if (this.clickConditions != null && Array.isArray((this.clickConditions))) {
        for (var i = 0; i < this.clickConditions.length; i++) {
            var condition = this.clickConditions[i]
            var globalVar = game.gamedata.globalVars.find(function (item) { return item.id == condition.globalId })
            if (globalVar.value == condition.value) {
                clickId = condition.dialogId
            }
        }
    } else if (this.clickId != null) {
        clickId = this.clickId
    }

    var dialogInstance = MakeDialog(game, clickId)
    // TODO add fadeIn()
    game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
    game.stage.addChild(dialogInstance)
}

TokenSprite.prototype.fadeOut = function (callback) {
    var fadeOutTween = game.add.tween(this).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);

    fadeOutTween.onComplete.addOnce(function () {
        this.destroy(true);
    }, this);

    if (callback != null) {
        fadeOutTween.onComplete.addOnce(callback, this);
    }
}