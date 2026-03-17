class Load extends Phaser.Scene {
    constructor() {
        super("loadScene")
    }

    preload() {
        
        // Generator, placemats, exhaust, note, and stamp
        this.load.path = "./assets/art/"
        this.load.spritesheet('generator', 'generator.png', {frameWidth: 540, frameHeight: 360})
        this.load.spritesheet('generatorCover', 'generatorCover.png', {frameWidth: 540, frameHeight: 360});
        this.load.image('placematParts', 'placematParts.png');
        this.load.image('placematTools', 'placematTools.png');
        this.load.image('checklist', 'checklist.png');
        this.load.image('exhaust', 'exhaust.png');
        this.load.image('stamp', 'stamp.png');
        this.load.spritesheet('paperclip', 'paperclip.png', {frameWidth: 200, frameHeight: 200});

        // AirFilter
        this.load.spritesheet('airFilterCover', 'airFilterCover.png', {frameWidth: 70, frameHeight: 80});
        this.load.spritesheet('airFilter', 'airFilter.png', {frameWidth: 60, frameHeight: 40});

        // Sparkplug
        this.load.spritesheet('sparkplug', '/Sparkplug.png', {frameWidth: 60, frameHeight: 30});
        this.load.spritesheet('sparkplugCover', '/SparkplugCover.png', {frameWidth: 30, frameHeight: 10});
        this.load.spritesheet('socketWrench', 'SocketWrench.png', {frameWidth: 26, frameHeight: 106});
        this.load.spritesheet('turnArrow', 'turnArrow.png', {frameWidth: 120, frameHeight: 120});

        // Oil
        this.load.spritesheet('oilDrainPan', 'oilDrainPan.png', {frameWidth: 80, frameHeight: 100});
        this.load.spritesheet('wrench', 'wrench.png', {frameWidth: 30, frameHeight: 106});
        this.load.spritesheet('bolt', 'bolt.png', {frameWidth: 14, frameHeight: 14});
        this.load.image('dirtyOil', 'dirtyOil.png');
        this.load.image('cleanOil', 'cleanOil.png');
        this.load.spritesheet('oilCap', 'oilcap.png', {frameWidth: 26, frameHeight: 26});
        this.load.spritesheet('funnel', 'funnel.png', {frameWidth: 50, frameHeight: 100});
        this.load.spritesheet('oil', 'oil.png', {frameWidth: 80, frameHeight: 100});
        this.load.spritesheet('Xmark', 'Xmark.png', {frameWidth: 14, frameHeight: 14});

        // Sounds
        this.load.path = "./assets/sounds/";
        this.load.audio('startup', 'startupSound.mp3');
        this.load.audio('fixedSound', 'fixedSound.wav');
        this.load.audio('oil', 'pouringoil.wav');
        this.load.audio('socketwrench', 'socketwrench.wav');
        this.load.audio('completeSound', 'completeobtainedsound.wav');
        this.load.audio('message', 'PostcardMessage.m4a');

        // Music
        this.load.path = "./assets/Music/";
        this.load.audio('backgroundMusic', 'garden-mythical-game-music.wav');

        // Fonts
        this.load.path = "./assets/fonts/";
        this.load.font('handwritingFont', 'CuteHandWriting.ttf');
        this.load.font('checklistFont', 'DR_Exclusive_Editorial.ttf');
    }

    create() {

        // Variables for blinking animations
        let animsName = ['airFilterCoverBlink', 'generatorCoverBlink', 'airFilterCleanBlink', 'airFilterDirtyBlink', 'sparkplugBlink', 'sparkplugDirtyBlink', 'sparkplugCoverBlink', 'socketWrenchBlink', 'turnArrowBlink', 'oilDrainPanBlink', 'wrenchBlink', 'boltBlink', 'oilBlink', 'oilCapBlink', 'funnelBlink', 'paperclipBlink'];
        let animsString = ['airFilterCover', 'generatorCover', 'airFilter', 'airFilter', 'sparkplug', 'sparkplug', 'sparkplugCover', 'socketWrench', 'turnArrow', 'oilDrainPan', 'wrench', 'bolt', 'oil', 'oilCap', 'funnel', 'paperclip'];
        let animsFrames = [[0, 1], [0, 1], [0, 1], [2, 3], [0, 1], [2, 3], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1]];

        // Create all blinking animations
        for(let i = 0; i < animsName.length; i++) {

            this.anims.create({
                key: animsName[i],
                frames: this.anims.generateFrameNumbers(animsString[i], {start: animsFrames[i][0], end: animsFrames[i][1]}),
                frameRate: 4,
                repeat: -1
            });

        }

        // Create Xmark animation
        this.anims.create({
            key: 'XmarkAnim',
            frames: this.anims.generateFrameNumbers('Xmark', {start: 1, end: 8}),
            frameRate: 8,
            repeat: 0
        })

        this.scene.start('postcardGameScene');

    }
}