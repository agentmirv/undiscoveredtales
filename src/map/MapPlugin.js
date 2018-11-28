import Phaser from 'phaser'
import MapTileSprite from 'map/MapTileSprite'
import MapTokenSprite from 'map/MapTokenSprite'

export default class MapPlugin extends Phaser.Plugins.BasePlugin {

    constructor (pluginManager) {
        super(pluginManager)

        //  Register our new Game Object type
        pluginManager.registerGameObject('mapTile', this.createMapTile)
        pluginManager.registerGameObject('mapToken', this.createMapToken)
    }

    createMapTile (x, y, id) {
        const data = this.scene.cache.json.get('gamedata').mapTiles.find((item) => item.id == id);
        const mapTile = new MapTileSprite(this.scene, x, y, data.imageKey, data.angle)
        this.scene.add.existing(mapTile)

        return mapTile
    }

    createMapToken (x, y, id) {
        const data = this.scene.cache.json.get('gamedata').mapTokens.find((item) => item.id == id);
        const mapToken = new MapTokenSprite(this.scene, x, y, data.imageKey, data.angle)
        this.scene.add.existing(mapToken)

        return mapToken
    }
}