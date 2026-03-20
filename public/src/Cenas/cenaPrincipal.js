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
        if (!this.scene.isActive("cenaHUD")) {
            this.scene.launch("cenaHUD")
        }
        this.scene.bringToTop("cenaHUD")

        // Música
        if (!gameState.musica) {
            gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 })
        }
        if (!gameState.musica.isPlaying) {
            gameState.musica.play()
        }

        const largura = this.scale.width
        const altura = this.scale.height

        const posicaoX = largura - largura * 0.2
        const posicaoY = altura

        // Fundo
        this.bg = this.add
            .image(posicaoX / 2, posicaoY / 2, "bgPrincipal")
            .setDisplaySize(posicaoX, posicaoY)
            .setDepth(-1)

        // Criar cachorro
        this.gerenciadorCachorros = new GerenciadorCachorros(this)
        this.cachorro = this.gerenciadorCachorros.criarCachorro(
            posicaoX / 2,
            posicaoY / 2.3,
            cachorrosBase[0]
        )

        this.cachorro.sprite.setScale(posicaoY * 0.0006)

        // Resize
        this.scale.on("resize", (tamanhoTela) => {
            const { width: largura, height: altura } = tamanhoTela

            this.bg
                .setDisplaySize(largura - largura * 0.2, altura)
                .setPosition((largura - largura * 0.2) / 2, altura / 2)

            // Corrigido: usa altura nova
            this.cachorro.sprite.setScale(altura * 0.0006)

            this.cachorro.sprite.setPosition((largura - largura * 0.2) / 2, altura / 2)
        })


        // Câmera
        this.cameras.main.setBounds(0, 0, largura, altura)
        this.cameras.main.fadeIn(200, 0, 0, 0)
    }
}