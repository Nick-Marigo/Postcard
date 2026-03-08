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
        this.generatorImage = this.scene.add.sprite(width / 2, 50, 'generator', 0).setInteractive().setOrigin(.5, 0);
        this.generatorCover = this.scene.add.sprite(width / 2, 50, 'generatorCover').setInteractive().setOrigin(.5, 0).setDepth(100);
        this.scene.input.setDraggable(this.generatorCover);
        this.targetGeneratorCover = this.scene.add.rectangle(150, 650, 540, 360, 0xffff00, 0.25);

        //create all images for airfilter state
        this.airFilterDirty = this.scene.add.sprite(this.generatorImage.x -161, this.generatorImage.y + 105, 'airFilter', 1).setInteractive().setOrigin(0.5, 0);
        this.airFilerCover = this.scene.add.sprite(this.generatorImage.x - 159, this.generatorImage.y + 91, 'airFilterCover').setInteractive().setOrigin(0.5, 0);

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
        scene.input.setDraggable(generator.airFilterDirty);
        scene.input.setDraggable(generator.airFilerCover);
        
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