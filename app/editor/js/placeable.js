//=========================================================
function Placeable(game, imageKey) {
    Phaser.Sprite.call(this, game, 0, 0, ImageHelper.getImage(game, imageKey));

    this.imageKey = imageKey;
    this.rotating = false;
    this.deleting = false;
    this.deleteConfirm = false;
    this.inputEnabled = true;

    if (this.width > this.height) {
        this.anchor.set(0.5, 1);
    } else if (this.width > this.height) {
        this.anchor.set(1, 0.5);
    } else {
        this.anchor.set(0.5, 0.5);
    }
}

Placeable.prototype = Object.create(Phaser.Sprite.prototype);
Placeable.prototype.constructor = Placeable;

Placeable.prototype.rotateClockwise = function () {
    if (!this.rotating) {
        this.rotating = true;
        var newAngle = this.angle + 90;
        var rotateTween = this.game.add.tween(this).to({ angle: newAngle }, 200, Phaser.Easing.Linear.None, true);

        rotateTween.onComplete.addOnce(function () {
            this.rotating = false;
        }, this);
    }
}

Placeable.prototype.rotateCounterClockwise = function () {
    if (!this.rotating) {
        this.rotating = true;
        var newAngle = this.angle - 90;
        var rotateTween = this.game.add.tween(this).to({ angle: newAngle }, 200, Phaser.Easing.Linear.None, true);

        rotateTween.onComplete.addOnce(function () {
            this.rotating = false;
        }, this);
    }
}

Placeable.prototype.delete = function () {
    if (!this.deleting) {
        if (!this.deleteConfirm) {
            var alphaTween = this.game.add.tween(this).to({ alpha: 0.6 }, 200, Phaser.Easing.Linear.None, true);

            alphaTween.onStart.addOnce(function () {
                this.deleting = true;
            }, this);
            
            alphaTween.onComplete.addOnce(function () {
                this.deleting = false;
            }, this);
            
            this.deleteConfirm = true;
        } else {
            var alphaTween = this.game.add.tween(this).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true);

            alphaTween.onStart.addOnce(function () {
                this.deleting = true;
            }, this);
            
            alphaTween.onComplete.addOnce(function () {
                this.game.deleteInstance = null;
                this.deleting = false;
                this.destroy(true);
            }, this);
        }
    }
}

Placeable.prototype.deleteCancel = function () {
    if (!this.deleting) {
        if (this.deleteConfirm) {
            var alphaTween = this.game.add.tween(this).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);

            alphaTween.onStart.addOnce(function () {
                this.deleting = true;
            }, this);
            
            alphaTween.onComplete.addOnce(function () {
                this.deleting = false;
            }, this);
            
            this.deleteConfirm = false;
        } 
    }            
}