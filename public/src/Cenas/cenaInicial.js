import { gameState } from "../main.js";

export class cenaInicial extends Phaser.Scene {
    constructor() {
        super({ key: "cenaInicial" });
        this.transicao = false;
    }

    create() {
        // Para garantir que a HUD não fique ativa
        this.scene.stop("cenaHUD");
        this.transicao = false;

        // Música de fundo
        if (!gameState.musica) {
            gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        }
        if (!gameState.musica.isPlaying) {
            gameState.musica.play();
        }

        // Fundo da cena
        this.add
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

        // Botão Jogar
        criarBotao(
            window.innerWidth / 7 + 28, window.innerWidth / 3,
            "botaoJogarNormal", "botaoJogarCrescendo", "botaoJogarPressionado",
            0.085, 0.1, 0.08,
            () => this.transitionTo("cenaPrincipal")
        );

        // Botão Sair
        criarBotao(
            window.innerWidth / 7 - 150, window.innerWidth / 2 - 100,
            "botaoSairNormal", "botaoSairCrescendo", "botaoSairPressionado",
            0.065, 0.08, 0.06,
            () => this.game.destroy(true)
        );

        // Botão Configurações 
        criarBotao(
            window.innerWidth / 7 + 200, window.innerWidth / 2 - 100,
            "botaoConfiguracoesNormal", "botaoConfiguracoesCrescendo", "botaoConfiguracoesPressionado",
            0.85, 0.95, 0.75,
            () => this.transitionTo("cenaConfiguracoes")
        );

        // Configuração da câmera
        this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
        this.cameras.main.fadeIn(200, 0, 0, 0);
    }

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
