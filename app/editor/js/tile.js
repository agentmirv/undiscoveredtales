//=========================================================
function Tile(game, imageKey) {
    Placeable.call(this, game, imageKey);

    // For drag controls
    this.input.enableSnap(96, 96, true, true);        
    
    var startOffsetX = 0;
    var startOffsetY = 0
    if (this.width > this.height) {
        startOffsetY = Math.floor(this.height / 2);
    } else if (this.width > this.height) {
        startOffsetX = Math.floor(this.width / 2);
    } 

    // Set x, y based on center of view and grid-snapped.
    var remainderX = (this.game.player.x % 96);
    var remainderY = (this.game.player.y % 96);
    var startSnapX = remainderX < 48 ? this.game.player.x - remainderX : this.game.player.x + (96 - remainderX); 
    var startSnapY = remainderY < 48 ? this.game.player.y - remainderY : this.game.player.y + (96 - remainderY); 
    this.x = startSnapX + startOffsetX;
    this.y = startSnapY + startOffsetY;
}

Tile.prototype = Object.create(Placeable.prototype);
Tile.prototype.constructor = Tile;
