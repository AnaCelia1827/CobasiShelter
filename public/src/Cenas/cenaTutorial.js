export class cenaTutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'cenaTutorial' });
        this.currentIndex = 1;
        this.maxTutorials = 11;
    }

    preload() {
        for (let i = 1; i <= this.maxTutorials; i++) {
            this.load.image(`tutorial${i}`, `assets/tutorial${i}.png`);
        }
    }

    create() {
        this.currentIndex = 1;

        this.image = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            `tutorial${this.currentIndex}`
        ).setOrigin(0.5);

        // Timer mais lento
        this.tutorialTimer = this.time.addEvent({
            delay: 3500, // aumenta aqui: 2000 = 2s | 3500 = 3.5s | 5000 = 5s
            callback: this.proximoTutorial,
            callbackScope: this,
            loop: true
        });

        // Botão skip / próximo
        this.skipText = this.add.text(
            this.cameras.main.width - 120,
            this.cameras.main.height - 60,
            'SKIP >',
            {
                fontSize: '28px',
                color: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 12, y: 8 }
            }
        )
        .setInteractive({ useHandCursor: true })
        .setDepth(10)
        .on('pointerdown', () => {
            this.proximoTutorial();
        });

        // opcional: hover
        this.skipText.on('pointerover', () => {
            this.skipText.setScale(1.05);
        });

        this.skipText.on('pointerout', () => {
            this.skipText.setScale(1);
        });
    }

    proximoTutorial() {
        this.currentIndex++;

        if (this.currentIndex > this.maxTutorials) {
            if (this.tutorialTimer) {
                this.tutorialTimer.remove();
            }
            this.scene.start('cenaPrincipal');
            return;
        }

        this.image.setTexture(`tutorial${this.currentIndex}`);
    }
}