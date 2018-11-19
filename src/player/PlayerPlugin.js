import Phaser from 'phaser'
import PlayerSprite from 'player/PlayerSprite'

export default class PlayerPlugin extends Phaser.Plugins.BasePlugin {

    constructor (pluginManager)
    {
        super(pluginManager)

        //  Register our new Game Object type
        pluginManager.registerGameObject('player', this.createPlayer)
    }

    createPlayer (x, y)
    {
        const player = this.scene.physics.add.existing(new PlayerSprite(this.scene, x, y))
        player.body.setCollideWorldBounds(true);

        return player
    }

}