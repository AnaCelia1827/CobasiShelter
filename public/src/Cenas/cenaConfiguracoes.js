import { gameState } from "../main.js";

export class cenaConfiguracoes extends Phaser.Scene {
    constructor() {
        super({ key: 'cenaConfiguracoes' });
    }

    create() {
        // Música de fundo
        if (!gameState.musica) {
            gameState.musica = this.sound.add('musica', { loop: true, volume: 0.5 });
        }
        if (!gameState.musica.isPlaying) {
            gameState.musica.play();
        }

        // Fundo da cena
        const fundo = this.add
            .image(this.scale.width / 2, this.scale.height / 2, "bgInical")
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        // Retângulo translúcido para escurecer o fundo
        const retanguloFundo = this.add.rectangle(
            window.innerWidth / 2, window.innerHeight / 2,
            window.innerWidth, window.innerHeight,
            0x000000
        ).setAlpha(0.5).setDepth(0);

        // Botão Jogar (apenas textura normal, sem interatividade)
        const botaoJogar = this.add.image(
            window.innerWidth / 7 + 28, window.innerHeight / 2+100,
            "botaoJogarNormal"
        ).setScale(0.085).setDepth(1);

        // Botão Sair (apenas textura normal, sem interatividade)
        const botaoSair = this.add.image(
            window.innerWidth / 7 - 150, window.innerHeight /2+300,
            "botaoSairNormal"
        ).setScale(0.065).setDepth(1);

        // Botão Configurações (apenas textura normal, sem interatividade)
        const botaoConfiguracoes = this.add.image(
            window.innerWidth / 7 + 200, window.innerHeight / 2 + 300,
            "botaoConfiguracoesNormal"
        ).setScale(0.85).setDepth(1);

        // Ícone de configurações
        const iconeConfiguracoes = this.add.image(1000, 300, "configuracoes").setScale(0.8).setDepth(1);

        // Botão de retorno ao menu inicial (este continua interativo)
        const botaoRetorno = this.add.image(200, 100, "retornoInicio").setScale(0.35).setInteractive({ useHandCursor: true }).setDepth(2);

        botaoRetorno.on('pointerover', () => {
            this.tweens.add({ targets: botaoRetorno, scale: 0.4, duration: 200, ease: 'Power2' });
        });

        botaoRetorno.on('pointerout', () => {
            this.tweens.add({ targets: botaoRetorno, scale: 0.35, duration: 200, ease: 'Power2' });
        });

        botaoRetorno.on('pointerdown', () => {
            this.cameras.main.fadeOut(200, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                gameState.musica.stop();
                this.scene.start('cenaInicial');
            });
        });

        // Alternar Música
        gameState.alternarMusica = this.criarAlternar(1020, 215, true,
            () => { gameState.musica.resume(); },
            () => { gameState.musica.pause(); }
        );

        // Alternar Som
        gameState.alternarSom = this.criarAlternar(1020, 265, true,
            () => { console.log('Som ligado (placeholder)'); },
            () => { console.log('Som desligado (placeholder)'); }
        );

        // Alternar Vibração
        gameState.alternarVibracao = this.criarAlternar(1020, 315, true,
            () => { console.log('Vibração ligada (placeholder)'); },
            () => { console.log('Vibração desligada (placeholder)'); }
        );

        // Configuração da câmera
        this.cameras.main.setBounds(0, 0, window.innerWidth, window.innerHeight);
        this.cameras.main.fadeIn(200, 0, 0, 0);
    }

    // Função para criar botões de alternar (liga/desliga)
    criarAlternar(x, y, estadoInicial, aoLigar, aoDesligar) {
        const botaoLigado = this.add.image(x, y, "botaoOn")
            .setScale(0.6)
            .setInteractive({ useHandCursor: true })
            .setDepth(3);

        const botaoDesligado = this.add.image(x, y, "botaoOff")
            .setScale(0.6)
            .setInteractive({ useHandCursor: true })
            .setDepth(3);

        let ligado = estadoInicial;
        botaoLigado.setVisible(ligado);
        botaoDesligado.setVisible(!ligado);

        botaoLigado.on('pointerdown', () => {
            ligado = false;
            botaoLigado.setVisible(false);
            botaoDesligado.setVisible(true);
            if (aoDesligar) aoDesligar();
        });

        botaoDesligado.on('pointerdown', () => {
            ligado = true;
            botaoDesligado.setVisible(false);
            botaoLigado.setVisible(true);
            if (aoLigar) aoLigar();
        });

        return { botaoLigado, botaoDesligado };
    }

    update() {}
}
