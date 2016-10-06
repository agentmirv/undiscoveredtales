// JavaScript source code
var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'phaser-app')

var GameState = {
    preload: function () {
        game.load.image('background', 'assets/images/debug-grid-1920x1920.png')
        game.load.image('pixelWhite', 'assets/images/FFFFFF-1.png')
        game.load.image('pixelBlack', 'assets/images/000000-1.png')
        game.load.image('pixelTransparent', 'assets/images/1x1.png')
        game.load.image('circleToken', 'assets/images/CircleToken.png');
        game.load.image('squareToken', 'assets/images/SquareToken.png');
        game.load.image('investigator', 'assets/images/run.png');
        game.load.image('search', 'assets/images/uncertainty.png');
        game.load.image('explore', 'assets/images/lantern-flame.png');
        game.load.image('revealPointer', 'assets/images/RevealPointer.png');
        game.load.image('wall', 'assets/images/WallTokenN.png');
        game.load.image('debugCircle', 'assets/images/DebugCircle.png');
        game.load.image('debugSquare', 'assets/images/DebugSquare.png');
        game.load.image('pentacle', 'assets/images/pentacle.png');

        game.load.spritesheet('tileWallsSheet', 'assets/images/TileWalls.png', 96, 96);

        game.load.json('gamedata', 'data/gamedata.json');
    },

    create: function () {
        //=================================================
        // Initialize game data
        game.gamedata = game.cache.getJSON('gamedata'); 
        game.gamedataInstances = {};
        game.gamedataInstances.mapTiles = []
        game.gamedataInstances.mapTokens = []
        game.customStates = [];

        //=================================================
        // ImageTokens BitmapData
        for (var i = 0; i < game.gamedata.imageTokens.length; i++) {
            var gridWidth = 96
            var imageTokenData = game.gamedata.imageTokens[i]
            var tokenBmd = game.make.bitmapData(gridWidth, gridWidth)

            if (imageTokenData.backgroundImageKey != null) {
                if (imageTokenData.backgroundImageAngle == null) {
                    tokenBmd.copy(imageTokenData.backgroundImageKey)
                } else {
                    var degToRad = imageTokenData.backgroundImageAngle * (Math.PI / 180);
                    if (imageTokenData.backgroundImageAngle == 90) {
                        tokenBmd.copy(imageTokenData.backgroundImageKey, null, null, null, null, null, null, null, null, degToRad, 0, 1);
                    } else if (imageTokenData.backgroundImageAngle == 270) {
                        tokenBmd.copy(imageTokenData.backgroundImageKey, null, null, null, null, null, null, null, null, degToRad, 1, 0);
                    } else if (imageTokenData.backgroundImageAngle == 180) {
                        tokenBmd.copy(imageTokenData.backgroundImageKey, null, null, null, null, null, null, null, null, degToRad, 1, 1);
                    } else {
                        tokenBmd.copy(imageTokenData.backgroundImageKey);
                    }
                }
            }

            if (imageTokenData.primaryImageKey != null) {
                var primaryImage = game.make.image(0, 0, imageTokenData.primaryImageKey)

                if (imageTokenData.imageShadowColor != null) {
                    primaryImage.tint = imageTokenData.imageShadowColor
                    tokenBmd.copy(primaryImage, 0, 0, 64, 64, 16 + 2, 16 + 2)
                }

                if (imageTokenData.imagePrimaryColor != null) {
                    primaryImage.tint = imageTokenData.imagePrimaryColor
                }

                tokenBmd.copy(primaryImage, 0, 0, 64, 64, 16, 16)
            }

            game.cache.addBitmapData(imageTokenData.imageKey, tokenBmd)
        }

        //=================================================
        // ImageTiles bitmapData
        for (var k = 0; k < game.gamedata.imageTiles.length; k++) {
            var gridWidth = 96;
            var imageTileData = game.gamedata.imageTiles[k]
            var bmdWidth = imageTileData.width * gridWidth;
            var bmdHeight = imageTileData.height * gridWidth;
            var mapTileBmd = game.make.bitmapData(bmdWidth, bmdHeight);

            mapTileBmd.rect(0, 0, bmdWidth, bmdHeight, imageTileData.floorColor);

            for (var j = 0; j < imageTileData.height; j++) {
                for (var i = 0; i < imageTileData.width; i++) {
                    var localX = i * gridWidth;
                    var localY = j * gridWidth;
                    var wallIndex = i + j * 6;
                    var sprite = game.make.tileSprite(localX, localY, gridWidth, gridWidth, imageTileData.spritesheet, imageTileData.walls[wallIndex])
                    mapTileBmd.copy(sprite);
                }
            }

            game.cache.addBitmapData(imageTileData.imageKey, mapTileBmd)
        }

        //=================================================
        // Initialize Stuff
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.world.setBounds(0, 0, 2560, 2560);
        game.camera.bounds = null
        game.stageViewRect = new Phaser.Rectangle(0, 0, game.camera.view.width, game.camera.view.height)
        cursors = game.input.keyboard.createCursorKeys();

        var startX = game.gamedata.playerStart.x
        var startY = game.gamedata.playerStart.y
        game.walkLerp = 0.5;
        game.followLerp = 0.06;
        game.camera.focusOnXY(startX, startY)
        player = game.add.sprite(startX, startY, 'pixelTransparent');
        game.physics.p2.enable(player);
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, game.followLerp, game.followLerp);

        game.add.tileSprite(0, 0, 2560, 2560, 'background');

        //=================================================
        // First Reveal
        game.revealMap = {};
        game.revealMap.dialogs = [];
        game.revealMap.center = {}
        MakeRevealMap(game, 'reveal-lobby')
    },

    update: function () {
        if (game.cutSceneCamera == true) {
            cameraPoint = new Phaser.Point(Math.floor(game.camera.x + game.stageViewRect.halfWidth), Math.floor(game.camera.y + game.stageViewRect.halfHeight));
            playerPoint = new Phaser.Point(Math.floor(player.body.x), Math.floor(player.body.y))

            if (!cameraPoint.equals(playerPoint)) {
                var targetRectLarge = new Phaser.Rectangle(player.body.x - 60, player.body.y - 60, 120, 120)

                if (Phaser.Rectangle.contains(targetRectLarge, cameraPoint.x, cameraPoint.y)) {
                    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.2, 0.2);
                    var targetRectSmall = new Phaser.Rectangle(player.body.x - 10, player.body.y - 10, 20, 20)

                    if (Phaser.Rectangle.contains(targetRectSmall, cameraPoint.x, cameraPoint.y)) {
                        game.camera.focusOn(player)
                        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);

                        if (game.customCallback != null) {
                            game.customCallback()
                        }
                    }
                }
            } else {
                // If the camera doesn't need to move before displaying the dialog
                if (game.customCallback != null) {
                    game.customCallback()
                }
            }
        } else {
            var playerVelocity = 400;
            player.body.setZeroVelocity();

            if (cursors.up.isDown) {
                player.body.moveUp(playerVelocity)
            }
            else if (cursors.down.isDown) {
                player.body.moveDown(playerVelocity);
            }

            if (cursors.left.isDown) {
                player.body.velocity.x = -playerVelocity;
            }
            else if (cursors.right.isDown) {
                player.body.moveRight(playerVelocity);
            }

            if (game.input.activePointer.isDown) {	
                if (game.origDragPoint) {		
                    // move the camera by the amount the mouse has moved since last update	
                    player.body.x += game.origDragPoint.x - game.input.activePointer.position.x;		
                    player.body.y += game.origDragPoint.y - game.input.activePointer.position.y;
                }
                // set new drag origin to current position	
                game.origDragPoint = game.input.activePointer.position.clone();
            } else {	
                game.origDragPoint = null;
            }
        }
    },

    render: function () {
        //game.debug.cameraInfo(game.camera, 32, 32);
        //game.debug.spriteInfo(player, 32, 130);
        //game.debug.text(game.revealDialogs.length, 32, 230)
        //game.debug.text(cameraPoint.x, 32, 230)
        //game.debug.text(cameraPoint.y, 32, 250)
        //game.debug.text(playerPoint.x, 32, 270)
        //game.debug.text(playerPoint.y, 32, 290)

        //var targetRectLarge = new Phaser.Rectangle(player.body.x - 60, player.body.y - 60, 120, 120)
        //game.debug.geom(targetRectLarge, "#00FF00", false)
        //var targetRectSmall = new Phaser.Rectangle(player.body.x - 10, player.body.y - 10, 20, 20)
        //game.debug.geom(targetRectSmall, "#00FF00", false)
    }
}

