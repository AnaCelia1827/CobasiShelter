import { gameState } from "../main.js";

export class introScene extends Phaser.Scene {
    constructor() {
        super({ key: "introScene" });
        this.isTransitioning = false;
    }

    create() {
        this.scene.stop("hudScene");
        this.isTransitioning = false;

        if (!gameState.musica) {
            gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        }
        if (!gameState.musica.isPlaying) {
            gameState.musica.play();
        }

        this.add
            .image(this.scale.width / 2, this.scale.height / 2, "bg")
            .setDisplaySize(this.scale.width, this.scale.height);

        const hoverPressEffect = (target, scaleNormal, scaleHover) => {
            target.on("pointerover", () => {
                this.tweens.add({
                    targets: target,
                    scaleX: scaleHover,
                    scaleY: scaleHover,
                    duration: 200,
                    ease: "Power2"
                });
            });

            target.on("pointerdown", () => {
                this.tweens.add({
                    targets: target,
                    scaleX: 0.45,
                    scaleY: 0.45,
                    duration: 180,
                    ease: "Power2",
                    yoyo: true
                });
            });

            target.on("pointerout", () => {
                this.tweens.add({
                    targets: target,
                    scaleX: scaleNormal,
                    scaleY: scaleNormal,
                    duration: 200,
                    ease: "Power2"
                });
            });
        };

        const createButton = (y, texture) => {
            return this.add
                .image(this.scale.width / 6 + 20, y, texture)
                .setScale(0.5)
                .setInteractive({ useHandCursor: true });
        };

        const botaoJogar = createButton(380, "botaoJogar");
        const botaoTutorial = createButton(480, "botaoTutorial");
        const botaoSair = createButton(580, "botaoSair");
        const botaoConfiguracoes = createButton(680, "botaoConfiguracoes");

        this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
        this.cameras.main.fadeIn(200, 0, 0, 0);

        hoverPressEffect(botaoJogar, 0.5, 0.6);
        hoverPressEffect(botaoTutorial, 0.5, 0.6);
        hoverPressEffect(botaoSair, 0.5, 0.6);
        hoverPressEffect(botaoConfiguracoes, 0.5, 0.6);

        botaoJogar.on("pointerdown", () => this.transitionTo("bathScene"));
        botaoConfiguracoes.on("pointerdown", () => this.transitionTo("settingsScene"));
    }

    transitionTo(sceneKey) {
        if (this.isTransitioning) {
            return;
        }

        this.isTransitioning = true;
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            if (gameState.musica?.isPlaying) {
                gameState.musica.stop();
            }
            this.scene.start(sceneKey);
        });
    }
}
