import { Cachorro } from "../componentes/controleCachorro/cachorroAnimacao.js";

export class cenaComida extends Phaser.Scene {
    constructor() {
        super({ key: "cenaComida" });
        this.transicao = false;
    }

    create() {
        this.transicao = false;

        if (!this.scene.isActive("CenaHUD")) {
            this.scene.launch("CenaHUD");
        } else if (this.scene.isSleeping("CenaHUD")) {
            this.scene.wake("CenaHUD");
        }

        this.scene.bringToTop("CenaHUD");
        this.preCarregarTexturasRacao();

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
                    scaleX: escalaNormal * 0.9,
                    scaleY: escalaNormal * 0.9,
                    duration: 150,
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

        this.add
            .image(this.scale.width / 2, this.scale.height / 2, "bgRacao")
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        const estante = this.add.image(300, 600, "estanteRacao").setScale(0.5).setInteractive({ useHandCursor: true });
        passarPressionarEfeito(estante, 0.5, 0.6);

        estante.on("pointerdown", () => {
            if (this.transicao) {
                return;
            }

            this.transicao = true;
            this.cameras.main.fadeOut(100, 0, 0, 0);
            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("JogoRacao");
            });
        });

        this.add.image(700, 750, "racaoVazia").setScale(0.2).setDepth(100);

        this.cachorro = new Cachorro(this, 920, 600);

        const bilhete = this.add.image(1350, 100, "mineFicha").setScale(0.1).setInteractive({ useHandCursor: true });
        passarPressionarEfeito(bilhete, 0.1, 0.13);

        bilhete.on("pointerdown", () => {
            if (this.scene.isActive("Ficha")) {
                this.scene.stop("Ficha");
                return;
            }

            this.scene.launch("Ficha");
            this.scene.bringToTop("Ficha");
            this.scene.bringToTop("CenaHUD");
        });

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            if (this.scene.isActive("Ficha")) {
                this.scene.stop("Ficha");
            }
        });
    }

    preCarregarTexturasRacao() {
        if (this.registry.get("texturas_racao_precarregadas")) {
            return;
        }

        // OTIMIZAÇÃO: pré-carrega texturas da cena de ração para evitar travamento no primeiro clique da prateleira.
        const chavesPreCarregadas = ["bgLimpo", "estanteVazia", "botaoVoltar", "racaoGA", "racaoGF", "racaoGV", "racaoMA", "racaoMF", "racaoMV"];
        const spritesPreCarregados = chavesPreCarregadas.map((chave, indice) =>
            this.add.image(2 + indice, 2, chave).setScale(0.001).setAlpha(0.001).setDepth(-9999)
        );

        this.time.delayedCall(50, () => {
            spritesPreCarregados.forEach((sprite) => sprite.destroy());
            this.registry.set("texturas_racao_precarregadas", true);
        });
    }
}
