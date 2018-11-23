import Phaser from 'phaser'

export default class PostloadScene extends Phaser.Scene {
    constructor(){
        super({
            key: 'postload'
        })
    }

    preload() {
        this.loadTokensAndTiles(this.cache.json.get('gamedata'))
    }

    create () {
        this.scene.start('main')
    }

    loadTokensAndTiles (gamedata) {
        //=================================================
        // ImageTokens RenderTexture
        for (var i = 0; i < gamedata.imageTokens.length; i++) {
            const gridWidth = 96;
            const gridWidthHalf = gridWidth / 2
            const imageTokenData = gamedata.imageTokens[i];

            if (imageTokenData.imageKey != null) {
                const image = this.make.image({ key: imageTokenData.imageKey }, false)
                const renderTexture = this.make.renderTexture({ width: gridWidth, height: gridWidth }, false);
                image.displayWidth = gridWidth
                image.displayHeight = gridWidth
                renderTexture.draw(image, gridWidthHalf, gridWidthHalf) 
                this.textures.remove(imageTokenData.imageKey)
                renderTexture.saveTexture(imageTokenData.imageKey)
            }
        }

        //=================================================
        // ImageTiles RenderTexture
        for (var k = 0; k < gamedata.imageTiles.length; k++) {
            const imageTileData = gamedata.imageTiles[k];
            const image = this.make.image({ key: imageTileData.imageKey }, false)
            const renderTexture = this.make.renderTexture({ width: image.width, height: image.height }, false);
            
            if (imageTileData.floorColor != null) {
                renderTexture.fill(imageTileData.floorColor)
            }

            renderTexture.draw(image, image.width / 2, image.height / 2) 
            this.textures.remove(imageTileData.imageKey)
            renderTexture.saveTexture(imageTileData.imageKey)
        }
    }
}