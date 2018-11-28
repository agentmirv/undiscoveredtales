import Phaser from 'phaser'
import MapTokenSprite from 'map/MapTokenSprite'

export default class MainScene extends Phaser.Scene {
    constructor(){
        super({
            key: 'main',
            physics: {
                default: 'arcade',
                arcade: {
                    debug: true
                }
            }
        })
        
        this.gamedata = null
        this.cursors = null
        this.player = null
    }

    create () {
        this.gamedata = this.cache.json.get('gamedata')
        this.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2)
        this.physics.world.setBounds(0, 0, 1920 * 2, 1080 * 2)
        this.cursors = this.input.keyboard.createCursorKeys()
        
        this.add.tileSprite(0, 0, 1920 * 2, 1080 * 2, 'background')

        this.player = this.add.player(this.gamedata.playerStart.x, this.gamedata.playerStart.y)
        
        this.cameras.main.startFollow(this.player, true, 0.8, 0.8)

        //=================================================
        // Test
        //this.add.sprite(this.gamedata.playerStart.x, this.gamedata.playerStart.y, 'arrow')
        //this.add.sprite(this.gamedata.playerStart.x, this.gamedata.playerStart.y, 'tile-lobby')
        //this.add.existing(new MapTileSprite(this, this.gamedata.playerStart.x, this.gamedata.playerStart.y, 'tile-lobby'))
        //this.add.mapTile(this.gamedata.playerStart.x, this.gamedata.playerStart.y, 'maptile-lobby')
        this.add.mapToken(this.gamedata.playerStart.x, this.gamedata.playerStart.y, 'token-investigators-lobby')

        this.input.on('gameobjectup', (pointer, gameObject) => {
            if (gameObject instanceof MapTokenSprite) {
                this.player.emit('testevent', gameObject)
            }
        }, this)
    }
    
    update () {
        const playerVelocity = 400
        
        this.player.body.setVelocity(0, 0)

        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-playerVelocity)
        }
        else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(playerVelocity)
        }

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-playerVelocity)
        }
        else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(playerVelocity)
        }
    }
}