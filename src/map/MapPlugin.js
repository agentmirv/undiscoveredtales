import Phaser from 'phaser'
import MapTileSprite from 'map/MapTileSprite'
import MapTokenSprite from 'map/MapTokenSprite'

export default class MapPlugin extends Phaser.Plugins.BasePlugin {

    constructor (pluginManager)
    {
        super(pluginManager)

        //  Register our new Game Object type
        pluginManager.registerGameObject('mapTile', this.createMapTile)
        pluginManager.registerGameObject('mapToken', this.createMapToken)
    }

    createMapTile (x, y, id)
    {
        // gamedata = this.scene.cache.json.get('gamedata')
        // const data = gamedata.mapTiles.find((item) => item.id == id);
        const data = this.scene.cache.json.get('gamedata').mapTiles.find((item) => item.id == id);
        const texture = data.imageKey
        const mapTile = this.scene.add.existing(new MapTileSprite(this.scene, x, y, texture))

        return mapTile
    }

    createMapToken (x, y, id)
    {
        // gamedata = this.scene.cache.json.get('gamedata')
        // const data = gamedata.mapTokens.find((item) => item.id == id);
        const data = this.scene.cache.json.get('gamedata').mapTokens.find((item) => item.id == id);
        const texture = data.imageKey
        const mapToken = this.scene.add.existing(new MapTokenSprite(this.scene, x, y, texture))

        return mapToken
    }
}
