import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {
    constructor(){
        super({
            key: 'main'
        })
    }

    preload() {
        //this.load.image('assets', 'assets/json/assets.json')
    }

    create () {
        this.add.tileSprite(0, 0, 2560, 2560, 'backgrounddebug');
    }    
}