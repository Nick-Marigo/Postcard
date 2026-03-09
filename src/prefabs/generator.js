class Generator extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.scene = scene;

        this.create();

        //Create steps for each state
        this.brokenStep = 0;
        this.airFilterStep = 0;
        this.sparkPlugStep = 0;
        this.oilStep = 0;
        this.fixedStep = 0;

        //Create state machine
        this.generatorFSM = new StateMachine('broken', {
            broken: new BrokenState(),
            airFilter: new AirFilterState(),
            sparkPlug: new SparkPlugState(),
            oil: new OilState(),
            fixed: new FixedState()
        }, [scene, this]);

        //Create drag function so each gameobject will follow mouse movement
        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        //When object is dropped it will check if its in the correct position
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

        //Key mechanics add interative circle and progress circle
        this.keyhole = this.scene.add.circle(722, 254, 18, 0xffff00, .25).setInteractive().setDepth(101);
        this.progressRing = this.scene.add.graphics().setDepth(102);

        //varaibles needed for progressRing 
        this.isHoldingKey = false;
        this.holdProgress = 0;
        this.holdDuration = 6000;
        this.startupComplete = false;
        this.startupSound = this.scene.sound.add('startup');

        //Starting up generator and plays startup sound
        this.keyhole.on('pointerdown', () => {
            if(!this.keyhole.input.enabled) return;
            if(this.startupComplete) return;

            this.isHoldingKey = true;

            if(!this.startupSound.isPlaying) {
                this.startupSound.play();
            }
        });

        //If player lets go to early, will reset progressRing else will be marked as complete
        this.scene.input.on('pointerup', () => {
            if (!this.keyhole.input.enabled) return;
            if(this.startupComplete) return;

            this.isHoldingKey = false;
            this.holdProgress = 0;
            this.progressRing.clear();

            if(this.startupSound.isPlaying) {
                this.startupSound.stop();
            }
        })

        //create all images for generator and parts
        this.generatorImage = this.scene.add.sprite(width / 2, 50, 'generator', 0).setOrigin(.5, 0);
        this.generatorCover = this.scene.add.sprite(width / 2, 50, 'generatorCover').setOrigin(.5, 0).setDepth(100);
        //create targets needs to show where player needs to place x item
        this.targetGeneratorCover = this.scene.add.rectangle(200, 675, 540, 360, 0xffff00, 0.25).setVisible(false);

        //create all images for airfilter state

        //Air filter dirty and clean
        this.airFilterDirty = this.scene.add.sprite(this.generatorImage.x -161, this.generatorImage.y + 105, 'airFilter', 1).setInteractive().setOrigin(0.5, 0);
        this.airFilterClean = this.scene.add.sprite(550, 490, 'airFilter', 0).setInteractive().setOrigin(0.5, 0);
        //create targets needs to show where player needs to place x item
        this.targetairFilterDirty = this.scene.add.rectangle(550, 550, 60, 40, 0xffff000, 0.25).setVisible(false);
        this.targetairFilterClean = this.scene.add.rectangle(this.generatorImage.x - 161, this.generatorImage.y + 125, 60, 40, 0xffff000, 0.25).setVisible(false);

        //Air filter cover
        this.airFilterCover = this.scene.add.sprite(this.generatorImage.x - 159, this.generatorImage.y + 91, 'airFilterCover').setInteractive().setOrigin(0.5, 0);
        //create targets needs to show where player needs to place x item
        this.targetairFilterCoverOFF = this.scene.add.rectangle(550, 625, 70, 80, 0xffff000, 0.25).setVisible(false);
        this.targetairFilterCoverON = this.scene.add.rectangle(this.generatorImage.x - 159, this.generatorImage.y + 91, 70, 80, 0xffff000, 0.25).setOrigin(0.5, 0).setVisible(false);

    }

    update() {
        
        //Checks if player is holding key and startup has not been completed. Will call drawProgressCircle to draw progessRing
        if(this.isHoldingKey && !this.startupComplete) {
            this.holdProgress += this.scene.game.loop.delta;

            let percent = Phaser.Math.Clamp(this.holdProgress / this.holdDuration, 0, 1);
            this.drawProgressCircle(this.keyhole.x, this.keyhole.y, 28, percent);

            if(percent >= 1) {
                this.startupComplete = true;
                this.isHoldingKey = false;
                this.progressRing.clear();

                if(this.startupSound.isPlaying){
                    this.startupSound.stop();
                }
            }
        }
    }

    //Draws a circular progress ring around the key hole based on how close the player is to completion
    drawProgressCircle(x, y, radius, percent) {
        this.progressRing.clear();
        this.progressRing.lineStyle(6, 0xffff00, 1);
        this.progressRing.beginPath();
        this.progressRing.arc(x, y, radius, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(-90 + 360 * percent), false);
        this.progressRing.strokePath();
    }

    //Resets and enables the key hole interaction so the player can begin the startup hold action
    enableKeyholeTask() {
        this.startupComplete = false;
        this.isHoldingKey = false;
        this.holdProgress = 0;
        this.progressRing.clear();
        this.keyhole.setInteractive();
    }

    //Disbales the key hole interaction and clears any progress or sound associated with the startup
    disableKeyholeTask() {
        this.keyhole.disableInteractive();
        this.isHoldingKey = false;
        this.holdProgress = 0;
        this.progressRing.clear();

        if(this.startupSound.isPlaying) {
            this.startupSound.stop();
        }
    }

}

