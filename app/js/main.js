// JavaScript source code
var game = new Phaser.Game(1280, 720, Phaser.AUTO)

var GameState = {
    preload: function () {
        game.load.image('background', 'assets/images/debug-grid-1920x1920.png')
        game.load.image('pixelWhite', 'assets/images/FFFFFF-1.png')
        game.load.image('pixelBlack', 'assets/images/000000-1.png')
        game.load.image('pixelTransparent', 'assets/images/1x1.png')
        game.load.image('circleToken', 'assets/images/CircleToken.png', 96, 96);

        game.load.spritesheet('tileWallsSheet', 'assets/images/TileWalls.png', 96, 96);

        game.load.json('gamedata', 'data/gamedata.json');
    },

    create: function () {
        //=================================================
        // Initialize game data
        game.gamedata = game.cache.getJSON('gamedata');
        game.gamedataInstances = {};

        //=================================================
        // Create bitmapData (textures I create at runtime that I can reuse)
        var exploreLetterStyle = { font: "74px Arial Black", fill: "#ff0000", align: "center", stroke: "#aa0000", strokeThickness: 5 };
        var exploreLetter = game.make.text(0, 0, 'E', exploreLetterStyle)
        exploreLetter.setShadow(2, 2, "#333333", 2, true, false);
        exploreLetter.x = 48 - Math.floor(exploreLetter.width / 2);
        exploreLetter.y = 48 - Math.floor(exploreLetter.height / 2);

        var exploreTokenBmd = game.make.bitmapData(96, 96);
        exploreTokenBmd.copy('circleToken');
        exploreTokenBmd.copy(exploreLetter);
        game.cache.addBitmapData('exploreTokenBmd', exploreTokenBmd);

        var searchLetterStyle = { font: "74px Arial Black", fill: "#ffff00", align: "center", stroke: "#aaaa00", strokeThickness: 5 };
        var searchLetter = game.make.text(0, 0, '?', searchLetterStyle)
        searchLetter.setShadow(2, 2, "#333333", 2, true, false);
        searchLetter.x = 48 - Math.floor(searchLetter.width / 2);
        searchLetter.y = 48 - Math.floor(searchLetter.height / 2);

        var searchTokenBmd = game.make.bitmapData(96, 96);
        searchTokenBmd.copy('circleToken');
        searchTokenBmd.copy(searchLetter);
        game.cache.addBitmapData('searchTokenBmd', searchTokenBmd);

        var lobbyMapTileBmd = game.make.bitmapData(576, 576);
        // example is 6x6 grid
        // grid square is 96px
        var tileWidth = 6;
        var tileHeight = 6;
        var gridWidth = 96;
        var walls = [
            0, 4, 1, 1, 4, 2,
            4, 4, 4, 4, 4, 4,
            3, 4, 4, 4, 4, 5,
            3, 4, 4, 4, 4, 5,
            4, 4, 4, 4, 4, 4,
            6, 7, 7, 7, 7, 8
        ];

        for (var j = 0; j < tileHeight; j++) {
            for (var i = 0; i < tileWidth; i++) {
                var localX = i * gridWidth;
                var localY = j * gridWidth;
                var wallIndex = i + j * 6;
                var sprite = game.make.tileSprite(localX, localY, gridWidth, gridWidth, 'tileWallsSheet', walls[wallIndex])
                lobbyMapTileBmd.copy(sprite);
            }
        }
        game.cache.addBitmapData('lobbyMapTileBmd', lobbyMapTileBmd);

        //=================================================
        // Initialize Stuff
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.world.setBounds(0, 0, 2560, 2560);
        game.add.tileSprite(0, 0, 2560, 2560, 'background');
        game.camera.bounds = null
        game.cutSceneCamera = true;
        game.stageViewRect = new Phaser.Rectangle(0, 0, game.camera.view.width, game.camera.view.height)
        cursors = game.input.keyboard.createCursorKeys();

        //=================================================
        // Map Tile (TODO: use reveal)
        exampleMapTile = game.world.add(new MapTileGroup(game, 30 * 32, 30 * 32));

        //=================================================
        // Move camera and player (TODO: use reveal)
        game.camera.focusOnXY(exampleMapTile.centerX, exampleMapTile.centerY)
        player = game.add.sprite(exampleMapTile.centerX, exampleMapTile.centerY, 'pixelTransparent');
        game.physics.p2.enable(player);
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        //=================================================
        // Map Tile Dialog (TODO: use reveal)
        game.customCallback = function () {
            var revealDialogGroup = game.stage.addChild(MakeDialog(game, "lobby-reveal-dialog"));
            game.customCallback = null;
        }
    },

    update: function () {
        if (game.cutSceneCamera == true) {
            var cameraPosX = game.camera.x + game.stageViewRect.halfWidth;
            var cameraPosY = game.camera.y + game.stageViewRect.halfHeight;
            var targetRectLarge = new Phaser.Rectangle(player.body.x - 60, player.body.y - 60, 120, 120)

            if (Phaser.Rectangle.contains(targetRectLarge, cameraPosX, cameraPosY)) {
                game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.2, 0.2);
                var targetRectSmall = new Phaser.Rectangle(player.body.x - 10, player.body.y - 10, 20, 20)

                if (Phaser.Rectangle.contains(targetRectSmall, cameraPosX, cameraPosY)) {
                    game.camera.focusOn(player)
                    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);

                    if (game.customCallback != null) {
                        game.customCallback()
                    }
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
        //game.debug.text(exampleMapTile.centerX, 32, 230)
        //game.debug.text(exampleMapTile.centerY, 32, 250)

        //var targetRectLarge = new Phaser.Rectangle(player.body.x - 60, player.body.y - 60, 120, 120)
        //game.debug.geom(targetRectLarge, "#00FF00", false)

        //var targetRectSmall = new Phaser.Rectangle(player.body.x - 10, player.body.y - 10, 20, 20)
        //game.debug.geom(targetRectSmall, "#00FF00", false)
    }
}

//=========================================================
function MapTileGroup(game, x, y) {
    Phaser.Group.call(this, game);

    var gridWidth = 96;
    var halfGridWidth = 48;

    this.addChild(game.make.sprite(x, y, game.cache.getBitmapData('lobbyMapTileBmd')));

    game.world.addChild(MakeToken(game, 'lobby-door1-explore'))
    //this.addChild(new ExploreToken(game, x + gridWidth * 4, y - halfGridWidth));
    game.world.addChild(MakeToken(game, 'lobby-door2-explore'))
    //this.addChild(new ExploreToken(game, x + (gridWidth * 5) + halfGridWidth, y + gridWidth));
    //this.addChild(new ExploreToken(game, x - halfGridWidth, y + gridWidth * 4));
    game.world.addChild(MakeToken(game, 'lobby-door3-explore'))
    game.world.addChild(MakeToken(game, 'lobby-box-search'))
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
    game.gamedataInstances[id] = tokenInstance;

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
        dialogData.actionText,
        dialogData.actionRemove,
        dialogData.actionDialog,
        dialogData.buttons);

    game.gamedataInstances[id] = dialogInstance;

    return dialogInstance;
}