//=========================================================
function Helper() {
    // do nothing
}

Helper.getImage = function (imageKey) {
    return game.cache.getBitmapData(imageKey)
}

//=========================================================
function MakeRevealMap(game, id) {
    var revealData = game.gamedata.revealMaps.find(function (item) { return item.id == id });
    game.revealMap.dialogs = revealData.revealDialogs;

    var localGroup = game.add.group();

    // Add Map Tiles
    for (var i = 0; i < revealData.mapTiles.length; i++) {
        var mapTileId = revealData.mapTiles[i];
        var mapTileInstance = MakeMapTile(game, mapTileId);

        localGroup.addChild(mapTileInstance);

        // Remove Door tokens
        var mapTileData = game.gamedata.mapTiles.find(function (item) { return item.id == mapTileId });
        // Look at each entryTokenId of the room
        for (var j = 0; j < mapTileData.entryTokenIds.length; j++) {
            var removeToken = true;
            var tokenId = mapTileData.entryTokenIds[j];
            
            // Find this entryTokenId in all rooms
            for (var k = 0; k < game.gamedata.mapTiles.length; k++) {
                var mapTileDataCheck = game.gamedata.mapTiles[k];
                // Look for tokenId in mapTileData.entryTokenIds
                if (mapTileDataCheck.entryTokenIds.indexOf(tokenId) >= 0) {
                    // Check if mapTileData.id in game.gamedataInstances.mapTiles
                    if (!(mapTileDataCheck.id in game.gamedataInstances.mapTiles)) {
                        // If it is not in, then it is not revealed
                        removeToken = false
                    }
                }
            }

            if (removeToken) {
                var instance = game.gamedataInstances.mapTokens[tokenId]
                if (instance != null) {
                    instance.fadeOut(function () {
                        game.gamedataInstances.mapTokens[tokenId] = null;
                        game.world.removeChild(instance);
                        instance.destroy();
                    })
                }
            }
        }
    }

    var fadeInTween = game.add.tween(localGroup).from({ alpha: 0 }, 600, Phaser.Easing.Linear.None, true, 0, 0, false);

    fadeInTween.onComplete.addOnce(function () {
        game.revealMap.center = new Phaser.Point(localGroup.centerX, localGroup.centerY)

        // Move Player
        player.body.x = game.revealMap.center.x
        player.body.y = game.revealMap.center.y
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, game.followLerp, game.followLerp);
        game.cutSceneCamera = true;

        if (game.revealMap.dialogs.length > 0) {
            var revealDialog = game.revealMap.dialogs.shift();
            game.customCallback = function () {
                // Make first Dialog
                MakeRevealDialog(game, revealDialog);
            }
        }
    }, this);
}

