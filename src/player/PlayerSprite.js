import Phaser from 'phaser'

export default class PlayerSprite extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y)
        this.cutsceneCamera = false
        this.on('moveToMapToken', this.handleMoveToMapToken)
    }

    updateMoveCursor (cursors) {
        if (!this.cutsceneCamera) {
            const playerVelocity = 400
        
            this.body.setVelocity(0, 0)
    
            if (cursors.up.isDown) {
                this.body.setVelocityY(-playerVelocity)
            }
            else if (cursors.down.isDown) {
                this.body.setVelocityY(playerVelocity)
            }
    
            if (cursors.left.isDown) {
                this.body.setVelocityX(-playerVelocity)
            }
            else if (cursors.right.isDown) {
                this.body.setVelocityX(playerVelocity)
            }
        }
    }

    updateMoveDragPoint (dragPoint) {
        if (!this.cutsceneCamera) {
            this.x += dragPoint.x
            this.y += dragPoint.y
        }
    }

    handleMoveToMapToken (mapToken) {
        if (!this.cutsceneCamera) {
            this.cutsceneCamera = true
            const tween = this.scene.tweens.add({
                targets: this,
                x: mapToken.x,
                y: mapToken.y,
                ease: 'Power1',
                duration: 1200,
                onComplete: (tween, target) => { 
                    this.cutsceneCamera = false
                    mapToken.emit('activate', this)
                },
            })
        }
    }
}