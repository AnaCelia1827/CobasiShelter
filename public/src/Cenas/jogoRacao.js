import {
    racaoGrandeFilhote,
    racaoGrandeAdulto,
    racaoGrandeSenior,
    racaoMediaAdulto,
    racaoMediaFilhote,
    racaoMediaSenior,
    racaoPequenaSenior,
    racaoPequenaAdulto,
    racaoPequenaFilhote
} from "../componentes/controleRacoes/dadosRacoes.js";
import { Racao } from "../componentes/controleRacoes/racoes.js";

export class jogoRacao extends Phaser.Scene {
    constructor() {
        super({ key: "jogoRacao" });
    }

    create() {
        if (this.scene.isActive("cenaHUD")) {
            this.scene.sleep("cenaHUD");
        }

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

        this.add
            .image(this.scale.width / 2, this.scale.height / 2, "bgLimpo")
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        const voltar = this.add.image(100, 100, "botaoVoltar").setScale(0.01).setInteractive({ useHandCursor: true });
        passarPressionarEfeito(voltar, 0.01, 0.012);

        voltar.on("pointerdown", () => {
            if (this.scene.isSleeping("cenaHUD")) {
                this.scene.wake("cenaHUD");
            }
            this.scene.start("cenaAlimentacao");
        });

        this.add.image(500, 500, "estanteVazia").setScale(1.3).setDepth(-1);

        this.r1 = new Racao(this, 300, 300, racaoGrandeAdulto);
        this.r2 = new Racao(this, 500, 300, racaoGrandeFilhote);
        this.r3 = new Racao(this, 700, 300, racaoGrandeSenior);
        this.r4 = new Racao(this, 300, 500, racaoMediaAdulto);
        this.r5 = new Racao(this, 500, 500, racaoMediaFilhote);
        this.r6 = new Racao(this, 700, 500, racaoMediaVelho);
    }
}
