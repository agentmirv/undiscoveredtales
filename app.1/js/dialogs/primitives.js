/* global Phaser */

//=========================================================
function OutlineBox(game, width, height) {
    Phaser.Group.call(this, game);

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
function DialogButtonInput(game, button) {
    Phaser.Sprite.call(this, game, 0, 0, 'pixelTransparent');
    
    this.width = button.width;
    this.height = button.height;
    this.alignIn(button);
    this.inputEnabled = true;
}

DialogButtonInput.prototype = Object.create(Phaser.Sprite.prototype);
DialogButtonInput.prototype.constructor = DialogButtonInput;

//=========================================================
function DialogButtonThin(game, text, width) {
    Phaser.Group.call(this, game);

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

    this.buttonInput = new DialogButtonInput(game, outlineBox);

    this.addChild(outlineBox);
    this.addChild(messageText);
    this.addChild(this.buttonInput);
}

DialogButtonThin.prototype = Object.create(Phaser.Group.prototype);
DialogButtonThin.prototype.constructor = DialogButtonThin;

//=========================================================
function DialogButtonMedium(game, text, width) {
    Phaser.Group.call(this, game);

    var totalWidth = width;
    var leftMargin = 10;
    var rightMargin = 10;
    var topMargin = 10;
    var bottomMargin = 5;

    var textWidth = totalWidth - leftMargin - rightMargin;
    var textStyle = { font: "20px Times New Romans", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: textWidth };
    var messageText = game.make.text(0, 0, text, textStyle);
    messageText.x = Math.floor((totalWidth - messageText.width) / 2)
    messageText.y = topMargin;

    var totalHeight = messageText.height + topMargin + bottomMargin;
    var outlineBox = new OutlineBox(game, totalWidth, totalHeight);

    this.buttonInput = new DialogButtonInput(game, outlineBox);

    this.addChild(outlineBox);
    this.addChild(messageText);
    this.addChild(this.buttonInput);
}

DialogButtonMedium.prototype = Object.create(Phaser.Group.prototype);
DialogButtonMedium.prototype.constructor = DialogButtonMedium;

//=========================================================
function DialogMessageMonster(game, text, width) {
    Phaser.Group.call(this, game);

    var totalWidth = width;
    var leftMargin = 10;
    var rightMargin = 10;
    var topMargin = 20;
    var bottomMargin = 15;

    var textWidth = totalWidth - leftMargin - rightMargin;
    var textStyle = {
        font: "20px Times New Romans", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: textWidth
    };
    var messageText = game.make.text(0, 0, text, textStyle);
    messageText.x = Math.floor((totalWidth - messageText.width) / 2)
    messageText.y = topMargin;

    var totalHeight = messageText.height + topMargin + bottomMargin;
    var outlineBox = new OutlineBox(game, totalWidth, totalHeight);

    this.addChild(outlineBox);
    this.addChild(messageText);
}

DialogMessageMonster.prototype = Object.create(Phaser.Group.prototype);
DialogMessageMonster.prototype.constructor = DialogButtonMedium;

//=========================================================
function DialogMessage(game, text, imageKey) {
    Phaser.Group.call(this, game);

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
        var imageBadgeSprite = game.make.sprite(leftMargin, Math.floor((totalHeight - imageHeight) / 2), ImageHelper.getImage(imageKey))
        this.addChild(imageBadgeSprite);
    }
}

DialogMessage.prototype = Object.create(Phaser.Group.prototype);
DialogMessage.prototype.constructor = DialogMessage;

//=========================================================
function BaseDialog(game) {
    Phaser.Group.call(this, game);
    this.onOpen = new Phaser.Signal();
    this.onClose = new Phaser.Signal();
    this._processActions = MakeProcessActions(game);
}

BaseDialog.prototype = Object.create(Phaser.Group.prototype);
BaseDialog.prototype.constructor = BaseDialog;

BaseDialog.prototype.open = function () {
    var fadeInTween = this.game.add.tween(this).from({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);

    fadeInTween.onComplete.addOnce(function () {
        this.onOpen.dispatch();
    }, this);

}

BaseDialog.prototype.close = function () {
    var fadeOutTween = this.game.add.tween(this).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);

    fadeOutTween.onComplete.addOnce(function () {
        this.onClose.dispatch();
        this.game.player.cutSceneCamera = false;
        this.destroy(true);
    }, this);
}

BaseDialog.prototype.processActions = function (buttonData) {
    return function () { 
        this.onClose.addOnce(function () {
            this._processActions(buttonData);
        }, this);
        this.close();
    }
}

//=========================================================
function DialogModalBackground(game) {
    Phaser.Sprite.call(this, game, game.stageViewRect.x, game.stageViewRect.y, 'pixelTransparent');
    
    // Modal
    this.width = game.stageViewRect.width;
    this.height = game.stageViewRect.height;
    this.inputEnabled = true;
}

DialogModalBackground.prototype = Object.create(Phaser.Sprite.prototype);
DialogModalBackground.prototype.constructor = DialogModalBackground;

