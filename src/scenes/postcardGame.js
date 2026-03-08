class PostcardGame extends Phaser.Scene {
    constructor() {
        super("postcardGameScene")
    }

    preload() {
        this.load.path = "./assets/"
        this.load.image("square", "Square.png")
    }

    create() {

        /*this.square = this.add.sprite(500, 350, "square").setInteractive();
        this.square2 = this.add.sprite(500, 350, "square").setTint(0xFF0000).setInteractive();

        this.input.setDraggable(this.square);
        this.input.setDraggable(this.square2);*/

        this.generator = new Generator(this, width/2, height/2, 'texture');

    }

    update() {

        this.generator.generatorFSM.step();

    }
}