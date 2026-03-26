// Importa o objeto global gameState do arquivo principal
import { gameState } from "../main.js";
import { cachorrosBase } from "../componentes/controleCachorro/cachorrosBase.js";
import { GerenciadorCachorros } from "../componentes/controleCachorro/gerenciadorCachorros.js";

export class cenaBanho extends Phaser.Scene {
    constructor() {
        super({ key: "cenaBanho" });

        // Variáveis de controle do banho
        this.ferramentaAtiva = null;
        this.acumuladorAgua = 0;
        this.tempoSecando = 0;
        this.quantidadeEspuma = 0;
        this.limiteMovimento = 30;
        this.ultimoX = 0;
        this.ultimoY = 0;
        
        this.estadoCachorro = "sujo"; 
        this.gerenciadorCachorros = null;
        this.cachorro = null;
    }

    create() {
        // ================= SETUP DO HUD =================
        if (!this.scene.isActive("HUD")) {
            this.scene.launch("HUD");
        } else if (this.scene.isSleeping("HUD")) {
            this.scene.wake("HUD");
        }
        this.scene.bringToTop("HUD");
        
        // ================= RESET GERAL =================
        this.ferramentaAtiva = null;
        this.acumuladorAgua = 0;
        this.tempoSecando = 0;
        this.quantidadeEspuma = 0;

        const indiceAtivo = gameState.pets.cachorroHeroi ? 1 : 0;
        this.estadoCachorro = cachorrosBase[indiceAtivo]?.estado || "sujo";
        cachorrosBase[indiceAtivo].estado = this.estadoCachorro;

        // ================= CÁLCULO DE TELA =================
        const largura = this.scale.width;
        const altura = this.scale.height;

        // Lógica do HUD (Desconta 20% da largura)
        const areaX = largura - (largura * 0.2); 
        const areaY = altura;

        // ================= FUNDO =================
        gameState.banheiro = this.add.image(areaX / 2, areaY / 2, "bgBanheiro")
            .setDisplaySize(areaX, areaY)
            .setDepth(-1);

        // ================= CACHORRO E PULGAS =================
        this.gerenciadorCachorros = new GerenciadorCachorros(this);
        this.cachorro = this.gerenciadorCachorros.criarCachorro(0, 0, cachorrosBase[indiceAtivo]);

        const elementosContainer = [this.cachorro.sprite];

        if (!this.anims.exists("pulgaAnim")) {
            this.anims.create({
                key: "pulgaAnim",
                frames: this.anims.generateFrameNumbers("pulgas", { start: 0, end: 1 }), 
                frameRate: 1,  
                repeat: -1     
            });
        }

        this.pulgas = this.add.sprite(0, 0, "pulgas").setOrigin(0.5).setScale(areaY * 0.0015);
        this.pulgas.play("pulgaAnim");
        this.pulgas.setVisible(gameState.pulga); 
        elementosContainer.push(this.pulgas); 

        // Container agrupando cachorro (no Y 0.7)
        this.containerCachorro = this.add.container(
            areaX / 2, 
            areaY * 0.65, 
            elementosContainer
        );
        this.containerCachorro.setScale(areaY * 0.0006);

        // Física do Cachorro
        this.physics.add.existing(this.cachorro.sprite);
        this.cachorro.sprite.body.setAllowGravity(false);
        this.cachorro.sprite.body.immovable = true;
        gameState.cachorro = this.cachorro.sprite;

        this.atualizarEstadoCachorroAnimacao();
// ================= FERRAMENTAS =================
        const yFerramentas = areaY * 0.88;
        this.posicaoInicialSabao = { x: (areaX / 2) - (areaX * 0.25), y: yFerramentas };
        this.posicaoInicialChuveiro = { x: areaX / 2, y: yFerramentas };
        this.posicaoInicialToalha = { x: (areaX / 2) + (areaX * 0.25), y: yFerramentas };
        const escalaFerramentas = areaY * 0.0005;

        // Sabão
        gameState.sabao = this.add.follower(new Phaser.Curves.Path(0, 0), this.posicaoInicialSabao.x, this.posicaoInicialSabao.y, "sabao")
            .setInteractive({ useHandCursor: true }).setDepth(3);
        gameState.sabao.escalaOriginal = escalaFerramentas * 0.4;
        gameState.sabao.setScale(gameState.sabao.escalaOriginal);

        // Chuveiro
        gameState.chuveiro = this.add.follower(new Phaser.Curves.Path(0, 0), this.posicaoInicialChuveiro.x, this.posicaoInicialChuveiro.y, "chuveiro")
            .setInteractive({ useHandCursor: true }).setDepth(3);
        gameState.chuveiro.escalaOriginal = escalaFerramentas * 0.6;
        gameState.chuveiro.setScale(gameState.chuveiro.escalaOriginal);

        // Toalha
        gameState.toalha = this.add.follower(new Phaser.Curves.Path(0, 0), this.posicaoInicialToalha.x, this.posicaoInicialToalha.y, "toalha")
            .setInteractive({ useHandCursor: true }).setDepth(3);
        gameState.toalha.escalaOriginal = escalaFerramentas * 0.6;
        gameState.toalha.setScale(gameState.toalha.escalaOriginal);

        // Adicionando física às ferramentas
        this.physics.add.existing(gameState.sabao);
        this.physics.add.existing(gameState.chuveiro);
        this.physics.add.existing(gameState.toalha);

        // --- AJUSTE DA HITBOX DA TOALHA ---
        const larguraHitbox = gameState.toalha.width * 0.6;
        const alturaHitbox = gameState.toalha.height * 0.6;
        gameState.toalha.body.setSize(larguraHitbox, alturaHitbox);
        gameState.toalha.body.setOffset(
            (gameState.toalha.width - larguraHitbox) / 2, 
            (gameState.toalha.height - alturaHitbox) / 2
        );

        // ================= FÍSICA E PARTÍCULAS (IMPORTANTE) =================
        // Se isso não for criado, as funções de criar bolhas/gotas vão quebrar o jogo
        gameState.bolhas = this.physics.add.group({ maxSize: 80 });
        gameState.gotas = this.physics.add.group({ maxSize: 160 });

        this.physics.add.overlap(gameState.gotas, gameState.bolhas, (gota, bolha) => {
            this.reciclarObjeto(bolha);
            if (this.ferramentaAtiva === "chuveiro") {
                this.quantidadeEspuma = Math.max(0, this.quantidadeEspuma - 1);
            }
        });

        // ================= EVENTOS DE CLIQUE DAS FERRAMENTAS =================
        // ISSO FAZ O JOGO REGISTRAR QUE VOCÊ CLICOU NELAS!
        gameState.sabao.on("pointerdown", () => this.alternarFerramenta("sabao"));
        gameState.chuveiro.on("pointerdown", () => this.alternarFerramenta("chuveiro"));
        gameState.toalha.on("pointerdown", () => this.alternarFerramenta("toalha"));

        this.criarAnimacoes();

        // ================= EVENTO DE RESIZE =================
        // Como o botão precisa manter a lógica no resize, adicione este listener
        const handleResizeBanho = (tamanhoTela) => {
            if (!this.scene.isActive()) return;

            const novaLargura = tamanhoTela.width;
            const novaAltura = tamanhoTela.height;
            const novaAreaX = novaLargura - (novaLargura * 0.2);
            const novaAreaY = novaAltura;

            if (gameState.banheiro) {
                gameState.banheiro.setPosition(novaAreaX / 2, novaAreaY / 2).setDisplaySize(novaAreaX, novaAreaY);
            }

            if (this.containerCachorro) {
                this.containerCachorro.setPosition(novaAreaX / 2, novaAreaY * 0.65);
                this.containerCachorro.setScale(novaAreaY * 0.0006);
            }

            const novoYFerramentas = novaAreaY * 0.88;
            this.posicaoInicialSabao = { x: (novaAreaX / 2) - (novaAreaX * 0.25), y: novoYFerramentas };
            this.posicaoInicialChuveiro = { x: novaAreaX / 2, y: novoYFerramentas };
            this.posicaoInicialToalha = { x: (novaAreaX / 2) + (novaAreaX * 0.25), y: novoYFerramentas };
            const novaEscalaFerramentas = novaAreaY * 0.0005;

            // Ajusta Sabão
            if (gameState.sabao) {
                gameState.sabao.escalaOriginal = novaEscalaFerramentas * 0.4;
                if (this.ferramentaAtiva === "sabao") {
                    gameState.sabao.setScale(gameState.sabao.escalaOriginal * 1.3);
                } else {
                    gameState.sabao.setPosition(this.posicaoInicialSabao.x, this.posicaoInicialSabao.y)
                                   .setScale(gameState.sabao.escalaOriginal);
                }
            }

            // Ajusta Chuveiro
            if (gameState.chuveiro) {
                gameState.chuveiro.escalaOriginal = novaEscalaFerramentas * 0.6;
                if (this.ferramentaAtiva === "chuveiro") {
                    gameState.chuveiro.setScale(gameState.chuveiro.escalaOriginal * 1.3);
                } else {
                    gameState.chuveiro.setPosition(this.posicaoInicialChuveiro.x, this.posicaoInicialChuveiro.y)
                                      .setScale(gameState.chuveiro.escalaOriginal);
                }
            }

            // Ajusta Toalha
            if (gameState.toalha) {
                gameState.toalha.escalaOriginal = novaEscalaFerramentas * 0.6;
                if (this.ferramentaAtiva === "toalha") {
                    gameState.toalha.setScale(gameState.toalha.escalaOriginal * 1.3);
                } else {
                    gameState.toalha.setPosition(this.posicaoInicialToalha.x, this.posicaoInicialToalha.y)
                                    .setScale(gameState.toalha.escalaOriginal);
                }
            }
        };

        this.scale.on("resize", handleResizeBanho);
        this.events.on('shutdown', () => {
            this.scale.off("resize", handleResizeBanho);
        });

        // ================= TELA DE INSTRUÇÕES =================
        if (!gameState.instrucoesBanhoVistas) {
            this.mostrarInstrucoes();
        }
    } // <-- Fim do create()=======================