//=========================================================
function MakeRevealDialog(game, id) {
    var revealDialog = game.gamedata.revealDialogs.find(function (item) { return item.id == id });

    // Dialog Info
    var imageKey = null;
    var buttonType = "reveal";
    var buttonData = [{ "text": "Continue", "actions": [{ "type": "reveal" }] }];

    // Add Tokens
    if (revealDialog.addSingleToken != null) {
        // Show image at the top of the Dialog
        var tokenInstance = MakeToken(game, revealDialog.addSingleToken);
        // TODO add fadeIn()
        game.add.tween(tokenInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);

        if (tokenInstance.addToWorld) {
            game.world.addChild(tokenInstance)
        }

        imageKey = tokenInstance.imageKey;
        player.body.x = tokenInstance.x + 48
        player.body.y = tokenInstance.y + 256

    } else if (revealDialog.addMultipleTokens != null) {
        // Show images with the Dialog in the middle of the room
        for (var i = 0; i < revealDialog.addMultipleTokens.length; i++) {
            var tokenId = revealDialog.addMultipleTokens[i];
            var tokenInstance = MakeToken(game, tokenId);

            // TODO add fadeIn()
            game.add.tween(tokenInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
            if (tokenInstance.addToWorld) {
                game.world.addChild(tokenInstance)
            }
        }

        player.body.x = game.revealMap.center.x
        player.body.y = game.revealMap.center.y

    } else {
        player.body.x = game.revealMap.center.x
        player.body.y = game.revealMap.center.y
    }

    // Move Player
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, game.followLerp, game.followLerp);
    game.cutSceneCamera = true;

    // set Callback to open Dialog
    game.customCallback = function () {
        var dialogInstance = new DialogGroup(
            game,
            revealDialog.id,
            revealDialog.text,
            imageKey,
            buttonType,
            buttonData);

        // TODO add fadeIn()
        game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);

        game.stage.addChild(dialogInstance);
        game.customCallback = null;
    }
}

