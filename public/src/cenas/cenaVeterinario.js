import { gameState } from "../main.js";
import { GerenciadorCachorros } from "../componentes/controleCachorro/gerenciadorCachorros.js";
import { cachorrosBase } from "../componentes/controleCachorro/cachorrosBase.js";

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

        if (!gameState.musicaMenuPrincipal) {
            gameState.musicaMenuPrincipal = this.sound.add("musicaMenuPrincipal", { loop: true, volume: 1.0 });
        }
        if (gameState.musicaTutorial?.isPlaying) {
            gameState.musicaTutorial.stop();
        }
        if (!gameState.musicaMenuPrincipal.isPlaying) gameState.musicaMenuPrincipal.play();
        gameState.musica = gameState.musicaMenuPrincipal;

        // --- Fundo ---
        this.fundo = this.add.image(0, 0, "bgVeterinario");

        // --- Gerenciador ---
        this.gerenciadorCachorros = new GerenciadorCachorros(this);

        // ==========================================
        // SISTEMA DE CACHORRO + PULGAS NO CONTAINER
        // ==========================================
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

        // --- Pulga Alvo da Lupa ---
        this.pulgaAlvo = this.add.image(0, 0, "pulga1")
            .setScale(0.1)
            .setDepth(15)
            .setVisible(false);

        // --- Texto de Instrução da Lupa ---
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
            this.lupa.setScale(this.escalaLupaBase); 
            this.textoInstrucao.setVisible(false);
            
            this.reposicionarElementos(this.scale.width, this.scale.height);
        });

        // --- CHAMADA INICIAL DA RESPONSIVIDADE ---
        this.reposicionarElementos(this.scale.width, this.scale.height);

        // --- EVENTO DE REDIMENSIONAMENTO DE TELA ---
        this.scale.on("resize", (gameSize) => {
            this.cameras.resize(gameSize.width, gameSize.height);
            this.reposicionarElementos(gameSize.width, gameSize.height);
        });

        // ==========================================
        // CHAMA A TELA DE INSTRUÇÕES (A correção entra aqui!)
        // ==========================================
        if (!gameState.instrucoesPulgasVistas) {
            this.mostrarInstrucoes();
        }
    }

    // --- FUNÇÃO DE RESPONSIVIDADE ---
    reposicionarElementos(width, height) {
        const areaUtilX = width * 0.8; 
        const centroX = areaUtilX / 2;
        const centroY = height / 2;

        if (this.fundo) {
            this.fundo.setDisplaySize(areaUtilX, height);
            this.fundo.setPosition(centroX, centroY);
        }

        if (this.containerCachorro) {
            this.containerCachorro.setPosition(centroX, height / 2.3);
            this.containerCachorro.setScale(height * 0.0006); 
            
            if (this.pulgas) {
                this.pulgas.setScale(height * 0.0015); 
            }
        }

        if (this.pulgaAlvo && !this.achouPulga) {
            this.pulgaAlvo.setPosition(centroX, height / 2.3);
        }

        if (this.textoInstrucao) {
            this.textoInstrucao.setPosition(centroX, height * 0.12);
        }

        if (this.lupa) {
            this.escalaLupaBase = Math.min(areaUtilX, height) * 0.0012; 

            if (!this.achouPulga) {
                if (!this.lupaSendoArrastada) {
                    this.lupa.setPosition(centroX, height * 0.85);
                    this.lupa.setScale(this.escalaLupaBase);
                } else {
                    this.lupa.setScale(this.escalaLupaBase * 1.15);
                }
            }
        }
    }

    // --- Zoom ---
    darZoomNaPulga() {
        if (this.achouPulga) return;

        this.achouPulga = true;
        this.lupaSendoArrastada = false; 
        gameState.lupaJaUsada = true;

        this.textoInstrucao.setVisible(true);

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
            this.gerenciadorCachorros.mudarParaCachorroHeroi();
        }

        if (this.pulgas) {
            this.pulgas.setVisible(gameState.pulga);
        }
    }

    // ========================================================
    //                 TELA DE INSTRUÇÕES
    // ========================================================
    mostrarInstrucoes() {
        this.scene.bringToTop();

        const centroX = this.scale.width / 2;
        const centroY = this.scale.height / 2;

        const fundoEscuro = this.add.rectangle(centroX, centroY, 8000, 8000, 0x000000, 0.7)
            .setDepth(100)
            .setInteractive();

        const telaInstrucao = this.add.image(centroX, centroY, "instrucaoPulgas")
            .setDepth(101)
            .setInteractive({ useHandCursor: true }); 

        const limiteLargura = this.scale.width * 0.8;
        const limiteAltura = this.scale.height * 0.8;

        const escalaX = limiteLargura / telaInstrucao.width;
        const escalaY = limiteAltura / telaInstrucao.height;

        const escalaFinal = Math.min(escalaX, escalaY);
        telaInstrucao.setScale(escalaFinal);

        const fecharInstrucoes = () => {
            fundoEscuro.destroy();
            telaInstrucao.destroy();
            
            // Variável corrigida para a cena do veterinário!
            gameState.instrucoesPulgasVistas = true; 
            
            this.scene.bringToTop("HUD");
        };

        fundoEscuro.on('pointerdown', fecharInstrucoes);
        telaInstrucao.on('pointerdown', fecharInstrucoes);
    }
}