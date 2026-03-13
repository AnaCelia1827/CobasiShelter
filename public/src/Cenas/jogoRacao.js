import {
    racaoGrandeFilhote,
    racaoGrandeAdulto,
    racaoGrandeSenior,
    racaoMediaAdulto,
    racaoMediaFilhote,
    racaoMediaSenior,
    racaoPequenaAdulto,
    racaoPequenaFilhote,
    racaoPequenaSenior
} from "../componentes/controleRacoes/dadosRacoes.js";

import { Racao } from "../componentes/controleRacoes/racoes.js";
import { cachorroGeral } from "../componentes/controleCachorro/cachorroGeral.js";
import { jogoAlimentacao } from "./jogoAlimentacao.js";

export class jogoRacao extends Phaser.Scene {

    constructor() {
        super({ key: "jogoRacao" });
    }

    create() {

        // desativa HUD
        if (this.scene.isActive("cenaHUD")) {
            this.scene.sleep("cenaHUD");
        }

        // efeito hover
        const hoverPressEffect = (target, scaleNormal, scaleHover) => {

            target.on("pointerover", () => {
                this.tweens.add({
                    targets: target,
                    scaleX: scaleHover,
                    scaleY: scaleHover,
                    duration: 200
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

        // FUNDO
        this.add
        .image(this.scale.width / 2, this.scale.height / 2, "bgLimpo")
        .setDisplaySize(this.scale.width, this.scale.height)
        .setDepth(-1);

        // BOTÃO VOLTAR
        const voltar = this.add
        .image(100, 100, "botaoVoltar")
        .setScale(0.01)
        .setInteractive({ useHandCursor: true });

        hoverPressEffect(voltar, 0.01, 0.012);

        voltar.on("pointerdown", () => {

            if (this.scene.isSleeping("cenaHUD")) {
                this.scene.wake("cenaHUD");
            }

            this.scene.start("cenaComida");

        });

        // ESTANTE
        this.add
        .image(500, 500, "estanteVazia")
        .setScale(1.3)
        .setDepth(-1);

        // RAÇÕES
        this.r1 = new Racao(this, 300, 300, racaoGrandeAdulto);
        this.r2 = new Racao(this, 500, 300, racaoGrandeFilhote);
        this.r3 = new Racao(this, 700, 300, racaoGrandeSenior);

        this.r4 = new Racao(this, 300, 500, racaoMediaAdulto);
        this.r5 = new Racao(this, 500, 500, racaoMediaFilhote);
        this.r6 = new Racao(this, 700, 500, racaoMediaSenior);

        this.r7 = new Racao(this, 300, 700, racaoPequenaAdulto);
        this.r8 = new Racao(this, 500, 700, racaoPequenaFilhote);
        this.r9 = new Racao(this, 700, 700, racaoPequenaSenior);

        const pet = cachorroGeral.pet;

        // PAINEL
        const painel = this.add.container(1100, 400);

        const fundo = this.add.graphics();

        fundo.fillStyle(0xffffff, 1);
        fundo.lineStyle(6, 0xff7a00);

       

        fundo.strokeRoundedRect(-250, -300, 600, 700, 20);
        fundo.fillRoundedRect(-250, -300, 600, 700, 20);

        // TEXTO CENTRALIZADO
      const mensagem = this.add.text(50, 20, "Selecione uma ração.", {
    fontFamily: '"Press Start 2P"',
    fontSize: "18px",
    color: "#000",
    align: "center",
    wordWrap: { width: 500 }
})
.setOrigin(0.5);

        // FUNÇÃO QUE ATUALIZA O PAINEL
        this.atualizarPainel = (racao) => {

            mensagem.setText(

`RAÇÃO SELECIONADA

${racao.nome}

${racao.descricao}`

            );
        };

        // BOTÃO VERIFICAR
        const verificar = this.add.text(0, 300, "VERIFICAR", {
            fontFamily: '"Press Start 2P"',
            fontSize: "18px",
            backgroundColor: "#ffa500",
            color: "#ffffff",
            padding: { x: 25, y: 12 }
        })
        .setOrigin(0.5)
        .setInteractive();

        verificar.on("pointerdown", () => {

            const racao = Racao.selecionada;

            if (!racao) {

                mensagem.setText("FALTA SELECIONAR UMA RAÇÃO.");
                return;

            }

            if (racao.id === pet.id) {

                mensagem.setText(

`ACERTOU!

ESSA É A RAÇÃO
IDEAL PARA O
CACHORRO.`

                );

                this.time.delayedCall(2000, () => {
                    this.scene.start("jogoAlimentacao");

                    console.log("beta");

                });

            } else {

                mensagem.setText(

`ESSA RAÇÃO NÃO É IDEAL.

ESCOLHA OUTRA
RAÇÃO.`

                );

            }

        });

        painel.add([fundo, mensagem, verificar]);

    }

}