//=========================================================
function MakeMapTile(game, id) {
    var mapTileData = game.gamedata.mapTiles.find(function (item) { return item.id == id });

    var mapTileInstance = new MapTileGroup(
        game,
        mapTileData.x,
        mapTileData.y,
        mapTileData.imageKey,
        mapTileData.angle);

    game.gamedataInstances.mapTiles[id] = mapTileInstance;

    return mapTileInstance;
}

//=========================================================
function MapTileGroup(game, x, y, imageKey, angle) {
    Phaser.Group.call(this, game);

    var mapTileSprite = game.make.sprite(x, y, Helper.getImage(imageKey))

    if (angle == 90) {
        mapTileSprite.anchor.setTo(0, 1)
    } else if (angle == 180) {
        mapTileSprite.anchor.setTo(1, 1)
    } else if (angle == 270) {
        mapTileSprite.anchor.setTo(1, 0)
    }

    mapTileSprite.angle = angle;

    this.addChild(mapTileSprite);
}

MapTileGroup.prototype = Object.create(Phaser.Group.prototype);
MapTileGroup.prototype.constructor = MapTileGroup;

//=========================================================
function MakeToken(game, id) {
    var tokenData = game.gamedata.mapTokens.find(function (item) { return item.id == id });
    var tokenInstance = new TokenSprite(
        game,
        tokenData.x,
        tokenData.y,
        tokenData.imageKey,
        tokenData.clickId,
        tokenData.addToWorld);

    game.gamedataInstances.mapTokens[id] = tokenInstance;

    return tokenInstance;
}

//=========================================================
function MakeDialog(game, id) {
    var dialogData = game.gamedata.dialogs.find(function (item) { return item.id == id });

    var dialogInstance = new DialogGroup(
        game,
        dialogData.id,
        dialogData.text,
        dialogData.imageKey,
        dialogData.buttonType,
        dialogData.buttons,
        dialogData.skillTarget);

    return dialogInstance;
}

//=========================================================
function TokenSprite(game, x, y, imageKey, clickId, addToWorld) {
    Phaser.Sprite.call(this, game, x, y, Helper.getImage(imageKey));

    this.imageKey = imageKey;
    this.clickId = clickId;
    this.addToWorld = addToWorld;

    if (clickId != null) {
        this.inputEnabled = true;
        this.events.onInputUp.add(this.tokenClicked, this);
    }
}

