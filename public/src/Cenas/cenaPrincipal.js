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
        // Coloca a HUD por cima das outras cenas
        this.scene.bringToTop("cenaHUD");

        // Música de fundo: cria se não existir e inicia se não estiver tocando
        if (!gameState.musica) {
            gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        }
        if (!gameState.musica.isPlaying) {
            gameState.musica.play();
        }

        // Fundo da cena principal (HUD visual)
        this.add
            .image(this.scale.width / 2, this.scale.height / 2, "bgHUD")
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1); // Coloca o fundo atrás dos elementos

        // Configuração da câmera (fade in inicial para suavizar transição)
        this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
        this.cameras.main.fadeIn(200, 0, 0, 0);
    }
}
