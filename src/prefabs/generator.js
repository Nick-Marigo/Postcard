class Generator extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);

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
        //create all images for generator and parts
        this.square1 = this.scene.add.sprite(500, 350, "square");
        this.square2 = this.scene.add.sprite(500, 650, "square").setTint(0xFF0000);
        this.square3 = this.scene.add.sprite(700, 650, "square").setTint(0x00FF00);

        this.target1 = this.scene.add.rectangle(600, 250, 100, 100, 0xffff00, 0.25);
        this.target2 = this.scene.add.rectangle(800, 450, 100, 100, 0xffff00, 0.25);

        this.square1.setInteractive();
        this.square2.setInteractive();
        this.scene.input.setDraggable(this.square1);
        this.scene.input.setDraggable(this.square2);

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

        if(gameObject === generator.square1) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.square1.getBounds(), generator.target1.getBounds())) {
                generator.square1.x = generator.target1.x;
                generator.square1.y = generator.target1.y;
                generator.square1.disableInteractive();
                console.log("square snapped into place");
                generator.brokenStep++;
            }
        }

    }
}

class AirFilterState extends State {
    enter(scene, generator){
        console.log("Enter airFilterState");
        generator.square1.disableInteractive();
        generator.square2.disableInteractive();
        
        generator.square3.setInteractive();

        scene.input.setDraggable(generator.square2);

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