class PostcardGame extends Phaser.Scene {
    constructor() {
        super("postcardGameScene")
    }

    preload() {
        this.load.path = "./assets/"
        this.load.image("square", "Square.png")
        this.load.spritesheet('generator', 'generator.png', {frameWidth: 540, frameHeight: 360})
        this.load.spritesheet('generatorCover', 'generatorCover.png', {frameWidth: 540, frameHeight: 360});
        this.load.spritesheet('airFilterCover', 'airFilterCover.png', {frameWidth: 70, frameHeight: 80});
        this.load.spritesheet('airFilter', 'airFilter.png', {frameWidth: 60, frameHeight: 40});
        this.load.image('checklist', 'checklist.png');
        this.load.image('exhaust', 'exhaust.png');

        //Sparkplug
        this.load.spritesheet('sparkplug', '/Sparkplug.png', {frameWidth: 60, frameHeight: 30});

        this.load.path = "./assets/sounds/"
        this.load.audio('startup', 'startupSound.mp3');
    }

    create() {

        //Blinking animations for...

        //Air filter Cover
        this.anims.create({
            key: 'airFilterCoverBlink',
            frames: this.anims.generateFrameNumbers('airFilterCover', {start: 0, end: 1}),
            frameRate: 4,
            repeat: -1
        });

        //Generator cover
        this.anims.create({
            key: 'generatorCoverBlink',
            frames: this.anims.generateFrameNumbers('generatorCover', {start: 0, end: 1}),
            frameRate: 4,
            repeat: -1
        });

        //Air filter clean
        this.anims.create({
            key: 'airFilterCleanBlink',
            frames: this.anims.generateFrameNumbers('airFilter', {start: 0, end: 1}),
            frameRate: 4,
            repeat: -1
        });

        //Air filter dirty
        this.anims.create({
            key: 'airFilterDirtyBlink',
            frames: this.anims.generateFrameNumbers('airFilter', {start: 2, end: 3}),
            frameRate: 4,
            repeat: -1
        });

        //Sparkplug blink
        this.anims.create({
            key: 'sparkplugBlink',
            frames: this.anims.generateFrameNumbers('sparkplug', {start: 0, end: 1}),
            frameRate: 4,
            repeat: -1
        });

        //Particle effect for generator exhaust
        this.exhaustemitter = this.add.particles(775, 150, 'exhaust', {
            speed: 50,
            gravityX: 200,
            scale: {start: 1, end: 0},
            lifespan: 1000,
            emitting: false
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
        this.generator.update(this.exhaustemitter);

    }
}