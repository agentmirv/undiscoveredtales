import Phaser from 'phaser'

export default class DialogPlugin extends Phaser.Plugins.BasePlugin {
    constructor (pluginManager) {
        super(pluginManager)

        //  Register our new Game Object type
        // pluginManager.registerGameObject('mapTile', this.createMapTile)
        // pluginManager.registerGameObject('mapToken', this.createMapToken)
    }

    // createMapTile (x, y, id) {
    //     const data = this.scene.cache.json.get('gamedata').mapTiles.find((item) => item.id == id)
    //     const mapTile = new MapTileSprite(this.scene, x, y, data)
    //     this.scene.add.existing(mapTile)
    //     this.scene.gamedataInstances.mapTiles.push(mapTile)
        
    //     return mapTile
    // }

    // createMapToken (x, y, id) {
    //     const data = this.scene.cache.json.get('gamedata').mapTokens.find((item) => item.id == id)
    //     const mapToken = new MapTokenSprite(this.scene, x, y, data)
    //     this.scene.add.existing(mapToken)
    //     this.scene.gamedataInstances.mapTokens.push(mapToken)

    //     return mapToken
    // }
}
