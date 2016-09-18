// JavaScript source code
var game = new Phaser.Game(800, 600, Phaser.AUTO)

var GameState = {
    preload: function () {
        game.load.image('background', 'assets/images/debug-grid-1920x1920.png')
        game.load.image('pixelWhite', 'assets/images/FFFFFF-1.png')
        game.load.image('pixelBlack', 'assets/images/000000-1.png')
        game.load.image('pixelTransparent', 'assets/images/1x1.png')
    },

    create: function () {
        game.add.tileSprite(0, 0, 1920, 1920, 'background');
        game.world.setBounds(0, 0, 1920, 1920);
        game.physics.startSystem(Phaser.Physics.P2JS);
        player = game.add.sprite(game.world.centerX, game.world.centerY, 'pixelTransparent');
        game.physics.p2.enable(player);
        cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(player);

        var revealDialogGroup = game.stage.addChild(new RevealDialogGroup(game, "You step into the warmth of the house. A strange stillness hangs in the air, and your footsteps echo through the quiet entrance. Place your Investigator figures as indicated."));
    },

    update: function () {
        player.body.setZeroVelocity();

        if (cursors.up.isDown) {
            player.body.moveUp(300)
        }
        else if (cursors.down.isDown) {
            player.body.moveDown(300);
        }

        if (cursors.left.isDown) {
            player.body.velocity.x = -300;
        }
        else if (cursors.right.isDown) {
            player.body.moveRight(300);
        }
    }
}

//function buttonHandler(sprite, pointer, isOver) {
//    sprite.scale.x *= -1
//    //alert(1)
//}

//=========================================================
var RevealDialogGroup = function (game, messageText) {
    Phaser.Group.call(this, game);

    var revealMessage = new RevealMessage(game, messageText);
    revealMessage.x = Math.floor(this.game.width / 2) - Math.floor(revealMessage.totalWidth / 2);
    revealMessage.y = Math.floor(this.game.height / 2) - Math.floor(revealMessage.totalHeight / 2);

    var revealContinue = new RevealContinue(game, "Continue");
    revealContinue.x = Math.floor(this.game.width / 2) - Math.floor(revealContinue.totalWidth / 2);
    revealContinue.y = revealMessage.y + revealMessage.totalHeight + 10;

    this.addChild(revealMessage);
    this.addChild(revealContinue);
}

RevealDialogGroup.prototype = Object.create(Phaser.Group.prototype);
RevealDialogGroup.prototype.constructor = RevealDialogGroup;

//=========================================================
var OutlineBox = function (game, width, height) {
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
var RevealMessage = function (game, text) {
    Phaser.Sprite.call(this, game, 0, 0);

    this.totalWidth = 400;
    var leftMargin = 10;
    var rightMargin = 10;
    var topMargin = 20;
    var bottomMargin = 20;

    var textWidth = this.totalWidth - leftMargin - rightMargin;
    var textStyle = { font: "16px Times New Romans", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: textWidth };
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
var RevealContinue = function (game, text) {
    Phaser.Sprite.call(this, game, 0, 0);

    this.totalWidth = 130;
    var leftMargin = 10;
    var rightMargin = 10;
    var topMargin = 4;
    var bottomMargin = 0;

    var textWidth = this.totalWidth - leftMargin - rightMargin;
    var textStyle = { font: "16px Times New Romans", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: textWidth };
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
