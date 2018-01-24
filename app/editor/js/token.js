//=========================================================
function Token(game, imageKey) {
    Placeable.call(this, game, imageKey);

    var spriteOffset = 48;

    // For drag controls
    this.inputEnabled = true;
    this.input.enableSnap(spriteOffset, spriteOffset, true, true, spriteOffset, spriteOffset);
    
    // Set x, y based on center of view and grid-snapped.
    this.x = this.game.player.x - (this.game.player.x % spriteOffset);
    this.y = this.game.player.y - (this.game.player.y % spriteOffset);    
}

Token.prototype = Object.create(Placeable.prototype);
Token.prototype.constructor = Token;
