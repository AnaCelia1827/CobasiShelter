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
import { cachorrosBase } from "../componentes/controleCachorro/cachorrosBase.js";

export class jogoRacao extends Phaser.Scene {
    constructor() {
        super({ key: "jogoRacao" });
    }

    create() {  

        const criarBotao = (x, y, texturaNormal, texturaPressionado, escalaBase, escalaAumentada, escalaPressionada, callback) => {
            const botao = this.add.image(x, y, texturaNormal).setScale(escalaBase).setInteractive({ useHandCursor: true });

            botao.on("pointerover", () => {
                botao.setTexture(texturaPressionado);
                this.tweens.add({ targets: botao, scale: escalaAumentada, duration: 150, ease: "Power2" });
            });

            botao.on("pointerout", () => {
                botao.setTexture(texturaNormal);
                this.tweens.add({ targets: botao, scale: escalaBase, duration: 150, ease: "Power2" });
            });

            botao.on("pointerdown", () => {
                botao.setTexture(texturaPressionado);
                this.tweens.add({ targets: botao, scale: escalaPressionada, duration: 100, ease: "Power2" });
            });

            botao.on("pointerup", () => {
                botao.setTexture(texturaPressionado);
                this.tweens.add({ targets: botao, scale: escalaAumentada, duration: 100, ease: "Power2" });
                if (callback) callback();
            });

            return botao;
        };

        // Fundo
        this.fundo = this.add.image(this.scale.width/2, this.scale.height/2, "bgLimpo")
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        // Botão Standard
        this.botaoStandard = criarBotao(
            this.scale.width*0.15, this.scale.height*0.145,
            "botaoStandard", "botaoStandardPressionado",
            0.5, 0.55, 0.45,
            () => this.transicaoPara("jogoRacao")
        );

        // Botão SuperPremium
        this.botaoSuperPremium = criarBotao(
            this.scale.width*0.35, this.scale.height*0.15,
            "botaoSuperPremium", "botaoSuperPremiumPressionado",
            0.5, 0.55, 0.45,
            () => this.game.destroy(true)
        );

        // Estante
        this.estante = this.add.image(this.scale.width/4, this.scale.height*0.6, "estanteVazia")
            .setScale(1.2)
            .setDepth(-1);

        // Rações
        this.r1 = new Racao(this, this.scale.width*0.13, this.scale.height*0.37, racaoGrandeAdulto);
        this.r1.sprite.setScale(0.125);
        this.r2 = new Racao(this, this.scale.width*0.25, this.scale.height*0.37, racaoGrandeFilhote);
        this.r2.sprite.setScale(0.125)
        this.r3 = new Racao(this, this.scale.width*0.37, this.scale.height*0.37, racaoGrandeSenior);
        this.r3.sprite.setScale(0.125)
        this.r4 = new Racao(this, this.scale.width*0.13, this.scale.height*0.605, racaoMediaAdulto);
        this.r4.sprite.setScale(0.125)
        this.r5 = new Racao(this, this.scale.width*0.25, this.scale.height*0.605, racaoMediaFilhote);
        this.r5.sprite.setScale(0.125)
        this.r6 = new Racao(this, this.scale.width*0.37, this.scale.height*0.605, racaoMediaSenior);
        this.r6.sprite.setScale(0.125)
        this.r7 = new Racao(this, this.scale.width*0.13, this.scale.height*0.845, racaoPequenaAdulto);
        this.r7.sprite.setScale(0.125)
        this.r8 = new Racao(this, this.scale.width*0.25, this.scale.height*0.845, racaoPequenaFilhote);
        this.r8.sprite.setScale(0.125)
        this.r9 = new Racao(this, this.scale.width*0.37, this.scale.height*0.845, racaoPequenaSenior);
        this.r9.sprite.setScale(0.125)

        const pet = cachorrosBase[0];

        // Template das informações das rações
        this.fundoTemplateRacao = this.add.image(this.scale.width*0.7, this.scale.height*0.52,"fundoTemplateRacao")
        .setScale(this.scale.height*0.001)
        this.textoInicial = this.add.text(this.scale.width*0.57, this.scale.height*0.39, 
            "Compre sua ração!\n\nEscolha o tipo de ração ideal\n para seu pet entre\nSuper Premium e Standard", {
            fontSize: "20px",
            color: "#000000",
            fontFamily:'"Press Start 2P"',
            align: "center"
        });

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
