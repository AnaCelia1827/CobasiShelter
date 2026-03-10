import { gameState } from "../main.js";

export class gameScene extends Phaser.Scene {
    constructor() {
        super({ key: "gameScene" });
    }

    create() {
        if (!this.scene.isActive("hudScene")) {
            this.scene.launch("hudScene");
        }
        this.scene.bringToTop("hudScene");

        if (!gameState.musica) {
            gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        }
        if (!gameState.musica.isPlaying) {
            gameState.musica.play();
        }

        this.add
            .image(this.scale.width / 2, this.scale.height / 2, "bgGameScene")
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
        this.cameras.main.fadeIn(200, 0, 0, 0);
    }
}
