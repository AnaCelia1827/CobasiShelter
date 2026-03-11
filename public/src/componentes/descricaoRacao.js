import { cachorroGeral } from "./controleCachorro/cachorroGeral.js";
import { Racao } from "./controleRacoes/racoes.js";

export class Descricao extends Phaser.Scene {
    constructor() {
        super({ key: "Descricao" });
    }

    create() {
        const pet = cachorroGeral.pet;
        const racao = Racao.pet;

        const painel = this.add.container(this.scale.width * 0.75, this.scale.height * 0.5);

        // caixa com borda laranja
        const fundo = this.add.graphics();
        fundo.fillStyle(0xffffff, 1);
        fundo.lineStyle(6, 0xff7a00);
        fundo.strokeRoundedRect(-200, -150, 400, 300, 20);
        fundo.fillRoundedRect(-200, -150, 400, 300, 20);

        // texto de feedback
        const mensagem = this.add.text(-180, -120, "", {
            fontFamily: '"Press Start 2P"',
            fontSize: "12px",
            color: "#000",
            wordWrap: { width: 360 }
        });

        painel.add([fundo, mensagem]);

        // botão verificar
        const verificar = this.add.text(this.scale.width * 0.75, this.scale.height * 0.75, "Verificar", {
            fontFamily: '"Press Start 2P"',
            fontSize: "14px",
            backgroundColor: "#ffa500",
            color: "#000",
            padding: { x: 10, y: 5 }
        })
        .setOrigin(0.5)
        .setInteractive();

        verificar.on("pointerdown", () => {

            const racaoEscolhida = Racao.pet;

            if (!racaoEscolhida) {
                mensagem.setText("Falta selecionar uma ração.");
                return;
            }

            // mostra info da ração
            mensagem.setText(
                `Ração selecionada:
Porte: ${racaoEscolhida.porte}
Idade: ${racaoEscolhida.idade}`
            );

            // verifica se é correta
            if (
                racaoEscolhida.porte === pet.porte &&
                racaoEscolhida.idade === pet.idade
            ) {

                mensagem.setText(
                    "Acertou! Essa é a ração ideal para o cachorro."
                );

                this.time.delayedCall(2000, () => {
                    this.scene.start("MiniGamePegarRacao");
                });

            } else {

                mensagem.setText(
`Essa ração não é ideal.

Cachorro:
Porte: ${pet.porte}
Idade: ${pet.idade}

Ração escolhida:
Porte: ${racaoEscolhida.porte}
Idade: ${racaoEscolhida.idade}

Escolha outra ração.`
                );

            }

        });
    }
}