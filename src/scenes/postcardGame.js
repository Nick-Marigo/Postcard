class PostcardGame extends Phaser.Scene {
    constructor() {
        super("postcardGameScene")
    }

    preload() {
        this.load.path = "./assets/"
        this.load.image("square", "Square.png")
        this.load.spritesheet('generator', 'generator.png', {frameWidth: 540, frameHeight: 360})
        this.load.image('generatorCover', 'generatorCover.png');
        this.load.spritesheet('airFilterCover', 'airFilterCover.png', {frameWidth: 70, frameHeight: 80});
        this.load.spritesheet('airFilter', 'airFilter.png', {frameWidth: 60, frameHeight: 40});
        this.load.image('checklist', 'checklist.png');

        this.load.path = "./assets/sounds/"
        this.load.audio('startup', 'startupSound.mp3');
    }

    create() {

        //Blinking animation for air Filter Cover
        this.anims.create({
            key: 'airFilterCoverBlink',
            frames: this.anims.generateFrameNumbers('airFilterCover', {start: 0, end: 1}),
            frameRate: 4,
            repeat: -1
        });

        //Create new generator
        this.generator = new Generator(this, width/2, height/2);

        //Create new checklist
        this.checklist = new Checklist(this, 100, 225);

        // Key to be able to switch scenes easily
        this.input.keyboard.on('keydown-S', () => {
            console.log('Switching Scene to postcardBackScene');
            this.scene.start('postcardBackScene');
        }, this);

    }

    update() {

        //Update generator state machine
        this.generator.generatorFSM.step();

        //Update generator
        this.generator.update();

    }
}