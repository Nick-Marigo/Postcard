class PostcardGame extends Phaser.Scene {
    constructor() {
        super("postcardGameScene")
    }

    create() {

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

        // All variables to enable the note and make the game start after its been closed
        this.gameStarted = false;

        this.introMessage = this.sound.add('message', {volume: 0.7});

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

        //Check if note has been closed
        if(!this.gameStarted) return;

        //Update generator state machine
        this.generator.generatorFSM.step();

        //Update generator
        this.generator.update(this.exhaustemitter);

    }
}