TokenSprite.prototype = Object.create(Phaser.Sprite.prototype);
TokenSprite.prototype.constructor = TokenSprite;

TokenSprite.prototype.tokenClicked = function (token) {
    player.body.x = token.centerX + 300 - 20 - 48 //half message width - left margin - half image width
    player.body.y = token.centerY
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, game.followLerp, game.followLerp);
    game.cutSceneCamera = true;

    game.customCallback = function () {
        var dialogInstance = MakeDialog(game, token.clickId)
        // TODO add fadeIn()
        game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
        game.stage.addChild(dialogInstance)
        game.customCallback = null;
    }
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

//=========================================================
function DialogGroup(game, id, messageText, imageKey, buttonType, buttonData, skillTarget) {
    Phaser.Group.call(this, game);

    this._id = id
    this._buttonData = buttonData;
    this._skillTarget = skillTarget;

    // Modal
    var modalBackground = game.make.sprite(game.stageViewRect.x, game.stageViewRect.y, 'pixelTransparent');
    modalBackground.width = game.stageViewRect.width;
    modalBackground.height = game.stageViewRect.height;
    modalBackground.inputEnabled = true;
    this.addChild(modalBackground);

    var messageImageKey = null;
    var revealImageKey = null;

    if (buttonType == "reveal") {
        revealImageKey = imageKey;
    } else {
        messageImageKey = imageKey;
    }

    if (buttonType == "reveal" && revealImageKey != null) {
        // Reveal Image
        var revealPointer = game.make.image(0, 0, Helper.getImage(imageKey))
        revealPointer.alignIn(game.stageViewRect, Phaser.CENTER, 0, -256 + 48)
        this.addChild(revealPointer);

        // Reveal Pointer
        var revealPointer = game.make.image(0, 0, 'revealPointer')
        revealPointer.alignIn(game.stageViewRect, Phaser.CENTER, 0, -96 -48 + 4)
        this.addChild(revealPointer);
    }

    // Message
    var dialogMessage = new DialogMessage(game, messageText, messageImageKey);
    if (buttonType == "reveal" && imageKey != null) {
        dialogMessage.alignTo(revealPointer, Phaser.BOTTOM_CENTER, 0, 3)
    } else {
        dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER)
    }
    this.addChild(dialogMessage);

    if (buttonType == "cancel-action") {
        // Buttons for [Cancel] [Action]
        var dialogCancel = new DialogButtonThin(game, "Cancel", 280);
        dialogCancel.alignTo(dialogMessage, Phaser.BOTTOM_LEFT, -10, 10)
        this.addChild(dialogCancel);

        var dialogAction = new DialogButtonThin(game, buttonData[0].text, 280);
        dialogAction.alignTo(dialogMessage, Phaser.BOTTOM_RIGHT, -10, 10)
        this.addChild(dialogAction);

        dialogCancelButton = game.make.sprite(dialogCancel.x, dialogCancel.y, 'pixelTransparent');
        dialogCancelButton.width = dialogCancel.width;
        dialogCancelButton.height = dialogCancel.height;
        dialogCancelButton.inputEnabled = true;
        dialogCancelButton.events.onInputUp.add(this.cancelClicked, this);
        this.addChild(dialogCancelButton);

        dialogActionButton = game.make.sprite(dialogAction.x, dialogAction.y, 'pixelTransparent');
        dialogActionButton.width = dialogAction.width;
        dialogActionButton.height = dialogAction.height;
        dialogActionButton.inputEnabled = true;
        dialogActionButton.events.onInputUp.add(this.buttonClicked, this);
        dialogActionButton.buttonIndex = 0; //dynamic property
        this.addChild(dialogActionButton);

    } else if (buttonType == "continue" || buttonType == "reveal") {
        // Button for [Continue]
        var dialogContinue = new DialogButtonThin(game, buttonData[0].text, 180);
        dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
        this.addChild(dialogContinue);

        var dialogContinueButton = game.make.sprite(dialogContinue.x, dialogContinue.y, 'pixelTransparent');
        dialogContinueButton.width = dialogContinue.width;
        dialogContinueButton.height = dialogContinue.height;
        dialogContinueButton.inputEnabled = true;
        dialogContinueButton.events.onInputUp.add(this.buttonClicked, this);
        dialogContinueButton.buttonIndex = 0; //dynamic property
        this.addChild(dialogContinueButton);

    } else if (buttonType == "skilltest") {
        // Button for [-][#][+]
        //            [Confirm]
        this._skillTestDisplay = 0;
    
        if (!(this._id in game.customStates)) {
            game.customStates.push({ "id": this._id, "successCount": 0})
        }

        var skillTestGroup = game.add.group()

        // Display number
        var displayNumber = new OutlineBox(game, 50, 50)
        displayNumber.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
        this.addChild(displayNumber);

        var textStyle = { font: "30px Times New Romans", fill: "#ffffff", align: "center" };
        this._numberText = game.make.text(0, 0, this._skillTestDisplay, textStyle);
        this._numberText.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 1, 18)
        this.addChild(this._numberText);

        // Subtract number
        var subtractNumber = new OutlineBox(game, 50, 50)
        subtractNumber.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, -60, 10)
        this.addChild(subtractNumber);

        var subtractText = game.make.text(0, 0, "-", textStyle);
        subtractText.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, -59, 16)
        this.addChild(subtractText);

        var subtractNumberButton = game.make.sprite(subtractNumber.x, subtractNumber.y, 'pixelTransparent');
        subtractNumberButton.width = subtractNumber.width;
        subtractNumberButton.height = subtractNumber.height;
        subtractNumberButton.inputEnabled = true;
        subtractNumberButton.events.onInputUp.add(this.skillSubtractClicked, this);
        this.addChild(subtractNumberButton);

        // Add number
        var addNumber = new OutlineBox(game, 50, 50)
        addNumber.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 60, 10)
        this.addChild(addNumber);

        var addText = game.make.text(0, 0, "+", textStyle);
        addText.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 61, 18)
        this.addChild(addText);

        var addNumberButton = game.make.sprite(addNumber.x, addNumber.y, 'pixelTransparent');
        addNumberButton.width = addNumber.width;
        addNumberButton.height = addNumber.height;
        addNumberButton.inputEnabled = true;
        addNumberButton.events.onInputUp.add(this.skillAddClicked, this);
        this.addChild(addNumberButton);

        // Confirm
        var dialogContinue = new DialogButtonThin(game, "Confirm", 150);
        dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 90)
        this.addChild(dialogContinue);

        var confirmButton = game.make.sprite(dialogContinue.x, dialogContinue.y, 'pixelTransparent');
        confirmButton.width = dialogContinue.width;
        confirmButton.height = dialogContinue.height;
        confirmButton.inputEnabled = true;
        confirmButton.events.onInputUp.add(this.skillConfirmClicked, this);
        this.addChild(confirmButton);

        this.addChild(skillTestGroup)
    }
}

