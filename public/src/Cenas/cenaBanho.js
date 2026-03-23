// Importa o objeto global gameState do arquivo principal
import { gameState } from "../main.js";
import { cachorrosBase } from "../componentes/controleCachorro/cachorrosBase.js";
import { GerenciadorCachorros } from "../componentes/controleCachorro/gerenciadorCachorros.js";

export class cenaBanho extends Phaser.Scene {
    constructor() {
        super({ key: "cenaBanho" });

        this.ferramentaAtiva = null;
        this.acumuladorAgua = 0;
        this.tempoSecando = 0;
        this.quantidadeEspuma = 0;
        this.limiteMovimento = 30;
        this.ultimoX = 0;
        this.ultimoY = 0;
        this.estadoCachorro = cachorrosBase[0]?.estado || "sujo";
        this.gerenciadorCachorros = null;
        this.cachorro = null;
    }

    create() {
        if (!this.scene.isActive("HUD")) {
            this.scene.launch("HUD");
        } else if (this.scene.isSleeping("HUD")) {
            this.scene.wake("HUD");
        }
        this.scene.bringToTop("HUD");

        const posicao = (this.scale.width - this.scale.width * 0.2) / 2;
        const escalaBase = Math.min(this.scale.width - this.scale.width * 0.2, this.scale.height) * 0.0005;

        // Reset geral
        this.ferramentaAtiva = null;
        this.acumuladorAgua = 0;
        this.tempoSecando = 0;
        this.quantidadeEspuma = 0;
        this.estadoCachorro = cachorrosBase[0]?.estado || "sujo";
        cachorrosBase[0].estado = this.estadoCachorro;

        // Fundo
        gameState.banheiro = this.add.image(posicao, this.scale.height / 2, "bgBanheiro")
            .setDisplaySize(this.scale.width - this.scale.width * 0.2, this.scale.height);

        // Cachorro dentro de um container
        this.gerenciadorCachorros = new GerenciadorCachorros(this);
        this.cachorro = this.gerenciadorCachorros.criarCachorro(0, 0, cachorrosBase[0]);

        const elementosContainer = [this.cachorro.sprite];

        // Pulgas só aparecem se gameState.pulga === true
        if (gameState.pulga === true) {
            this.pulgas = this.add.image(0, 0, "pulgas").setScale(this.scale.height * 0.0002);
            elementosContainer.push(this.pulgas);
        }

        this.containerCachorro = this.add.container(posicao, this.scale.height / 2, elementosContainer);
        this.containerCachorro.setScale(escalaBase);

        this.physics.add.existing(this.cachorro.sprite);
        this.cachorro.sprite.body.setAllowGravity(false);
        this.cachorro.sprite.body.immovable = true;

        gameState.cachorro = this.cachorro.sprite;

        this.atualizarEstadoCachorroAnimacao();

        // Ferramentas
        this.posicaoInicialSabao = { x: posicao - posicao * 0.4, y: this.scale.height / 2 + (this.scale.height / 2) * 0.8 };
        this.posicaoInicialChuveiro = { x: posicao, y: this.scale.height / 2 + (this.scale.height / 2) * 0.8 };
        this.posicaoInicialToalha = { x: posicao + posicao * 0.4, y: this.scale.height / 2 + (this.scale.height / 2) * 0.8 };

        gameState.sabao = this.add.follower(new Phaser.Curves.Path(posicao, this.scale.height / 2), this.posicaoInicialSabao.x, this.posicaoInicialSabao.y, "sabao")
            .setInteractive({ useHandCursor: true }).setDepth(3).setScale(0.12);
        gameState.sabao.escalaOriginal = 0.12;

        gameState.chuveiro = this.add.follower(new Phaser.Curves.Path(400, 500), this.posicaoInicialChuveiro.x, this.posicaoInicialChuveiro.y, "chuveiro")
        .setInteractive({ useHandCursor: true }).setDepth(3).setScale(0.25);
        gameState.chuveiro.escalaOriginal = 0.25;

        gameState.toalha = this.add.follower(new Phaser.Curves.Path(400, 500), this.posicaoInicialToalha.x, this.posicaoInicialToalha.y, "toalha")
        .setInteractive({ useHandCursor: true }).setDepth(3).setScale(0.2);
        gameState.toalha.escalaOriginal = 0.2;

        this.physics.add.existing(gameState.sabao);
        this.physics.add.existing(gameState.chuveiro);
        this.physics.add.existing(gameState.toalha);

        gameState.bolhas = this.physics.add.group({ maxSize: 80 });
        gameState.gotas = this.physics.add.group({ maxSize: 160 });

        this.physics.add.overlap(gameState.gotas, gameState.bolhas, (gota, bolha) => {
            this.reciclarObjeto(bolha);
            if (this.ferramentaAtiva === "chuveiro") {
                this.quantidadeEspuma = Math.max(0, this.quantidadeEspuma - 1);
            }
        });

        gameState.sabao.on("pointerdown", () => this.alternarFerramenta("sabao"));
        gameState.chuveiro.on("pointerdown", () => this.alternarFerramenta("chuveiro"));
        gameState.toalha.on("pointerdown", () => this.alternarFerramenta("toalha"));

        this.scale.on("resize", (gameSize) => {
            const width = gameSize.width;
            const height = gameSize.height;
            const posicao = (width - width * 0.2) / 2;
            const escalaBase = Math.min(width - width * 0.2, height) * 0.0005;

            this.cameras.resize(width, height);
            gameState.banheiro.setDisplaySize(width - width * 0.2, height).setPosition(posicao, height / 2);
            this.containerCachorro.setPosition(posicao, height / 2).setScale(escalaBase);

            gameState.sabao.setPosition(posicao, height / 2);
            gameState.chuveiro.setPosition(posicao, height / 2);
            gameState.toalha.setPosition(posicao, height / 2);
        });
    }


