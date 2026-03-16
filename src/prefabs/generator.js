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

            if(gameObject === this.socketWrench && (this.sparkPlugStep === 2 || this.sparkPlugStep === 5)) {
                return;
            }

            if(gameObject === this.wrench && (this.oilStep === 2 || this.oilStep === 4)) {
                return;
            }

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

        this.transitionCalled = false;

        //Key mechanics add interative circle and progress circle
        this.keyhole = this.scene.add.circle(722, 254, 18, 0xffff00, .25).setInteractive().setDepth(101);
        this.progressRing = this.scene.add.graphics().setDepth(102);

        //varaibles needed for progressRing 
        this.isHoldingKey = false;
        this.holdProgress = 0;
        this.holdDuration = 6000;
        this.startupComplete = false;
        this.ranOnce = false;
        this.startupSound = this.scene.sound.add('startup');
        this.fixedStartupSound = this.scene.sound.add('fixedSound', {volume: 0.5});
        this.currentStartupSound = this.startupSound;
        this.ranFixedStart = false;
        this.generatorRunning = false;

        //Starting up generator and plays startup sound
        this.keyhole.on('pointerdown', () => {
            if(!this.keyhole.input.enabled) return;
            if(this.startupComplete) return;

            this.isHoldingKey = true;

            if(this.currentStartupSound && !this.currentStartupSound.isPlaying) {
                this.currentStartupSound.play();
            }
        });

        //If player lets go to early, will reset progressRing else will be marked as complete
        this.scene.input.on('pointerup', () => {
            if (!this.keyhole.input.enabled) return;
            if(this.startupComplete) return;

            this.isHoldingKey = false;
            this.holdProgress = 0;
            this.progressRing.clear();

            if(this.currentStartupSound && this.currentStartupSound.isPlaying) {
                this.currentStartupSound.stop();
            }
        })


        //create all images for generator and parts
        this.generatorImage = this.scene.add.sprite(width / 2, 50, 'generator', 0).setOrigin(.5, 0);
        this.generatorCover = this.scene.add.sprite(width / 2, 50, 'generatorCover').setOrigin(.5, 0).setDepth(100);
        //create targets needs to show where player needs to place x item
        this.targetGeneratorCover = this.scene.add.rectangle(200, 675, 540, 360, 0xffff00, 0.25).setVisible(false);
        this.targetGeneratorCoverTwo = this.scene.add.rectangle(width / 2, 50, 540, 360, 0xffff00, 0.25).setVisible(false).setOrigin(0.5, 0);
        this.turnArrow = this.scene.add.sprite(520, 175, 'turnArrow', 0).setVisible(false);
        this.turnArrow.play('turnArrowBlink');

        //create all images for airfilter state

        //Air filter dirty and clean
        this.airFilterDirty = this.scene.add.sprite(this.generatorImage.x -161, this.generatorImage.y + 105, 'airFilter', 2).setInteractive().setOrigin(0.5, 0);
        this.airFilterClean = this.scene.add.sprite(550, 490, 'airFilter', 0).setInteractive().setOrigin(0.5, 0);
        //create targets needs to show where player needs to place x item
        this.targetairFilterDirty = this.scene.add.rectangle(550, 550, 60, 40, 0xffff00, 0.25).setVisible(false);
        this.targetairFilterClean = this.scene.add.rectangle(this.generatorImage.x - 161, this.generatorImage.y + 125, 60, 40, 0xffff000, 0.25).setVisible(false);

        //Air filter cover
        this.airFilterCover = this.scene.add.sprite(this.generatorImage.x - 159, this.generatorImage.y + 91, 'airFilterCover').setInteractive().setOrigin(0.5, 0);
        //create targets needs to show where player needs to place x item
        this.targetairFilterCoverOFF = this.scene.add.rectangle(550, 625, 70, 80, 0xffff000, 0.25).setVisible(false);
        this.targetairFilterCoverON = this.scene.add.rectangle(this.generatorImage.x - 159, this.generatorImage.y + 91, 70, 80, 0xffff000, 0.25).setOrigin(0.5, 0).setVisible(false);


        // varaibles to turn wrench
        this.turningWrench = false;
        this.lastWrenchAngle = 0;
        this.totalWrenchRotation = 0;
        this.wrenchDirection = null;

        // Create all images for sparkplug state
        this.sparkplug = this.scene.add.sprite(625, 525, 'sparkplug', 0).setInteractive();
        this.targetsparkplug = this.scene.add.rectangle(525, 180, 60, 30, 0xffff00, 0.25).setVisible(false);
        this.sparkplugDirty = this.scene.add.sprite(525, 180, 'sparkplug', 2).setInteractive().setVisible(false).setDepth(50);
        this.targetsparkplugDirty = this.scene.add.rectangle(625, 575, 60, 30, 0xffff00, 0.25).setVisible(false);
        this.sparkplugCover = this.scene.add.sprite(530, 183, 'sparkplugCover', 0).setInteractive();
        this.socketWrench = this.scene.add.sprite(800, 100, 'socketWrench', 0).setInteractive().setOrigin(0.15, 0.1);
        this.targetsocketWrench = this.scene.add.rectangle(510, 183, 20, 20, 0xffff00, 0.25).setVisible(false);
        this.targetsocketWrenchTwo = this.scene.add.rectangle(800, 100, 26, 106, 0xffff00, 0.25).setVisible(false);

        //Input for turning socket wrench
        this.socketWrench.on('pointerdown', (pointer) => {
            if(this.sparkPlugStep === 2 || this.sparkPlugStep === 5) {

                this.turningWrench = true;
                this.lastWrenchAngle = Phaser.Math.Angle.Between(this.socketWrench.x, this.socketWrench.y, pointer.x, pointer.y);
            }
        });

        this.scene.input.on('pointerup', () => {
            this.turningWrench = false;
            this.turningOilWrench = false;
        });

        //varaibles to turn oil wrench
        this.turningOilWrench = false;
        this.lastOilWrenchAngle = 0;
        this.totalOilWrenchRotation = 0;
        this.oilWrenchDirection = null;

        // Create all images for oil state
        this.bolt = this.scene.add.sprite(625, 300, 'bolt', 0);
        this.targetbolt = this.scene.add.rectangle(625, 300, 14, 14, 0xffff00, 0.25).setVisible(false);
        this.targetboltTwo = this.scene.add.rectangle(900, 300, 14, 14, 0xffff00, 0.25).setVisible(false);
        this.wrench = this.scene.add.sprite(850, 100, 'wrench', 0).setInteractive().setOrigin(0.15, 0.1).setDepth(50);
        this.targetwrench = this.scene.add.rectangle(625, 300, 14, 14, 0xffff00, 0.25).setVisible(false);
        this.targetwrenchTwo = this.scene.add.rectangle(850, 100, 30, 106, 0xffff00, 0.25).setVisible(false);
        this.oilDrainPan = this.scene.add.sprite(850, 500, 'oilDrainPan', 0).setInteractive();
        this.targetoilDrainPan = this.scene.add.rectangle(625, 400, 50, 50, 0xffff00, 0.25).setVisible(false);
        this.funnel = this.scene.add.sprite(920, 500, 'funnel', 0).setInteractive().setOrigin(0.5, 1);
        this.targetfunnel = this.scene.add.rectangle(680, 235, 50, 50, 0xffff00, 0.25).setVisible(false);
        this.targetfunnelTwo = this.scene.add.rectangle(920, 500, 50, 100, 0xffff00, 0.25).setVisible(false);
        this.oil = this.scene.add.sprite(850, 650, 'oil', 0).setInteractive();
        this.targetoil = this.scene.add.rectangle(765, 100, 50, 50, 0xffff00, 0.25).setVisible(false);
        this.targetoilTwo = this.scene.add.rectangle(850, 650, 50, 50, 0xffff00, 0.25).setVisible(false);
        this.oilCap = this.scene.add.sprite(680, 235, 'oilCap', 0).setInteractive();
        this.targetoilCap = this.scene.add.rectangle(1000, 600, 26, 26, 0xffff00, 0.25).setVisible(false);
        this.targetoilCapTwo = this.scene.add.rectangle(680, 235, 26, 26, 0xffff00, 0.25).setVisible(false);

        //Input for turning wrench
        this.wrench.on('pointerdown', (pointer) => {
            if(this.oilStep === 2 || this.oilStep === 4) {

                this.turningOilWrench = true;
                this.lastOilWrenchAngle = Phaser.Math.Angle.Between(this.wrench.x, this.wrench.y, pointer.x, pointer.y);
            }
        });
        


    }

    update(exhaustemitter) {
        
        //Checks if player is holding key and startup has not been completed. Will call drawProgressCircle to draw progessRing
        if(this.isHoldingKey && !this.startupComplete) {
            this.holdProgress += this.scene.game.loop.delta;

            let percent = Phaser.Math.Clamp(this.holdProgress / this.holdDuration, 0, 1);
            this.drawProgressCircle(this.keyhole.x, this.keyhole.y, 28, percent);
            exhaustemitter.emitting = true;

            if(percent >= 1) {
                this.startupComplete = true;
                this.isHoldingKey = false;
                this.progressRing.clear();

                if(this.currentStartupSound === this.startupSound){
                    if(this.currentStartupSound.isPlaying) {
                        this.currentStartupSound.stop();
                    }
                }
            }
        } else if (!this.generatorRunning) {
            exhaustemitter.emitting = false;
        }

        if(this.turningWrench && (this.sparkPlugStep === 2 || this.sparkPlugStep === 5)) {
            let pointer = this.scene.input.activePointer;

            let currentAngle = Phaser.Math.Angle.Between(this.socketWrench.x, this.socketWrench.y, pointer.x, pointer.y);

            let delta = currentAngle - this.lastWrenchAngle;

            delta = Phaser.Math.Angle.Wrap(delta);

            if(this.sparkPlugStep === 2 && this.wrenchDirection === 'ccw') {
        
                if(delta < 0) {
                    this.totalWrenchRotation += Math.abs(delta);
                }

                this.socketWrench.rotation += delta;

                if(this.totalWrenchRotation >= Math.PI * 2) {
                    this.turningWrench = false;
                    this.sparkPlugStep++;
                    console.log("Socket wrench loosening complete");
                    this.socketWrench.stop();
                    this.socketWrench.setFrame(0);
                    this.scene.checklist.completeTask(2);
                    this.sparkplugDirty.setVisible(true);
                    this.sparkplugDirty.play('sparkplugDirtyBlink');
                    this.scene.input.setDraggable(this.sparkplugDirty);
                    this.targetsparkplugDirty.setVisible(true);
                    this.turnArrow.setVisible(false);
                }
            } else if(this.sparkPlugStep === 5 && this.wrenchDirection === 'cw') {

                if(delta > 0) {
                    this.totalWrenchRotation += Math.abs(delta);
                    this.socketWrench.rotation += delta;
                }

                if(this.totalWrenchRotation >= Math.PI * 2) {
                    this.turningWrench = false;
                    this.totalWrenchRotation = 0;
                    this.sparkPlugStep++;
                    console.log('Socket wrench tightening complete');
                    this.scene.checklist.completeTask(5);
                    this.socketWrench.setInteractive();
                    this.scene.input.setDraggable(this.socketWrench, true);
                    this.targetsocketWrenchTwo.setVisible(true);
                    this.turnArrow.setVisible(false);
                }

            }

            this.lastWrenchAngle = currentAngle;

        }

        if(this.turningOilWrench && (this.oilStep === 2 || this.oilStep === 4)) {
            let pointer = this.scene.input.activePointer;

            let currentAngle = Phaser.Math.Angle.Between(this.wrench.x, this.wrench.y, pointer.x, pointer.y);

            let delta = currentAngle - this.lastOilWrenchAngle;

            delta = Phaser.Math.Angle.Wrap(delta);

            if(this.oilStep === 2 && this.oilWrenchDirection === 'ccw') {
                if(delta < 0) {
                    this.totalOilWrenchRotation += Math.abs(delta);
                    this.wrench.rotation += delta;
                }

                if(this.totalOilWrenchRotation >= Math.PI * 2) {
                    this.turningOilWrench = false;
                    this.totalOilWrenchRotation = 0;
                    this.oilStep++;
                    this.turnArrow.setVisible(false);
                    console.log("Bolt loosened");
                    this.scene.checklist.completeTask(2);
                    this.wrench.stop();
                    this.wrench.setFrame(0);

                    this.wrench.x = 850;
                    this.wrench.y = 100;
                    this.scene.dirtyOilemitter.emitting = true;
                    this.scene.time.delayedCall(5000, () => {
                        this.scene.dirtyOilemitter.stop();
                        console.log("Oil finished draining");
                        this.oilStep++;
                        this.scene.checklist.completeTask(3);
                        this.wrench.x = this.targetwrench.x - 10;
                        this.wrench.y = this.targetwrench.y - 5;
                        this.wrench.play('wrenchBlink');
                        this.turnArrow.setVisible(true);
                        this.turnArrow.setFlipX(true);
                        this.totalOilWrenchRotation = 0;
                        this.turningOilWrench = false;
                        this.oilWrenchDirection = 'cw';
                    })
                }
            }

            if(this.oilStep === 4 && this.oilWrenchDirection === 'cw') {
                if(delta > 0) {
                    this.totalOilWrenchRotation += Math.abs(delta);
                    this.wrench.rotation += delta;
                }

                if(this.totalOilWrenchRotation >= Math.PI * 2) {
                    this.turningOilWrench = false;
                    this.totalOilWrenchRotation = 0;
                    this.oilStep++;
                    this.turnArrow.setVisible(false);
                    console.log("Bolt tightened ");
                    this.scene.checklist.completeTask(4);
                    this.wrench.play('wrenchBlink');
                    this.scene.input.setDraggable(this.wrench, true);
                    this.targetwrenchTwo.setVisible(true);
                }
            }

            this.lastOilWrenchAngle = currentAngle;

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

        if(this.currentStartupSound === this.startupSound){
            if(this.currentStartupSound.isPlaying) {
                this.currentStartupSound.stop();
            }
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
        if(generator.startupComplete && !generator.ranOnce) {
            generator.ranOnce = true;
            generator.disableKeyholeTask();
            generator.generatorCover.setInteractive();
            scene.input.setDraggable(generator.generatorCover);
            generator.keyhole.setVisible(false);
            generator.targetGeneratorCover.setVisible(true);
            scene.checklist.completeTask(0);
            generator.generatorCover.play('generatorCoverBlink');
        }

        if(generator.brokenStep === 1) {
            generator.targetGeneratorCover.setVisible(false);
            scene.checklist.completeTask(1);
            generator.generatorCover.stop();
            generator.generatorCover.setFrame(0);
            generator.generatorFSM.transition('fixed'); //airFilter
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
                generator.airFilterDirty.play('airFilterDirtyBlink');
            }
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.airFilterCover.getBounds(), generator.targetairFilterCoverON.getBounds())) {
                generator.airFilterCover.x = generator.targetairFilterCoverON.x
                generator.airFilterCover.y = generator.targetairFilterCoverON.y
                generator.airFilterCover.disableInteractive();
                console.log("Air Filter Cover snapped into place");
                generator.airFilterStep++;
                generator.targetairFilterCoverON.setVisible(false);
                generator.airFilterCover.stop();
                generator.airFilterCover.setFrame(0);
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
                generator.airFilterDirty.stop();
                generator.airFilterDirty.setFrame(2);
                generator.airFilterClean.play('airFilterCleanBlink');
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
                generator.airFilterClean.stop();
                generator.airFilterClean.setFrame(0);
                generator.airFilterCover.play('airFilterCoverBlink');
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

        generator.sparkplugCover.play('sparkplugCoverBlink');

        //Add new tasks to the task list
        scene.checklist.setTasks([
            'Remove spark plug cover',
            'Move socket wrench over spark plug',
            'Rotate socket wrench counter clock wise',
            'Remove old spark plug',
            'Replace spark plug',
            'Rotate socket wrench clock wise',
            'Move socket wrench back',
            'Replace spark plug cover'
        ]);

        generator.sparkplugCover.once('pointerdown', () => {
            scene.tweens.add({
                targets: generator.sparkplugCover,
                x: 554,
                duration: 250,
                ease: 'Power2',
                onComplete: () => {
                    generator.sparkplugCover.x = 555;
                    generator.sparkplugCover.disableInteractive();
                    scene.checklist.completeTask(0);
                    generator.totalWrenchRotation = 0;
                    generator.turningWrench = false;
                    generator.wrenchDirection = 'ccw';
                    generator.sparkplugCover.stop();
                    generator.sparkplugCover.setFrame(0);
                    generator.sparkPlugStep++;
                    generator.socketWrench.play('socketWrenchBlink');
                    scene.input.setDraggable(generator.socketWrench);
                    generator.targetsocketWrench.setVisible(true);
                    console.log('Spark plug cover removed');
                }
            });
        });

    }

    handleDrop(gameObject, generator) {

        if(gameObject === generator.socketWrench && generator.sparkPlugStep === 1) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.socketWrench.getBounds(), generator.targetsocketWrench.getBounds())) {
                generator.socketWrench.x = generator.targetsocketWrench.x;
                generator.socketWrench.y = generator.targetsocketWrench.y;
                generator.targetsocketWrench.setVisible(false);
                generator.scene.input.setDraggable(generator.socketWrench, false);
                generator.totalWrenchRotation = 0;
                generator.turningWrench = false;
                generator.wrenchDirection = 'ccw';
                generator.sparkPlugStep++;
                generator.turnArrow.setVisible(true);
                console.log("Wrench placed");
            }
            
        }

        if(gameObject === generator.sparkplugDirty) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.sparkplugDirty.getBounds(), generator.targetsparkplugDirty.getBounds())) {
                generator.sparkplugDirty.x = generator.targetsparkplugDirty.x;
                generator.sparkplugDirty.y = generator.targetsparkplugDirty.y;
                generator.sparkplugDirty.stop();
                generator.sparkplugDirty.setFrame(2);
                generator.sparkplugDirty.disableInteractive();
                generator.scene.input.setDraggable(generator.sparkplug);
                generator.targetsparkplugDirty.setVisible(false);
                generator.sparkPlugStep++;
                console.log("Spark plug dirty placed");
                generator.sparkplug.play('sparkplugBlink');
                generator.targetsparkplug.setVisible(true);
            }
        }

        if(gameObject === generator.sparkplug) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.sparkplug.getBounds(), generator.targetsparkplug.getBounds())) {
                generator.sparkplug.setVisible(false);
                generator.scene.input.setDraggable(generator.sparkplug);
                generator.targetsparkplug.setVisible(false);
                generator.socketWrench.setInteractive();
                generator.sparkPlugStep++;
                console.log("Spark plug clean placed");
                generator.socketWrench.play('socketWrenchBlink');
                generator.totalWrenchRotation = 0;
                generator.turningWrench = false;
                generator.wrenchDirection = 'cw';
                generator.turnArrow.setVisible(true);
                generator.turnArrow.setFlipX(true);

            }
        }

        if(gameObject === generator.socketWrench && generator.sparkPlugStep === 6) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.socketWrench.getBounds(), generator.targetsocketWrenchTwo.getBounds())) {
                generator.socketWrench.x = generator.targetsocketWrenchTwo.x;
                generator.socketWrench.y = generator.targetsocketWrenchTwo.y;
                generator.targetsocketWrenchTwo.setVisible(false);
                generator.scene.input.setDraggable(generator.socketWrench, false);
                generator.socketWrench.stop();
                generator.socketWrench.setFrame(0);
                generator.sparkplugCover.play('sparkplugCoverBlink');
                generator.sparkplugCover.setInteractive();
                generator.totalWrenchRotation = 0;
                generator.turningWrench = false;
                generator.wrenchDirection = 'ccw';
                generator.sparkPlugStep++;
                console.log("Wrench returned");

                generator.sparkplugCover.once('pointerdown', () => {
                        generator.scene.tweens.add({
                            targets: generator.sparkplugCover,
                            x: 554,
                            duration: 250,
                            ease: 'Power2',
                            onComplete: () => {
                                generator.sparkplugCover.x = 530;
                                generator.sparkplugCover.disableInteractive();
                                generator.scene.checklist.completeTask(0);
                                generator.sparkplugCover.stop();
                                generator.sparkPlugStep = 8;
                                generator.sparkplugCover.setFrame(0);
                                console.log('Spark plug cover replaced');
                            }
                        });
                    });
            }
            
        }

    }

    execute(scene, generator) {

        if(generator.sparkPlugStep === 2) {
            scene.checklist.completeTask(1);
        } else if (generator.sparkPlugStep === 3) {
            scene.checklist.completeTask(2);
        } else if (generator.sparkPlugStep === 4) {
            scene.checklist.completeTask(3);
        } else if (generator.sparkPlugStep === 5) {
            scene.checklist.completeTask(4);
        } else if (generator.sparkPlugStep === 7) {
            scene.checklist.completeTask(6);
        } else if (generator.sparkPlugStep === 8) {
            scene.checklist.completeTask(7);
            generator.generatorFSM.transition('oil');
        }

    }
}

