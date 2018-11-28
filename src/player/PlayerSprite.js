import Phaser from 'phaser'

export default class PlayerSprite extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y)
        this.on('testevent', (gameObject) => { 
            console.log(gameObject) 
        })
    }
}