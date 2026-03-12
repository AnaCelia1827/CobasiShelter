// Importa os dados das rações (cada tipo de ração com suas informações)
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

// Importa a classe Racao, responsável por criar os objetos de ração na cena
import { Racao } from "../componentes/controleRacoes/racoes.js";

// Define a cena "jogoRacao", que é o minijogo de escolha de ração
export class jogoRacao extends Phaser.Scene {
    constructor() {
        super({ key: "jogoRacao" });
    }

    create() {
        // Se a HUD estiver ativa, coloca ela em "sleep" para não interferir
        if (this.scene.isActive("cenaHUD")) {
            this.scene.sleep("cenaHUD");
        }

        // Função utilitária para aplicar efeitos visuais ao passar/clicar em botões
        const passarPressionarEfeito = (alvo, escalaNormal, escalaPassar) => {
            // Ao passar o mouse → aumenta escala
            alvo.on("pointerover", () => {
                this.tweens.add({
                    targets: alvo,
                    scaleX: escalaPassar,
                    scaleY: escalaPassar,
                    duration: 200,
                    ease: "Power2"
                });
            });

            // Ao clicar → reduz escala temporariamente (efeito de pressão)
            alvo.on("pointerdown", () => {
                this.tweens.add({
                    targets: alvo,
                    scaleX: 0.45,
                    scaleY: 0.45,
                    duration: 180,
                    ease: "Power2",
                    yoyo: true // volta ao tamanho original
                });
            });

            // Ao retirar o mouse → volta para escala normal
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

        // Fundo da cena (imagem limpa)
        this.add
            .image(this.scale.width / 2, this.scale.height / 2, "bgLimpo")
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        // Botão de voltar para cena de alimentação
        const voltar = this.add.image(100, 100, "botaoVoltar").setScale(0.01).setInteractive({ useHandCursor: true });
        passarPressionarEfeito(voltar, 0.01, 0.012);

        voltar.on("pointerdown", () => {
            // Ao voltar, reativa HUD se estiver em sleep
            if (this.scene.isSleeping("cenaHUD")) {
                this.scene.wake("cenaHUD");
            }
            // Vai para cena de alimentação
            this.scene.start("cenaAlimentacao");
        });

        // Estante vazia como fundo decorativo
        this.add.image(500, 500, "estanteVazia").setScale(1.3).setDepth(-1);

        // Criação das rações (cada uma é um objeto da classe Racao)
        this.r1 = new Racao(this, 300, 300, racaoGrandeAdulto);
        this.r2 = new Racao(this, 500, 300, racaoGrandeFilhote);
        this.r3 = new Racao(this, 700, 300, racaoGrandeSenior);
        this.r4 = new Racao(this, 300, 500, racaoMediaAdulto);
        this.r5 = new Racao(this, 500, 500, racaoMediaFilhote);
        this.r6 = new Racao(this, 700, 500, racaoMediaSenior);

    }
}
