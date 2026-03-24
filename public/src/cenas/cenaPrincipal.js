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

        // Fundo da cena
        this.bg = this.add
            .image(posicaoX / 2, posicaoY / 2, "bgPrincipal")
            .setDisplaySize(posicaoX, posicaoY)
            .setDepth(-1)

        // Criar cachorro dentro de um container
        this.gerenciadorCachorros = new GerenciadorCachorros(this)
        this.cachorro = this.gerenciadorCachorros.criarCachorro(0, 0, cachorrosBase[0])

        // Container que agrupa cachorro + pulgas
        const elementosContainer = [this.cachorro.sprite]

        // Cria a animação da pulga (se ainda não existir)
        if (!this.anims.exists("pulgaAnim")) {
            this.anims.create({
                key: "pulgaAnim",
                frames: this.anims.generateFrameNumbers("pulgas", { start: 0, end: 1 }), 
                frameRate: 1,   // velocidade da animação (frames por segundo)
                repeat: -1      // -1 = loop infinito
            })
        }

        // Cria o sprite da pulga
        this.pulgas = this.add.sprite(0, 0, "pulgas")
            .setOrigin(0.5) // centraliza no container
            // Dica: Como a pulga está dentro do container, é melhor uma escala fixa em relação ao cachorro
            // Mas mantive a sua proporção baseada na altura inicial
            .setScale(posicaoY * 0.0015) 

        // Inicia a animação da pulga
        this.pulgas.play("pulgaAnim")

        // Define a visibilidade inicial baseada no gameState atual
        this.pulgas.setVisible(gameState.pulga)

        // Adiciona ao container
        elementosContainer.push(this.pulgas)

        // Cria o container com cachorro + pulgas
        this.containerCachorro = this.add.container(
            posicaoX / 2,
            posicaoY * 0.7,
            elementosContainer
        )

        // Escala do container (afeta ambos)
        this.containerCachorro.setScale(posicaoY * 0.0006)

        // --- AJUSTE AQUI: Resize dinâmico otimizado ---
        this.scale.on("resize", (gameSize) => {
            const novaLargura = gameSize.width
            const novaAltura = gameSize.height

            // Recalcula a área útil da tela principal (descontando 20% da HUD)
            const novaPosicaoX = novaLargura - (novaLargura * 0.2)
            const novaPosicaoY = novaAltura

            // 1. Ajusta o Fundo
            this.bg
                .setDisplaySize(novaPosicaoX, novaPosicaoY)
                .setPosition(novaPosicaoX / 2, novaPosicaoY / 2)

            // 2. Ajusta escala e posição do container (Cachorro + Pulga)
            this.containerCachorro.setScale(novaPosicaoY * 0.0006)
            this.containerCachorro.setPosition(novaPosicaoX / 2, novaPosicaoY * 0.7)

            // 3. Atualiza os limites da câmera para não quebrar a visão após o resize
            this.cameras.main.setBounds(0, 0, novaLargura, novaAltura)
        })

        // Câmera Inicial
        this.cameras.main.setBounds(0, 0, largura, altura)
        this.cameras.main.fadeIn(200, 0, 0, 0)
    }

    update() {
        // Verifica continuamente se todas as barras estão completas para evoluir o cachorro
        if (this.gerenciadorCachorros) {
            this.gerenciadorCachorros.verificarCompletude()
        }

        // Atualiza a visibilidade da pulga em tempo real
        if (this.pulgas) {
            this.pulgas.setVisible(gameState.pulga)
        }
    }
}