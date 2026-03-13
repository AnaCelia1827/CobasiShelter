// Importa o objeto global gameState do arquivo principal
import { gameState } from "../main.js";

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

        this.posicaoInicialSabao = { x: 600, y: 720 };
        this.posicaoInicialChuveiro = { x: 770, y: 750 };
        this.posicaoInicialToalha = { x: 940, y: 720 };
    }

    create() {
        if (!this.scene.isActive("cenaHUD")) {
            this.scene.launch("cenaHUD");
        } else if (this.scene.isSleeping("cenaHUD")) {
            this.scene.wake("cenaHUD");
        }
        this.scene.bringToTop("cenaHUD");

        this.ferramentaAtiva = null;
        this.acumuladorAgua = 0;
        this.tempoSecando = 0;
        this.quantidadeEspuma = 0;

        gameState.banheiro = this.add.image(this.scale.width / 2, this.scale.height / 2, "bgBanheiro")
            .setDisplaySize(this.scale.width, this.scale.height);

        gameState.cachorro = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, "dogSujo").setScale(0.5);
        gameState.cachorro.setImmovable(true);
        gameState.cachorro.body.allowGravity = false;

        this.criarAnimacoes();
        gameState.cachorro.play("dogSujoAnim");

        gameState.sabao = this.add.follower(new Phaser.Curves.Path(400, 500), this.posicaoInicialSabao.x, this.posicaoInicialSabao.y, "sabao")
            .setInteractive().setDepth(3).setScale(0.12);

        gameState.chuveiro = this.add.follower(new Phaser.Curves.Path(400, 500), this.posicaoInicialChuveiro.x, this.posicaoInicialChuveiro.y, "chuveiro")
            .setInteractive().setDepth(3).setScale(0.25);

        gameState.toalha = this.add.follower(new Phaser.Curves.Path(400, 500), this.posicaoInicialToalha.x, this.posicaoInicialToalha.y, "toalha")
            .setInteractive().setDepth(3).setScale(0.2);

        this.physics.add.existing(gameState.sabao);
        gameState.sabao.body.setSize(gameState.sabao.displayWidth, gameState.sabao.displayHeight);

        this.physics.add.existing(gameState.chuveiro);
        gameState.chuveiro.body.setSize(gameState.chuveiro.displayWidth, gameState.chuveiro.displayHeight);

        this.physics.add.existing(gameState.toalha);
        gameState.toalha.body.setSize(gameState.toalha.displayWidth, gameState.toalha.displayHeight);

        gameState.bolhas = this.physics.add.group({ maxSize: 80 });
        gameState.gotas = this.physics.add.group({ maxSize: 160 });

        this.physics.add.overlap(gameState.gotas, gameState.bolhas, (gota, bolha) => {
            this.reciclarObjeto(gota);
            this.reciclarObjeto(bolha);
        });

        gameState.sabao.on("pointerdown", () => this.alternarFerramenta("sabao"));
        gameState.chuveiro.on("pointerdown", () => this.alternarFerramenta("chuveiro"));
        gameState.toalha.on("pointerdown", () => this.alternarFerramenta("toalha"));
    }

    criarAnimacoes() {
        if (!this.anims.exists("dogSujoAnim")) {
            this.anims.create({
                key: "dogSujoAnim",
                frames: this.anims.generateFrameNumbers("dogSujo", { start: 0, end: 1 }),
                frameRate: 4,
                repeat: -1
            });
        }
        if (!this.anims.exists("aguaAnim")) {
            this.anims.create({
                key: "aguaAnim",
                frames: this.anims.generateFrameNumbers("agua", { start: 0, end: 5 }),
                frameRate: 8,
                repeat: -1
            });
        }
        if (!this.anims.exists("dogEspumaAnim")) {
            this.anims.create({
                key: "dogEspumaAnim",
                frames: this.anims.generateFrameNumbers("dogEspuma", { start: 0, end: 1 }),
                frameRate: 4,
                repeat: -1
            });
        }
        if (!this.anims.exists("dogLimpoAnim")) {
            this.anims.create({
                key: "dogLimpoAnim",
                frames: this.anims.generateFrameNumbers("dogLimpo", { start: 0, end: 1 }),
                frameRate: 4,
                repeat: -1
            });
        }
    }

    alternarFerramenta(nomeFerramenta) {
        if (this.ferramentaAtiva === nomeFerramenta) {
            this.retornarPosicaoInicial(nomeFerramenta);
            if (nomeFerramenta === "sabao" && this.quantidadeEspuma < 50) {
                this.quantidadeEspuma = 0;
            }
            this.ferramentaAtiva = null;
            return;
        }
        if (this.ferramentaAtiva) {
            this.retornarPosicaoInicial(this.ferramentaAtiva);
        }
        this.ferramentaAtiva = nomeFerramenta;
    }

    retornarPosicaoInicial(nomeFerramenta) {
        const ferramenta = this.pegarFerramenta(nomeFerramenta);
        const posicaoInicial = this.pegarPosicaoInicial(nomeFerramenta);
        if (!ferramenta || !posicaoInicial) return;

        if (ferramenta.stopFollow) {
            ferramenta.stopFollow();
        }

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

        if (this.quantidadeEspuma >= 50 && gameState.cachorro.texture.key !== "dogEspuma") {
            gameState.cachorro.setTexture("dogEspuma");
            gameState.cachorro.play("dogEspumaAnim");
            this.quantidadeEspuma = 0;
        }
    }

    atualizarSabao() {
        if (this.ferramentaAtiva !== "sabao") return;

        this.ultimoX = gameState.sabao.x;
        this.ultimoY = gameState.sabao.y;

        gameState.sabao.x = this.input.activePointer.x;
        gameState.sabao.y = this.input.activePointer.y;
        gameState.sabao.body.reset(this.input.activePointer.x, this.input.activePointer.y);

        const distX = Math.abs(gameState.sabao.x - gameState.cachorro.x);
        const distY = Math.abs(gameState.sabao.y - gameState.cachorro.y);

        const moveu =
            Math.abs(gameState.sabao.x - this.ultimoX) > this.limiteMovimento ||
            Math.abs(gameState.sabao.y - this.ultimoY) > this.limiteMovimento;

        if (distX < 200 && distY < 250 && this.quantidadeEspuma < 50 && moveu) {
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

        this.acumuladorAgua += delta;
        if (this.acumuladorAgua < 70) return;

        this.acumuladorAgua = 0;
        this.criarGota();
    }

    atualizarToalha() {
        if (this.ferramentaAtiva !== "toalha") {
            this.tempoSecando = 0;
            return;
        }

        gameState.toalha.x = this.input.activePointer.x;
        gameState.toalha.y = this.input.activePointer.y;
        gameState.toalha.body.reset(this.input.activePointer.x, this.input.activePointer.y);

        if (gameState.cachorro.texture.key !== "dogEspuma") {
            this.tempoSecando = 0;
            return;
        }

        const distX = Math.abs(gameState.toalha.x - gameState.cachorro.x);
        const distY = Math.abs(gameState.toalha.y - gameState.cachorro.y);

        if (distX < 200 && distY < 250) {
            this.tempoSecando += 1;
            if (this.tempoSecando >= 90) {
                gameState.cachorro.setTexture("dogLimpo");
                gameState.cachorro.play("dogLimpoAnim");

                gameState.barras.limpeza = Phaser.Math.Clamp(
                    gameState.barras.limpeza - 11, 0, 11
                );
                this.tempoSecando = 0;
            }
            return;
        }

        this.tempoSecando = 0;
    }

    criarBolha() {
        const x = Phaser.Math.RND.between(700, 830);
        const y = Phaser.Math.RND.between(280, 600);
        const bolha = gameState.bolhas.get(x, y, "bolhas");

        if (!bolha) return;

        bolha.setActive(true).setVisible(true);
        bolha.setScale(0.13);
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
        gota.body.setVelocityY(100);
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
