import { gameState } from "../main.js";

export class jogoAlimentacao extends Phaser.Scene {
    constructor() {
        super({ key: 'jogoAlimentacao' });
    }

    preload() {
        this.load.image('bgFoodScene', 'assets/kitchen.png');
        this.load.image('dogPlayer', 'assets/dogPlayer.png');
        this.load.image('foodNormal', 'assets/foodNormal.png');
        this.load.image('foodSuperPremium', 'assets/foodSuperPremium.png');
        this.load.image('foodChocolate', 'assets/foodChocolate.png');
        this.load.image('heart', 'assets/heart.png');
        this.load.image('retornoInicio', 'assets/retornoInicio.png');
    }

    create() {
        if (this.scene.isActive("cenaHUD")) {
            this.scene.sleep("cenaHUD");
        }

        // Botão voltar
        this.botaoVoltar = this.add.text(60, 50, "←", {
            fontFamily: "Arial",
            fontSize: "52px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(100).setInteractive({ useHandCursor: true });

        this.botaoVoltar.on("pointerover", () => this.botaoVoltar.setStyle({ color: "#ffdd00" }));
        this.botaoVoltar.on("pointerout",  () => this.botaoVoltar.setStyle({ color: "#ffffff" }));
        this.botaoVoltar.on("pointerdown", () => {
            if (this.scene.isSleeping("cenaHUD")) { this.scene.wake("cenaHUD"); }
            this.scene.start("cenaComida");
        });

        this.larguraTela = this.scale.width;
        this.alturaTela = this.scale.height;
        this.chaoY = this.alturaTela - 90;

        this.pontuacao = 0;
        this.vidas = 3;
        this.vidasMaximas = 3;
        this.velocidadeQueda = 220;
        this.intervaloSpawn = 1200;
        this.intervaloMinimoSpawn = 420;
        this.partidaEncerrada = false;

        this.fundo = this.add.image(this.larguraTela / 2, this.alturaTela / 2, 'bgFoodScene')
            .setDisplaySize(this.larguraTela, this.alturaTela)
            .setDepth(-1);

        this.jogador = this.physics.add.sprite(this.larguraTela / 2, this.chaoY, 'dogPlayer');
        this.jogador.setCollideWorldBounds(true);
        this.jogador.body.allowGravity = false;
        this.jogador.setScale(0.1);
        this.velocidadeJogador = 560;

        this.physics.world.setBounds(0, 0, this.larguraTela, this.alturaTela);

        this.itensComida = this.physics.add.group();
        this.physics.add.overlap(this.jogador, this.itensComida, this.coletarItem, null, this);

        this.textoPontuacao = this.add.text(20, 20, 'Pontuacao: 0', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#1f1f1f'
        }).setDepth(10);

        this.iconesVida = [];
        for (let i = 0; i < this.vidasMaximas; i++) {
            const coracao = this.add.image(this.larguraTela - 40 - (i * 45), 35, 'heart')
                .setScale(0.15)
                .setDepth(10);
            this.iconesVida.push(coracao);
        }
        this.atualizarHUDVidas();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.teclaA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.teclaD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.criarEventoSpawn();

        this.eventoDificuldade = this.time.addEvent({
            delay: 8000,
            loop: true,
            callback: () => {
                if (this.partidaEncerrada) return;
                this.velocidadeQueda = Math.min(this.velocidadeQueda + 30, 700);
                this.intervaloSpawn = Math.max(this.intervaloSpawn - 90, this.intervaloMinimoSpawn);
                this.criarEventoSpawn();
            }
        });

        // >>> Listener de resize <<<
        this.scale.on("resize", (gameSize) => {
            this.larguraTela = gameSize.width;
            this.alturaTela = gameSize.height;
            this.chaoY = this.alturaTela - 90;

            this.cameras.resize(this.larguraTela, this.alturaTela);

            this.fundo.setDisplaySize(this.larguraTela, this.alturaTela).setPosition(this.larguraTela / 2, this.alturaTela / 2);
            this.jogador.setPosition(this.larguraTela / 2, this.chaoY);
            this.textoPontuacao.setPosition(20, 20);

            this.iconesVida.forEach((icone, i) => {
                icone.setPosition(this.larguraTela - 40 - (i * 45), 35);
            });

            this.botaoVoltar.setPosition(60, 50);
            this.physics.world.setBounds(0, 0, this.larguraTela, this.alturaTela);
        });
    }

    update() {
        if (this.partidaEncerrada) return;

        this.jogador.y = this.chaoY;
        this.jogador.body.velocity.y = 0;

        const indoEsquerda = this.cursors.left.isDown || this.teclaA.isDown;
        const indoDireita = this.cursors.right.isDown || this.teclaD.isDown;

        if (indoEsquerda) {
            this.jogador.setVelocityX(-this.velocidadeJogador);
            this.jogador.setFlipX(true);
        } else if (indoDireita) {
            this.jogador.setVelocityX(this.velocidadeJogador);
            this.jogador.setFlipX(false);
        } else {
            this.jogador.setVelocityX(0);
        }

        this.itensComida.getChildren().forEach((item) => {
            if (item.y > this.alturaTela + item.displayHeight) {
                this.tratarItemPerdido(item);
            }
        });
    }

    criarEventoSpawn() {
        if (this.eventoSpawn) {
            this.eventoSpawn.remove(false);
        }
        this.eventoSpawn = this.time.addEvent({
            delay: this.intervaloSpawn,
            loop: true,
            callback: this.spawnarItem,
            callbackScope: this
        });
    }

    spawnarItem() {
        if (this.partidaEncerrada) return;

        const tipoSorteado = this.sortearTipoItem();
        const x = Phaser.Math.Between(40, this.larguraTela - 40);
        const item = this.itensComida.create(x, -40, tipoSorteado.key);

        item.body.allowGravity = false;
        item.setVelocityY(this.velocidadeQueda + Phaser.Math.Between(-25, 25));
        item.setData('tipo', tipoSorteado.tipo);
        item.setData('pontos', tipoSorteado.pontos);
        item.setData('penalidade', tipoSorteado.penalidade);
        item.setData('dano', tipoSorteado.dano);
        item.setData('cura', tipoSorteado.cura);

        if (tipoSorteado.tipo === 'superPremium') {
            item.setScale(0.13);
        } else if (tipoSorteado.tipo === 'chocolate') {
            item.setScale(0.19);
        } else {
            item.setScale(0.18);
        }
    }

    sortearTipoItem() {
        const chance = Phaser.Math.Between(1, 100);
        if (chance <= 70) {
            return { tipo: 'normal', key: 'foodNormal', pontos: 10, penalidade: 5, dano: 0, cura: 0 };
        }
        if (chance <= 92) {
            return { tipo: 'chocolate', key: 'foodChocolate', pontos: 0, penalidade: 0, dano: 1, cura: 0 };
        }
        return { tipo: 'superPremium', key: 'foodSuperPremium', pontos: 25, penalidade: 5, dano: 0, cura: 1 };
    }

        coletarItem(jogador, item) {
        if (this.partidaEncerrada) return;

        this.pontuacao += item.getData('pontos');

        const dano = item.getData('dano');
        if (dano > 0) this.alterarVidas(-dano);

        const cura = item.getData('cura');
        if (cura > 0) this.alterarVidas(cura);

        this.atualizarHUDPontuacao();
        item.destroy();

        // ✅ Verificação de vitória
        if (this.pontuacao >= 150) {
            // Atualiza barra de comida no gameState
            gameState.barras.comida = Phaser.Math.Clamp(
                gameState.barras.comida - 11, 0, 11
            );
            this.partidaEncerrada = true;
            this.scene.start('cenaComida'); // Volta para cena de comida
        }
    }

    // Trata item perdido (quando cai fora da tela)
    tratarItemPerdido(item) {
        const penalidade = item.getData('penalidade');
        if (penalidade > 0) {
            this.pontuacao = Math.max(0, this.pontuacao - penalidade);
            this.atualizarHUDPontuacao();
        }
        item.destroy();
    }

    // Altera vidas do jogador (cura ou dano)
    alterarVidas(valor) {
        this.vidas = Phaser.Math.Clamp(this.vidas + valor, 0, this.vidasMaximas);
        this.atualizarHUDVidas();

        if (this.vidas <= 0) {
            this.encerrarPartida(); // Se vidas acabarem → game over
        }
    }

    // Atualiza HUD de pontuação
    atualizarHUDPontuacao() {
        this.textoPontuacao.setText('Pontuacao: ' + this.pontuacao);
    }

    // Atualiza HUD de vidas (mostra corações ativos)
    atualizarHUDVidas() {
        this.iconesVida.forEach((icone, index) => {
            icone.setVisible(index < this.vidas);
        });
    }

    // Encerramento da partida (Game Over)
    encerrarPartida() {
        if (this.partidaEncerrada) {
            return;
        }

        this.partidaEncerrada = true;
        this.jogador.setVelocityX(0);

        // Remove eventos ativos
        if (this.eventoSpawn) {
            this.eventoSpawn.remove(false);
        }
        if (this.eventoDificuldade) {
            this.eventoDificuldade.remove(false);
        }

        // Limpa itens da tela
        this.itensComida.clear(true, true);

        // Tela de Game Over
        this.add.rectangle(this.larguraTela / 2, this.alturaTela / 2, this.larguraTela, this.alturaTela, 0x000000, 0.55)
            .setDepth(20);

        this.add.text(this.larguraTela / 2, this.alturaTela / 2 - 60, 'GAME OVER', {
            fontFamily: 'Arial',
            fontSize: '64px',
            color: '#ffffff'
        }).setOrigin(0.5).setDepth(21);

        this.add.text(this.larguraTela / 2, this.alturaTela / 2, 'Pontuacao final: ' + this.pontuacao, {
            fontFamily: 'Arial',
            fontSize: '30px',
            color: '#ffffff'
        }).setOrigin(0.5).setDepth(21);

        this.add.text(this.larguraTela / 2, this.alturaTela / 2 + 55, 'Pressione ESPACO para reiniciar', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5).setDepth(21);

        // Reinicia partida ao pressionar espaço
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.restart();
        });
    }
}
