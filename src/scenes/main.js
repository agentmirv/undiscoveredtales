import Phaser from 'phaser'
import PlayerSprite from 'player'

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
        
        this.player = null
        this.cursors = null
    }

    create () {
        this.add.tileSprite(0, 0, 2560, 2560, 'background');
        this.player = new PlayerSprite(this, 0, 0);
        this.physics.add.existing(this.player);
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    
    update () {
        var playerVelocity = 400
        
        this.player.body.setVelocity(0, 0)

        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-playerVelocity);
        }
        else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(playerVelocity);
        }

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-playerVelocity);
        }
        else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(playerVelocity);
        }
    }
}