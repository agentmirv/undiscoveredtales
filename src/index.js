import Phaser from 'phaser'
import BootScene from 'scene/BootScene';
import PreloadScene from 'scene/PreloadScene';
import MainScene from 'scene/MainScene';

const gameConfig = {
    width: 1280,
    height: 720,
    scene: [ BootScene, PreloadScene, MainScene ]
}

new Phaser.Game(gameConfig)

