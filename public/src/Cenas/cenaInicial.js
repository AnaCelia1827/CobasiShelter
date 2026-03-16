// Importa o objeto global gameState do arquivo principal
import { gameState } from "../main.js";

// Define a cena "cenaInicial", que é a tela principal do jogo
export class cenaInicial extends Phaser.Scene {
    constructor() {
        super({ key: "cenaInicial" });
        this.transicao = false; // Flag para evitar múltiplas transições de cena
    }

    create() {
        // Para garantir que a HUD não fique ativa ao iniciar
        this.scene.stop("cenaHUD");
        this.transicao = false;

        // Música de fundo: cria e inicia se ainda não estiver tocando
        if (!gameState.musica) {
            gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        }
        if (!gameState.musica.isPlaying) {
            gameState.musica.play();
        }

        // Fundo da cena inicial (responsivo)
        this.bg = this.add
            .image(this.scale.width / 2, this.scale.height / 2, "bgInical")
            .setDisplaySize(this.scale.width, this.scale.height);

        // Função utilitária para criar botões com troca de textura e animação de escala
        const criarBotao = (x, y, texturaNormal, texturaOver, texturaDown, escalaBase, escalaHover, escalaDown, callback) => {
            const botao = this.add.image(x, y, texturaNormal).setScale(escalaBase).setInteractive({ useHandCursor: true });

            botao.on("pointerover", () => {
                botao.setTexture(texturaOver);
                this.tweens.add({ targets: botao, scale: escalaHover, duration: 150, ease: "Power2" });
            });

            botao.on("pointerout", () => {
                botao.setTexture(texturaNormal);
                this.tweens.add({ targets: botao, scale: escalaBase, duration: 150, ease: "Power2" });
            });

            botao.on("pointerdown", () => {
                botao.setTexture(texturaDown);
                this.tweens.add({ targets: botao, scale: escalaDown, duration: 100, ease: "Power2" });
            });

            botao.on("pointerup", () => {
                botao.setTexture(texturaOver);
                this.tweens.add({ targets: botao, scale: escalaHover, duration: 100, ease: "Power2" });
                if (callback) callback();
            });

            return botao;
        };

        // Escalas adaptativas (baseadas no tamanho da tela)
        const escalaBase = Math.min(this.scale.width, this.scale.height) * 0.00008;
        const escalaHover = escalaBase * 1.2;
        const escalaDown = escalaBase * 0.9;

        // Botão Jogar
        this.botaoJogar = criarBotao(
            this.scale.width * 0.162, this.scale.height * 0.6,
            "botaoJogarNormal", "botaoJogarCrescendo", "botaoJogarPressionado",
            escalaBase, escalaHover, escalaDown,
            () => this.transitionTo("cenaTutorial")
        );

        // Botão Sair
        this.botaoSair = criarBotao(
            this.scale.width * 0.05, this.scale.height * 0.9,
            "botaoSairNormal", "botaoSairCrescendo", "botaoSairPressionado",
            escalaBase, escalaHover, escalaDown,
            () => this.game.destroy(true)
        );

        // Botão Configurações
        this.botaoConfig = criarBotao(
            this.scale.width * 0.28, this.scale.height * 0.9,
            "botaoConfiguracoesNormal", "botaoConfiguracoesCrescendo", "botaoConfiguracoesPressionado",
            escalaBase * 10, escalaHover * 10, escalaDown * 10, // Config maior
            () => {
                if (!this.scene.isActive("cenaConfiguracoes")) {
                    this.scene.launch("cenaConfiguracoes");
                }
            }
        );

        // Configuração da câmera (fade in inicial)
        this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
        this.cameras.main.fadeIn(200, 0, 0, 0);

        // Listener para redimensionamento da tela
        this.scale.on("resize", (gameSize) => {
            const width = gameSize.width;
            const height = gameSize.height;

            this.cameras.resize(width, height);
            this.bg.setDisplaySize(width, height).setPosition(width / 2, height / 2);

            // Reposiciona os botões proporcionalmente
            this.botaoJogar.setPosition(width * 0.15, height * 0.33);
            this.botaoSair.setPosition(width * 0.15, height * 0.5);
            this.botaoConfig.setPosition(width * 0.25, height * 0.5);
        });
    }

    // Função para transição entre cenas com efeito de fade
    transitionTo(sceneKey) {
        if (this.transicao) return;

        this.transicao = true;
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            if (gameState.musica?.isPlaying) {
                gameState.musica.stop();
            }
            this.scene.start(sceneKey);
        });
    }
}
