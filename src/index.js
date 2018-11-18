import Phaser from 'phaser'
import BootScene from 'scenes/boot';
import PreloadScene from 'scenes/preload';
import MainScene from 'scenes/main';

const gameConfig = {
    width: 1280,
    height: 720,
    scene: [ BootScene, PreloadScene, MainScene ]
}

new Phaser.Game(gameConfig)

