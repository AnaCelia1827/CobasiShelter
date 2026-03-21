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
            () => this.transicaoPara("")
        );

        // Botão SuperPremium
        this.botaoSuperPremium = criarBotao(
            this.scale.width*0.35, this.scale.height*0.15,
            "botaoSuperPremium", "botaoSuperPremiumPressionado",
            0.5, 0.55, 0.45,
            () => this.transicaoPara("")
        );

        // Estante
        this.estante = this.add.image(this.scale.width/4, this.scale.height*0.6, "estanteVazia")
            .setScale(1.2)
            .setDepth(-1);

        // Grupo Super Premium (visível no início)
        this.racoesSuperPremium = [
            new Racao(this, this.scale.width * 0.13, this.scale.height * 0.37,  racaoGrandeAdulto),
            new Racao(this, this.scale.width * 0.25, this.scale.height * 0.37,  racaoGrandeFilhote),
            new Racao(this, this.scale.width * 0.37, this.scale.height * 0.37,  racaoGrandeSenior),
            new Racao(this, this.scale.width * 0.13, this.scale.height * 0.605, racaoMediaAdulto),
            new Racao(this, this.scale.width * 0.25, this.scale.height * 0.605, racaoMediaFilhote),
            new Racao(this, this.scale.width * 0.37, this.scale.height * 0.605, racaoMediaSenior),
            new Racao(this, this.scale.width * 0.13, this.scale.height * 0.845, racaoPequenaAdulto),
            new Racao(this, this.scale.width * 0.25, this.scale.height * 0.845, racaoPequenaFilhote),
            new Racao(this, this.scale.width * 0.37, this.scale.height * 0.845, racaoPequenaSenior),
        ];
        this.racoesSuperPremium.forEach(r => r.sprite.setScale(0.125));

        // Grupo Standard (oculto no início — troque os dados quando tiver os sprites)
        this.racoesStandard = [
            new Racao(this, this.scale.width * 0.13, this.scale.height * 0.37,  racaoGrandeAdulto),
            new Racao(this, this.scale.width * 0.25, this.scale.height * 0.37,  racaoGrandeFilhote),
            new Racao(this, this.scale.width * 0.37, this.scale.height * 0.37,  racaoGrandeSenior),
            new Racao(this, this.scale.width * 0.13, this.scale.height * 0.605, racaoMediaAdulto),
            new Racao(this, this.scale.width * 0.25, this.scale.height * 0.605, racaoMediaFilhote),
            new Racao(this, this.scale.width * 0.37, this.scale.height * 0.605, racaoMediaSenior),
            new Racao(this, this.scale.width * 0.13, this.scale.height * 0.845, racaoPequenaAdulto),
            new Racao(this, this.scale.width * 0.25, this.scale.height * 0.845, racaoPequenaFilhote),
            new Racao(this, this.scale.width * 0.37, this.scale.height * 0.845, racaoPequenaSenior),
        ];
        this.racoesStandard.forEach(r => {
            r.sprite.setScale(0.125);
            r.sprite.setVisible(false);
        });

        const pet = cachorrosBase[0];

        // Template das informações das rações
        this.fundoTemplateRacao = this.add.image(
            this.scale.width*0.7, 
            this.scale.height*0.52,
            "fundoTemplateRacao")
        .setScale(this.scale.height*0.001);

        // Container invisível para centralizar o texto no template
        this.containerTexto = this.add.container(
            this.fundoTemplateRacao.x,
            this.fundoTemplateRacao.y
        );

        const titulo = this.add.text(0, -200, "Compre sua ração!", 
        {
            fontSize: "30px",
            color: "#000",
            fontFamily: '"Press Start 2P"',
            align: "center"
        }).setOrigin(0.5);

        const subtitulo = this.add.text(0, 0, 
            "Escolha o tipo de\n\nração ideal para seu\n\npet entre Super\n\nPremium e Standard", 
            {
                fontSize: "20px",
                color: "#000",
                fontFamily: '"Press Start 2P"',
                align: "center",
                wordWrap: { width: 450 }
            }).setOrigin(0.5);

        // Adiciona tudo no container
        this.containerTexto.add([titulo, subtitulo]);

        this.botaoComprar = criarBotao(
        this.scale.width*0.7, this.scale.height*0.84,
        "botaoComprar", "botaoComprarPressionado",
        0.35, 0.4, 0.30,
        () => this.transicaoPara("")
        )
        .setScale(0.35); 

        // Adicina as informações de composição das rações
        this.composicaoRacao = this.add.image(
            this.scale.width*0.74, 
            this.scale.height*0.45,
            "composicaoRacao")
            .setScale(this.scale.height*0.001)
            .setVisible(false);

            // Torna todas as rações clicáveis
        const todasRacoes = [...this.racoesSuperPremium, ...this.racoesStandard];

        todasRacoes.forEach((racao) => {
            racao.sprite.setInteractive({ useHandCursor: true });

            racao.sprite.on("pointerover", () => {
                this.tweens.add({ targets: racao.sprite, scale: 0.14, duration: 100, ease: "Power2" });
            });

            racao.sprite.on("pointerout", () => {
                this.tweens.add({ targets: racao.sprite, scale: 0.125, duration: 100, ease: "Power2" });
            });

            racao.sprite.on("pointerup", () => {
                this.tweens.add({
                    targets: this.containerTexto,
                    alpha: 0,
                    duration: 200,
                    ease: "Power2",
                    onComplete: () => this.containerTexto.setVisible(false)
                });
                this.composicaoRacao.setAlpha(0).setVisible(true);
                this.tweens.add({
                    targets: this.composicaoRacao,
                    alpha: 1,
                    duration: 200,
                    ease: "Power2"
                });
            });
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