class OilState extends State {
    enter(scene, generator){
        console.log("Enter OilState");

        generator.oilDrainPan.play('oilDrainPanBlink');
        generator.scene.input.setDraggable(generator.oilDrainPan);
        generator.targetoilDrainPan.setVisible(true);

        //Add new tasks to the task list
        scene.checklist.setTasks([
            'Move oil drain pan into place',
            'Move wrench to bolt',
            'Rotate wrench counter clockwise',
            'Let oil drain',
            'Rotate wrench clockwise',
            'Move wrench back',
            'Take off oil cap',
            'Place funnel into place',
            'Pour new oil into generator',
            'Put oil back',
            'Take out funnel',
            'Replace oil cap'
        ]);

    }

    handleDrop(gameObject, generator) {

        if(gameObject === generator.oilDrainPan) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.oilDrainPan.getBounds(), generator.targetoilDrainPan.getBounds())) {
                generator.targetoilDrainPan.setVisible(false);
                generator.oilDrainPan.disableInteractive();
                generator.oilDrainPan.x = generator.targetoilDrainPan.x;
                generator.oilDrainPan.y = generator.targetoilDrainPan.y;
                generator.oilDrainPan.stop();
                generator.oilDrainPan.setFrame(2);
                generator.targetwrench.setVisible(true);
                generator.scene.input.setDraggable(generator.wrench);
                generator.wrench.play('wrenchBlink');
                generator.oilStep++;
                console.log("Oil drain pan placed");

            }
        }

        if(gameObject === generator.wrench && generator.oilStep === 1) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.wrench.getBounds(), generator.targetwrench.getBounds())) {
                generator.targetwrench.setVisible(false);
                generator.wrench.x = generator.targetwrench.x - 10;
                generator.wrench.y = generator.targetwrench.y - 5;
                generator.oilStep++;
                generator.scene.input.setDraggable(generator.wrench, false);
                generator.wrench.setInteractive();
                generator.totalOilWrenchRotation = 0;
                generator.turningOilWrench = false;
                generator.oilWrenchDirection = 'ccw';
                generator.turnArrow.x = 625;
                generator.turnArrow.y = 300;
                generator.turnArrow.setVisible(true);
                generator.turnArrow.setFlipX(false);
                console.log("Wrench placed");
            }
        }

        if(generator.oilStep === 3) {
            generator.scene.time.addEvent({
                delay: 5000,
                callback: () => {
                    generator.scene.dirtyOil
                },
                callbackScope: this,
                loop: false
            })
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.wrench.getBounds(), generator.targetwrenchTwo.getBounds())) {
                generator.targetwrench.setVisible(false);
                generator.wrench.x = generator.targetwrenchTwo.x - 10;
                generator.wrench.y = generator.targetwrenchTwo.y - 5;
                generator.oilStep++;
                generator.scene.input.setDraggable(generator.wrench, false);
                generator.wrench.setInteractive();
                console.log("Wrench placed");
            }
        }

        if(gameObject === generator.wrench && generator.oilStep === 5) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.wrench.getBounds(), generator.targetwrenchTwo.getBounds())) {
                generator.targetwrenchTwo.setVisible(false);
                generator.wrench.x = generator.targetwrenchTwo.x - 10;
                generator.wrench.y = generator.targetwrenchTwo.y - 5;
                generator.oilStep++;
                generator.wrench.disableInteractive();
                generator.wrench.stop();
                generator.wrench.setFrame(0);
                console.log("Wrench placed");
                generator.oilDrainPan.x = 850;
                generator.oilDrainPan.y = 500;
                generator.oilDrainPan.setFrame(0);
                generator.oilCap.play('oilCapBlink');
                generator.targetoilCap.setVisible(true);
                generator.scene.input.setDraggable(generator.oilCap);
            }
        }

        if(gameObject === generator.oilCap && generator.oilStep === 6) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.oilCap.getBounds(), generator.targetoilCap.getBounds())) {
                generator.targetoilCap.setVisible(false);
                generator.oilCap.x = generator.targetoilCap.x - 10;
                generator.oilCap.y = generator.targetoilCap.y - 5;
                generator.oilStep++;
                generator.oilCap.disableInteractive();
                generator.oilCap.stop();
                generator.oilCap.setFrame(0);
                console.log("Oil cap placed");
                generator.funnel.play('funnelBlink');
                generator.targetfunnel.setVisible(true);
                generator.scene.input.setDraggable(generator.funnel);
                
            }
        }

        if(gameObject === generator.funnel && generator.oilStep === 7) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.funnel.getBounds(), generator.targetfunnel.getBounds())) {
                generator.targetfunnel.setVisible(false);
                generator.funnel.x = generator.targetfunnel.x;
                generator.funnel.y = generator.targetfunnel.y + 15;
                generator.oilStep++;
                generator.funnel.disableInteractive();
                generator.funnel.stop();
                generator.funnel.setFrame(0);
                console.log("Funnel placed");
                generator.oil.play('oilBlink');
                generator.targetoil.setVisible(true);
                generator.scene.input.setDraggable(generator.oil);
                
            }
        }

        if(gameObject === generator.oil && generator.oilStep === 8) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.oil.getBounds(), generator.targetoil.getBounds())) {
                generator.targetoil.setVisible(false);
                generator.oil.x = generator.targetoil.x;
                generator.oil.y = generator.targetoil.y;
                generator.oilStep++;
                generator.oil.stop();
                generator.oil.setFrame(0);
                console.log("Oil placed");
                //generator.targetoil.setVisible(true);

                generator.oil.setOrigin(0.2, 0.85);

                generator.scene.tweens.add({
                    targets: generator.oil,
                    angle: -90,
                    duration: 500,
                    ease: 'Power2',
                    onComplete: () => {
                        console.log("Oil pouring");

                        //generator.oilStep++;
                        generator.scene.cleanOilemitter.emitting = true;

                        generator.scene.time.delayedCall(5000, () => {
                            generator.scene.cleanOilemitter.emitting = false;
                            console.log("Finished pouring oil");

                            generator.scene.tweens.add({
                                targets: generator.oil,
                                angle: 0,
                                duration: 300,
                                ease: 'Power2'
                            });

                            generator.oil.play('oilBlink');
                            generator.targetoilTwo.setVisible(true);
                           
                        });

                    }
                });
                
            }
        }

        if(gameObject === generator.oil && generator.oilStep === 9) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.oil.getBounds(), generator.targetoilTwo.getBounds())) {
                generator.targetoilTwo.setVisible(false);
                generator.oil.x = generator.targetoilTwo.x;
                generator.oil.y = generator.targetoilTwo.y;
                generator.oilStep++;
                generator.oil.stop();
                generator.oil.setFrame(0);
                console.log("Oil placed");
                generator.targetfunnelTwo.setVisible(true);
                generator.funnel.setInteractive();
                generator.scene.input.setDraggable(generator.funnel);
                generator.funnel.play('funnelBlink');
                
            }
        }

        if(gameObject === generator.funnel && generator.oilStep === 10) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.funnel.getBounds(), generator.targetfunnelTwo.getBounds())) {
                generator.targetfunnelTwo.setVisible(false);
                generator.funnel.x = generator.targetfunnelTwo.x;
                generator.funnel.y = generator.targetfunnelTwo.y + 15;
                generator.oilStep++;
                generator.funnel.disableInteractive();
                generator.funnel.stop();
                generator.funnel.setFrame(0);
                console.log("Funnel placed");
                generator.oilCap.play('oilCapBlink');
                generator.targetoilCapTwo.setVisible(true);
                generator.oilCap.setInteractive();
                generator.scene.input.setDraggable(generator.oilCap);
                
            }
        }

        if(gameObject === generator.oilCap && generator.oilStep === 11) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.oilCap.getBounds(), generator.targetoilCapTwo.getBounds())) {
                generator.targetoilCapTwo.setVisible(false);
                generator.oilCap.x = 680;
                generator.oilCap.y = 235;
                generator.oilStep++;
                generator.oilCap.disableInteractive();
                generator.oilCap.stop();
                generator.oilCap.setFrame(0);
                console.log("Oil cap placed");
                
            }
        }

    }

    execute(scene, generator) {

        if(generator.oilStep === 1) {
            scene.checklist.completeTask(0);
        } else if (generator.oilStep === 2) {
            scene.checklist.completeTask(1);
        } else if (generator.oilStep === 6) {
            scene.checklist.completeTask(5);
        } else if (generator.oilStep === 7) {
            scene.checklist.completeTask(6);
        } else if (generator.oilStep === 8) {
            scene.checklist.completeTask(7);
        } else if (generator.oilStep === 9) {
            scene.checklist.completeTask(8);
        } else if (generator.oilStep === 10) {
            scene.checklist.completeTask(9);
        } else if (generator.oilStep === 11) {
            scene.checklist.completeTask(10);
        } else if (generator.oilStep === 12) {
            scene.checklist.completeTask(11);
            generator.generatorFSM.transition('fixed');
        }


    }
}

