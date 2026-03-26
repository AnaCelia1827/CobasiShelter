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
        this.fundo = this.add.image(this.scale.width / 2, this.scale.height / 2, "bgLimpo")
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        // Botão Standard
        this.botaoStandard = criarBotao(
            this.scale.width * 0.15, this.scale.height * 0.145,
            "botaoStandard", "botaoStandardPressionado",
            0.5, 0.55, 0.45,
            () => this.transicaoPara("")
        );

        // Botão SuperPremium
        this.botaoSuperPremium = criarBotao(
            this.scale.width * 0.35, this.scale.height * 0.15,
            "botaoSuperPremium", "botaoSuperPremiumPressionado",
            0.5, 0.55, 0.45,
            () => this.transicaoPara("")
        );

        // Estante
        this.estante = this.add.image(this.scale.width / 4, this.scale.height * 0.6, "estanteVazia")
            .setScale(1.2)
            .setDepth(-1);

        // Grupo Super Premium (visível no início)
        this.racoesSuperPremium = [
            new Racao(this, this.scale.width * 0.13, this.scale.height * 0.37, racaoGrandeFilhote),
            new Racao(this, this.scale.width * 0.25, this.scale.height * 0.37, racaoGrandeAdulto),
            new Racao(this, this.scale.width * 0.37, this.scale.height * 0.37, racaoGrandeSenior),
            new Racao(this, this.scale.width * 0.13, this.scale.height * 0.605, racaoMediaFilhote),
            new Racao(this, this.scale.width * 0.25, this.scale.height * 0.605, racaoMediaAdulto),
            new Racao(this, this.scale.width * 0.37, this.scale.height * 0.605, racaoMediaSenior),
            new Racao(this, this.scale.width * 0.13, this.scale.height * 0.845, racaoPequenaFilhote),
            new Racao(this, this.scale.width * 0.25, this.scale.height * 0.845, racaoPequenaAdulto),
            new Racao(this, this.scale.width * 0.37, this.scale.height * 0.845, racaoPequenaSenior),
        ];
        this.racoesSuperPremium.forEach(r => r.sprite.setScale(0.125));

        // Grupo Standard (oculto no início — troque os dados quando tiver os sprites)
        this.racoesStandard = [
            new Racao(this, this.scale.width * 0.13, this.scale.height * 0.37, racaoGrandeFilhote),
            new Racao(this, this.scale.width * 0.25, this.scale.height * 0.37, racaoGrandeAdulto),
            new Racao(this, this.scale.width * 0.37, this.scale.height * 0.37, racaoGrandeSenior),
            new Racao(this, this.scale.width * 0.13, this.scale.height * 0.605, racaoMediaFilhote),
            new Racao(this, this.scale.width * 0.25, this.scale.height * 0.605, racaoMediaAdulto),
            new Racao(this, this.scale.width * 0.37, this.scale.height * 0.605, racaoMediaSenior),
            new Racao(this, this.scale.width * 0.13, this.scale.height * 0.845, racaoPequenaFilhote),
            new Racao(this, this.scale.width * 0.25, this.scale.height * 0.845, racaoPequenaAdulto),
            new Racao(this, this.scale.width * 0.37, this.scale.height * 0.845, racaoPequenaSenior),
        ];
        this.racoesStandard.forEach(r => {
            r.sprite.setScale(0.125);
            r.sprite.setVisible(false);
        });

        const pet = cachorrosBase[0];

        // Template das informações das rações
        this.fundoTemplateRacao = this.add.image(
            this.scale.width * 0.58,
            this.scale.height * 0.47,
            "fundoTemplateRacao")
            .setScale(this.scale.height * 0.00065);

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
            this.scale.width * 0.58, this.scale.height * 0.70,
            "botaoComprar", "botaoComprarPressionado",
            0.35, 0.4, 0.30,
            () => this.transicaoPara("")
        )
            .setScale(0.35);

        // Tebtativa de aplicação de responsividade (Container com as informações e imagens ao clicar na ração)
        this.containerInfo = this.add.container(
            this.scale.width * 0.58,
            this.scale.height * 0.45
        )
        .setScale(this.scale.height * 0.0009)
        .setVisible(false).setAlpha(0);

        // A imagem entra no container no X: 0, Y: 0 (centro)
        this.composicaoRacao = this.add.image(0, 0, "composicaoRacao");

        // Imagem da ração clicada (ao lado das informações)
        this.imagemRacaoInfo = this.add.image(-160, -70, "").setScale(0.18);

        // Título (super Premium / standard)
        this.textoTipo = this.add.text(0, -217, "", {
            fontSize: "32px", color: "#000", fontFamily: '"Press Start 2P"', align: "center"
        }).setOrigin(0.5);

        // Porte 
        this.textoPorte = this.add.text(75, -138, "", {
            fontSize: "16px", color: "#006600", fontFamily: '"Press Start 2P"'
        }).setOrigin(0, 0.5);

        // Idade 
        this.textoIdade = this.add.text(75, -102, "", {
            fontSize: "16px", color: "#006600", fontFamily: '"Press Start 2P"'
        }).setOrigin(0, 0.5);

        // Mini descrição 1
        this.textoChar1 = this.add.text(80, -44, "", {
            fontSize: "16px", color: "#000", fontFamily: '"Press Start 2P"', align: "center", wordWrap: { width: 300 }
        }).setOrigin(0.5);

        // Mini descrição 2
        this.textoChar2 = this.add.text(80, 18, "", {
            fontSize: "16px", color: "#000", fontFamily: '"Press Start 2P"', align: "center", wordWrap: { width: 300 }
        }).setOrigin(0.5);

        // Porcentagens nutricionais
        const porcentagem = { fontSize: "12px", color: "#8B4513", fontFamily: '"Press Start 2P"' };
        this.textoTrigo = this.add.text(-170, 204, "", porcentagem).setOrigin(0.5);
        this.textoCarne = this.add.text(-60, 204, "", porcentagem).setOrigin(0.5);
        this.textoOsso = this.add.text(51, 204, "", porcentagem).setOrigin(0.5);
        this.textoGordura = this.add.text(165, 204, "", porcentagem).setOrigin(0.5);

        // Colocando textos e a imagem da ração por cima do container (imagem)
        this.containerInfo.add([
            this.composicaoRacao,
            this.imagemRacaoInfo,
            this.textoTipo, this.textoPorte, this.textoIdade, 
            this.textoChar1, this.textoChar2,
            this.textoTrigo, this.textoCarne, this.textoOsso, this.textoGordura
        ]);
        // ─────────────────────────────────────────────────────────────────

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
                // Preenche o template com os dados da ração clicada
                this.textoTipo.setText(racao.tipo || "Super Premium");
                this.textoPorte.setText(racao.porte || "-");
                this.textoIdade.setText(racao.idade || "-");
                
                this.textoChar1.setText(racao.caracteristicas ? racao.caracteristicas[0] : "");
                this.textoChar2.setText(racao.caracteristicas ? racao.caracteristicas[1] : "");
                
                this.textoTrigo.setText(racao.nutrientes ? racao.nutrientes.trigo : "");
                this.textoCarne.setText(racao.nutrientes ? racao.nutrientes.carne : "");
                this.textoOsso.setText(racao.nutrientes ? racao.nutrientes.osso : "");
                this.textoGordura.setText(racao.nutrientes ? racao.nutrientes.gordura : "");

                this.imagemRacaoInfo.setTexture(racao.sprite.texture.key);

                // Mostra o container (tudo junto) com fade
                this.composicaoRacao.setVisible(true); // Garante visibilidade interna
                this.containerInfo.setAlpha(0).setVisible(true);
                this.tweens.add({
                    targets: this.containerInfo,
                    alpha: 1,
                    duration: 250,
                    ease: "Power2"
                });
            });
        });

        // >>> Listener de resize <<<
        const handleResizeRacao = (gameSize) => {
            const largura = gameSize.width;
            const altura = gameSize.height;

            this.cameras.resize(largura, altura);
            this.fundo.setDisplaySize(largura, altura).setPosition(largura / 2, altura / 2);
            this.estante.setPosition(largura / 4, altura * 0.6);
        };

        this.scale.on("resize", handleResizeRacao);

        this.events.on('shutdown', () => {
            this.scale.off("resize", handleResizeRacao);
        });
    }
}
