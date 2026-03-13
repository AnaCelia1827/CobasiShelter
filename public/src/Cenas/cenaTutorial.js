export class cenaTutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'cenaTutorial' });
        this.currentIndex = 1; // começa no tutorial1
    }

    preload() {
        for (let i = 1; i <= 11; i++) {
            this.load.image(`tutorial${i}`, `assets/tutorial${i}.png`);
        }
    }

    create() {
        // Mostra a primeira textura
        this.image = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            `tutorial${this.currentIndex}`
        ).setOrigin(0.5);

        // Cria um timer que troca a textura a cada 2 segundos
        this.time.addEvent({
            delay: 2000, // 2 segundos
            callback: () => {
                this.currentIndex++;

                if (this.currentIndex > 11) {
                    // Quando terminar, troca para cenaPrincipal
                    this.scene.start('cenaPrincipal');
                    return;
                }

                this.image.setTexture(`tutorial${this.currentIndex}`);
            },
            loop: true // repete até que seja interrompido
        });
    }
}
