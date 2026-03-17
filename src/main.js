//Name: Nick Marigo
//Project: Postcard
//Date: 3/18/26
//Hours: 58

//Note to Grader: To skip to the backside of the postcard press S

/*
Phaser components used:
1. Animation manager: Used for blinking affect game objects and cross-out affect. You can find this in load.js on lines 61 to 81
2. Particle Effects: Used for generator exhaust, draining oil, and pouring oil. You can find this in postcardGame.js on lines 12-35
3. Text Objects: Used for text and interactive text in some scenes. You can see text creation for checklist in checklist.js on lines 54-64. You can see interactive text creation in postcardBack.js on lines 99-158.
4. Tween Manager: Used for checklist cross-out line. You can find this in checklist.js on lines 109-114. Also used for all targets, pouring oil, and moving sparkplug cover. You can find this in generator.js on lines 205-212, 601-622, 700-715, and 889-921.
5. Timers: Used for dirty and clean oil to pour for 5 seconds. you can find this in generator.js on lines 329 and 901. Used to start scene at the end of the css transition when changing scenes. You can find this in generator.js on line 1065, 1071, in postcardGame.js on lines 117, and in postcardBack.js on lines 91 and 180.
6. Sounds Manager: Used different sound affects for different tasks like a completion task when one task is complete and another sound for when the user is spinning the socket wrench or wrench. You can see this in generator.js on lines 52-54, 230, 263 (snap.play is used 28 times so I wont list them all). Used background music which can be seen in postcardGame.js on lines 42, 103-105.
7. Input System: Used keyboard event keydown-S to transition from scene to scene. you can see this in postcardGame.js on lines 110-120 and postcardBack.js on lines 161-186. Used setInteractive() on all generator gameObjects you can see this in generator.js on lines 60, 114, 115, etc. 
*/

/*
Creative tilt: I think one feature was the progress ring that generates when starting the generator. It took me a while to figure out to have to progress in a circle. You can find it in generator.js on lines 373-403.
I think another amazing feature was the postcard flip. I know Nathan showed us a method but that lacked loading another scene for the backside. I had to use CSS 3D transform combined with JavaScript class toggling. The filp uses a layered card strcutre so I could have the front and back faces stacked in the same space. Then used a 3D transform to rotate along the Y-axis. You can see this in animate.css on lines 10-26. In javasciprt I triggered the flip and then reassigned the Phaser canvas to the back container so the scene remains interactive after the flip, otherwise the game was on the wrong side. You can see this in postcardBack.js on lines 10-14 and then lines 75-95 to reverse it and flip back.
*/ 

/*
Credits:
Art and Code by Nick Marigo

Sounds: 
Complete/obtained Sound Effect by Annyew: https://freesound.org/people/Annyew/sounds/580116/
Socket Wrench Sound Effect by yfjesse: https://freesound.org/people/yfjesse/sounds/131200/
Oil Pouring Sound Effect by clement.bern: https://freesound.org/people/clement.bernardeau/sounds/699231/
Generator Starting Sound Effect by mrrap4food: https://freesound.org/people/mrrap4food/sounds/618984/
Generator Starting and Running Sound Effect by JeffWojo: https://freesound.org/people/JeffWojo/sounds/169940/
Intro voice audio by Nick Marigo

Music:
Mythical Game Music by Kjartan_abel: https://freesound.org/people/kjartan_abel/sounds/647212/

Fonts:
Exclusive Editorial by Dora Typefoundry: https://www.dafont.com/exclusive-editorial.font
Cute Handwriting by Paula Tennet: https://www.dafont.com/cutehandwriting.font?text=handwriting
*/


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
    scene: [ Load, PostcardGame, PostcardBack ]
}

let width = config.width;
let height = config.height;

let game = new Phaser.Game(config)
