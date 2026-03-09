class PostcardBack extends Phaser.Scene {
    constructor() {
        super("postcardBackScene")
    }
    
    create() {

        //Create line in the middle
        this.line = this.add.line(width / 2, 10, 0, 50, 0, 625, 0x000000, 1).setOrigin(0).setLineWidth(5);
        
        //Create title Place holder
        this.add.text(40, 35, 'POSTCARD', {
            fontFamily: 'Arial',
            fontSize: '34px',
            color: '#000000'
        });

        //Create lines for message
        const leftX1 = 200;
        const leftX2 = 500;
        const leftStartY = 165;
        const leftGap = 42;

        for(let i = 0; i < 5; i++) {
            const y = leftStartY + i * leftGap;
            this.add.line(0, 0, leftX1, y, leftX2, y, 0x000000, 1).setLineWidth(1);
        }


        //Create to and from text and create lines

        this.add.text(640, 255, 'to:', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#0x000000'
        });

        this.add.text(640, 350, 'from:', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#0x000000'
        });

        const rightX1 = 800;
        const rightX2 = 1020;

        //to lines
        this.add.line(0, 0, rightX1, 305, rightX2, 305, 0x000000, 1).setLineWidth(1);
        this.add.line(0, 0, rightX1, 338, rightX2, 338, 0x000000, 1).setLineWidth(1);

        //from lines
        this.add.line(0, 0, rightX1, 400, rightX2, 400, 0x000000, 1).setLineWidth(1);
        this.add.line(0, 0, rightX1, 433, rightX2, 433, 0x000000, 1).setLineWidth(1);
    
        // Key to be able to switch scenes easily
        this.input.keyboard.on('keydown-S', () => {
            console.log('Switching Scene to postcardGameScene');
            this.scene.start('postcardGameScene');
        }, this);

    }
}