class Checklist {

    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.tasks = [];
        this.lines = [];
        this.underlines = [];
        this.boxes = [];

        this.list = scene.add.image(x, y, 'checklist');

        this.scene.add.text(this.x / 2, 50, 'Check List', {fontSize: '36px', color: '#000'});
    }

    // Clears any existing tasks and creates a new list of tasks with hidden cross-out line for each one
    setTasks(taskArray) {

        this.tasks.forEach(t => t.destroy());
        this.lines.forEach(l => l.destroy());
        this.underlines.forEach(u => u.destroy());
        this.boxes.forEach(b => b.destroy());

        this.tasks = [];
        this.lines = [];
        this.underlines = [];
        this.boxes = [];

        const startX = this.x / 4 + 10;
        const boxX = this.x / 5;
        const maxWidth = 280;
        const lineLength = 260;
    
        let currentY = this.y - 225;

        for(let i = 0; i < taskArray.length; i++) {

            //Checkbox
            let box = this.scene.add.rectangle(
                boxX,
                currentY + 12,
                14, 
                14
            ).setStrokeStyle(2, 0x000000);

            let text = this.scene.add.text(
                startX,
                currentY,
                taskArray[i],
                { 
                    fontSize: '20px', 
                    color: '#000',
                    wordWrap: {width: maxWidth, useAdvancedWrap: true}
                }
            );

            //Underline
            let underline = this.scene.add.line(
                0, 0, 
                startX, 
                currentY + text.height + 6, 
                startX + lineLength, 
                currentY + text.height + 6, 
                0x000000, 
                1
            ).setOrigin(0, 0).setLineWidth(1);

            //Cross-out line
            let line = this.scene.add.rectangle(
                50,
                currentY + text.height / 2,
                lineLength,
                3, 0xff0000
            ).setOrigin(0, 0.5);

            line.scaleX = 0;

            this.boxes.push(box);
            this.tasks.push(text);
            this.underlines.push(underline);
            this.lines.push(line);

            currentY += text.height + 20;

        }

    }

    //Animates the cross-out line for the given index of the current task list and fades the text.
    completeTask(index) {

        let line = this.lines[index];

        this.scene.tweens.add({
            targets: line,
            scaleX: 1,
            duration: 300,
            ease: 'Power2'
        });

        this.tasks[index].setColor('#777');

    }

}