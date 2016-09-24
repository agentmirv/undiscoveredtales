// JavaScript source code
var game = new Phaser.Game(1280, 720, Phaser.AUTO)

var GameState = {
    preload: function () {
        game.load.image('background', 'assets/images/debug-grid-1920x1920.png')
        game.load.image('pixelWhite', 'assets/images/FFFFFF-1.png')
        game.load.image('pixelBlack', 'assets/images/000000-1.png')
        game.load.image('pixelTransparent', 'assets/images/1x1.png')
        game.load.spritesheet('tileWallsSheet', 'assets/images/TileWalls.png', 96, 96);
        game.load.image('circleToken', 'assets/images/CircleToken.png', 96, 96);
    },

    create: function () {
        var exploreLetterStyle = { font: "74px Arial Black", fill: "#ff0000", align: "center", stroke: "#aa0000", strokeThickness: 5 };
        var exploreLetter = game.make.text(0, 0, 'E', exploreLetterStyle)
        exploreLetter.setShadow(2, 2, "#333333", 2, true, false);
        exploreLetter.x = 48 - Math.floor(exploreLetter.width / 2);
        exploreLetter.y = 48 - Math.floor(exploreLetter.height / 2);

        var searchLetterStyle = { font: "74px Arial Black", fill: "#ffff00", align: "center", stroke: "#aaaa00", strokeThickness: 5 };
        var searchLetter = game.make.text(0, 0, '?', searchLetterStyle)
        searchLetter.setShadow(2, 2, "#333333", 2, true, false);
        searchLetter.x = 48 - Math.floor(searchLetter.width / 2);
        searchLetter.y = 48 - Math.floor(searchLetter.height / 2);

        var exploreTokenBmd = game.make.bitmapData(96, 96);
        exploreTokenBmd.copy('circleToken');
        exploreTokenBmd.copy(exploreLetter);
        game.cache.addBitmapData('exploreTokenBmd', exploreTokenBmd);

        var searchTokenBmd = game.make.bitmapData(96, 96);
        searchTokenBmd.copy('circleToken');
        searchTokenBmd.copy(searchLetter);
        game.cache.addBitmapData('searchTokenBmd', searchTokenBmd);

        //=================================================
        game.add.tileSprite(0, 0, 2560, 2560, 'background');
        game.world.setBounds(0, 0, 2560, 2560);
        game.physics.startSystem(Phaser.Physics.P2JS);
        player = game.add.sprite(game.world.centerX, game.world.centerY, 'pixelTransparent');
        game.physics.p2.enable(player);
        cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        game.camera.bounds = null

        //this.revealDialogGroup = game.stage.addChild(new RevealDialogGroup(game, "A disembodied voice speaks from the dim chamber, 'So, you have found me.'"));
        var imageDialogGroup = game.stage.addChild(new ImageDialogGroup(game, "A heavy wooden box lies on the bureau. The lid of the box is held shut by a thick metal latch."));
        var exampleMapTile = game.world.add(new MapTileGroup(game, 30 * 32, 30 * 32));
        //game.world.add(new ExploreToken(game, 33 * 32, 29 * 32));
        //game.world.add(new ExploreToken(game, 42 * 32, 29 * 32));
        game.world.add(new ExploreToken(game, 29 * 32, 33 * 32));
        //game.world.add(new ExploreToken(game, 46 * 32, 33 * 32));
        game.world.add(new ExploreToken(game, 29 * 32, 42 * 32));
        game.world.add(new ExploreToken(game, 46 * 32, 42 * 32));
        game.world.add(new SearchToken(game, 40 * 30, 36 * 30));

        game.cutSceneCamera = true;
        cameraHalfWidth = game.camera.width / 2;
        cameraHalfHeight = game.camera.height / 2;
    },

    update: function () {
        if (game.cutSceneCamera == true) {
            var cameraPosX = game.camera.x + cameraHalfWidth;
            var cameraPosY = game.camera.y + cameraHalfHeight;
            var targetRectLarge = new Phaser.Rectangle(player.body.x - 60, player.body.y - 60, 120, 120)

            if (Phaser.Rectangle.contains(targetRectLarge, cameraPosX, cameraPosY)) {
                game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.2, 0.2);
                var targetRectSmall = new Phaser.Rectangle(player.body.x - 10, player.body.y - 10, 20, 20)
                if (Phaser.Rectangle.contains(targetRectSmall, cameraPosX, cameraPosY)) {
                    game.cutSceneCamera = false;
                    game.camera.focusOn(player)
                    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);
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

    render : function () {
        //game.debug.cameraInfo(game.camera, 32, 32);
        ////game.debug.spriteInfo(player, 32, 130);

        //var cameraPosX = game.camera.x + cameraHalfWidth;
        //var cameraPosY = game.camera.y + cameraHalfHeight;
        ////var linearX = game.math.linear(player.x, cameraPosX, game.camera.lerp.x)
        ////var linearY = game.math.linear(player.y, cameraPosY, game.camera.lerp.y)
        ////var differenceX = player.x - cameraPosX;
        ////var differenceY = player.y - cameraPosY;

        ////game.debug.text(cameraPosX, 32, 230)
        ////game.debug.text(cameraPosY, 32, 250)

        //var targetRectLarge = new Phaser.Rectangle(player.body.x - 60, player.body.y - 60, 120, 120)
        //game.debug.geom(targetRectLarge, "#00FF00", false)

        //var targetRectSmall = new Phaser.Rectangle(player.body.x - 10, player.body.y - 10, 20, 20)
        //game.debug.geom(targetRectSmall, "#00FF00", false)

        //var cameraRect = new Phaser.Rectangle(cameraPosX - 10, cameraPosY - 10, 20, 20)
        //game.debug.geom(cameraRect, "#0000FF", true)
        ////game.debug.pixel(game.camera.x, game.camera.y, '#ffffff', 1)
        ////game.debug.text(game.camera.x, 32, 230)
        ////game.debug.text(game.camera.y, 32, 250)

        //game.debug.geom(this.revealDialogGroup._revealMessage.getBounds())
    }
}

//=========================================================
function ExploreToken(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, game.cache.getBitmapData('exploreTokenBmd'));

    this.inputEnabled = true;
    this.events.onInputDown.add(this.tokenClicked, this);
    this.input.useHandCursor = true;
}

ExploreToken.prototype = Object.create(Phaser.Sprite.prototype);
ExploreToken.prototype.constructor = ExploreToken;

ExploreToken.prototype.tokenClicked = function (token) {
    game.cutSceneCamera = true;
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    player.body.x = token.centerX + 300 - 16 - 48 //half message width - left margin - half image width
    player.body.y = token.centerY
}

//=========================================================
function SearchToken(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, game.cache.getBitmapData('searchTokenBmd'));

    this.inputEnabled = true;
    this.events.onInputDown.add(this.tokenClicked, this);
    this.input.useHandCursor = true;
}