    // --- EFEITOS VISUAIS (JUICE) ---
    mostrarTextoFlutuante(texto, x, y, cor = "#ffffff") {
        const txt = this.add.text(x, y, texto, {
            fontFamily: '"Press Start 2P"', 
            fontSize: "28px",               
            fill: cor,
            stroke: "#000000",
            strokeThickness: 5,
            align: "center"
        }).setOrigin(0.5).setDepth(10);

        this.tweens.add({
            targets: txt,
            y: y - 100, 
            alpha: 0,   
            duration: 3000, // <-- AUMENTADO PARA 3 SEGUNDOS
            ease: "Power1",
            onComplete: () => txt.destroy() 
        });
    }

    animarCachorro() {
        const target = this.cachorro?.sprite || gameState.cachorro;
        const escala = target?.escalaBase || 1;
        this.tweens.add({
            targets: target,
            scaleY: escala * 0.85, 
            scaleX: escala * 1.15, 
            duration: 150,
            yoyo: true, 
            ease: "Quad.easeInOut"
        });
    }

    atualizarEstadoCachorroAnimacao() {
        if (!this.cachorro) return;

        const estadoAnim = (this.estadoCachorro === "limpo")
            ? "limpo"
            : (this.estadoCachorro === "sujo")
                ? "sujo"
                : "ensaboado";

        this.cachorro.mudarEstado(estadoAnim);
        cachorrosBase[0].estado = this.estadoCachorro;
        gameState.cachorro = this.cachorro.sprite;
    }

    criarExplosaoBrilhos() {
        for (let i = 0; i < 25; i++) {
            const x = gameState.cachorro.x + Phaser.Math.Between(-150, 150);
            const y = gameState.cachorro.y + Phaser.Math.Between(-150, 150);
            const brilho = this.add.image(x, y, "bolhas").setScale(0).setDepth(5);
            brilho.setTint(0xffd700); 

            this.tweens.add({
                targets: brilho,
                scale: Phaser.Math.FloatBetween(0.05, 0.15),
                y: y - Phaser.Math.Between(50, 150),
                alpha: 0,
                duration: Phaser.Math.Between(1000, 2000),
                ease: "Sine.easeOut",
                onComplete: () => brilho.destroy()
            });
        }
    }

    criarAnimacoes() {
        if (!this.anims.exists("aguaAnim")) {
            this.anims.create({ key: "aguaAnim", frames: this.anims.generateFrameNumbers("agua", { start: 0, end: 5 }), frameRate: 8, repeat: -1 });
        }
    }

