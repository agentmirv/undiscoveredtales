import Phaser from 'phaser'
import PlayerSprite from 'player'

export default class MainScene extends Phaser.Scene {
    constructor(){
        super({
            key: 'main'
        })
        this.player = null
    }

    preload() {
        //this.load.image('assets', 'assets/json/assets.json')
    }

    create () {
        this.add.tileSprite(0, 0, 2560, 2560, 'background');
        this.player = new PlayerSprite(this, 0, 0);
        this.add.existing(this.player);
    }    
}