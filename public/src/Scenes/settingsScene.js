import { gameState } from "../main.js";

export class settingsScene extends Phaser.Scene {
    constructor() {
        super({ key: "settingsScene" });
        this.isTransitioning = false;
    }

    create() {
        this.scene.stop("hudScene");
        this.isTransitioning = false;

        if (!gameState.musica) {
            gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        }
        if (!gameState.musica.isPlaying) {
            gameState.musica.play();
        }

        this.add
            .image(this.scale.width / 2, this.scale.height / 2, "bg")
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        this.add
            .rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000)
            .setAlpha(0.5)
            .setDepth(0);

        this.add.image(1000, 300, "settings").setScale(0.8).setDepth(1);

        const retornoInicio = this.add
            .image(1060, 165, "retornoInicio")
            .setScale(0.35)
            .setDepth(2)
            .setInteractive({ useHandCursor: true });

        this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
        this.cameras.main.fadeIn(200, 0, 0, 0);

        retornoInicio.on("pointerover", () => {
            this.tweens.add({
                targets: retornoInicio,
                scaleX: 0.4,
                scaleY: 0.4,
                duration: 200,
                ease: "Power2"
            });
        });

        retornoInicio.on("pointerout", () => {
            this.tweens.add({
                targets: retornoInicio,
                scaleX: 0.35,
                scaleY: 0.35,
                duration: 200,
                ease: "Power2"
            });
        });

        retornoInicio.on("pointerdown", () => {
            if (this.isTransitioning) {
                return;
            }

            this.isTransitioning = true;
            this.cameras.main.fadeOut(200, 0, 0, 0);
            this.cameras.main.once("camerafadeoutcomplete", () => {
                if (gameState.musica?.isPlaying) {
                    gameState.musica.stop();
                }
                this.scene.start("introScene");
            });
        });
    }
}