    alternarFerramenta(nomeFerramenta) {
        if (nomeFerramenta === "chuveiro" && this.estadoCachorro !== "ensaboado" && this.estadoCachorro !== "lavando") {
            this.mostrarTextoFlutuante("Ensaboe\nprimeiro!", gameState.chuveiro.x, gameState.chuveiro.y - 60, "#ff4444");
            this.retornarPosicaoInicial(nomeFerramenta);
            return;
        }
        if (nomeFerramenta === "toalha" && this.estadoCachorro !== "molhado") {
            this.mostrarTextoFlutuante("Use o\nchuveiro!", gameState.toalha.x, gameState.toalha.y - 60, "#ff4444");
            this.retornarPosicaoInicial(nomeFerramenta);
            return;
        }

        if (this.ferramentaAtiva === nomeFerramenta) {
            this.animarFerramenta(this.pegarFerramenta(nomeFerramenta), false);
            this.retornarPosicaoInicial(nomeFerramenta);
            this.ferramentaAtiva = null;
            return;
        }
        
        if (this.ferramentaAtiva) {
            this.animarFerramenta(this.pegarFerramenta(this.ferramentaAtiva), false);
            this.retornarPosicaoInicial(this.ferramentaAtiva);
        }
        
        this.ferramentaAtiva = nomeFerramenta;
        this.animarFerramenta(this.pegarFerramenta(nomeFerramenta), true);
    }

    animarFerramenta(ferramenta, ativa) {
        if (!ferramenta) return;
        const escalaAlvo = ativa ? ferramenta.escalaOriginal * 1.1 : ferramenta.escalaOriginal;
        this.tweens.add({
            targets: ferramenta,
            scale: escalaAlvo,
            duration: 150,
            ease: "Back.easeOut"
        });
    }

    retornarPosicaoInicial(nomeFerramenta) {
        const ferramenta = this.pegarFerramenta(nomeFerramenta);
        const posicaoInicial = this.pegarPosicaoInicial(nomeFerramenta);
        if (!ferramenta || !posicaoInicial) return;

        if (ferramenta.stopFollow) ferramenta.stopFollow();
        const caminho = new Phaser.Curves.Path(ferramenta.x, ferramenta.y);
        caminho.lineTo(posicaoInicial.x, posicaoInicial.y);
        ferramenta.setPath(caminho);
        ferramenta.startFollow({ duration: 250, repeat: 0 });
    }

    pegarFerramenta(nomeFerramenta) {
        if (nomeFerramenta === "sabao") return gameState.sabao;
        if (nomeFerramenta === "chuveiro") return gameState.chuveiro;
        if (nomeFerramenta === "toalha") return gameState.toalha;
        return null;
    }

    pegarPosicaoInicial(nomeFerramenta) {
        if (nomeFerramenta === "sabao") return this.posicaoInicialSabao;
        if (nomeFerramenta === "chuveiro") return this.posicaoInicialChuveiro;
        if (nomeFerramenta === "toalha") return this.posicaoInicialToalha;
        return null;
    }

    update(tempo, delta) {
        this.atualizarSabao();
        this.atualizarChuveiro(delta);
        this.atualizarToalha();
        this.limparGotas();

        if (this.estadoCachorro === "sujo" && this.quantidadeEspuma >= 50) {
            this.estadoCachorro = "ensaboado";
            this.atualizarEstadoCachorroAnimacao();
            this.cameras.main.flash(200, 255, 255, 255); 
            this.animarCachorro(); 
            this.mostrarTextoFlutuante("Pronto!\nUse o chuveiro.", gameState.cachorro.x, gameState.cachorro.y - 150, "#88ff88");
            
            this.animarFerramenta(gameState.sabao, false);
            this.retornarPosicaoInicial("sabao");
            this.ferramentaAtiva = null; 
        }

        if (this.estadoCachorro === "lavando" && this.quantidadeEspuma <= 0) {
            this.estadoCachorro = "molhado";
            this.atualizarEstadoCachorroAnimacao();
            
            gameState.bolhas.children.iterate((bolha) => {
                if (bolha && bolha.active) this.reciclarObjeto(bolha);
            });

            this.animarCachorro(); 

            this.mostrarTextoFlutuante("Agora use\na toalha!", gameState.cachorro.x, gameState.cachorro.y - 150, "#88ff88");
            
            this.animarFerramenta(gameState.chuveiro, false);
            this.retornarPosicaoInicial("chuveiro");
            this.ferramentaAtiva = null;
        }
    }

    atualizarSabao() {
        if (this.ferramentaAtiva !== "sabao") return;

        this.ultimoX = gameState.sabao.x;
        this.ultimoY = gameState.sabao.y;

        gameState.sabao.x = this.input.activePointer.x;
        gameState.sabao.y = this.input.activePointer.y;
        gameState.sabao.body.reset(this.input.activePointer.x, this.input.activePointer.y);

        const moveu = Math.abs(gameState.sabao.x - this.ultimoX) > this.limiteMovimento || Math.abs(gameState.sabao.y - this.ultimoY) > this.limiteMovimento;
        const estaNoCachorro = this.physics.overlap(gameState.sabao, gameState.cachorro);

        if (estaNoCachorro && this.estadoCachorro === "sujo" && this.quantidadeEspuma < 50 && moveu) {
            this.criarBolha();
        }
    }

