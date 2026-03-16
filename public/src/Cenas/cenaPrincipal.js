// Importa o objeto global gameState do arquivo principal
import { gameState } from "../main.js";

// Define a cena "cenaPrincipal", que é a tela de gameplay principal
export class cenaPrincipal extends Phaser.Scene {
    constructor() {
        super({ key: "cenaPrincipal" });
    }

    create() {
        // Garante que a HUD esteja ativa (se não estiver, inicia)
        if (!this.scene.isActive("cenaHUD")) {
            this.scene.launch("cenaHUD");
        }
        this.scene.bringToTop("cenaHUD");

        // Música de fundo
        if (!gameState.musica) {
            gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        }
        if (!gameState.musica.isPlaying) {
            gameState.musica.play();
        }

        // Fundo da cena principal (responsivo)
        this.bg = this.add
            .image(this.scale.width / 2, this.scale.height / 2, "bgHUD")
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        // Configuração da câmera
        this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
        this.cameras.main.fadeIn(200, 0, 0, 0);

        // Listener para redimensionamento da tela
        this.scale.on("resize", (gameSize) => {
            const width = gameSize.width;   // largura limitada pelo main.js
            const height = gameSize.height; // altura total da tela

            this.cameras.resize(width, height);

            // Ajusta fundo
            this.bg.setDisplaySize(width, height).setPosition(width / 2, height / 2);
        });
    }
}