DialogGroup.prototype = Object.create(Phaser.Group.prototype);
DialogGroup.prototype.constructor = DialogGroup;

DialogGroup.prototype.cancelClicked = function (button, pointer) {
    game.cutSceneCamera = false;
    this.fadeOut();
}

DialogGroup.prototype.skillSubtractClicked = function (button, pointer) {
    if (this._skillTestDisplay > 0) {
        this._skillTestDisplay--
        this._numberText.setText(this._skillTestDisplay)
    }
}

DialogGroup.prototype.skillAddClicked = function (button, pointer) {
    this._skillTestDisplay++
    this._numberText.setText(this._skillTestDisplay)
}

DialogGroup.prototype.skillConfirmClicked = function (button, pointer) {
    var dialogId = this._id;
    var customState = game.customStates.find(function (item) { return item.id == dialogId });

    if (customState.successCount + this._skillTestDisplay >= this._skillTarget) {
        button.buttonIndex = 0;
        DialogGroup.prototype.buttonClicked.call(this, button);
    } else {
        customState.successCount += this._skillTestDisplay
        button.buttonIndex = 1;
        DialogGroup.prototype.buttonClicked.call(this, button);
    }
}

DialogGroup.prototype.buttonClicked = function (button, pointer) {
    // this = DialogGroup
    var restoreControl = true;
    var fadeOutCallback = null;
    // Look for buttonIndex
    if (button.buttonIndex in this._buttonData) {
        // Look for actions array
        if (this._buttonData[button.buttonIndex].hasOwnProperty("actions")) {
            // Loop on actions array
            var actionArray = this._buttonData[button.buttonIndex]["actions"];
            for (var i = 0; i < actionArray.length; i++) {
                // Process each action
                var action = actionArray[i];
                if (action.type == "removeTokens") {
                    // Loop on tokenIds array
                    for (var j = 0; j < action.tokenIds.length; j++) {
                        var id = action.tokenIds[j];

                        if (game.gamedataInstances.mapTokens.hasOwnProperty(id)) {
                            // Remove Id
                            var instance = game.gamedataInstances.mapTokens[id]
                            if (instance != null) {
                                instance.fadeOut(function () {
                                    game.gamedataInstances.mapTokens[id] = null;
                                    game.world.removeChild(instance);
                                    instance.destroy();
                                })
                            }
                        }
                    }
                } else if (action.type == "dialog") {
                    // Make a new Dialog
                    fadeOutCallback = function () {
                        var dialogInstance = MakeDialog(game, action.dialogId)
                        // TODO add fadeIn()
                        game.add.tween(dialogInstance).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
                        game.stage.addChild(dialogInstance)
                    }
                    restoreControl = false;

                } else if (action.type == "reveal") {
                    //Go to next reveal dialog
                    if (game.revealMap.dialogs.length > 0) {
                        fadeOutCallback = function () {
                            var revealDialog = game.revealMap.dialogs.shift();
                            MakeRevealDialog(game, revealDialog);
                        }
                        restoreControl = false;
                    }
                } else if (action.type == "revealMap") {
                    //Reveal map tiles
                    if (action.revealMapId != null) {
                        fadeOutCallback = function () {
                            MakeRevealMap(game, action.revealMapId);
                        }
                        restoreControl = false;
                    }
                }
            }
        }
    }

    if (restoreControl) {
        game.cutSceneCamera = false;
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, game.walkLerp, game.walkLerp);
    }

    this.fadeOut(fadeOutCallback);
}

