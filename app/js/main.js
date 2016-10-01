// JavaScript source code
var game = new Phaser.Game(1280, 720, Phaser.AUTO)

var GameState = {
    preload: function () {
        game.load.image('background', 'assets/images/debug-grid-1920x1920.png')
        game.load.image('pixelWhite', 'assets/images/FFFFFF-1.png')
        game.load.image('pixelBlack', 'assets/images/000000-1.png')
        game.load.image('pixelTransparent', 'assets/images/1x1.png')
        game.load.image('circleToken', 'assets/images/CircleToken.png', 96, 96);
        game.load.image('investigator', 'assets/images/run.png');
        game.load.image('search', 'assets/images/uncertainty.png');
        game.load.image('explore', 'assets/images/lantern-flame.png');
        game.load.image('revealPointer', 'assets/images/RevealPointer.png');
        game.load.image('debugCircle', 'assets/images/DebugCircle.png');

        game.load.spritesheet('tileWallsSheet', 'assets/images/TileWalls.png', 96, 96);

        game.load.json('gamedata', 'data/gamedata.json');
    },

    create: function () {
        //=================================================
        // Initialize game data
        game.gamedata = game.cache.getJSON('gamedata'); 
        game.gamedataInstances = {};
        game.gamedataInstances.mapTiles = {}
        game.gamedataInstances.mapTokens = {}

        //=================================================
        // Create bitmapData (textures I create at runtime that I can reuse)
        var exploreTokenBmd = game.make.bitmapData(96, 96);
        exploreTokenBmd.copy('circleToken');
        var exploreImage = game.make.image(0, 0, 'explore');
        exploreImage.tint = 0x770000;
        exploreTokenBmd.copy(exploreImage, 0, 0, 64, 64, 16 + 2, 16 + 2);
        exploreImage.tint = 0xFF0000;
        exploreTokenBmd.copy(exploreImage, 0, 0, 64, 64, 16, 16);
        game.cache.addBitmapData('exploreTokenBmd', exploreTokenBmd);

        var searchTokenBmd = game.make.bitmapData(96, 96);
        var searchImage = game.make.image(0, 0, 'search');
        searchTokenBmd.copy('circleToken');
        searchImage.tint = 0xAAAA00;
        searchTokenBmd.copy(searchImage, 0, 0, 64, 64, 16 + 2, 16 + 2);
        searchImage.tint = 0xFFFF00;
        searchTokenBmd.copy(searchImage, 0, 0, 64, 64, 16, 16);
        game.cache.addBitmapData('searchTokenBmd', searchTokenBmd);

        var investigatorStartBmd = game.make.bitmapData(96, 96);
        var investigatorImage = game.make.image(0, 0, 'investigator');
        investigatorStartBmd.copy('circleToken');
        investigatorImage.tint = 0x000000;
        investigatorStartBmd.copy(investigatorImage, 0, 0, 64, 64, 16 + 2, 16 + 2);
        investigatorImage.tint = 0xFFFFFF;
        investigatorStartBmd.copy(investigatorImage, 0, 0, 64, 64, 16, 16);
        game.cache.addBitmapData('investigatorStartBmd', investigatorStartBmd);

        for (var k = 0; k < game.gamedata.mapTiles.length; k++) {
            var gridWidth = 96;
            var mapTileData = game.gamedata.mapTiles[k]
            var bmdWidth = mapTileData.width * 96;
            var bmdHeight = mapTileData.height * 96;
            var mapTileBmd = game.make.bitmapData(bmdWidth, bmdHeight);

            for (var j = 0; j < mapTileData.height; j++) {
                for (var i = 0; i < mapTileData.width; i++) {
                    var localX = i * gridWidth;
                    var localY = j * gridWidth;
                    var wallIndex = i + j * 6;
                    var sprite = game.make.tileSprite(localX, localY, gridWidth, gridWidth, mapTileData.spritesheet, mapTileData.walls[wallIndex])
                    mapTileBmd.copy(sprite);
                }
            }

            game.cache.addBitmapData(mapTileData.bmdId, mapTileBmd);
        }

        //=================================================
        // Initialize Stuff
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.world.setBounds(0, 0, 2560, 2560);
        game.add.tileSprite(0, 0, 2560, 2560, 'background');
        game.camera.bounds = null
        game.stageViewRect = new Phaser.Rectangle(0, 0, game.camera.view.width, game.camera.view.height)
        cursors = game.input.keyboard.createCursorKeys();

        var startX = game.gamedata.playerStart.x
        var startY = game.gamedata.playerStart.y
        game.camera.focusOnXY(startX, startY)
        player = game.add.sprite(startX, startY, 'pixelTransparent');
        game.physics.p2.enable(player);
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.08, 0.08);

        //=================================================
        // First Reveal
        //game.revealDialogs = []; // reveal dialog list is global for now
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
function MakeRevealMap(game, id) {
    var revealData = game.gamedata.revealMaps.find(function (item) { return item.id == id });
    game.revealMap.dialogs = revealData.revealDialogs;

    var localGroup = game.add.group();

    // Add Map Tiles
    for (var i = 0; i < revealData.mapTiles.length; i++) {
        var mapTileId = revealData.mapTiles[i];
        var mapTileInstance = MakeMapTile(game, mapTileId);
        game.add.tween(mapTileInstance).from({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);

        localGroup.addChild(mapTileInstance);

        // Remove Door tokens
        var mapTileData = game.gamedata.mapTiles.find(function (item) { return item.id == mapTileId });
        // Look at each entryTokenId of the room
        for (var i = 0; i < mapTileData.entryTokenIds.length; i++) {
            var removeToken = true;
            var tokenId = mapTileData.entryTokenIds[i];

            // Find this entryTokenId in all rooms
            for (var j = 0; j < game.gamedata.mapTiles.length; j++) {
                var mapTileData = game.gamedata.mapTiles[j];
                // Look for tokenId in mapTileData.entryTokenIds
                if (mapTileData.entryTokenIds.indexOf(tokenId) >= 0) {
                    // Check if mapTileData.id in game.gamedataInstances.mapTiles
                    if (!(mapTileData.id in game.gamedataInstances.mapTiles)) {
                        // If it is not in, then it is not revealed
                        removeToken = false
                    }
                }
            }

            if (removeToken) {
                var instance = game.gamedataInstances.mapTokens[tokenId]
                if (instance != null) {
                    game.gamedataInstances.mapTokens[id] = null;
                    game.world.removeChild(instance);
                    instance.destroy();
                }
            }
        }
    }

    game.revealMap.center = new Phaser.Point(localGroup.centerX, localGroup.centerY)
     
    // Move Player
    player.body.x = game.revealMap.center.x
    player.body.y = game.revealMap.center.y
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.08, 0.08);
    game.cutSceneCamera = true;

    if (game.revealMap.dialogs.length > 0) {
        var revealDialog = game.revealMap.dialogs.shift();
        game.customCallback = function () {
            // Make first Dialog
            MakeRevealDialog(game, revealDialog);
        }
    }
}

//=========================================================
function MakeRevealDialog(game, id) {
    var revealDialog = game.gamedata.revealDialogs.find(function (item) { return item.id == id });

    // Dialog Info
    var imageBmdId = null;
    var buttonType = "reveal";
    var buttonData = [{ "text": "Continue", "actions": [{ "type": "reveal" }] }];

    // Add Tokens
    if (revealDialog.addSingleToken != null) {
        // Show image at the top of the Dialog
        var tokenInstance = MakeToken(game, revealDialog.addSingleToken);
        if (tokenInstance.clickId != null) {
            game.world.addChild(tokenInstance)
        }

        imageBmdId = tokenInstance.bitmapDataId;
        player.body.x = tokenInstance.x + 48
        player.body.y = tokenInstance.y + 256

    } else if (revealDialog.addMultipleTokens != null) {
        // Show images with the Dialog in the middle of the room
        for (var i = 0; i < revealDialog.addMultipleTokens.length; i++) {
            var tokenInstance = MakeToken(game, revealDialog.addMultipleTokens[i]);
            if (tokenInstance.clickId != null) {
                game.world.addChild(tokenInstance)
            }
        }

        player.body.x = game.revealMap.center.x
        player.body.y = game.revealMap.center.y
    } 

    // Move Player
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.08, 0.08);
    game.cutSceneCamera = true;

    // set Callback to open Dialog
    game.customCallback = function () {
        var dialogInstance = new DialogGroup(
            game,
            revealDialog.text,
            imageBmdId,
            buttonType,
            buttonData);

        game.add.tween(dialogInstance).from({ alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);

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
        mapTileData.bmdId);

    game.gamedataInstances.mapTiles[id] = mapTileInstance;

    return mapTileInstance;
}

//=========================================================
function MapTileGroup(game, x, y, bitmapDataId) {
    Phaser.Group.call(this, game);

    this.addChild(game.make.sprite(x, y, game.cache.getBitmapData(bitmapDataId)));
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
        tokenData.bmdId,
        tokenData.clickId);

    game.gamedataInstances.mapTokens[id] = tokenInstance;

    return tokenInstance;
}

