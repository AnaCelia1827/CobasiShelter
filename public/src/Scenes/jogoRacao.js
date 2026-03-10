import {
    racaoGrandeFilhote,
    racaoGrandeAdulto,
    racaoGrandeVelho,
    racaoMediaAdulto,
    racaoMediaFilhote,
    racaoMediaVelho
} from "../componentes/controleRacoes/dadosRacoes.js";
import { Racao } from "../componentes/controleRacoes/racoes.js";

export class jogoRacao extends Phaser.Scene {
    constructor() {
        super({ key: "jogoRacao" });
    }

    create() {
        if (this.scene.isActive("hudScene")) {
            this.scene.sleep("hudScene");
        }

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
                    duration: 200
                });
            });
        };

        this.add
            .image(this.scale.width / 2, this.scale.height / 2, "bgLimpo")
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        const voltar = this.add.image(100, 100, "botaoVoltar").setScale(0.01).setInteractive({ useHandCursor: true });
        hoverPressEffect(voltar, 0.01, 0.012);

        voltar.on("pointerdown", () => {
            if (this.scene.isSleeping("hudScene")) {
                this.scene.wake("hudScene");
            }
            this.scene.start("foodScene");
        });

        this.add.image(500, 500, "estanteVazia").setScale(1.3).setDepth(-1);

        this.r1 = new Racao(this, 300, 300, racaoGrandeAdulto);
        this.r2 = new Racao(this, 500, 300, racaoGrandeFilhote);
        this.r3 = new Racao(this, 700, 300, racaoGrandeVelho);
        this.r4 = new Racao(this, 300, 500, racaoMediaAdulto);
        this.r5 = new Racao(this, 500, 500, racaoMediaFilhote);
        this.r6 = new Racao(this, 700, 500, racaoMediaVelho);
    }
}
