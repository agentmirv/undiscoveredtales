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

        var revealDialogGroup = game.world.add(new RevealDialogGroup(game, "You step into the warmth of the house. A strange stillness hangs in the air, and your footsteps echo through the quiet entrance. Place your Investigator figures as indicated."));
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
var RevealDialogGroup = function (game, messageText)
{
    Phaser.Group.call(this, game);

    var revealMessage = this.add(new RevealMessage(game, messageText));
    revealMessage.fixedToCamera = true;
    revealMessage.cameraOffset.setTo(Math.floor(game.camera.width / 2), Math.floor(game.camera.height / 2));
}

RevealDialogGroup.prototype = Object.create(Phaser.Group.prototype);
RevealDialogGroup.prototype.constructor = RevealDialogGroup;

//=========================================================
var RevealMessage = function (game, text) {
    Phaser.Sprite.call(this, game, 0, 0);

    var width = 400;
    var leftMargin = 10;
    var rightMargin = 10;
    var topMargin = 20;
    var bottomMargin = 20;

    var edgeSize = 1;
    var localX = 0;
    var localY = 0;
    var textWidth = width - leftMargin - rightMargin;

    var style = { font: "16px Times New Romans", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: textWidth };
    var myText = game.add.text(0, 0, text, style);
    myText.tint = 0xFFFFFF;

    // Calculate the width and height needed for the edges and for final position of the text
    var bounds = myText.getLocalBounds();
    var height = bounds.height + topMargin + bottomMargin;
    myText.x = localX + Math.floor((width - bounds.width) / 2)
    myText.y = localY + topMargin;

    // Create all of our corners and edges
    var borders = [
        // background
        game.make.tileSprite(localX + edgeSize, localY + edgeSize, width - edgeSize, height - edgeSize, 'pixelBlack'),
        // top left
        game.make.image(localX, localY, 'pixelWhite'),
        // top right
        game.make.image(localX + width, localY, 'pixelWhite'),
        // bottom right
        game.make.image(localX + width, localY + height, 'pixelWhite'),
        // bottom left
        game.make.image(localX, localY + height, 'pixelWhite'),
        // top
        game.make.tileSprite(localX + edgeSize, localY, width - edgeSize, edgeSize, 'pixelWhite'),
        // bottom
        game.make.tileSprite(localX + edgeSize, localY + height, width - edgeSize, edgeSize, 'pixelWhite'),
        // left
        game.make.tileSprite(localX, localY + edgeSize, edgeSize, height - edgeSize, 'pixelWhite'),
        // right
        game.make.tileSprite(localX + width, localY + edgeSize, edgeSize, height - edgeSize, 'pixelWhite'),
    ];

    // Add all of the above to this sprite
    for (var b = 0, len = borders.length; b < len; b++) {
        this.addChild(borders[b]);
    }

    this.addChild(myText);

    this.pivot.set(Math.floor(width / 2), Math.floor(height / 2));
}

RevealMessage.prototype = Object.create(Phaser.Sprite.prototype);
RevealMessage.prototype.constructor = RevealMessage;

game.state.add('GameState', GameState)
game.state.start('GameState')
