import Phaser from 'phaser'

export default class PreloadScene extends Phaser.Scene {
    constructor(){
        super({
            key: 'preload'
        })
    }

    preload() {
        this.loadAssets(this.cache.json.get('assets'))
    }

    create () {
        this.scene.start('main')
    }

    loadAssets(json) {
        Object.keys(json).forEach((group) => {
            Object.keys(json[group]).forEach((key) => {

                let value = json[group][key]

                if (group === 'image') {
                    this.load[group](key, value)
                }

            }, this)
        }, this)
    }
}