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
    }

    create() {

        this.generator = new Generator(this, width/2, height/2);

    }

    update() {

        this.generator.generatorFSM.step();

    }
}