import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
    constructor(){
        super({
            key: 'boot'
        })
    }

    preload() {
        console.log('boot.preload')
        this.load.json('assets', 'assets/json/assets.json')
    }

    create () {
        console.log('boot.create')
        this.scene.start('preload')
    }    
}