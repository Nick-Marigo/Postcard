class PostcardGame extends Phaser.Scene {
    constructor() {
        super("postcardGameScene")
    }

    preload() {
        this.load.path = "./assets/"
        this.load.image("square", "Square.png")
        this.load.image('generator', 'generator.png')
        this.load.image('generatorCover', 'generatorCover.png');
    }

    create() {

        this.generator = new Generator(this, width/2, height/2);

    }

    update() {

        this.generator.generatorFSM.step();

    }
}