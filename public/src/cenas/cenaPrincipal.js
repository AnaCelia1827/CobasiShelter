// Importa o estado global
import { gameState } from "../main.js"

// Imports do sistema de cachorro
import { GerenciadorCachorros } from "../componentes/controleCachorro/gerenciadorCachorros.js"
import { cachorrosBase } from "../componentes/controleCachorro/cachorrosBase.js"

// Define a cena principal
export class cenaPrincipal extends Phaser.Scene {
    constructor() {
        super({ key: "cenaPrincipal" })
    }

    create() {
        // HUD
        if (!this.scene.isActive("HUD")) {
            this.scene.launch("HUD")
        }
        this.scene.bringToTop("HUD")

        // Música de fundo
        if (!gameState.musicaMenuPrincipal) {
            gameState.musicaMenuPrincipal = this.sound.add("musicaMenuPrincipal", { loop: true, volume: 0.5 })
        }
        if (gameState.musicaTutorial?.isPlaying) {
            gameState.musicaTutorial.stop();
        }
        if (!gameState.musicaMenuPrincipal.isPlaying) {
            gameState.musicaMenuPrincipal.play()
        }
        gameState.musica = gameState.musicaMenuPrincipal;

        // --- LÓGICA DE POSICIONAMENTO RESPONSIVO (ÁREA ÚTIL) ---
        const larguraTotal = this.scale.width;
        const alturaTotal = this.scale.height;
        const areaUtilLargura = larguraTotal * 0.8; // Desconto de 20% da HUD

        // Fundo da cena (ajustado para a área útil)
        this.bg = this.add
            .image(areaUtilLargura / 2, alturaTotal / 2, "bgPrincipal")
            .setDisplaySize(areaUtilLargura, alturaTotal)
            .setDepth(-1);

        // Criar cachorro
        this.gerenciadorCachorros = new GerenciadorCachorros(this)
        this.cachorro = this.gerenciadorCachorros.criarCachorro(0, 0, cachorrosBase[0])

        // Configuração das pulgas
        if (!this.anims.exists("pulgaAnim")) {
            this.anims.create({
                key: "pulgaAnim",
                frames: this.anims.generateFrameNumbers("pulgas", { start: 0, end: 1 }), 
                frameRate: 2,
                repeat: -1
            })
        }

        this.pulgas = this.add.sprite(0, 0, "pulgas")
            .setOrigin(0.5)
            .play("pulgaAnim")
            .setVisible(gameState.pulga);

        // Container (Cachorro + Pulgas)
        this.containerCachorro = this.add.container(areaUtilLargura / 2, alturaTotal * 0.7, [
            this.cachorro.sprite, 
            this.pulgas
        ]);

        // Ajuste de escala inicial
        const escalaBase = alturaTotal * 0.0006;
        this.containerCachorro.setScale(escalaBase);

        // Define o handler de resize com referência fixa para poder remover
        const handleResizePrincipal = () => {
            const largura = this.scale.width - this.scale.width*0.2
            const altura = this.scale.height

            // Atualiza Fundo
            this.bg.setPosition(largura / 2, altura / 2)
            .setDisplaySize(largura, altura);

            // Atualiza Container
            const novaEscala = altura * 0.0006;
            this.containerCachorro.setPosition(largura / 2, altura * 0.7)                          
            .setScale(novaEscala);
        };

        this.scale.on("resize", handleResizePrincipal);

        // Limpeza de evento com referência exata
        this.events.on('shutdown', () => {
            this.scale.off("resize", handleResizePrincipal);
        });

        this.cameras.main.fadeIn(200, 0, 0, 0);
    }

    update() {
        if (this.gerenciadorCachorros) {
            this.gerenciadorCachorros.verificarCompletude()
        }
        if (this.pulgas) {
            this.pulgas.setVisible(gameState.pulga)
        }
    }
}