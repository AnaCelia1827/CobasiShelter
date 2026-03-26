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

        // Música de fundo (principal)
        if (!gameState.musicaMenuPrincipal) {
            gameState.musicaMenuPrincipal = this.sound.add("musicaMenuPrincipal", { loop: true, volume: 5.0 })
        }
        if (gameState.musicaTutorial?.isPlaying) {
            gameState.musicaTutorial.stop();
        }
        if (!gameState.musicaMenuPrincipal.isPlaying) {
            gameState.musicaMenuPrincipal.play()
        }
        gameState.musica = gameState.musicaMenuPrincipal;

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
            .setOrigin(0.5) 
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
        
        // --- TELA DE INSTRUÇÃO (Aparece apenas na primeira vez) ---
        if (!gameState.instrucaoMissaoVista) {
            const centroX = posicaoX / 2;
            const centroY = posicaoY / 2;

            // Fundo semi-transparente salvo no "this" para podermos redimensionar depois
            this.fundoEscuro = this.add.rectangle(centroX, centroY, posicaoX, posicaoY, 0x000000, 0.7)
                .setDepth(1000)
                .setInteractive(); 

            // Imagem de instrução (com escala reduzida para 70%)
            this.imgInstrucao = this.add.image(centroX, centroY, "instrucaoMissao")
                .setDepth(1001)
                .setScale(0.5);

            // Calcula a posição do texto para ficar um pouco abaixo da imagem
            const posicaoTextoY = centroY + (this.imgInstrucao.displayHeight / 2) + 30;

            this.txtContinuar = this.add.text(centroX, posicaoTextoY, "[ Clique para continuar ]", {
                fontFamily: '"Press Start 2P", Arial',
                fontSize: "15px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4
            }).setOrigin(0.5).setDepth(1001);

            // Efeito piscando suave no texto
            this.tweens.add({
                targets: this.txtContinuar,
                alpha: 0.4,
                duration: 800,
                yoyo: true,
                loop: -1
            });

            // Ao clicar, destrói a tela de aviso e salva no gameState
            this.fundoEscuro.on("pointerdown", () => {
                this.fundoEscuro.destroy();
                this.imgInstrucao.destroy();
                this.txtContinuar.destroy();
                
                // Limpa as variáveis para o resize ignorá-las
                this.fundoEscuro = null;
                this.imgInstrucao = null;
                this.txtContinuar = null;
                
                gameState.instrucaoMissaoVista = true; 
            });
        }
        // ----------------------------------------------------------

        // --- AJUSTE AQUI: Resize dinâmico otimizado ---
        this.scale.on("resize", (gameSize) => {
            if (!this.scene.isActive() || !this.cameras || !this.cameras.main) return;

            const novaLargura = gameSize.width
            const novaAltura = gameSize.height

            // Recalcula a área útil da tela principal (descontando 20% da HUD)
            const novaPosicaoX = novaLargura - (novaLargura * 0.2)
            const novaPosicaoY = novaAltura
            const novoCentroX = novaPosicaoX / 2;
            const novoCentroY = novaPosicaoY / 2;

            // 1. Ajusta o Fundo
            if (this.bg) {
               this.bg
                .setDisplaySize(novaPosicaoX, novaPosicaoY)
                .setPosition(novoCentroX, novoCentroY)
            }

            // 2. Ajusta escala e posição do container (Cachorro + Pulga)
            if (this.containerCachorro) {
                this.containerCachorro.setScale(novaPosicaoY * 0.0006)
                this.containerCachorro.setPosition(novoCentroX, novaPosicaoY * 0.7)
            }

            // 3. Ajusta a tela de instrução (se ela estiver aberta)
            if (this.fundoEscuro && this.fundoEscuro.active) {
                this.fundoEscuro.setSize(novaPosicaoX, novaPosicaoY);
                this.fundoEscuro.setPosition(novoCentroX, novoCentroY);
                
                if (this.imgInstrucao && this.imgInstrucao.active) {
                    this.imgInstrucao.setPosition(novoCentroX, novoCentroY);
                    
                    if (this.txtContinuar && this.txtContinuar.active) {
                        const novoPosicaoTextoY = novoCentroY + (this.imgInstrucao.displayHeight / 2) + 30;
                        this.txtContinuar.setPosition(novoCentroX, novoPosicaoTextoY);
                    }
                }
            }
        })

        // Limpa o evento de resize quando a cena for fechada/parada para evitar vazamento de memória e bugs
        this.events.on('shutdown', () => {
            this.scale.removeAllListeners('resize');
        });
        
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