class PostcardBack extends Phaser.Scene {
    constructor() {
        super("postcardBackScene")
    }
    
    create() {

        console.log('postcardBackScene started');

        document.getElementById('card').classList.add('flipped');
        const canvas = document.querySelector('#game canvas');
        if(canvas) {
            document.getElementById('game-back').appendChild(canvas);
        }

        this.add.image(1000, 100, 'stamp');

        //Create line in the middle
        this.line = this.add.line(width / 2, 15, 0, 50, 0, 620, 0x000000, 1).setOrigin(0).setLineWidth(5);
        
        //Create title Place holder
        this.add.text(width / 2, 25, 'POSTCARD', {
            fontFamily: 'checklistFont',
            fontSize: '34px',
            color: '#000'
        }).setOrigin(0.5, 0);

        this.add.text(150, 200, "Hey Dad!\nThank you for fixing\nthe generator. I don't\nknow what I would\ndo without you. Can't\nwait to see you in\na few days!", {fontFamily: 'handwritingFont', fontSize: '36px', color: '#000'});


        //Create to and from text and create lines
        this.add.text(640, 255, 'To:', {
            fontFamily: 'checklistFont',
            fontSize: '24px',
            color: '#000'
        });

        this.add.text(680, 255, 'Dad', {
            fontFamily: 'handwritingFont',
            fontSize: '30px',
            color: '#000'
        });

        this.add.text(640, 350, 'From:', {
            fontFamily: 'checklistFont',
            fontSize: '24px',
            color: '#000'
        });

        this.add.text(710, 350, 'Nick', {
            fontFamily: 'handwritingFont',
            fontSize: '30px',
            color: '#000'
        });

        const lineWidth = 150;

        //to line
        this.add.line(640, 285, 0, 0, lineWidth, 0, 0x000000, 1).setLineWidth(1).setOrigin(0);

        //from line
        this.add.line(640, 380, 0, 0, lineWidth, 0, 0x000000, 1).setLineWidth(1).setOrigin(0);

        const flipbackText = this.add.text(900, 600, 'Flip Back', {
            frontFamily: 'checklistFont',
            fontSize: '28px',
            color: '#000',
            backgroundColor: '#d4b472',
            padding: { left: 10, right: 10, top: 6, bottom: 6}
        }).setInteractive({useHandCursor: true});

        flipbackText.on('pointerdown', () => {
            console.log('Switching Scene to postcardGameScene');

            const card = document.getElementById('card');
            const game = document.getElementById('game');
            const frontImage = document.getElementById('front-image');

            if(card && game && frontImage) {

                frontImage.style.display = 'block';
                game.style.display = 'none';

                card.classList.remove('flipped');

                const canvas = document.querySelector('#game-back canvas');
                if(canvas) {
                    document.getElementById('game').appendChild(canvas);
                }

                this.time.delayedCall(3000, () => {
                    game.style.display = 'block';
                    frontImage.style.display = 'none';
                    this.scene.start('postcardGameScene');
                });
            }
        })

        const creditsText = this.add.text(100, 600, 'Credits', {
            fontFamily: 'checklistFont',
            fontSize: '28px',
            color: '#000',
            backgroundColor: '#d4b472',
            padding: { left: 10, right: 10, top: 6, bottom: 6}
        }).setInteractive({useHandCursor: true});

        const creditBox = this.add.rectangle(width / 2, height / 2, 660, 550, '0xd4b472').setDepth(100).setVisible(false);

        const creditTextBody = this.add.text(creditBox.x - 250, creditBox.y - 250, 
            `Art and Code by Nick Marigo
    Sounds:
        -Snapping Sound Effect by DRFX:
        https://freesound.org/people/DRFX/sounds/416928/
        -Socket Wrench Sound Effect by yfjesse: 
        https://freesound.org/people/yfjesse/sounds/131200/
        -Oil Pouring Sound Effect by clement.bern: 
        https://freesound.org/people/clement.bernardeau/sounds/699231/
        -Generator Starting Sound Effect by mrrap4food: 
        https://freesound.org/people/mrrap4food/sounds/618984/
        -Generator Starting and Running Sound Effect by JeffWojo: 
        https://freesound.org/people/JeffWojo/sounds/169940/
        -Intro voice audio by Nick Marigo

    Music:
        -Mythical Game Music by Kjartan_abel: 
        https://freesound.org/people/kjartan_abel/sounds/647212/

    Fonts:
        -Exclusive Editorial by Dora Typefoundry: 
        https://www.dafont.com/exclusive-editorial.font
        -Cute Handwriting by Paula Tennet: 
        https://www.dafont.com/cutehandwriting.font?text=handwriting`,
            {
                fontFamily: 'checklistFont',
                fontSize: '18px',
                color: '#000',
                wordWrap: {width: 650}
            }).setDepth(101).setVisible(false).setOrigin(0);

            const closeCredits = this.add.text(creditBox.x, creditBox.y + 240, 'Close', {
                fontFamily: 'checklistFont',
                fontSize: '28px',
                color: '#000',
                backgroundColor: '#FACADE',
                padding: {left: 8, right: 8, top: 4, bottom: 4}
            }).setInteractive({useHandCursor: true}).setDepth(101).setVisible(false).setOrigin(0.5);

            creditsText.on('pointerdown', () => {
                creditBox.setVisible(true);
                creditTextBody.setVisible(true);
                closeCredits.setVisible(true);
            })

            closeCredits.on('pointerdown', () => {
                creditBox.setVisible(false);
                creditTextBody.setVisible(false);
                closeCredits.setVisible(false);
            })
    
        // Key to be able to switch scenes easily
        this.input.keyboard.on('keydown-S', () => {
            console.log('Switching Scene to postcardGameScene');

            const card = document.getElementById('card');
            const game = document.getElementById('game');
            const frontImage = document.getElementById('front-image');

            if(card && game && frontImage) {

                frontImage.style.display = 'block';
                game.style.display = 'none';

                card.classList.remove('flipped');

                const canvas = document.querySelector('#game-back canvas');
                if(canvas) {
                    document.getElementById('game').appendChild(canvas);
                }

                this.time.delayedCall(3000, () => {
                    game.style.display = 'block';
                    frontImage.style.display = 'none';
                    this.scene.start('postcardGameScene');
                });
            }
        }, this);

    }
}