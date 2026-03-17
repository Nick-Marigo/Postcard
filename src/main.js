//Name: Nick Marigo
//Project: Postcard
//Date: 3/18/26
//Hours: 50

//All Art and Code by Nick Marigo

//Sounds 
// Complete/obtained Sound Effect by Annyew: https://freesound.org/people/Annyew/sounds/580116/
// Socket Wrench Sound Effect by yfjesse: https://freesound.org/people/yfjesse/sounds/131200/
// Oil Pouring Sound Effect by clement.bern: https://freesound.org/people/clement.bernardeau/sounds/699231/
// Generator Starting Sound Effect by mrrap4food: https://freesound.org/people/mrrap4food/sounds/618984/
// Generator Starting and Running Sound Effect by JeffWojo: https://freesound.org/people/JeffWojo/sounds/169940/
// Intro voice audio by Nick Marigo

//Music
// Mythical Game Music by Kjartan_abel: https://freesound.org/people/kjartan_abel/sounds/647212/

//Fonts
// Exclusive Editorial by Dora Typefoundry: https://www.dafont.com/exclusive-editorial.font
// Cute Handwriting by Paula Tennet: https://www.dafont.com/cutehandwriting.font?text=handwriting


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