class FixedState extends State {
    enter(scene, generator){
        console.log("Enter FixedState");

        //Add new tasks to the task list
        scene.checklist.setTasks([
            'Replace generator cover',
            'Start generator'
        ]);

        generator.generatorCover.play('generatorCoverBlink');
        generator.generatorCover.setInteractive();
        generator.scene.input.setDraggable(generator.generatorCover);
        generator.targetGeneratorCoverTwo.setVisible(true);


    }

    handleDrop(gameObject, generator) {

        if(gameObject === generator.generatorCover) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(generator.generatorCover.getBounds(), generator.targetGeneratorCoverTwo.getBounds())) {
                generator.generatorCover.x = width / 2;
                generator.generatorCover.y = 50;
                generator.generatorCover.disableInteractive();
                generator.generatorCover.stop();
                generator.generatorCover.setFrame(0);
                console.log("Cover snapped into place");
                generator.fixedStep++;
                generator.targetGeneratorCoverTwo.setVisible(false);
                generator.currentStartupSound = generator.fixedStartupSound;
                generator.keyhole.setVisible(true);
                generator.enableKeyholeTask();
                generator.holdDuration = 2000;
            }
        }

    }

    execute(scene, generator) {

        if(generator.fixedStep === 1) {
            scene.checklist.completeTask(0);

            if(!generator.ranFixedStart) {
                generator.ranFixedStart = true;
                generator.enableKeyholeTask();
            }
        }

        if(generator.fixedStep === 1 && generator.startupComplete) {
            scene.checklist.completeTask(1);
            generator.disableKeyholeTask();
            generator.generatorRunning = true;
            console.log("Generator repaired and started");

            if(!generator.transitionCalled) {
                generator.transitionCalled = true;
                scene.time.delayedCall(7000, () => {

                    const card = document.getElementById('card');

                    card.classList.add('flipped');

                    scene.time.delayedCall(3000, () => {
                        generator.currentStartupSound.stop();
                        scene.scene.start('postcardBackScene');
                    });
                });
            }
        }
    }
}