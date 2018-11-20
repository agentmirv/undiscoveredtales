import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
    constructor(){
        super({
            key: 'boot'
        })
    }

    preload() {
        this.load.json('assets', 'assets/json/assets.json')
        this.load.json('gamedata', 'assets/json/gamedata.json')
    }

    create () {
        this.scene.start('preload')
    }    
}