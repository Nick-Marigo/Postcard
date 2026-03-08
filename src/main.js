"use strict"

let config = {
    parent: 'game',
    type: Phaser.AUTO,
    width: 1100,
    height: 700,
    backgroundColor: '#FACADE',
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { 
                x: 0,
                y: 500 
            },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [ PostcardGame ]
}

let width = config.width;
let height = config.height;

let game = new Phaser.Game(config)