class BrokenState extends State {
    enter(scene, generator){
        console.log("Enter brokenState");
        //Set the current task list for this state
        scene.checklist.setTasks([
            "Start generator",
            "Remove cover"
        ]);
        //Start the first task in the list
        generator.enableKeyholeTask();

    }

    execute(scene, generator) {

        //Two steps for this state
        // 1. Turn key on until completion
        // 2. Drag from cover off of generator
        if(generator.startupComplete) {
            generator.disableKeyholeTask();
            generator.generatorCover.setInteractive();
            scene.input.setDraggable(generator.generatorCover);
            generator.keyhole.setVisible(false);
            generator.targetGeneratorCover.setVisible(true);
            scene.checklist.completeTask(0);
        }

        if(generator.brokenStep === 1) {
            generator.targetGeneratorCover.setVisible(false);
            scene.checklist.completeTask(1);
            generator.generatorFSM.transition('airFilter');
        }

    }

    handleDrop(gameObject, generator) {

        // If generatorCover is in range of its target postion it will snap into position and will increase brokenStep counter
        if(gameObject === generator.generatorCover) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.generatorCover.getBounds(), generator.targetGeneratorCover.getBounds())) {
                generator.generatorCover.x = 240
                generator.generatorCover.y = 450
                generator.generatorCover.disableInteractive();
                console.log("Cover snapped into place");
                generator.brokenStep++;
                generator.targetGeneratorCover.setVisible(false);
                generator.targetairFilterCoverOFF.setVisible(true);
            }
        }

    }
}

class AirFilterState extends State {
    enter(scene, generator){
        console.log("Enter airFilterState");
        //Enable all gameobjects that need to be draggable
        scene.input.setDraggable(generator.airFilterDirty);
        generator.airFilterCover.play('airFilterCoverBlink');
        scene.input.setDraggable(generator.airFilterCover);
        scene.input.setDraggable(generator.airFilterClean);

        //Add new tasks to the task list
        scene.checklist.setTasks([
            'Remove air filter cover',
            'Remove dirty filter',
            'Insert clean filter',
            'Replace air filter cover'
        ]);

    }

    handleDrop(gameObject, generator) {

        //If gameobject is airFilterCover and it is over its target in clean or dirty stage will snap to correct position and increase airFilterStep counter
        if(gameObject === generator.airFilterCover) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.airFilterCover.getBounds(), generator.targetairFilterCoverOFF.getBounds())) {
                generator.airFilterCover.x = generator.targetairFilterCoverOFF.x
                generator.airFilterCover.y = generator.targetairFilterCoverOFF.y - 25
                generator.airFilterCover.disableInteractive();
                console.log("Air Filter Cover snapped into place");
                generator.airFilterStep++;
                generator.targetairFilterCoverOFF.setVisible(false);
                generator.targetairFilterDirty.setVisible(true);
                generator.airFilterCover.stop();
                generator.airFilterCover.setFrame(0);
            }
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.airFilterCover.getBounds(), generator.targetairFilterCoverON.getBounds())) {
                generator.airFilterCover.x = generator.targetairFilterCoverON.x
                generator.airFilterCover.y = generator.targetairFilterCoverON.y
                generator.airFilterCover.disableInteractive();
                console.log("Air Filter Cover snapped into place");
                generator.airFilterStep++;
                generator.targetairFilterCoverON.setVisible(false);
            }
        }

        //If gameobject is airFilterDirty and it is over its target will snap to correct position and increase airFilterStep counter
        if(gameObject === generator.airFilterDirty) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.airFilterDirty.getBounds(), generator.targetairFilterDirty.getBounds())) {
                generator.airFilterDirty.x = generator.targetairFilterDirty.x
                generator.airFilterDirty.y = generator.targetairFilterDirty.y - 25
                generator.airFilterDirty.disableInteractive();
                console.log("Air Filter Dirty snapped into place");
                generator.airFilterStep++;
                generator.targetairFilterDirty.setVisible(false);
                generator.targetairFilterClean.setVisible(true);
            }
        }

        //If gameobject is airFilterClean and it is over its target will snap to correct position and increase airFilterStep counter
        if(gameObject === generator.airFilterClean) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.airFilterClean.getBounds(), generator.targetairFilterClean.getBounds())) {
                generator.airFilterClean.x = generator.targetairFilterClean.x
                generator.airFilterClean.y = generator.targetairFilterClean.y - 25
                generator.airFilterClean.disableInteractive();
                console.log("Air Filter Clean snapped into place");
                generator.airFilterStep++;
                generator.targetairFilterCoverON.setVisible(true);
            }
        }

    }

    execute(scene, generator) {

        //Four steps to complete state:
        // 1. Take off air filter cover
        // 2. Take out old air filter
        // 3. Move new air filter into place
        // 4. Move air filter cover back in place
        if(generator.airFilterStep === 1) {

            scene.checklist.completeTask(0);

        } else if(generator.airFilterStep === 2) {

            scene.checklist.completeTask(1);

        } else if(generator.airFilterStep === 3) {

            scene.checklist.completeTask(2);
            generator.airFilterCover.setInteractive();

        } else if (generator.airFilterStep === 4) {

            scene.checklist.completeTask(3);
            generator.generatorFSM.transition('sparkPlug');

        }

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