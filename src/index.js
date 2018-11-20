import Phaser from 'phaser'
import BootScene from 'scene/BootScene';
import PreloadScene from 'scene/PreloadScene';
import PostloadScene from 'scene/PostloadScene';
import MainScene from 'scene/MainScene';
import PlayerPlugin from 'player/PlayerPlugin';

const gameConfig = {
    width: 1280,
    height: 720,
    plugins: {
        global: [
            { key: 'PlayerPlugin', plugin: PlayerPlugin, start: true }
        ]
    },   
    scene: [ 
        BootScene, 
        PreloadScene, 
        PostloadScene, 
        MainScene 
    ]
}

new Phaser.Game(gameConfig)

