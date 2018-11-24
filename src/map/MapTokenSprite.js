import Phaser from 'phaser'

export default class MapTokenSprite extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, texture, angle) {
        super(scene, x, y, texture)

        //this.angle = angle
    }
}