import Phaser from 'phaser'
import BootScene from './scenes/boot';
import PreloadScene from './scenes/preload';
import MainScene from './scenes/main';

const gameConfig = {
    width: 680,
    height: 400,
    scene: [ BootScene, PreloadScene, MainScene ]
}

new Phaser.Game(gameConfig)

