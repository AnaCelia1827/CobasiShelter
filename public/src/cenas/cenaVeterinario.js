import { gameState } from "../main.js"
import { GerenciadorCachorros } from "../componentes/controleCachorro/gerenciadorCachorros.js"
import { cachorrosBase } from "../componentes/controleCachorro/cachorrosBase.js"

export class cenaVeterinario extends Phaser.Scene {
    
    constructor() {
        super({ key: "cenaVeterinario" });
        this.achouPulga = false;
        this.lupaSendoArrastada = false;
        this.escalaLupaBase = 0.8; // Valor inicial seguro
    }

    create() {

        // --- Estado global ---
        this.achouPulga = gameState.lupaJaUsada || false;
        this.lupaSendoArrastada = false;

        if (!this.scene.isActive("HUD")) this.scene.launch("HUD");
        this.scene.bringToTop("HUD");

        if (!gameState.musica) {
            gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        }
        if (!gameState.musica.isPlaying) gameState.musica.play();

        // --- Fundo (será redimensionado e posicionado na função reposicionarElementos) ---
        this.fundo = this.add.image(0, 0, "bgVeterinario");

        // --- Gerenciador ---
        this.gerenciadorCachorros = new GerenciadorCachorros(this);

        // ==========================================
        // SISTEMA DE CACHORRO + PULGAS NO CONTAINER
        // ==========================================
        // Cria o cachorro na posição 0,0 para ir para dentro do container
        this.cachorro = this.gerenciadorCachorros.criarCachorro(0, 0, cachorrosBase[0]);

        this.physics.add.existing(this.cachorro.sprite);
        this.cachorro.sprite.body.setAllowGravity(false);
        this.cachorro.sprite.body.immovable = true;

        const elementosContainer = [this.cachorro.sprite];

        // Cria a animação da pulga (se ainda não existir)
        if (!this.anims.exists("pulgaAnim")) {
            this.anims.create({
                key: "pulgaAnim",
                frames: this.anims.generateFrameNumbers("pulgas", { start: 0, end: 1 }), 
                frameRate: 1,  
                repeat: -1     
            });
        }

        // Cria o sprite animado de status das pulgas
        this.pulgas = this.add.sprite(0, 0, "pulgas").setOrigin(0.5);
        this.pulgas.play("pulgaAnim");
        this.pulgas.setVisible(gameState.pulga);
        elementosContainer.push(this.pulgas);

        // Cria o container com o cachorro e as pulgas
        this.containerCachorro = this.add.container(0, 0, elementosContainer);
        // ==========================================

        // --- Pulga Alvo da Lupa ---
        this.pulgaAlvo = this.add.image(0, 0, "pulga1")
            .setScale(0.1)
            .setDepth(15)
            .setVisible(false);

        // --- Texto ---
        this.textoInstrucao = this.add.text(
            0, 0,
            "Ache as pulgas e retire elas.",
            {
                fontFamily: '"Press Start 2P", Arial',
                fontSize: "20px",
                color: "#ffd166",
                stroke: "#000000",
                strokeThickness: 4,
                align: "center"
            }
        )
        .setOrigin(0.5)
        .setDepth(20)
        .setVisible(false);

        // --- Lupa ---
        this.lupa = this.add.image(0, 0, "lupa")
            .setOrigin(0.5)
            .setDepth(10);

        // Interação
        if (!gameState.lupaJaUsada) {
            this.lupa.setInteractive({ useHandCursor: true });
            this.input.setDraggable(this.lupa);
        } else {
            this.lupa.setAlpha(0.5);
        }

        // --- Eventos ---
        this.lupa.on('dragstart', () => {
            if (this.achouPulga) return;
            this.lupaSendoArrastada = true;
            // Usa a escala responsiva calculada, mas 15% maior pra dar efeito visual
            this.lupa.setScale(this.escalaLupaBase * 1.15); 
            this.textoInstrucao.setVisible(true);
        });

        this.lupa.on('drag', (pointer, dragX, dragY) => {
            if (this.achouPulga) return;

            this.lupa.x = dragX;
            this.lupa.y = dragY;

            // Distância calculada com base no container agora
            const distancia = Phaser.Math.Distance.Between(
                this.lupa.x,
                this.lupa.y,
                this.containerCachorro.x, 
                this.containerCachorro.y
            );

            if (distancia < 150) {
                this.darZoomNaPulga();
            }
        });

        this.lupa.on('dragend', () => {
            if (this.achouPulga) return;
            this.lupaSendoArrastada = false;
            // Volta para a escala responsiva normal
            this.lupa.setScale(this.escalaLupaBase); 
            this.textoInstrucao.setVisible(false);
            
            // Retorna a lupa para a posição inicial caso tenha soltado sem achar
            this.reposicionarElementos(this.scale.width, this.scale.height);
        });

        // --- CHAMADA INICIAL DA RESPONSIVIDADE ---
        this.reposicionarElementos(this.scale.width, this.scale.height);

        // --- EVENTO DE REDIMENSIONAMENTO DE TELA ---
        this.scale.on("resize", (gameSize) => {
            this.cameras.resize(gameSize.width, gameSize.height);
            this.reposicionarElementos(gameSize.width, gameSize.height);
        });
    }

