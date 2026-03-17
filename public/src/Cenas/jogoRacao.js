// Importa os dados das rações disponíveis
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

// Importa classe Racao e controle do cachorro
import { Racao } from "../componentes/controleRacoes/racoes.js";
import { cachorroGeral } from "../componentes/controleCachorro/cachorroGeral.js";

export class jogoRacao extends Phaser.Scene {
    constructor() {
        super({ key: "jogoRacao" });
    }

    create() {
        if (this.scene.isActive("cenaHUD")) {
            this.scene.sleep("cenaHUD");
        }

        const hoverPressEffect = (target, scaleNormal, scaleHover) => {
            target.on("pointerover", () => {
                this.tweens.add({ targets: target, scaleX: scaleHover, scaleY: scaleHover, duration: 200 });
            });
            target.on("pointerdown", () => {
                this.tweens.add({ targets: target, scaleX: scaleNormal * 0.9, scaleY: scaleNormal * 0.9, duration: 150, yoyo: true });
            });
            target.on("pointerout", () => {
                this.tweens.add({ targets: target, scaleX: scaleNormal, scaleY: scaleNormal, duration: 200 });
            });
        };
        const posicao = (this.scale.width - this.scale.width * 0.2) / 2;

        // Fundo
        this.fundo = this.add.image(posicao, this.scale.height / 2, "bgLimpo")
            .setDisplaySize(posicao, this.scale.height)
            .setDepth(-1);

        // Botão voltar
        this.voltar = this.add.image(posicao-(posicao*2)*0.5, (this.scale.height / 2)- (this.scale.height / 2)*0.5, "botaoVoltar")
            .setScale(0.01)
            .setInteractive({ useHandCursor: true });
        hoverPressEffect(this.voltar, 0.01, 0.012);
        this.voltar.on("pointerdown", () => {
            if (this.scene.isSleeping("cenaHUD")) {
                this.scene.wake("cenaHUD");
            }
            this.scene.start("cenaComida");
        });

        // Estante
        this.estante = this.add.image(500, 500, "estanteVazia")
            .setScale(1.3)
            .setDepth(-1);

        // Rações
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

        // Painel lateral
        this.painel = this.add.container(1100, 400);
        const fundoPainel = this.add.graphics();
        fundoPainel.fillStyle(0xffffff, 1);
        fundoPainel.lineStyle(6, 0xff7a00);
        fundoPainel.strokeRoundedRect(-250, -300, 600, 700, 20);
        fundoPainel.fillRoundedRect(-250, -300, 600, 700, 20);

        this.mensagem = this.add.text(50, 20, "Selecione uma ração.", {
            fontFamily: '"Press Start 2P"',
            fontSize: "18px",
            color: "#000",
            align: "center",
            wordWrap: { width: 500 }
        }).setOrigin(0.5);

        this.atualizarPainel = (racao) => {
            this.mensagem.setText(`RAÇÃO SELECIONADA\n\n${racao.nome}\n\n${racao.descricao}`);
        };

        const verificar = this.add.text(0, 300, "VERIFICAR", {
            fontFamily: '"Press Start 2P"',
            fontSize: "18px",
            backgroundColor: "#ffa500",
            color: "#ffffff",
            padding: { x: 25, y: 12 }
        }).setOrigin(0.5).setInteractive();

        verificar.on("pointerdown", () => {
            const racao = Racao.selecionada;
            if (!racao) {
                this.mensagem.setText("FALTA SELECIONAR UMA RAÇÃO.");
                return;
            }
            if (racao.id === pet.id) {
                this.mensagem.setText("ACERTOU!\n\nESSA É A RAÇÃO IDEAL PARA O CACHORRO.");
                this.time.delayedCall(2000, () => {
                    this.scene.start("jogoAlimentacao");
                });
            } else {
                this.mensagem.setText("ESSA RAÇÃO NÃO É IDEAL.\n\nESCOLHA OUTRA RAÇÃO.");
            }
        });

        this.painel.add([fundoPainel, this.mensagem, verificar]);

        // >>> Listener de resize <<<
        this.scale.on("resize", (gameSize) => {
            const largura = gameSize.width;
            const altura = gameSize.height;

            this.cameras.resize(largura, altura);

            this.fundo.setDisplaySize(largura, altura).setPosition(largura / 2, altura / 2);
            this.voltar.setPosition(100, 100);
            this.estante.setPosition(largura / 2, altura / 2);

            this.painel.setPosition(largura - 300, altura / 2);
        });
    }
}
