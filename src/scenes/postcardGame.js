class PostcardGame extends Phaser.Scene {
    constructor() {
        super("postcardGameScene")
    }

    preload() {
        this.load.path = "./assets/art/"
        this.load.image("square", "Square.png");
        this.load.spritesheet('turnArrow', 'turnArrow.png', {frameWidth: 120, frameHeight: 120});
        this.load.spritesheet('generator', 'generator.png', {frameWidth: 540, frameHeight: 360})
        this.load.spritesheet('generatorCover', 'generatorCover.png', {frameWidth: 540, frameHeight: 360});
        this.load.spritesheet('airFilterCover', 'airFilterCover.png', {frameWidth: 70, frameHeight: 80});
        this.load.spritesheet('airFilter', 'airFilter.png', {frameWidth: 60, frameHeight: 40});
        this.load.image('checklist', 'checklist.png');
        this.load.image('exhaust', 'exhaust.png');
        this.load.image('placematParts', 'placematParts.png');
        this.load.image('placematTools', 'placematTools.png');
        this.load.image('stamp', 'stamp.png');
        this.load.spritesheet('paperclip', 'paperclip.png', {frameWidth: 200, frameHeight: 200});

        //Sparkplug
        this.load.spritesheet('sparkplug', '/Sparkplug.png', {frameWidth: 60, frameHeight: 30});
        this.load.spritesheet('sparkplugCover', '/SparkplugCover.png', {frameWidth: 30, frameHeight: 10});
        this.load.spritesheet('socketWrench', 'SocketWrench.png', {frameWidth: 26, frameHeight: 106});

        //Oil
        this.load.spritesheet('oilDrainPan', 'oilDrainPan.png', {frameWidth: 80, frameHeight: 100});
        this.load.spritesheet('wrench', 'wrench.png', {frameWidth: 30, frameHeight: 106});
        this.load.spritesheet('bolt', 'bolt.png', {frameWidth: 14, frameHeight: 14});
        this.load.image('dirtyOil', 'dirtyOil.png');
        this.load.image('cleanOil', 'cleanOil.png');
        this.load.spritesheet('oilCap', 'oilcap.png', {frameWidth: 26, frameHeight: 26});
        this.load.spritesheet('funnel', 'funnel.png', {frameWidth: 50, frameHeight: 100});
        this.load.spritesheet('oil', 'oil.png', {frameWidth: 80, frameHeight: 100});
        this.load.spritesheet('Xmark', 'Xmark.png', {frameWidth: 14, frameHeight: 14});

        this.load.path = "./assets/sounds/";
        this.load.audio('startup', 'startupSound.mp3');
        this.load.audio('fixedSound', 'fixedSound.wav');
        this.load.audio('oil', 'pouringoil.wav');
        this.load.audio('socketwrench', 'socketwrench.wav');
        this.load.audio('completeSound', 'completeobtainedsound.wav');
        this.load.audio('message', 'PostcardMessage.m4a');

        this.load.path = "./assets/Music/";
        this.load.audio('backgroundMusic', 'garden-mythical-game-music.wav');

        this.load.path = "./assets/fonts/";
        this.load.font('handwritingFont', 'CuteHandWriting.ttf');
        this.load.font('checklistFont', 'DR_Exclusive_Editorial.ttf');
    }

    create() {

        let animsName = ['airFilterCoverBlink', 'generatorCoverBlink', 'airFilterCleanBlink', 'airFilterDirtyBlink', 'sparkplugBlink', 'sparkplugDirtyBlink', 'sparkplugCoverBlink', 'socketWrenchBlink', 'turnArrowBlink', 'oilDrainPanBlink', 'wrenchBlink', 'boltBlink', 'oilBlink', 'oilCapBlink', 'funnelBlink', 'paperclipBlink'];
        let animsString = ['airFilterCover', 'generatorCover', 'airFilter', 'airFilter', 'sparkplug', 'sparkplug', 'sparkplugCover', 'socketWrench', 'turnArrow', 'oilDrainPan', 'wrench', 'bolt', 'oil', 'oilCap', 'funnel', 'paperclip'];
        let animsFrames = [[0, 1], [0, 1], [0, 1], [2, 3], [0, 1], [2, 3], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1]];

        for(let i = 0; i < animsName.length; i++) {

            this.anims.create({
                key: animsName[i],
                frames: this.anims.generateFrameNumbers(animsString[i], {start: animsFrames[i][0], end: animsFrames[i][1]}),
                frameRate: 4,
                repeat: -1
            });

        }

        this.anims.create({
            key: 'XmarkAnim',
            frames: this.anims.generateFrameNumbers('Xmark', {start: 1, end: 8}),
            frameRate: 8,
            repeat: 0
        })

        //Particle effect for generator exhaust
        this.exhaustemitter = this.add.particles(915, 150, 'exhaust', {
            speed: 50,
            gravityX: 200,
            scale: {start: 1, end: 0},
            lifespan: 1000,
            emitting: false
        });

        //Particle effect for dirty oil
        this.dirtyOilemitter = this.add.particles(758, 305, 'dirtyOil', {
            speed: 10,
            gravityY: 100,
            lifespan: 1200,
            emitting: false
        });

        //Particle effect for clean oil
        this.cleanOilemitter = this.add.particles(810, 100, 'cleanOil', {
            speed: 10,
            gravityY: 100,
            lifespan: 1000,
            emitting: false
        });

        this.dirtyOilemitter.setDepth(50);
        this.cleanOilemitter.setDepth(50);

        //Create new generator
        this.generator = new Generator(this, width/2, height/2);

        //Create new checklist
        this.checklist = new Checklist(this, 200, 325);

        this.backgroundMusic = this.sound.add('backgroundMusic', {volume: .2});

        this.gameStarted = false;

        this.introMessage = this.sound.add('message');

        this.introOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.25).setDepth(200);

        this.introNote = this.add.sprite(width / 2, 0, 'paperclip').setDepth(201).setInteractive({useHandCursor: true}).setOrigin(0.5, 0).setDepth(201);
        this.introNote.play('paperclipBlink');

        this.introPrompt = this.add.text(width / 2, this.introNote.y + 225, 'Click the note to play the message!', {
            fontFamily: 'handwritingfont',
            fontSize: '28px',
            color: '#000',
            backgroundColor: '#FACADE',
            padding: {left: 12, right: 12, top: 8, bottom: 8}
        }).setDepth(201).setOrigin(0.5, 0);

        this.introBox = this.add.rectangle(width / 2, height / 2, 500, 500, 0xd4b472).setVisible(false).setDepth(200);

        this.noteMessage = this.add.text((this.introBox.x / 2) + 75, (this.introBox.y / 2) - 50, `Hey Dad,
I hope you are doing well. I've missed working on engines with you. I bought this generator, but I am having trouble getting it to run. Could you help me get it running? I was able to do some wizardry and put it on a digital postcard. I think the air filter, sparkplug, and oil should all be changed. Just use your mouse to click and drag over objects to move them around. Oh, and follow the checklist on the left to see the correct order of things. 
Love,
	Nick`, {
        fontFamily: 'handwritingfont',
        fontSize: '28px',
        color: '#000',
        wordWrap: {width: 400, useAdvancedWrap: true}
    }).setVisible(false).setDepth(202);

    this.closeIntroNote = this.add.text(this.introBox.x, this.introBox.y + 225, 'Close', {
        fontFamily: 'handwritingfont',
        fontSize: '28px',
        color: '#000',
        backgroundColor: '#FACADE',
        padding: {left: 12, right: 12, top: 8, bottom: 8}
    }).setOrigin(0.5).setDepth(202).setInteractive({useHandCursor: true}).setVisible(false);

    this.introNote.on('pointerdown', () => {
        if(!this.introMessage.isPlaying) {
            this.introMessage.play();
        }
        this.introNote.setVisible(false);
        this.noteMessage.setVisible(true);
        this.closeIntroNote.setVisible(true);
        this.introBox.setVisible(true);
        this.introPrompt.setVisible(false);
        
    });

    this.closeIntroNote.on('pointerdown', () => {
        if(this.introMessage.isPlaying) {
            this.introMessage.stop();
        }
        this.noteMessage.setVisible(false);
        this.closeIntroNote.setVisible(false);
        this.introBox.setVisible(false);
        this.introOverlay.setVisible(false);
        this.gameStarted = true;

        if(!this.backgroundMusic.isPlaying) {
            this.backgroundMusic.play();
        }
        
    });

        // Key to be able to switch scenes easily
        this.input.keyboard.on('keydown-S', () => {
            console.log('Switching Scene to postcardBackScene');

            const card = document.getElementById('card');

                    card.classList.add('flipped');

                    this.time.delayedCall(3000, () => {
                        this.scene.start('postcardBackScene');
                    });
        }, this);

    }

    update() {

        if(!this.gameStarted) return;

        //Update generator state machine
        this.generator.generatorFSM.step();

        //Update generator
        this.generator.update(this.exhaustemitter);

    }
}