    // --- FUNÇÃO DE RESPONSIVIDADE ---
    reposicionarElementos(width, height) {
        // Assume que o HUD tira 20% da largura na direita
        const areaUtilX = width * 0.8; 
        const centroX = areaUtilX / 2;
        const centroY = height / 2;

        // Fundo
        if (this.fundo) {
            this.fundo.setDisplaySize(areaUtilX, height);
            this.fundo.setPosition(centroX, centroY);
        }

        // Cachorro (Container) e pulgas
        if (this.containerCachorro) {
            this.containerCachorro.setPosition(centroX, height / 2.3);
            this.containerCachorro.setScale(height * 0.0006); 
            
            if (this.pulgas) {
                this.pulgas.setScale(height * 0.0015); 
            }
        }

        // Pulga Alvo
        if (this.pulgaAlvo && !this.achouPulga) {
            this.pulgaAlvo.setPosition(centroX, height / 2.3);
        }

        // Texto
        if (this.textoInstrucao) {
            this.textoInstrucao.setPosition(centroX, height * 0.12);
        }

        // Lupa
        if (this.lupa) {
            // Calcula a escala responsiva baseada no tamanho da tela
            this.escalaLupaBase = Math.min(areaUtilX, height) * 0.0012; 

            // Só reposiciona e altera a escala base se não estiver arrastando/não achou a pulga
            if (!this.achouPulga) {
                if (!this.lupaSendoArrastada) {
                    this.lupa.setPosition(centroX, height * 0.85);
                    this.lupa.setScale(this.escalaLupaBase);
                } else {
                    // Mantém a proporção de "zoom" se a tela for redimensionada enquanto arrasta
                    this.lupa.setScale(this.escalaLupaBase * 1.15);
                }
            }
        }
    }

    // --- Zoom ---
    darZoomNaPulga() {
        if (this.achouPulga) return;

        this.achouPulga = true;
        this.lupaSendoArrastada = false; // Garante que parou de arrastar
        gameState.lupaJaUsada = true;

        this.textoInstrucao.setVisible(true);

        // Mostra pulga alvo
        this.pulgaAlvo.setVisible(true);
        this.pulgaAlvo.setPosition(this.lupa.x, this.lupa.y);

        this.tweens.add({
            targets: this.pulgaAlvo,
            scale: 1.5,
            duration: 600,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.time.delayedCall(1500, () => {
                    gameState.cachorroTemPulga = true;
                    this.scene.start("cenaCuidado");
                });
            }
        });
    }

    update(time, delta) {
        if (this.cachorro?.update) {
            this.cachorro.update(time, delta);
        }

        if (gameState.trocar) {
            this.gerenciadorCachorros.mudarParaCachorroHeroi()
        }

        // Atualiza a visibilidade das pulgas "normais" em tempo real
        if (this.pulgas) {
            this.pulgas.setVisible(gameState.pulga);
        }
    }
}