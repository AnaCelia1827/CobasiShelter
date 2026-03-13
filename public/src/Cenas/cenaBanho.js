// Importa o objeto global gameState do arquivo principal
import { gameState } from "../main.js";

// Define a cena "cenaBanho" que representa o banho do cachorro
export class cenaBanho extends Phaser.Scene {
    constructor() {
        super({ key: "cenaBanho" });

        // Variáveis de controle
        this.ferramentaAtiva = null;      // Ferramenta atualmente selecionada (sabão, chuveiro ou toalha)
        this.acumuladorAgua = 0;          // Controla o tempo para gerar gotas de água
        this.tempoSecando = 0;            // Tempo acumulado para secar o cachorro
        this.quantidadeEspuma = 0;        // Quantidade de espuma gerada
        this.limiteMovimento = 30;        // Limite de movimento para gerar bolhas
        this.ultimoX = 0;                 // Última posição X do sabão
        this.ultimoY = 0;                 // Última posição Y do sabão

        // Posições iniciais das ferramentas
        this.posicaoInicialSabao = { x: 600, y: 720 };
        this.posicaoInicialChuveiro = { x: 770, y: 750 };
        this.posicaoInicialToalha = { x: 940, y: 720 };
    }

    create() {
        // Garante que a cena HUD esteja ativa
        if (!this.scene.isActive("cenaHUD")) {
            this.scene.launch("cenaHUD");
        } else if (this.scene.isSleeping("cenaHUD")) {
            this.scene.wake("cenaHUD");
        }
        this.scene.bringToTop("cenaHUD");

        // Reseta variáveis
        this.ferramentaAtiva = null;
        this.acumuladorAgua = 0;
        this.tempoSecando = 0;
        this.quantidadeEspuma = 0;

        // Fundo do banheiro
        gameState.banheiro = this.add
            .image(this.scale.width / 2, this.scale.height / 2, "bgBanheiro")
            .setDisplaySize(this.scale.width, this.scale.height);

        // Sprite do cachorro sujo
        gameState.cachorro = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, "dogSujo").setScale(0.5);
        gameState.cachorro.setImmovable(true);
        gameState.cachorro.body.allowGravity = false;

        // Cria animações e inicia a animação do cachorro sujo
        this.criarAnimacoes();
        gameState.cachorro.play("dogSujoAnim");

        // Cria ferramentas (sabão, chuveiro e toalha) como objetos interativos
        gameState.sabao = this.add
            .follower(new Phaser.Curves.Path(400, 500), this.posicaoInicialSabao.x, this.posicaoInicialSabao.y, "sabao")
            .setInteractive()
            .setDepth(3)
            .setScale(0.12);

        gameState.chuveiro = this.add
            .follower(new Phaser.Curves.Path(400, 500), this.posicaoInicialChuveiro.x, this.posicaoInicialChuveiro.y, "chuveiro")
            .setInteractive()
            .setDepth(3)
            .setScale(0.25);

        gameState.toalha = this.add
            .follower(new Phaser.Curves.Path(400, 500), this.posicaoInicialToalha.x, this.posicaoInicialToalha.y, "toalha")
            .setInteractive()
            .setDepth(3)
            .setScale(0.2);

        // Adiciona física às ferramentas
        this.physics.add.existing(gameState.sabao);
        gameState.sabao.body.setSize(gameState.sabao.displayWidth, gameState.sabao.displayHeight);

        this.physics.add.existing(gameState.chuveiro);
        gameState.chuveiro.body.setSize(gameState.chuveiro.displayWidth, gameState.chuveiro.displayHeight);

        this.physics.add.existing(gameState.toalha);
        gameState.toalha.body.setSize(gameState.toalha.displayWidth, gameState.toalha.displayHeight);

        // Grupos de bolhas e gotas
        gameState.bolhas = this.physics.add.group({ maxSize: 80 });
        gameState.gotas = this.physics.add.group({ maxSize: 160 });

        // Colisão entre gotas e bolhas (recicla objetos)
        this.physics.add.overlap(gameState.gotas, gameState.bolhas, (gota, bolha) => {
            this.reciclarObjeto(gota);
            this.reciclarObjeto(bolha);
        });

        // Eventos de clique nas ferramentas
        gameState.sabao.on("pointerdown", () => this.alternarFerramenta("sabao"));
        gameState.chuveiro.on("pointerdown", () => this.alternarFerramenta("chuveiro"));
        gameState.toalha.on("pointerdown", () => this.alternarFerramenta("toalha"));

