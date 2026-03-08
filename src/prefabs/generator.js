class Generator extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.scene = scene;

        this.create();

        this.brokenStep = 0;
        this.airFilterStep = 0;
        this.sparkPlugStep = 0;
        this.oilStep = 0;
        this.fixedStep = 0;

        //this.scene.add.sprite(0, 0, texture);

        this.generatorFSM = new StateMachine('broken', {
            broken: new BrokenState(),
            airFilter: new AirFilterState(),
            sparkPlug: new SparkPlugState(),
            oil: new OilState(),
            fixed: new FixedState()
        }, [scene, this]);

        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        scene.input.on('dragend', (pointer, gameObject) => {
            this.generatorFSM.possibleStates[this.generatorFSM.state].handleDrop(gameObject, this);

        })

    }

    create() {
        //testing objects to get mechanics working
        /*this.square1 = this.scene.add.sprite(500, 350, "square");
        this.square2 = this.scene.add.sprite(500, 650, "square").setTint(0xFF0000);
        this.square3 = this.scene.add.sprite(700, 650, "square").setTint(0x00FF00);

        this.target1 = this.scene.add.rectangle(600, 250, 100, 100, 0xffff00, 0.25);
        this.target2 = this.scene.add.rectangle(800, 450, 100, 100, 0xffff00, 0.25);

        this.square1.setInteractive();
        this.square2.setInteractive();
        this.scene.input.setDraggable(this.square1);
        this.scene.input.setDraggable(this.square2);*/

        //create all images for generator and parts
        this.generatorImage = this.scene.add.sprite(width / 2, 50, 'generator').setInteractive().setOrigin(.5, 0);
        this.generatorCover = this.scene.add.sprite(width / 2, 50, 'generatorCover').setInteractive().setOrigin(.5, 0);
        this.scene.input.setDraggable(this.generatorCover);
        this.targetGeneratorCover = this.scene.add.rectangle(150, 650, 540, 360, 0xffff00, 0.25);

    }

}

class BrokenState extends State {
    enter(scene, generator){
        console.log("Enter brokenState");

    }

    execute(scene, generator) {

        if(generator.brokenStep === 1) {
            generator.generatorFSM.transition('airFilter');
        }

    }

    handleDrop(gameObject, generator) {

        if(gameObject === generator.generatorCover) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.generatorCover.getBounds(), generator.targetGeneratorCover.getBounds())) {
                generator.generatorCover.x = 240
                generator.generatorCover.y = 450
                generator.generatorCover.disableInteractive();
                console.log("Cover snapped into place");
                generator.brokenStep++;
            }
        }

    }
}

class AirFilterState extends State {
    enter(scene, generator){
        console.log("Enter airFilterState");
        //generator.square1.disableInteractive();
        //generator.square2.disableInteractive();
        
        //generator.square3.setInteractive();

        //scene.input.setDraggable(generator.square2);

    }

    handleDrop(gameObject) {

    }

    execute(scene, generator) {

    }
}

class SparkPlugState extends State {
    enter(scene, generator){
        console.log("Enter sparkPlugState");

    }

    execute(scene, generator) {

    }
}

class OilState extends State {
    enter(scene, generator){
        console.log("Enter OilState");

    }

    execute(scene, generator) {

    }
}

class FixedState extends State {
    enter(scene, generator){
        console.log("Enter FixedState");

    }

    execute(scene, generator) {

    }
}