    atualizarChuveiro(delta) {
        if (this.ferramentaAtiva !== "chuveiro") {
            this.acumuladorAgua = 0;
            return;
        }

        gameState.chuveiro.x = this.input.activePointer.x;
        gameState.chuveiro.y = this.input.activePointer.y;
        gameState.chuveiro.body.reset(this.input.activePointer.x, this.input.activePointer.y);

        const estaNoCachorro = this.physics.overlap(gameState.chuveiro, gameState.cachorro);

        if (estaNoCachorro && this.estadoCachorro === "ensaboado") {
            this.estadoCachorro = "lavando";
            cachorrosBase[0].estado = "lavando";
        }

        if (this.estadoCachorro === "lavando" || this.estadoCachorro === "ensaboado") {
            this.acumuladorAgua += delta;
            if (this.acumuladorAgua >= 70) {
                this.acumuladorAgua = 0;
                this.criarGota();
            }
        }
    }

    atualizarToalha() {
        if (this.ferramentaAtiva !== "toalha") {
            this.tempoSecando = 0;
            return;
        }

        gameState.toalha.x = this.input.activePointer.x;
        gameState.toalha.y = this.input.activePointer.y;
        gameState.toalha.body.reset(this.input.activePointer.x, this.input.activePointer.y);

        if (this.estadoCachorro !== "molhado") return;

        const estaNoCachorro = this.physics.overlap(gameState.toalha, gameState.cachorro);

        if (estaNoCachorro) {
            this.tempoSecando += 1;

            if (this.tempoSecando >= 90) {
                // VITÓRIA!
                this.estadoCachorro = "limpo";
                this.atualizarEstadoCachorroAnimacao();
                
                this.animarCachorro(); 
                this.criarExplosaoBrilhos(); 

                gameState.barras.limpeza = 0; 
                
                if (!gameState.recompensas.banho) { 
                    gameState.cobasiCoins += 20; 
                    gameState.recompensas.banho = true; 
                    this.mostrarTextoFlutuante("+20 Moedas!", gameState.cachorro.x, gameState.cachorro.y - 100, "#ffd700");
                }

                gameState.sabao.disableInteractive();
                gameState.chuveiro.disableInteractive();
                gameState.toalha.disableInteractive();
                
                this.animarFerramenta(gameState.toalha, false);
                this.retornarPosicaoInicial("toalha");
                this.ferramentaAtiva = null;
                this.tempoSecando = 0;
            }
        } else {
            this.tempoSecando = 0; 
        }
    }

    criarBolha() {
        const variacaoX = Phaser.Math.RND.between(-30, 30);
        const variacaoY = Phaser.Math.RND.between(-30, 30);
        const x = gameState.sabao.x + variacaoX;
        const y = gameState.sabao.y + variacaoY;
        
        const bolha = gameState.bolhas.get(x, y, "bolhas");

        if (!bolha) return;

        bolha.setActive(true).setVisible(true);
        bolha.setScale(0.13);
        bolha.clearTint(); 
        bolha.body.enable = true;
        bolha.body.reset(x, y);
        bolha.body.setSize(bolha.displayWidth, bolha.displayHeight, true);
        
        this.quantidadeEspuma += 1;
    }

    criarGota() {
        const x = gameState.chuveiro.x;
        const y = gameState.chuveiro.y + gameState.chuveiro.displayHeight / 2;
        const gota = gameState.gotas.get(x, y, "agua");

        if (!gota) return;

        gota.setActive(true).setVisible(true);
        gota.body.enable = true;
        gota.body.reset(x, y);
        gota.setScale(0.1);
        gota.play("aguaAnim", true);
        gota.body.setSize(gota.displayWidth, gota.displayHeight, true);
        gota.body.setVelocityY(200); 
    }

    limparGotas() {
        gameState.gotas.children.iterate((gota) => {
            if (!gota || !gota.active) return;
            if (gota.y > this.scale.height + 120) {
                this.reciclarObjeto(gota);
            }
        });
    }

    reciclarObjeto(objeto) {
        if (!objeto) return;
        if (objeto.body) {
            objeto.body.stop();
            objeto.body.enable = false;
        }
        objeto.setActive(false).setVisible(false);
        objeto.setPosition(-200, -200); 
    }
}