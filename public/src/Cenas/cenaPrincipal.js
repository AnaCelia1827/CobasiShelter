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

        const posicaoX = this.scale.width - this.scale.width * 0.15;
        const posicaoY = this.scale.height;

        // Fundo da cena principal (responsivo)
        this.bg = this.add
            .image(posicaoX/2, posicaoY/2, "bgHUD")
            .setDisplaySize(posicaoX, posicaoY)
            .setDepth(-1);

        // Configuração da câmera
        this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
        this.cameras.main.fadeIn(200, 0, 0, 0);
    }
}
