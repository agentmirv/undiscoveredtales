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
        this.gamedataInstances = {
            mapTokens: [],
            mapTiles: []
        }
        this.cursors = null
        this.player = null
        this.origDragPoint = null
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
        // Events
        this.input.on('gameobjectup', (pointer, gameObject) => {
            if (gameObject instanceof MapTokenSprite) {
                this.player.emit('moveToMapToken', gameObject)
            }
        }, this)
        
        //=================================================
        // Test
        this.add.mapTile(this.gamedata.playerStart.x, this.gamedata.playerStart.y, 'maptile-lobby')
        this.add.mapToken(this.gamedata.playerStart.x, this.gamedata.playerStart.y, 'token-investigators-lobby')
    }
    
    update () {
        if (this.input.activePointer.isDown) {
            if (this.origDragPoint) {
                const dragPoint = new Phaser.Math.Vector2(this.origDragPoint.x - this.input.activePointer.position.x, this.origDragPoint.y - this.input.activePointer.position.y)
                this.player.updateMoveDragPoint(dragPoint)
            }
            // set new drag origin to current position	
            this.origDragPoint = this.input.activePointer.position.clone();
        } else {
            this.origDragPoint = null;
            this.player.updateMoveCursor(this.cursors)
        }
    }
}