SearchToken.prototype = Object.create(Phaser.Sprite.prototype);
SearchToken.prototype.constructor = SearchToken;

SearchToken.prototype.tokenClicked = function (token) {
    game.cutSceneCamera = true;
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    player.body.x = token.centerX + 300 - 16 - 48 //half message width - left margin - half image width
    player.body.y = token.centerY 
}

//=========================================================
function MapTileGroup (game, x, y) {
    Phaser.Group.call(this, game);

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
            var sprite = game.make.tileSprite(x + localX, y + localY, gridWidth, gridWidth, 'tileWallsSheet', walls[wallIndex])
            this.add(sprite);
        }
    }
}

MapTileGroup.prototype = Object.create(Phaser.Group.prototype);
MapTileGroup.prototype.constructor = MapTileGroup;

//=========================================================
function ImageDialogGroup(game, messageText) {
    Phaser.Group.call(this, game);

    this._imageMessage = new ImageMessage(game, messageText);
    this._imageMessage.alignIn(game.camera.view, Phaser.CENTER)
    this.addChild(this._imageMessage);

    this._imageCancel = new ImageMessageButton(game, "Cancel", 280);
    this._imageCancel.alignTo(this._imageMessage, Phaser.BOTTOM_LEFT, -10, 10)
    this.addChild(this._imageCancel);

    this._imageAction = new ImageMessageButton(game, "@ Search", 280);
    this._imageAction.alignTo(this._imageMessage, Phaser.BOTTOM_RIGHT, -10, 10)
    this.addChild(this._imageAction);

    this._imageCancelButton = game.make.sprite(this._imageCancel.x, this._imageCancel.y, 'pixelTransparent');
    this._imageCancelButton.width = this._imageCancel.width;
    this._imageCancelButton.height = this._imageCancel.height;
    this._imageCancelButton.inputEnabled = true;
    //this._imageCancelButton.events.onInputDown.add(this.continueClicked, this);
    this._imageCancelButton.input.useHandCursor = true;
    this.addChild(this._imageCancelButton);

    this._imageActionButton = game.make.sprite(this._imageAction.x, this._imageAction.y, 'pixelTransparent');
    this._imageActionButton.width = this._imageAction.width;
    this._imageActionButton.height = this._imageAction.height;
    this._imageActionButton.inputEnabled = true;
    //this._imageActionButton.events.onInputDown.add(this.continueClicked, this);
    this._imageActionButton.input.useHandCursor = true;
    this.addChild(this._imageActionButton);
}