//=========================================================
function MakeDialog(game, id) {
    var dialogData = game.gamedata.dialogs.find(function (item) { return item.id == id });
    
    var dialogInstance = new DialogGroup(
        game,
        dialogData.text,
        dialogData.bmdId,
        dialogData.buttonType,
        dialogData.buttons);

    return dialogInstance;
}

//=========================================================
function TokenSprite(game, x, y, bitmapDataId, clickId) {
    Phaser.Sprite.call(this, game, x, y, game.cache.getBitmapData(bitmapDataId));

    this.bitmapDataId = bitmapDataId;
    this.clickId = clickId;
    this.inputEnabled = true;
    this.events.onInputUp.add(this.tokenClicked, this);
    this.input.useHandCursor = true;
}

TokenSprite.prototype = Object.create(Phaser.Sprite.prototype);
TokenSprite.prototype.constructor = TokenSprite;

TokenSprite.prototype.tokenClicked = function (token) {
    player.body.x = token.centerX + 300 - 16 - 48 //half message width - left margin - half image width
    player.body.y = token.centerY
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.08, 0.08);
    game.cutSceneCamera = true;

    game.customCallback = function () {
        game.stage.addChild(MakeDialog(game, token.clickId))
        game.customCallback = null;
    }
}

//=========================================================
function DialogGroup(game, messageText, imageBmdId, buttonType, buttonData) {
    Phaser.Group.call(this, game);

    this._buttonData = buttonData;

    // Modal
    var modalBackground = game.make.sprite(game.stageViewRect.x, game.stageViewRect.y, 'pixelTransparent');
    modalBackground.width = game.stageViewRect.width;
    modalBackground.height = game.stageViewRect.height;
    modalBackground.inputEnabled = true;
    this.addChild(modalBackground);

    var messageImageBmdId = null;
    var revealImageBmdId = null;

    if (buttonType == "reveal") {
        revealImageBmdId = imageBmdId;
    } else {
        messageImageBmdId = imageBmdId;
    }

    if (buttonType == "reveal" && revealImageBmdId != null) {
        // Reveal Image
        var revealPointer = game.make.image(0, 0, game.cache.getBitmapData(revealImageBmdId))
        revealPointer.alignIn(game.stageViewRect, Phaser.CENTER, 0, -256 + 48)
        this.addChild(revealPointer);

        // Reveal Pointer
        var revealPointer = game.make.image(0, 0, 'revealPointer')
        revealPointer.alignIn(game.stageViewRect, Phaser.CENTER, 0, -96 -48 + 4)
        this.addChild(revealPointer);
    }

    // Message
    var dialogMessage = new DialogMessage(game, messageText, messageImageBmdId);
    if (buttonType == "reveal" && imageBmdId != null) {
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
        dialogCancelButton.input.useHandCursor = true;
        this.addChild(dialogCancelButton);

        dialogActionButton = game.make.sprite(dialogAction.x, dialogAction.y, 'pixelTransparent');
        dialogActionButton.width = dialogAction.width;
        dialogActionButton.height = dialogAction.height;
        dialogActionButton.inputEnabled = true;
        dialogActionButton.events.onInputUp.add(this.buttonClicked, this);
        dialogActionButton.input.useHandCursor = true;
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
        dialogContinueButton.input.useHandCursor = true;
        dialogContinueButton.buttonIndex = 0; //dynamic property
        this.addChild(dialogContinueButton);
    }
}

