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
        game.add.tileSprite(0, 0, 2560, 2560, 'background');
        game.world.setBounds(0, 0, 2560, 2560);
        game.physics.startSystem(Phaser.Physics.P2JS);
        player = game.add.sprite(game.world.centerX, game.world.centerY, 'pixelTransparent');
        game.physics.p2.enable(player);
        cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.08, 0.08);

        var revealDialogGroup = game.stage.addChild(new RevealDialogGroup(game, "You step into the warmth of the house. A strange stillness hangs in the air, and your footsteps echo through the quiet entrance. Place your Investigator figures as indicated."));
        var exampleMapTile = game.world.add(new MapTileGroup(game, 30 * 32, 30 * 32));
        //game.world.add(new ExploreToken(game, 33 * 32, 29 * 32));
        //game.world.add(new ExploreToken(game, 42 * 32, 29 * 32));
        game.world.add(new ExploreToken(game, 29 * 32, 33 * 32));
        //game.world.add(new ExploreToken(game, 46 * 32, 33 * 32));
        game.world.add(new ExploreToken(game, 29 * 32, 42 * 32));
        game.world.add(new ExploreToken(game, 46 * 32, 42 * 32));
        game.world.add(new SearchToken(game, 40 * 30, 36 * 30));
    },

    update: function () {
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
}

//=========================================================
function ExploreToken(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'circleToken');

    var textStyle = { font: "74px Arial Black", fill: "#ff0000", align: "center" };
    var text = game.make.text(0, 0, 'E', textStyle)
    text.stroke = "#aa0000";
    text.strokeThickness = 5;
    text.setShadow(2, 2, "#333333", 2, true, false);

    text.x = 48 - Math.floor(text.width / 2);
    text.y = 48 - Math.floor(text.height / 2);
     
    this.addChild(text);

    this.inputEnabled = true;
    this.events.onInputDown.add(this.tokenClicked, this);
    this.input.useHandCursor = true;
}

ExploreToken.prototype = Object.create(Phaser.Sprite.prototype);
ExploreToken.prototype.constructor = ExploreToken;

ExploreToken.prototype.tokenClicked = function (token) {
    game.camera.follow(token, Phaser.Camera.FOLLOW_LOCKON, 0.05, 0.05);
}

//=========================================================
function SearchToken(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'circleToken');

    var textStyle = { font: "74px Arial Black", fill: "#ffff00", align: "center" };
    var text = game.make.text(0, 0, '?', textStyle)
    text.stroke = "#aaaa00";
    text.strokeThickness = 5;
    text.setShadow(2, 2, "#333333", 2, true, false);

    text.x = 48 - Math.floor(text.width / 2);
    text.y = 48 - Math.floor(text.height / 2);

    this.addChild(text);

    this.inputEnabled = true;
    this.events.onInputDown.add(this.tokenClicked, this);
    this.input.useHandCursor = true;
}

SearchToken.prototype = Object.create(Phaser.Sprite.prototype);
SearchToken.prototype.constructor = SearchToken;

SearchToken.prototype.tokenClicked = function (token) {
    game.camera.follow(token, Phaser.Camera.FOLLOW_LOCKON, 0.05, 0.05);
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
function RevealDialogGroup (game, messageText) {
    Phaser.Group.call(this, game);

    this._revealMessage = new RevealMessage(game, messageText);
    this._revealMessage.x = Math.floor(this.game.width / 2) - Math.floor(this._revealMessage.totalWidth / 2);
    this._revealMessage.y = Math.floor(this.game.height / 2) - Math.floor(this._revealMessage.totalHeight / 2);

    this._revealContinue = new RevealContinue(game, "Continue");
    this._revealContinue.x = Math.floor(this.game.width / 2) - Math.floor(this._revealContinue.totalWidth / 2);
    this._revealContinue.y = this._revealMessage.y + this._revealMessage.totalHeight + 10;

    this._revealContinue.inputEnabled = true;
    this._revealContinue.events.onInputDown.add(this.continueClicked, this);
    this._revealContinue.input.useHandCursor = true;

    this.addChild(this._revealMessage);
    this.addChild(this._revealContinue);
}

RevealDialogGroup.prototype = Object.create(Phaser.Group.prototype);
RevealDialogGroup.prototype.constructor = RevealDialogGroup;

RevealDialogGroup.prototype.continueClicked = function (group) {
    group.removeChild(this._revealMessage);
    group.removeChild(this._revealContinue);
    this._revealMessage.destroy();
    this._revealContinue.destroy();
    group.destroy();
}

//=========================================================
function OutlineBox (game, width, height) {
    Phaser.Sprite.call(this, game, 0, 0);

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

OutlineBox.prototype = Object.create(Phaser.Sprite.prototype);
OutlineBox.prototype.constructor = OutlineBox;

//=========================================================
function RevealMessage (game, text) {
    Phaser.Sprite.call(this, game, 0, 0);

    this.totalWidth = 600;
    var leftMargin = 10;
    var rightMargin = 10;
    var topMargin = 20;
    var bottomMargin = 20;

    var textWidth = this.totalWidth - leftMargin - rightMargin;
    var textStyle = { font: "20px Times New Romans", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: textWidth };
    var revealText = game.make.text(0, 0, text, textStyle);
    revealText.x = Math.floor((this.totalWidth - revealText.width) / 2)
    revealText.y = topMargin;

    this.totalHeight = revealText.height + topMargin + bottomMargin;
    var outlineBox = new OutlineBox(game, this.totalWidth, this.totalHeight);

    this.addChild(outlineBox);
    this.addChild(revealText);
}

RevealMessage.prototype = Object.create(Phaser.Sprite.prototype);
RevealMessage.prototype.constructor = RevealMessage;

//=========================================================
function RevealContinue (game, text) {
    Phaser.Sprite.call(this, game, 0, 0);

    this.totalWidth = 180;
    var leftMargin = 10;
    var rightMargin = 10;
    var topMargin = 4;
    var bottomMargin = 0;

    var textWidth = this.totalWidth - leftMargin - rightMargin;
    var textStyle = { font: "20px Times New Romans", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: textWidth };
    var revealText = game.make.text(0, 0, text, textStyle);
    revealText.x = Math.floor((this.totalWidth - revealText.width) / 2)
    revealText.y = topMargin;

    this.totalHeight = revealText.height + topMargin + bottomMargin;
    var outlineBox = new OutlineBox(game, this.totalWidth, this.totalHeight);

    this.addChild(outlineBox);
    this.addChild(revealText);
}

RevealContinue.prototype = Object.create(Phaser.Sprite.prototype);
RevealContinue.prototype.constructor = RevealContinue;

//=========================================================
game.state.add('GameState', GameState)
game.state.start('GameState')
