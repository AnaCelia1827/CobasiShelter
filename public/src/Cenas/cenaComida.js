// Importa a classe Cachorro, responsável pela animação e controle do cachorro
import { Cachorro } from "../componentes/controleCachorro/cachorroAnimacao.js";

export class cenaComida extends Phaser.Scene {
    
    constructor() {
        super({ key: "cenaComida" });
        this.transicao = false;
    }

    create() {
        this.transicao = false;

        // HUD
        if (!this.scene.isActive("cenaHUD")) {
            this.scene.launch("cenaHUD");
        } else if (this.scene.isSleeping("cenaHUD")) {
            this.scene.wake("cenaHUD");
        }
        this.scene.bringToTop("cenaHUD");

        const posicaoX = (this.scale.width - this.scale.width * 0.2);
        const posicaoY = this.scale.height;

        this.preCarregarTexturasRacao();

        // Função auxiliar para hover/click dinâmico
        const passarPressionarEfeito = (alvo, escalaNormal, escalaPassar) => {
            alvo.removeAllListeners();

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

        // Fundo
        this.fundo = this.add.image(posicaoX / 2, posicaoY / 2, "bgRacao")
            .setDisplaySize(posicaoX, posicaoY)
            .setDepth(-1);

        // Estante
        const estante = this.add.image(posicaoX * 0.2, posicaoY / 2 + posicaoY * 0.14, "estanteRacao")
            .setScale(posicaoY * 0.0007)
            .setInteractive({ useHandCursor: true });
        passarPressionarEfeito(estante, estante.scaleX, estante.scaleX * 1.1);

        estante.on("pointerdown", () => {
            this.cameras.main.fadeOut(100, 0, 0, 0);
            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("jogoRacao");
            });
        });

        // Pote vazio
        const racaoVazia = this.add.image((posicaoX / 2) + (posicaoX / 2) * 0.1, posicaoY / 2 + posicaoY * 0.4, "racaoVazia")
            .setScale(posicaoY * 0.00002)
            .setDepth(100);

        // Cachorro
        this.cachorro = new Cachorro(this, (posicaoX / 2) + (posicaoX / 2) * 0.4, (posicaoY / 2) + (posicaoY / 2) * 0.25);
        this.cachorro.sprite.setScale(posicaoY * 0.0007);

        // Bilhete
        const bilhete = this.add.image((posicaoX / 2) + (posicaoX / 2) * 0.7, posicaoY / 2 - posicaoY * 0.3, "mineFicha")
            .setScale(posicaoY*0.0001)
            .setInteractive({ useHandCursor: true });
        passarPressionarEfeito(bilhete, bilhete.scaleX, bilhete.scaleX * 1.3);

        bilhete.on("pointerdown", () => {
            if (this.scene.isActive("ficha")) {
                this.scene.stop("ficha");
                return;
            }
            this.scene.launch("ficha");
            this.scene.bringToTop("ficha");
            this.scene.bringToTop("cenaHUD");
        });

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            if (this.scene.isActive("ficha")) {
                this.scene.stop("ficha");
            }
        });

        // >>> Listener de resize ajustado <<<
        this.scale.on("resize", (tamanhoTela) => {
            const { width: largura, height: altura } = tamanhoTela;
            const posicaoX = largura - largura * 0.2;
            const posicaoY = altura;

            // Fundo
            this.fundo.setDisplaySize(posicaoX, altura).setPosition(posicaoX / 2, altura / 2);

            // Estante
            estante.setPosition(posicaoX * 0.2, altura / 2 + altura * 0.14);
            estante.setScale(posicaoY * 0.0007);
            passarPressionarEfeito(estante, estante.scaleX, estante.scaleX * 1.1);

            // Pote vazio
            racaoVazia.setPosition((posicaoX / 2) + (posicaoX / 2) * 0.1, altura / 2 + altura * 0.4);
            racaoVazia.setScale(posicaoY * 0.00002);

            // Cachorro
            this.cachorro.sprite.setPosition((posicaoX / 2) + (posicaoX / 2) * 0.4, (posicaoY / 2) + (posicaoY / 2) * 0.25);
            this.cachorro.sprite.setScale(posicaoY * 0.0007);

            // Bilhete
            bilhete.setPosition((posicaoX / 2) + (posicaoX / 2) * 0.7, altura / 2 - altura * 0.3);
            bilhete.setScale(posicaoY*0.0001);
            passarPressionarEfeito(bilhete, bilhete.scaleX, bilhete.scaleX * 1.3);
        });
    }

    preCarregarTexturasRacao() {
        if (this.registry.get("texturas_racao_precarregadas")) return;

        const chavesPreCarregadas = [
            "bgLimpo", "estanteVazia", "botaoVoltar",
            "racaoGA", "racaoGF", "racaoGV",
            "racaoMA", "racaoMF", "racaoMV",
            "racaoPA", "racaoPF", "racaoPV"
        ];

        const spritesPreCarregados = chavesPreCarregadas.map((chave, indice) =>
            this.add.image(2 + indice, 2, chave).setScale(0.001).setAlpha(0.001).setDepth(-9999)
        );

        this.time.delayedCall(50, () => {
            spritesPreCarregados.forEach((sprite) => sprite.destroy());
            this.registry.set("texturas_racao_precarregadas", true);
        });
    }
}
