import Phaser from 'phaser'

export default class MapTileSprite extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, data) {
        super(scene, x, y, data.imageKey)
        this.data = data
        this.angle = data.angle
        this.setDepth(1)
    }
}