DialogGroup.prototype.fadeOut = function (callback) {
    var fadeOutTween = game.add.tween(this).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);

    fadeOutTween.onComplete.addOnce(function () {
        this.destroy(true);
    }, this);

    if (callback != null) {
        fadeOutTween.onComplete.addOnce(callback, this);
    }
}

//=========================================================
function DialogMessage(game, text, imageKey) {
    Phaser.Group.call(this, game, 0, 0);

    var totalWidth = 600;
    var leftMargin = 20;
    var imageWidth = 96;
    var imageHeight = 96;
    var middleMargin = 20
    var rightMargin = 20;
    var topMargin = 20;
    var bottomMargin = 20;
    var textAlign = "left"
    var widthOffset = 0

    if (imageKey == null) {
        imageWidth = 0;
        middleMargin = 0;
        textAlign = "center"
    }

    var textWidth = totalWidth - leftMargin - imageWidth - middleMargin - rightMargin;
    var textStyle = { font: "20px Times New Romans", fill: "#ffffff", align: textAlign, wordWrap: true, wordWrapWidth: textWidth };
    var messageText = game.make.text(0, 0, text, textStyle);

    if (imageKey == null) {
        widthOffset = Math.floor((textWidth - messageText.width) / 2);
    }
    messageText.x = leftMargin + imageWidth + middleMargin + widthOffset

    var textHeight = messageText.height
    if (textHeight >= imageHeight) {
        messageText.y = topMargin;
    } else {
        messageText.y = topMargin + Math.floor((imageHeight - textHeight) / 2)
        textHeight = imageHeight
    }

    var totalHeight = textHeight + topMargin + bottomMargin;
    var outlineBox = new OutlineBox(game, totalWidth, totalHeight);

    this.addChild(outlineBox);
    this.addChild(messageText);

    if (imageKey != null) {
        var imageBadgeSprite = game.make.sprite(leftMargin, Math.floor((totalHeight - imageHeight) / 2), Helper.getImage(imageKey))
        this.addChild(imageBadgeSprite);
    }
}