        // Reseta variáveis ao encerrar a cena
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.ferramentaAtiva = null;
            this.acumuladorAgua = 0;
            this.tempoSecando = 0;
        });
    }

    // Cria animações do cachorro e da água
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

    // Alterna entre ferramentas
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

    // Retorna ferramenta para posição inicial
    retornarPosicaoInicial(nomeFerramenta) {
        const ferramenta = this.pegarFerramenta(nomeFerramenta);
        if (!ferramenta) return;

        const posicaoInicial = this.pegarPosicaoInicial(nomeFerramenta);
        if (!posicaoInicial) return;

        if (ferramenta.stopFollow) {
            ferramenta.stopFollow();
        }

        const caminho = new Phaser.Curves.Path(ferramenta.x, ferramenta.y);
        caminho.lineTo(posicaoInicial.x, posicaoInicial.y);
        ferramenta.setPath(caminho);
        ferramenta.startFollow({ duration: 250, repeat: 0 });
    }

    // Retorna referência da ferramenta
    pegarFerramenta(nomeFerramenta) {
        if (nomeFerramenta === "sabao") return gameState.sabao;
        if (nomeFerramenta === "chuveiro") return gameState.chuveiro;
        if (nomeFerramenta === "toalha") return gameState.toalha;
        return null;
    }

    // Retorna posição inicial da ferramenta
    pegarPosicaoInicial(nomeFerramenta) {
        if (nomeFerramenta === "sabao") return this.posicaoInicialSabao;
        if (nomeFerramenta === "chuveiro") return this.posicaoInicialChuveiro;
        if (nomeFerramenta === "toalha") return this.posicaoInicialToalha;
        return null;
    }

    // Atualiza lógica a cada frame
    update(tempo, delta) {
        this.atualizarSabao();
        this.atualizarChuveiro(delta);
        this.atualizarToalha();
        this.limparGotas();

                // Quando espuma suficiente é gerada, troca textura do cachorro
        if (this.quantidadeEspuma >= 50 && gameState.cachorro.texture.key !== "dogEspuma") {
            gameState.cachorro.setTexture("dogEspuma");   // Define textura de cachorro com espuma
            gameState.cachorro.play("dogEspumaAnim");     // Inicia animação de cachorro ensaboado
            this.quantidadeEspuma = 0;                    // Reseta contador de espuma
        }
    }

    // Atualiza lógica do sabão
    atualizarSabao() {
        if (this.ferramentaAtiva !== "sabao") return;

        // Guarda última posição
        this.ultimoX = gameState.sabao.x;
        this.ultimoY = gameState.sabao.y;

        // Move sabão para posição do ponteiro
        gameState.sabao.x = this.input.activePointer.x;
        gameState.sabao.y = this.input.activePointer.y;
        gameState.sabao.body.reset(this.input.activePointer.x, this.input.activePointer.y);

        // Calcula distância até o cachorro
        const distX = Math.abs(gameState.sabao.x - gameState.cachorro.x);
        const distY = Math.abs(gameState.sabao.y - gameState.cachorro.y);

        // Verifica se houve movimento suficiente
        const moveu =
            Math.abs(gameState.sabao.x - this.ultimoX) > this.limiteMovimento ||
            Math.abs(gameState.sabao.y - this.ultimoY) > this.limiteMovimento;

        // Se sabão está perto do cachorro e houve movimento, cria bolha
        if (distX < 200 && distY < 250 && this.quantidadeEspuma < 50 && moveu) {
            this.criarBolha();
        }
    }

    // Atualiza lógica do chuveiro
    atualizarChuveiro(delta) {
        if (this.ferramentaAtiva !== "chuveiro") {
            this.acumuladorAgua = 0;
            return;
        }

        // Move chuveiro para posição do ponteiro
        gameState.chuveiro.x = this.input.activePointer.x;
        gameState.chuveiro.y = this.input.activePointer.y;
        gameState.chuveiro.body.reset(this.input.activePointer.x, this.input.activePointer.y);

        // Acumula tempo para gerar gotas
        this.acumuladorAgua += delta;
        if (this.acumuladorAgua < 70) return;

        this.acumuladorAgua = 0;
        this.criarGota();
    }

    // Atualiza lógica da toalha
    atualizarToalha() {
        if (this.ferramentaAtiva !== "toalha") {
            this.tempoSecando = 0;
            return;
        }

        // Move toalha para posição do ponteiro
        gameState.toalha.x = this.input.activePointer.x;
        gameState.toalha.y = this.input.activePointer.y;
        gameState.toalha.body.reset(this.input.activePointer.x, this.input.activePointer.y);

        // Só funciona se o cachorro estiver com espuma
        if (gameState.cachorro.texture.key !== "dogEspuma") {
            this.tempoSecando = 0;
            return;
        }

        // Calcula distância até o cachorro
        const distX = Math.abs(gameState.toalha.x - gameState.cachorro.x);
        const distY = Math.abs(gameState.toalha.y - gameState.cachorro.y);

        // Se toalha está próxima, acumula tempo de secagem
        if (distX < 200 && distY < 250) {
            this.tempoSecando += 1;
            if (this.tempoSecando >= 90) {
                // Troca textura para cachorro limpo
                gameState.cachorro.setTexture("dogLimpo");
                gameState.cachorro.play("dogLimpoAnim");

                
                  gameState.barras.limpeza = Phaser.Math.Clamp(
              gameState.barras.limpeza -3, 0, 11
            );
               
                this.tempoSecando = 0;
            }
            return;
        }

        this.tempoSecando = 0;
    }

    // Cria bolha de sabão
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

    // Cria gota de água
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

    // Remove gotas que saíram da tela
    limparGotas() {
        gameState.gotas.children.iterate((gota) => {
            if (!gota || !gota.active) return;

            if (gota.y > this.scale.height + 120) {
                this.reciclarObjeto(gota);
            }
        });
    }

    // Recicla objetos (bolhas/gotas) para reaproveitar memória
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