//=========================================================
function TokenSprite(game, x, y, bitmapDataId, clickId) {
    Phaser.Sprite.call(this, game, x, y, game.cache.getBitmapData(bitmapDataId));

    this.clickId = clickId;
    this.inputEnabled = true;
    this.events.onInputDown.add(this.tokenClicked, this);
    this.input.useHandCursor = true;
}

TokenSprite.prototype = Object.create(Phaser.Sprite.prototype);
TokenSprite.prototype.constructor = TokenSprite;

TokenSprite.prototype.tokenClicked = function (token) {
    player.body.x = token.centerX + 300 - 16 - 48 //half message width - left margin - half image width
    player.body.y = token.centerY
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    game.cutSceneCamera = true;

    game.customCallback = function () {
        game.stage.addChild(MakeDialog(game, token.clickId))
        game.customCallback = null;
    }
}

//=========================================================
function DialogGroup(game, messageText, imageBmdId, buttonType, actionButtonText, actionRemove, actionDialog, buttonData) {
    Phaser.Group.call(this, game);

    this._buttonData = buttonData;
    this._actionRemove = actionRemove;
    this._actionDialog = actionDialog;

    // Modal
    var modalBackground = game.make.sprite(game.stageViewRect.x, game.stageViewRect.y, 'pixelTransparent');
    modalBackground.width = game.stageViewRect.width;
    modalBackground.height = game.stageViewRect.height;
    modalBackground.inputEnabled = true;
    this.addChild(modalBackground);

    // Message
    var dialogMessage = new DialogMessage(game, messageText, imageBmdId);
    dialogMessage.alignIn(game.stageViewRect, Phaser.CENTER)
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
        dialogCancelButton.events.onInputDown.add(this.cancelClicked, this);
        dialogCancelButton.input.useHandCursor = true;
        this.addChild(dialogCancelButton);

        dialogActionButton = game.make.sprite(dialogAction.x, dialogAction.y, 'pixelTransparent');
        dialogActionButton.width = dialogAction.width;
        dialogActionButton.height = dialogAction.height;
        dialogActionButton.inputEnabled = true;
        dialogActionButton.events.onInputDown.add(this.actionClicked, this);
        dialogActionButton.input.useHandCursor = true;
        dialogActionButton.buttonIndex = 0; //dynamic property
        this.addChild(dialogActionButton);

    } else if (buttonType == "continue") {
        console.dir(buttonData)
        // Buttons for [Continue]
        var dialogContinue = new DialogButtonThin(game, "Continue", 180);
        dialogContinue.alignTo(dialogMessage, Phaser.BOTTOM_CENTER, 0, 10)
        this.addChild(dialogContinue);

        var dialogContinueButton = game.make.sprite(dialogContinue.x, dialogContinue.y, 'pixelTransparent');
        dialogContinueButton.width = dialogContinue.width;
        dialogContinueButton.height = dialogContinue.height;
        dialogContinueButton.inputEnabled = true;
        dialogContinueButton.events.onInputUp.add(this.continueClicked, this);
        dialogContinueButton.input.useHandCursor = true;
        dialogContinueButton.buttonIndex = 0; //dynamic property
        this.addChild(dialogContinueButton);
    }
}

