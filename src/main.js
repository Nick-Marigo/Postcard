"use strict"

let config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 700,
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
    scene: [ PostcardGame ]
}

let game = new Phaser.Game(config)