ImageDialogGroup.prototype = Object.create(Phaser.Group.prototype);
ImageDialogGroup.prototype.constructor = ImageDialogGroup;

//=========================================================
function ImageMessage(game, text) {
    Phaser.Group.call(this, game, 0, 0);

    var totalWidth = 600;
    var leftMargin = 16;
    var imageWidth = 96;
    var imageHeight = 96;
    var middleMargin = 16
    var rightMargin = 10;
    var topMargin = 20;
    var bottomMargin = 20;

    var textWidth = totalWidth - leftMargin - imageWidth - middleMargin - rightMargin;
    var textStyle = { font: "20px Times New Romans", fill: "#ffffff", align: "left", wordWrap: true, wordWrapWidth: textWidth };
    var revealText = game.make.text(0, 0, text, textStyle);

    revealText.x = leftMargin + imageWidth + middleMargin

    var textHeight = revealText.height
    if (textHeight >= imageHeight)
    {
        revealText.y = topMargin;
    } else {
        revealText.y = topMargin + Math.floor((imageHeight - textHeight) / 2)
        textHeight = imageHeight
    }

    var totalHeight = textHeight + topMargin + bottomMargin;
    var outlineBox = new OutlineBox(game, totalWidth, totalHeight);

    this.addChild(outlineBox);
    this.addChild(revealText);

    // Example
    var imageBadgeSprite = game.make.sprite(leftMargin, Math.floor((totalHeight - imageHeight) / 2), game.cache.getBitmapData('searchTokenBmd'))
    this.addChild(imageBadgeSprite);
}

ImageMessage.prototype = Object.create(Phaser.Group.prototype);
ImageMessage.prototype.constructor = ImageMessage;

//=========================================================
function ImageMessageButton(game, text, width) {
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

ImageMessageButton.prototype = Object.create(Phaser.Group.prototype);
ImageMessageButton.prototype.constructor = ImageMessageButton;

//=========================================================
function RevealDialogGroup (game, messageText) {
    Phaser.Group.call(this, game);

    this._revealMessage = new RevealMessage(game, messageText);
    this._revealMessage.alignIn(game.camera.view, Phaser.CENTER)
    this.addChild(this._revealMessage);

    this._revealContinue = new RevealContinue(game, "Continue");
    this._revealContinue.alignTo(this._revealMessage, Phaser.BOTTOM_CENTER, 0, 10)
    this.addChild(this._revealContinue);
    
    this._revealContinueButton = game.make.sprite(this._revealContinue.x, this._revealContinue.y, 'pixelTransparent');
    this._revealContinueButton.width = this._revealContinue.width;
    this._revealContinueButton.height = this._revealContinue.height;
    this._revealContinueButton.inputEnabled = true;
    this._revealContinueButton.events.onInputDown.add(this.continueClicked, this);
    this._revealContinueButton.input.useHandCursor = true;
    this.addChild(this._revealContinueButton);
}

RevealDialogGroup.prototype = Object.create(Phaser.Group.prototype);
RevealDialogGroup.prototype.constructor = RevealDialogGroup;

RevealDialogGroup.prototype.continueClicked = function (group) {
    group.removeChild(this._revealMessage);
    group.removeChild(this._revealContinue);
    group.removeChild(this._revealContinueButton);
    this._revealMessage.destroy();
    this._revealContinue.destroy();
    this._revealContinueButton.destroy();
    group.destroy();
}

//=========================================================
function OutlineBox (game, width, height) {
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

    // Add all of the above to this sprite
    for (var b = 0, len = borders.length; b < len; b++) {
        this.addChild(borders[b]);
    }
}

OutlineBox.prototype = Object.create(Phaser.Group.prototype);
OutlineBox.prototype.constructor = OutlineBox;

//=========================================================
function RevealMessage (game, text) {
    Phaser.Group.call(this, game, 0, 0);

    var totalWidth = 600;
    var leftMargin = 10;
    var rightMargin = 10;
    var topMargin = 20;
    var bottomMargin = 20;

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

RevealMessage.prototype = Object.create(Phaser.Group.prototype);
RevealMessage.prototype.constructor = RevealMessage;

//=========================================================
function RevealContinue (game, text) {
    Phaser.Group.call(this, game, 0, 0);

    var totalWidth = 180;
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

RevealContinue.prototype = Object.create(Phaser.Group.prototype);
RevealContinue.prototype.constructor = RevealContinue;

//=========================================================
game.state.add('GameState', GameState)
game.state.start('GameState')