DialogGroup.prototype = Object.create(Phaser.Group.prototype);
DialogGroup.prototype.constructor = DialogGroup;

DialogGroup.prototype.cancelClicked = function () {
    game.cutSceneCamera = false;
    this.fadeOut();
}

DialogGroup.prototype.buttonClicked = function (button, pointer) {
    // This is scary looking
    var restoreControl = true;
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
                    // Loop on removeIds array
                    for (var j = 0; j < action.removeIds.length; j++) {
                        var id = action.removeIds[j];

                        if (game.gamedataInstances.mapTokens.hasOwnProperty(id)) {
                            // Remove Id
                            var instance = game.gamedataInstances.mapTokens[id]
                            if (instance != null) {
                                game.gamedataInstances.mapTokens[id] = null;
                                game.world.removeChild(instance);
                                instance.destroy();
                            }
                        }
                    }
                } else if (action.type == "dialog") {
                    // Make a new Dialog
                    game.stage.addChild(MakeDialog(game, action.dialogId))
                    restoreControl = false;

                } else if (action.type == "reveal") {
                    //Go to next reveal dialog
                    if (game.revealMap.dialogs.length > 0) {
                        var revealDialog = game.revealMap.dialogs.shift();
                        MakeRevealDialog(game, revealDialog);
                        restoreControl = false;
                    }
                } else if (action.type == "revealMap") {
                    //Reveal map tiles
                    if (action.revealMapId != null) {
                        MakeRevealMap(game, action.revealMapId);
                        restoreControl = false;
                    }
                }
            }
        }
    }

    if (restoreControl) {
        game.cutSceneCamera = false;
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);
    }

    this.fadeOut();
}

