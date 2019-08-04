//=========================================================
function Tile(game, data) {
    Placeable.call(this, game, data.imageKey);

    // For drag controls
    this.input.enableSnap(96, 96, true, true);        
    
    var halfWidth = Math.floor(this.width / 2);
    var halfHeight = Math.floor(this.height / 2);
    var startOffsetX = 0;
    var startOffsetY = 0;
    var textOffsetX = halfWidth;
    var textOffsetY = halfHeight;
    
    if (this.width > this.height) {
        startOffsetY = halfHeight;
        textOffsetY = this.height;
    } else if (this.width > this.height) {
        startOffsetX = halfWidth;
        textOffsetX = this.width;
    } 

    // Set x, y based on center of view and grid-snapped.
    var remainderX = (this.game.player.x % 96);
    var remainderY = (this.game.player.y % 96);
    var startSnapX = remainderX < 48 ? this.game.player.x - remainderX : this.game.player.x + (96 - remainderX); 
    var startSnapY = remainderY < 48 ? this.game.player.y - remainderY : this.game.player.y + (96 - remainderY); 
    this.x = startSnapX + startOffsetX;
    this.y = startSnapY + startOffsetY;

    // Add Name
    var textStyle = { font: "bold 20px Times New Romans", fill: "#ffffff", stroke: "#000000", strokeThickness: 3 };
    var messageText = this.game.make.text(0, 0, data.name, textStyle);
    if (data.namePosition == "NW") {
        messageText.x = -textOffsetX;
        messageText.y = -textOffsetY;
    } else if (data.namePosition == "NE") {
        messageText.x = textOffsetX - messageText.width;
        messageText.y = -textOffsetY;
    }
    this.addChild(messageText);
}

Tile.prototype = Object.create(Placeable.prototype);
Tile.prototype.constructor = Tile;
