import Phaser from 'phaser'

export default class PlayerSprite extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y)
        this.on('testevent', (gameObject) => { 
            console.log(gameObject) 
        })
    }

    updateMoveCursor (cursors) {
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

    updateMoveDragPoint (dragPoint) {
        this.x += dragPoint.x
        this.y += dragPoint.y
    }
}