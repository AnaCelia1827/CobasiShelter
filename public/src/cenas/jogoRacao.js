import { gameState } from "../main.js";
import {
    racaoGrandeFilhote, racaoGrandeAdulto, racaoGrandeSenior,
    racaoMediaAdulto, racaoMediaFilhote, racaoMediaSenior,
    racaoPequenaAdulto, racaoPequenaFilhote, racaoPequenaSenior
} from "../componentes/controleRacoes/dadosRacoes.js";
import { Racao } from "../componentes/controleRacoes/racoes.js";
import { cachorrosBase } from "../componentes/controleCachorro/cachorrosBase.js";

export class jogoRacao extends Phaser.Scene {
    constructor() {
        super({ key: "jogoRacao" });
    }

    create() {
        const larguraTotal = this.scale.width;
        const alturaTotal = this.scale.height;

        // 1. CHAMA A INSTRUÇÃO LOGO NO INÍCIO
        // this.mostrarInstrucoes(); // Certifique-se que este método existe no seu arquivo ou remova se for global

        // Helper para criar botões
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

        // 2. FUNDO E ESTANTE
        this.fundo = this.add.image(larguraTotal / 2, alturaTotal / 2, "bgLimpo")
            .setDisplaySize(larguraTotal, alturaTotal)
            .setDepth(-1);

        this.estante = this.add.image(larguraTotal / 4, alturaTotal * 0.6, "estanteVazia")
            .setScale(1.2)
            .setDepth(0);

        // 3. BOTÕES DE CATEGORIA
        this.botaoStandard = criarBotao(larguraTotal * 0.15, alturaTotal * 0.145, "botaoStandard", "botaoStandardPressionado", 0.5, 0.55, 0.45);
        this.botaoSuperPremium = criarBotao(larguraTotal * 0.35, alturaTotal * 0.15, "botaoSuperPremium", "botaoSuperPremiumPressionado", 0.5, 0.55, 0.45);

        // 4. GRUPOS DE RAÇÕES (Exemplo com Super Premium)
        this.racoesSuperPremium = [
            new Racao(this, larguraTotal * 0.13, alturaTotal * 0.37, racaoGrandeFilhote),
            new Racao(this, larguraTotal * 0.25, alturaTotal * 0.37, racaoGrandeAdulto),
            new Racao(this, larguraTotal * 0.37, alturaTotal * 0.37, racaoGrandeSenior),
            new Racao(this, larguraTotal * 0.13, alturaTotal * 0.605, racaoMediaFilhote),
            new Racao(this, larguraTotal * 0.25, alturaTotal * 0.605, racaoMediaAdulto),
            new Racao(this, larguraTotal * 0.37, alturaTotal * 0.605, racaoMediaSenior),
            new Racao(this, larguraTotal * 0.13, alturaTotal * 0.845, racaoPequenaFilhote),
            new Racao(this, larguraTotal * 0.25, alturaTotal * 0.845, racaoPequenaAdulto),
            new Racao(this, larguraTotal * 0.37, alturaTotal * 0.845, racaoPequenaSenior),
        ];

        // 5. TEMPLATE DE INFORMAÇÃO (LADO DIREITO)
        this.fundoTemplateRacao = this.add.image(larguraTotal * 0.58, alturaTotal * 0.47, "fundoTemplateRacao")
            .setScale(alturaTotal * 0.00065);

        // Container de Texto Inicial (Boas-vindas)
        this.containerTexto = this.add.container(this.fundoTemplateRacao.x, this.fundoTemplateRacao.y);
        const titulo = this.add.text(0, -200, "Compre sua ração!", { fontSize: "30px", color: "#000", fontFamily: '"Press Start 2P"', align: "center" }).setOrigin(0.5);
        const subtitulo = this.add.text(0, 0, "Escolha a ração\nideal para seu pet", { fontSize: "20px", color: "#000", fontFamily: '"Press Start 2P"', align: "center" }).setOrigin(0.5);
        this.containerTexto.add([titulo, subtitulo]);

        this.botaoComprar = criarBotao(larguraTotal * 0.58, alturaTotal * 0.70, "botaoComprar", "botaoComprarPressionado", 0.35, 0.4, 0.30, () => console.log("Comprado!"));

        // 6. CONTAINER DE DETALHES DA RAÇÃO (Escondido inicialmente)
        this.containerInfo = this.add.container(larguraTotal * 0.58, alturaTotal * 0.45)
            .setScale(alturaTotal * 0.0009)
            .setVisible(false).setAlpha(0);

        this.composicaoRacao = this.add.image(0, 0, "composicaoRacao");
        this.imagemRacaoInfo = this.add.image(-160, -70, "").setScale(0.18);
        this.textoTipo = this.add.text(0, -217, "", { fontSize: "32px", color: "#000", fontFamily: '"Press Start 2P"', align: "center" }).setOrigin(0.5);
        this.textoPorte = this.add.text(75, -138, "", { fontSize: "16px", color: "#006600", fontFamily: '"Press Start 2P"' }).setOrigin(0, 0.5);
        this.textoIdade = this.add.text(75, -102, "", { fontSize: "16px", color: "#006600", fontFamily: '"Press Start 2P"' }).setOrigin(0, 0.5);
        this.textoChar1 = this.add.text(80, -44, "", { fontSize: "16px", color: "#000", fontFamily: '"Press Start 2P"', align: "center", wordWrap: { width: 300 } }).setOrigin(0.5);
        this.textoChar2 = this.add.text(80, 18, "", { fontSize: "16px", color: "#000", fontFamily: '"Press Start 2P"', align: "center", wordWrap: { width: 300 } }).setOrigin(0.5);

        const estiloNutri = { fontSize: "12px", color: "#8B4513", fontFamily: '"Press Start 2P"' };
        this.textoTrigo = this.add.text(-170, 204, "", estiloNutri).setOrigin(0.5);
        this.textoCarne = this.add.text(-60, 204, "", estiloNutri).setOrigin(0.5);
        this.textoOsso = this.add.text(51, 204, "", estiloNutri).setOrigin(0.5);
        this.textoGordura = this.add.text(165, 204, "", estiloNutri).setOrigin(0.5);

        this.containerInfo.add([
            this.composicaoRacao, this.imagemRacaoInfo, this.textoTipo, this.textoPorte, 
            this.textoIdade, this.textoChar1, this.textoChar2, this.textoTrigo, 
            this.textoCarne, this.textoOsso, this.textoGordura
        ]);

        // 7. CONFIGURAÇÃO DE EVENTOS DAS RAÇÕES
        this.racoesSuperPremium.forEach((racao) => {
            racao.sprite.setInteractive({ useHandCursor: true }).setScale(0.125);

            racao.sprite.on("pointerover", () => {
                this.tweens.add({ targets: racao.sprite, scale: 0.14, duration: 100, ease: "Power2" });
            });

            racao.sprite.on("pointerout", () => {
                this.tweens.add({ targets: racao.sprite, scale: 0.125, duration: 100, ease: "Power2" });
            });

            racao.sprite.on("pointerup", () => {
                // Esconde texto inicial
                this.tweens.add({
                    targets: this.containerTexto,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => this.containerTexto.setVisible(false)
                });

                // Preenche dados
                this.textoTipo.setText(racao.dados.tipo || "Premium");
                this.textoPorte.setText(racao.dados.porte || "-");
                this.textoIdade.setText(racao.dados.idade || "-");
                this.imagemRacaoInfo.setTexture(racao.sprite.texture.key);
                
                // Nutrientes (exemplo de acesso aos dados)
                if (racao.dados.nutrientes) {
                    this.textoTrigo.setText(racao.dados.nutrientes.trigo);
                    this.textoCarne.setText(racao.dados.nutrientes.carne);
                    this.textoOsso.setText(racao.dados.nutrientes.osso);
                    this.textoGordura.setText(racao.dados.nutrientes.gordura);
                }

                // Mostra container de info
                this.containerInfo.setVisible(true);
                this.tweens.add({ targets: this.containerInfo, alpha: 1, duration: 250 });
            });
        });

        // 8. LISTENER DE RESIZE UNIFICADO
        const handleResizeRacao = (gameSize) => {
            const largura = gameSize.width;
            const altura = gameSize.height;

            this.cameras.resize(largura, altura);
            this.fundo.setDisplaySize(largura, altura).setPosition(largura / 2, altura / 2);
            this.estante.setPosition(largura / 4, altura * 0.6);
            
            this.botaoStandard.setPosition(largura * 0.15, altura * 0.145);
            this.botaoSuperPremium.setPosition(largura * 0.35, altura * 0.15);
            
            this.fundoTemplateRacao.setPosition(largura * 0.58, altura * 0.47).setScale(altura * 0.00065);
            this.containerTexto.setPosition(this.fundoTemplateRacao.x, this.fundoTemplateRacao.y);
            this.containerInfo.setPosition(largura * 0.58, altura * 0.45).setScale(altura * 0.0009);
            this.botaoComprar.setPosition(largura * 0.58, altura * 0.70);
        };

        this.scale.on("resize", handleResizeRacao);

        this.events.on('shutdown', () => {
            this.scale.off("resize", handleResizeRacao);
        });
    }
}