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

        // Criar cachorro dentro de um container
        this.gerenciadorCachorros = new GerenciadorCachorros(this)
        this.cachorro = this.gerenciadorCachorros.criarCachorro(0, 0, cachorrosBase[0])

        // Container que agrupa cachorro + pulgas (se habilitado)
        const elementosContainer = [this.cachorro.sprite]

        if (gameState.pulga === true) {
            this.pulgas = this.add.image(0, 0, "pulgas").setScale(posicaoY * 0.0002)
            elementosContainer.push(this.pulgas)
        }

        this.containerCachorro = this.add.container(posicaoX / 2, posicaoY * 0.7, elementosContainer)

        // Escala do container (afeta ambos)
        this.containerCachorro.setScale(posicaoY * 0.0006)

        // Resize
        this.scale.on("resize", (tamanhoTela) => {
            const { width: largura, height: altura } = tamanhoTela

            this.bg
                .setDisplaySize(largura - largura * 0.2, altura)
                .setPosition((largura - largura * 0.2) / 2, altura / 2)

            // Ajusta escala e posição do container
            this.containerCachorro.setScale(altura * 0.0006)
            this.containerCachorro.setPosition((largura - largura * 0.2) / 2, altura * 0.7)
        })

        // Câmera
        this.cameras.main.setBounds(0, 0, largura, altura)
        this.cameras.main.fadeIn(200, 0, 0, 0)
    }
}