DialogGroup.prototype = Object.create(Phaser.Group.prototype);
DialogGroup.prototype.constructor = DialogGroup;

DialogGroup.prototype.cancelClicked = function () {
    game.cutSceneCamera = false;
    this.destroy(true);
}

DialogGroup.prototype.actionClicked = function (button, pointer) {
    // This is scary looking
    if (button.buttonIndex in this._buttonData) {
        if (this._buttonData[button.buttonIndex].hasOwnProperty("actions")) {
            var actionArray = this._buttonData[button.buttonIndex]["actions"];
            for (var i = 0; i < actionArray.length; i++) {
                var action = actionArray[i];

                if (action.type == "remove") {
                    //console.log("remove")
                    for (var j = 0; j < action.removeIds.length; j++) {
                        var id = action.removeIds[j];

                        if (game.gamedataInstances.hasOwnProperty(id)) {
                            var instance = game.gamedataInstances[id]
                            if (instance != null) {
                                game.gamedataInstances[id] = null;
                                game.world.removeChild(instance);
                                instance.destroy();
                            }
                        }
                    }

                } else if (action.type == "dialog") {
                    //console.log("dialog")
                    game.stage.addChild(MakeDialog(game, action.dialogId))

                } else if (action.type == "reveal") {
                    //TODO
                }
            }
        }
    }

    //if (this._actionRemove != null) {
    //    for (var i = 0; i < this._actionRemove.length; i++) {
    //        var id = this._actionRemove[i];

    //        if (game.gamedataInstances.hasOwnProperty(id)) {
    //            var instance = game.gamedataInstances[id]
    //            game.gamedataInstances[id]= null;
    //            game.world.removeChild(instance);
    //            instance.destroy();
    //        }
    //    }
    //}

    //if (this._actionDialog != null) {
    //    game.stage.addChild(MakeDialog(game, this._actionDialog))
    //} else {
    //    game.cutSceneCamera = false;
    //}

    this.destroy(true);
}

DialogGroup.prototype.continueClicked = function () {
    game.cutSceneCamera = false;
    this.destroy(true);
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
