//Name: Nick Marigo
//Project: Postcard
//Date: 3/18/26
//Hours: 40

//Sounds 
//Generator Startup, Run, Shutdown: https://freesound.org/people/JeffWojo/sounds/169940/
// High performance car engine turning over won't start: https://freesound.org/people/mrrap4food/sounds/618984/



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
    scene: [ PostcardGame, PostcardBack ]
}

let width = config.width;
let height = config.height;

let game = new Phaser.Game(config)