DialogMessage.prototype = Object.create(Phaser.Group.prototype);
DialogMessage.prototype.constructor = DialogMessage;

//=========================================================
function DialogButtonThin(game, text, width) {
    Phaser.Group.call(this, game, 0, 0);

    var totalWidth = width;
    var leftMargin = 10;
    var rightMargin = 10;
    var topMargin = 4;
    var bottomMargin = 0;

    var textWidth = totalWidth - leftMargin - rightMargin;
    var textStyle = { font: "20px Times New Romans", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: textWidth };
    var messageText = game.make.text(0, 0, text, textStyle);
    messageText.x = Math.floor((totalWidth - messageText.width) / 2)
    messageText.y = topMargin;

    var totalHeight = messageText.height + topMargin + bottomMargin;
    var outlineBox = new OutlineBox(game, totalWidth, totalHeight);

    this.addChild(outlineBox);
    this.addChild(messageText);
}

DialogButtonThin.prototype = Object.create(Phaser.Group.prototype);
DialogButtonThin.prototype.constructor = DialogButtonThin;

//=========================================================
function OutlineBox(game, width, height) {
    Phaser.Group.call(this, game, 0, 0);

    var localX = 0;
    var localY = 0;
    var edgeSize = 1;

    // Create all of our corners and edges
    var borders = [
        // background
        game.make.tileSprite(localX + edgeSize, localY + edgeSize, width - (edgeSize * 2), height - (edgeSize * 2), 'pixelBlack'),
        // top left
        game.make.image(localX, localY, 'pixelWhite'),
        // top right
        game.make.image(localX + width - edgeSize, localY, 'pixelWhite'),
        // bottom right
        game.make.image(localX + width - edgeSize, localY + height - edgeSize, 'pixelWhite'),
        // bottom left
        game.make.image(localX, localY + height - edgeSize, 'pixelWhite'),
        // top
        game.make.tileSprite(localX + edgeSize, localY, width - (edgeSize * 2), edgeSize, 'pixelWhite'),
        // bottom
        game.make.tileSprite(localX + edgeSize, localY + height - edgeSize, width - (edgeSize * 2), edgeSize, 'pixelWhite'),
        // left
        game.make.tileSprite(localX, localY + edgeSize, edgeSize, height - (edgeSize * 2), 'pixelWhite'),
        // right
        game.make.tileSprite(localX + width - edgeSize, localY + edgeSize, edgeSize, height - (edgeSize * 2), 'pixelWhite'),
    ];

    // Add all of the above to this group
    for (var b = 0, len = borders.length; b < len; b++) {
        this.addChild(borders[b]);
    }
}

OutlineBox.prototype = Object.create(Phaser.Group.prototype);
OutlineBox.prototype.constructor = OutlineBox;

//=========================================================
game.state.add('GameState', GameState)
game.state.start('GameState')
