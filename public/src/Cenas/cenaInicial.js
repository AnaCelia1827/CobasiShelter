import { gameState } from "../main.js";

export class cenaInicial extends Phaser.Scene {
    constructor() {
        super({ key: "cenaInicial" });
        this.transicao = false;
    }

    create() {
        this.scene.stop("cenaHUD");
        this.transicao = false;

        if (!gameState.musica) {
            gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        }
        if (!gameState.musica.isPlaying) {
            gameState.musica.play();
        }

        this.add
            .image(this.scale.width / 2, this.scale.height / 2, "bg")
            .setDisplaySize(this.scale.width, this.scale.height);

        const passarPressionarEfeito = (alvo, escalaNormal, escalaPassar) => {
            alvo.on("pointerover", () => {
                this.tweens.add({
                    targets: alvo,
                    scaleX: escalaPassar,
                    scaleY: escalaPassar,
                    duration: 200,
                    ease: "Power2"
                });
            });

            alvo.on("pointerdown", () => {
                this.tweens.add({
                    targets: alvo,
                    scaleX: 0.45,
                    scaleY: 0.45,
                    duration: 180,
                    ease: "Power2",
                    yoyo: true
                });
            });

            alvo.on("pointerout", () => {
                this.tweens.add({
                    targets: alvo,
                    scaleX: escalaNormal,
                    scaleY: escalaNormal,
                    duration: 200,
                    ease: "Power2"
                });
            });
        };

        const criarBotao = (y, texture) => {
            return this.add
                .image(this.scale.width / 6 + 20, y, texture)
                .setScale(0.5)
                .setInteractive({ useHandCursor: true });
        };

        const botaoJogar = criarBotao(380, "botaoJogar");
        const botaoSair = criarBotao(580, "botaoSair");
        const botaoConfiguracoes = criarBotao(680, "botaoConfiguracoes");

        this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
        this.cameras.main.fadeIn(200, 0, 0, 0);

        passarPressionarEfeito(botaoJogar, 0.5, 0.6);
        passarPressionarEfeito(botaoSair, 0.5, 0.6);
        passarPressionarEfeito(botaoConfiguracoes, 0.5, 0.6);

        botaoJogar.on("pointerdown", () => this.transitionTo("cenaPrincipal"));
        botaoConfiguracoes.on("pointerdown", () => this.transitionTo("cenaConfiguracoes"));
    }

    transitionTo(sceneKey) {
        if (this.transicao) {
            return;
        }

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