    update(tempo, delta) {
        this.atualizarSabao();
        this.atualizarChuveiro(delta);
        this.atualizarToalha();
        this.limparGotas();

        if (gameState.trocar) {
            this.cachorro = this.gerenciadorCachorros.cachorroAtual;
            gameState.cachorro = this.cachorro.sprite;

            this.estadoCachorro = "sujo";
            this.cachorro.dados.estado = "sujo";
            this.quantidadeEspuma = 0;
            this.acumuladorAgua = 0;
            this.tempoSecando = 0;
            this.ferramentaAtiva = null;

            this.atualizarEstadoCachorroAnimacao();

            if (this.containerCachorro) {
                this.containerCachorro.removeAll(false);
                this.containerCachorro.add(this.cachorro.sprite);
                if (this.pulgas) this.containerCachorro.add(this.pulgas);
            }

            gameState.sabao.setInteractive({ useHandCursor: true });
            gameState.chuveiro.setInteractive({ useHandCursor: true });
            gameState.toalha.setInteractive({ useHandCursor: true });

            if (!this.cachorro.sprite.body) {
                this.physics.add.existing(this.cachorro.sprite);
            }
            this.cachorro.sprite.body.setAllowGravity(false);
            this.cachorro.sprite.body.immovable = true;

            gameState.trocar = false;
        }

        if (this.pulgas) {
            this.pulgas.setVisible(gameState.pulga);
        }

        if (this.estadoCachorro === "sujo" && this.quantidadeEspuma >= 50) {
            this.estadoCachorro = "ensaboado";
            this.atualizarEstadoCachorroAnimacao();
            this.cameras.main.flash(200, 255, 255, 255); 
            this.animarCachorro(); 
            this.mostrarTextoFlutuante("Pronto!\nUse o chuveiro.", this.containerCachorro.x, this.containerCachorro.y - 150, "#88ff88");
            
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
            this.mostrarTextoFlutuante("Agora use\na toalha!", this.containerCachorro.x, this.containerCachorro.y - 150, "#88ff88");
            
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
        const estaNoCachorro = Phaser.Math.Distance.Between(gameState.sabao.x, gameState.sabao.y, this.containerCachorro.x, this.containerCachorro.y) < 150;

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

        const estaNoCachorro = Phaser.Math.Distance.Between(gameState.chuveiro.x, gameState.chuveiro.y, this.containerCachorro.x, this.containerCachorro.y) < 150;

        if (estaNoCachorro && this.estadoCachorro === "ensaboado") {
            this.estadoCachorro = "lavando";
            this.cachorro.dados.estado = "lavando";
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

        const estaNoCachorro = Phaser.Math.Distance.Between(gameState.toalha.x, gameState.toalha.y, this.containerCachorro.x, this.containerCachorro.y) < 150;

        if (estaNoCachorro) {
            this.tempoSecando += 1;

            if (this.tempoSecando >= 90) {
                this.estadoCachorro = "limpo";
                this.atualizarEstadoCachorroAnimacao();
                this.animarCachorro(); 
                this.criarExplosaoBrilhos(); 

                gameState.barras.limpeza = 0; 
                
                if (!gameState.recompensas.banho) { 
                    gameState.cobasiCoins += 20; 
                    gameState.recompensas.banho = true; 
                    this.mostrarTextoFlutuante("+20 Moedas!", this.containerCachorro.x, this.containerCachorro.y - 100, "#ffd700");
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

   alternarFerramenta(ferramenta) {
    // Se clicar na mesma ferramenta, desativa
    if (this.ferramentaAtiva === ferramenta) {
        this.ferramentaAtiva = null;
    } else {
        this.ferramentaAtiva = ferramenta;
    }

    // Lista de todas as ferramentas para iterar
    const ferramentas = {
        sabao: gameState.sabao,
        chuveiro: gameState.chuveiro,
        toalha: gameState.toalha
    };

    // Lógica de Escala: Aumenta a ativa, volta as outras ao normal
    for (let nome in ferramentas) {
        const obj = ferramentas[nome];
        if (nome === this.ferramentaAtiva) {
            // Aumenta em 30% quando ativa (ajuste o 1.3 como preferir)
            obj.setScale(obj.escalaOriginal * 1.3);
        } else {
            // Volta ao tamanho original definido no create/resize
            obj.setScale(obj.escalaOriginal);
            
            // Retorna para a posição inicial se não estiver ativa
            if (nome === "sabao") obj.setPosition(this.posicaoInicialSabao.x, this.posicaoInicialSabao.y);
            if (nome === "chuveiro") obj.setPosition(this.posicaoInicialChuveiro.x, this.posicaoInicialChuveiro.y);
            if (nome === "toalha") obj.setPosition(this.posicaoInicialToalha.x, this.posicaoInicialToalha.y);
        }
    }
}
    criarBolha() {
        // Pega as coordenadas do sabão
        const x = gameState.sabao.x + Phaser.Math.Between(-30, 30);
        const y = gameState.sabao.y + Phaser.Math.Between(-30, 30);

        // Tenta pegar uma bolha do grupo de física que criamos
        const bolha = gameState.bolhas.get(x, y, "bolhas");

        if (!bolha) return; // Se já chegou no limite máximo de bolhas, ignora

        // Ativa a bolha na tela
        bolha.setActive(true).setVisible(true);
        bolha.body.enable = true;
        bolha.body.reset(x, y);
        
        // Dá um tamanho aleatório para ficar mais natural
        bolha.setScale(Phaser.Math.FloatBetween(0.05, 0.15));

        // Incrementa a barra de progresso do banho
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

    criarAnimacoes() {
        if (!this.anims.exists("aguaAnim")) {
            this.anims.create({ key: "aguaAnim", frames: this.anims.generateFrameNumbers("agua", { start: 0, end: 5 }), frameRate: 8, repeat: -1 });
        }
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
            duration: 3000, 
            ease: "Power1",
            onComplete: () => txt.destroy() 
        });
    }

    animarCachorro() {
        const target = this.cachorro?.sprite || gameState.cachorro;
        const escala = target?.escalaBase || target.scale;
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
        const estadoAnim = (this.estadoCachorro === "limpo") ? "limpo" : (this.estadoCachorro === "sujo") ? "sujo" : "ensaboado";
        this.cachorro.mudarEstado(estadoAnim);
        const dadosCachorro = cachorrosBase.find(c => c.id === this.cachorro.dados.id) || cachorrosBase[0];
        if (dadosCachorro) dadosCachorro.estado = this.estadoCachorro;
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
    
    mostrarInstrucoes() {
        this.scene.bringToTop();

        const centroX = this.scale.width / 2;
        const centroY = this.scale.height / 2;

        const fundoEscuro = this.add.rectangle(centroX, centroY, 8000, 8000, 0x000000, 0.7)
            .setDepth(100)
            .setInteractive();

        const telaInstrucao = this.add.image(centroX, centroY, "instrucaoBanho")
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
            
            gameState.instrucoesBanhoVistas = true; 
            
            this.scene.bringToTop("HUD");
        };

        fundoEscuro.on('pointerdown', fecharInstrucoes);
        telaInstrucao.on('pointerdown', fecharInstrucoes);
    }
}