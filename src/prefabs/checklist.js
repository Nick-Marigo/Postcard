class Checklist {

    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.tasks = [];
        this.lines = [];

        this.list = scene.add.image(x, y, 'checklist');

        this.scene.add.text(50, 50, 'Check List', {fontSize: '36px', color: '#000'});
    }

    // Clears any existing tasks and creates a new list of tasks with hidden cross-out line for each one
    setTasks(taskArray) {

        this.tasks.forEach(t => t.destroy());
        this.lines.forEach(l => l.destroy());

        this.tasks = [];
        this.lines = [];

        for(let i = 0; i < taskArray.length; i++) {

            let yOffset = this.y - 80 + i * 40;

            let text = this.scene.add.text(
                this.x - 50,
                yOffset,
                taskArray[i],
                { fontSize: '20px', color: '#000'}
            );

            let line = this.scene.add.rectangle(
                this.x - 50,
                yOffset + 12,
                text.width,
                3, 0xff0000
            ).setOrigin(0, 0.5);

            line.scaleX = 0;

            this.tasks.push(text);
            this.lines.push(line);

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