import Phaser from 'phaser'

export default class MapTileSprite extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, texture, angle) {
        super(scene, x, y, texture)

        //this.angle = angle
    }
}