import { Cachorro } from "../componentes/controleCachorro/cachorroAnimacao.js";

export class foodScene extends Phaser.Scene {
    constructor() {
        super({ key: "foodScene" });
        this.isTransitioning = false;
    }

    create() {
        this.isTransitioning = false;

        if (!this.scene.isActive("hudScene")) {
            this.scene.launch("hudScene");
        } else if (this.scene.isSleeping("hudScene")) {
            this.scene.wake("hudScene");
        }

        this.scene.bringToTop("hudScene");
        this.prewarmRacaoTextures();

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
                    scaleX: scaleNormal * 0.9,
                    scaleY: scaleNormal * 0.9,
                    duration: 150,
                    yoyo: true
                });
            });

            target.on("pointerout", () => {
                this.tweens.add({
                    targets: target,
                    scaleX: scaleNormal,
                    scaleY: scaleNormal,
                    duration: 180,
                    ease: "Power2"
                });
            });
        };

        this.add
            .image(this.scale.width / 2, this.scale.height / 2, "bgRacao")
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        const estante = this.add.image(300, 600, "estanteRacao").setScale(0.5).setInteractive({ useHandCursor: true });
        hoverPressEffect(estante, 0.5, 0.6);

        estante.on("pointerdown", () => {
            if (this.isTransitioning) {
                return;
            }

            this.isTransitioning = true;
            this.cameras.main.fadeOut(100, 0, 0, 0);
            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("jogoRacao");
            });
        });

        this.add.image(700, 750, "racaoVazia").setScale(0.2).setDepth(100);

        this.cachorro = new Cachorro(this, 920, 600);

        const bilhete = this.add.image(1350, 100, "mineFicha").setScale(0.1).setInteractive({ useHandCursor: true });
        hoverPressEffect(bilhete, 0.1, 0.13);

        bilhete.on("pointerdown", () => {
            if (this.scene.isActive("ficha")) {
                this.scene.stop("ficha");
                return;
            }

            this.scene.launch("ficha");
            this.scene.bringToTop("ficha");
            this.scene.bringToTop("hudScene");
        });

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            if (this.scene.isActive("ficha")) {
                this.scene.stop("ficha");
            }
        });
    }

    prewarmRacaoTextures() {
        if (this.registry.get("racao_textures_prewarmed")) {
            return;
        }

        // OTIMIZACAO: pre-aquece texturas da cena de racao para evitar travada no primeiro clique da prateleira.
        const warmupKeys = ["bgLimpo", "estanteVazia", "botaoVoltar", "racaoGA", "racaoGF", "racaoGV", "racaoMA", "racaoMF", "racaoMV"];
        const warmupSprites = warmupKeys.map((key, index) =>
            this.add.image(2 + index, 2, key).setScale(0.001).setAlpha(0.001).setDepth(-9999)
        );

        this.time.delayedCall(50, () => {
            warmupSprites.forEach((sprite) => sprite.destroy());
            this.registry.set("racao_textures_prewarmed", true);
        });
    }
}
