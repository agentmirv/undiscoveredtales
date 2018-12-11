import Phaser from 'phaser'

export default class MapTokenSprite extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, data) {
        super(scene, x, y, data.imageKey)
        this.data = data
        this.angle = data.angle
        this.setInteractive()
        this.setDepth(5)
        this.on('pointerup', this.handlePointerUp, this)
        this.on('activate', this.handleActivate, this)
    }

    handlePointerUp(sender) {
        this.scene.player.emit('moveToMapToken', this)
    }

    handleActivate (sender) {
        console.log(this.data)
    }
}