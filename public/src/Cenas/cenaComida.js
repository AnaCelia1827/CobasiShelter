import { GerenciadorCachorros } from "../componentes/controleCachorro/gerenciadorCachorros.js"
import { cachorrosBase } from "../componentes/controleCachorro/cachorrosBase.js"

export class cenaComida extends Phaser.Scene {
    
    constructor() {
        super({ key: "cenaComida" });
        this.transicao = false;
    }

    create() {
        this.transicao = false;

        if (!this.scene.isActive("HUD")) {
            this.scene.launch("HUD");
        } else if (this.scene.isSleeping("HUD")) {
            this.scene.wake("HUD");
        }
        this.scene.bringToTop("HUD");

        const posicaoX = (this.scale.width - this.scale.width * 0.2);
        const posicaoY = this.scale.height;

        const passarPressionarEfeito = (alvo, escalaNormal, escalaPassar) => {
            alvo.removeAllListeners();

            alvo.on("pointerover", () => {
                this.tweens.add({ targets: alvo, scaleX: escalaPassar, scaleY: escalaPassar, duration: 200 });
            });

            alvo.on("pointerdown", () => {
                this.tweens.add({ targets: alvo, scaleX: escalaNormal * 0.9, scaleY: escalaNormal * 0.9, duration: 150, yoyo: true });
            });

            alvo.on("pointerout", () => {
                this.tweens.add({ targets: alvo, scaleX: escalaNormal, scaleY: escalaNormal, duration: 200 });
            });
        };

        this.fundo = this.add.image(posicaoX / 2, posicaoY / 2, "bgRacao")
            .setDisplaySize(posicaoX, posicaoY)
            .setDepth(-1);

        const estante = this.add.image(posicaoX * 0.2, posicaoY / 2 + posicaoY * 0.14, "estanteRacao")
            .setScale(posicaoY * 0.0007)
            .setInteractive({ useHandCursor: true });

        passarPressionarEfeito(estante, estante.scaleX, estante.scaleX * 1.1);

        estante.on("pointerdown", () => {
            const cenaHUD = this.scene.manager.getScene("cenaHUD");
            if (cenaHUD && cenaHUD.transicionarPara) {
                cenaHUD.transicionarPara("jogoRacao");
            } else {
                this.scene.start("jogoRacao");
            }
        });

        const racaoVazia = this.add.image((posicaoX / 2) + (posicaoX / 2) * 0.1, posicaoY / 2 + posicaoY * 0.4, "racaoVazia")
            .setScale(posicaoY * 0.00002);

        // 👇 usa estado atual do cachorro (sincronizado com CenaBanho e outras)
        // cachorrosBase[0].estado não deve ser sobrescrito para preservar progresso

        this.gerenciadorCachorros = new GerenciadorCachorros(this)

        this.cachorro = this.gerenciadorCachorros.criarCachorro(
            (posicaoX / 2) + (posicaoX / 2) * 0.4,
            (posicaoY / 2) + (posicaoY / 2) * 0.25,
            cachorrosBase[0]
        )

        this.cachorro.sprite.setScale(posicaoY * 0.0007)
    }
}