DialogGroup.prototype.fadeOut = function () {
    var fadeOutTween = game.add.tween(this).to({ alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    fadeOutTween.onComplete.addOnce(function () {
        this.destroy(true);
    }, this);
}

//=========================================================
function DialogMessage(game, text, imageBmdId) {
    Phaser.Group.call(this, game, 0, 0);

    var totalWidth = 600;
    var leftMargin = 16;
    var imageWidth = 96;
    var imageHeight = 96;
    var middleMargin = 16
    var rightMargin = 10;
    var topMargin = 20;
    var bottomMargin = 20;

    if (imageBmdId == null) {
        leftMargin = 36;
        imageWidth = 0;
        middleMargin = 0;
    }

    var textWidth = totalWidth - leftMargin - imageWidth - middleMargin - rightMargin;
    var textStyle = { font: "20px Times New Romans", fill: "#ffffff", align: "left", wordWrap: true, wordWrapWidth: textWidth };
    var messageText = game.make.text(0, 0, text, textStyle);

    messageText.x = leftMargin + imageWidth + middleMargin

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

    if (imageBmdId != null) {
        var imageBadgeSprite = game.make.sprite(leftMargin, Math.floor((totalHeight - imageHeight) / 2), game.cache.getBitmapData(imageBmdId))
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
    var revealText = game.make.text(0, 0, text, textStyle);
    revealText.x = Math.floor((totalWidth - revealText.width) / 2)
    revealText.y = topMargin;

    var totalHeight = revealText.height + topMargin + bottomMargin;
    var outlineBox = new OutlineBox(game, totalWidth, totalHeight);

    this.addChild(outlineBox);
    this.addChild(revealText);
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
