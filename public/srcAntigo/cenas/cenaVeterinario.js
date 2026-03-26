import { gameState } from "../main.js";
import { GerenciadorCachorros } from "../componentes/controleCachorro/gerenciadorCachorros.js";
import { cachorrosBase } from "../componentes/controleCachorro/cachorrosBase.js";

export class cenaVeterinario extends Phaser.Scene {
    constructor() {
        super({ key: "cenaVeterinario" });
        this.achouPulga = false;
        this.lupaSendoArrastada = false;
        this.escalaLupaBase = 0.8;
    }

    create() {
        // --- Estado global ---
        this.achouPulga = gameState.lupaJaUsada || false;
        this.lupaSendoArrastada = false;

        // --- HUD ---
        if (!this.scene.isActive("HUD")) this.scene.launch("HUD");
        this.scene.bringToTop("HUD");

        // --- Música ---
        if (!gameState.musicaMenuPrincipal) {
            gameState.musicaMenuPrincipal = this.sound.add("musicaMenuPrincipal", { loop: true, volume: 1.0 });
        }
        if (gameState.musicaTutorial?.isPlaying) {
            gameState.musicaTutorial.stop();
        }
        if (!gameState.musicaMenuPrincipal.isPlaying) gameState.musicaMenuPrincipal.play();
        gameState.musica = gameState.musicaMenuPrincipal;

        // --- Variáveis de Área Útil Iniciais ---
        const larguraTotal = this.scale.width;
        const alturaTotal = this.scale.height;
        const areaUtilLargura = larguraTotal * 0.8; // 80% da tela (desconto da HUD)

        // --- Fundo ---
        this.fundo = this.add.image(areaUtilLargura / 2, alturaTotal / 2, "bgVeterinario")
            .setDisplaySize(areaUtilLargura, alturaTotal)
            .setDepth(-1);

        // --- Gerenciador e Cachorro ---
        this.gerenciadorCachorros = new GerenciadorCachorros(this);
        this.cachorro = this.gerenciadorCachorros.criarCachorro(0, 0, cachorrosBase[0]);

        this.physics.add.existing(this.cachorro.sprite);
        this.cachorro.sprite.body.setAllowGravity(false);
        this.cachorro.sprite.body.immovable = true;

        // --- Animação e Sprite de Pulgas ---
        if (!this.anims.exists("pulgaAnim")) {
            this.anims.create({
                key: "pulgaAnim",
                frames: this.anims.generateFrameNumbers("pulgas", { start: 0, end: 1 }), 
                frameRate: 1,  
                repeat: -1     
            });
        }

        this.pulgas = this.add.sprite(0, 0, "pulgas")
            .setOrigin(0.5)
            .play("pulgaAnim")
            .setVisible(gameState.pulga);

        // --- Container (Cachorro + Pulgas) ---
        this.containerCachorro = this.add.container(areaUtilLargura / 2, alturaTotal * 0.5, [
            this.cachorro.sprite, 
            this.pulgas
        ]);
        this.containerCachorro.setScale(alturaTotal * 0.0006);

        // --- Elementos de Gameplay ---
        this.pulgaAlvo = this.add.image(0, 0, "pulga1")
            .setScale(0.1)
            .setDepth(15)
            .setVisible(false);

        this.textoInstrucao = this.add.text(areaUtilLargura / 2, alturaTotal * 0.15,
            "Ache as pulgas e retire elas.",
            {
                fontFamily: '"Press Start 2P", Arial',
                fontSize: "20px",
                color: "#ffd166",
                stroke: "#000000",
                strokeThickness: 4,
                align: "center"
            }
        ).setOrigin(0.5).setDepth(20).setVisible(false);

        // --- Lupa ---
        this.escalaLupaBase = alturaTotal * 0.0012;
        this.lupa = this.add.image(areaUtilLargura * 0.5, alturaTotal * 0.85, "lupa")
            .setOrigin(0.5)
            .setDepth(10)
            .setScale(this.escalaLupaBase);

        if (!gameState.lupaJaUsada) {
            this.lupa.setInteractive({ useHandCursor: true });
            this.input.setDraggable(this.lupa);
        } else {
            this.lupa.setAlpha(0.5);
        }

        // --- Eventos da Lupa ---
        this.lupa.on('dragstart', () => {
            if (this.achouPulga) return;
            this.lupaSendoArrastada = true;
            this.lupa.setScale(this.escalaLupaBase * 1.15); 
            this.textoInstrucao.setVisible(true);
        });

        this.lupa.on('drag', (pointer, dragX, dragY) => {
            if (this.achouPulga) return;
            this.lupa.x = dragX;
            this.lupa.y = dragY;

            const distancia = Phaser.Math.Distance.Between(
                this.lupa.x, this.lupa.y,
                this.containerCachorro.x, this.containerCachorro.y
            );

            if (distancia < 150) {
                this.darZoomNaPulga();
            }
        });

        this.lupa.on('dragend', () => {
            if (this.achouPulga) return;
            this.lupaSendoArrastada = false;
            this.lupa.setScale(this.escalaLupaBase); 
            this.textoInstrucao.setVisible(false);
        });

        // --- LÓGICA DE RESPONSIVIDADE UNIFICADA ---
        const handleResize = (tamanhoTela) => {
            const larguraTotal = tamanhoTela.width;
            const alturaTotal = tamanhoTela.height;
            const areaUtil = larguraTotal * 0.8; // Mantém a regra dos 80%

            // Atualiza Fundo
            if (this.fundo) {
                this.fundo.setPosition(areaUtil / 2, alturaTotal / 2)
                          .setDisplaySize(areaUtil, alturaTotal);
            }

            // Atualiza Container do Cachorro
            if (this.containerCachorro) {
                const novaEscalaCachorro = alturaTotal * 0.0006;
                this.containerCachorro.setPosition(areaUtil / 2, alturaTotal * 0.5)
                                      .setScale(novaEscalaCachorro);
            }

            // Atualiza Lupa (se não estiver sendo arrastada)
            if (this.lupa && !this.lupaSendoArrastada) {
                this.escalaLupaBase = alturaTotal * 0.0012;
                this.lupa.setPosition(areaUtil * 0.5, alturaTotal * 0.85)
                         .setScale(this.escalaLupaBase);
            }

            // Atualiza Texto
            if (this.textoInstrucao) {
                this.textoInstrucao.setPosition(areaUtil / 2, alturaTotal * 0.15);
            }
        };

        // Adiciona o listener
        this.scale.on("resize", handleResize);

        // Limpeza de evento segura
        this.events.on('shutdown', () => {
            this.scale.off("resize", handleResize);
        });

        // --- Instruções iniciais ---
        if (!gameState.instrucoesPulgasVistas) {
            this.mostrarInstrucoes();
        }
    }

    darZoomNaPulga() {
        if (this.achouPulga) return;

        this.achouPulga = true;
        this.lupaSendoArrastada = false;

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
        if (this.pulgas) {
            this.pulgas.setVisible(gameState.pulga);
        }
    }

    mostrarInstrucoes() {
        const centroX = this.scale.width / 2;
        const centroY = this.scale.height / 2;

        const fundoEscuro = this.add.rectangle(centroX, centroY, this.scale.width, this.scale.height, 0x000000, 0.7)
            .setDepth(100).setInteractive();

        const telaInstrucao = this.add.image(centroX, centroY, "instrucaoPulgas")
            .setDepth(101).setInteractive({ useHandCursor: true }); 

        const escalaFinal = Math.min(this.scale.width * 0.8 / telaInstrucao.width, this.scale.height * 0.8 / telaInstrucao.height);
        telaInstrucao.setScale(escalaFinal);

        const fecharInstrucoes = () => {
            fundoEscuro.destroy();
            telaInstrucao.destroy();
            gameState.instrucoesPulgasVistas = true; 
            this.scene.bringToTop("HUD");
        };

        fundoEscuro.on('pointerdown', fecharInstrucoes);
        telaInstrucao.on('pointerdown', fecharInstrucoes);
    }
}