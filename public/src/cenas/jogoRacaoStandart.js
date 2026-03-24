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

export class jogoRacaoStandart extends Phaser.Scene {
    constructor() {
        super({ key: "jogoRacaoStandart" });
    }

    create() {
        const largura = this.scale.width;
        const altura = this.scale.height;

        // Sem HUD, usamos o espaço total: 30% para a esquerda (estante) e 70% para a direita (informações)
        const centroEsquerdaX = largura * 0.30;
        const centroDireitaX = largura * 0.70;

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

        // Fundo ocupando a tela toda
        this.fundo = this.add.image(largura / 2, altura / 2, "bgLimpo")
            .setDisplaySize(largura, altura)
            .setDepth(-1);

        // ==========================================
        // COLUNA ESQUERDA (Botões, Estante e Rações)
        // ==========================================

        // Botões centralizados em relação à estante
        this.botaoStandard = criarBotao(
            largura * 0.20, altura * 0.15,
            "botaoStandard", "botaoStandardPressionado",
            0.35, 0.4, 0.30,
            () => this.transicaoPara("")
        );

        this.botaoSuperPremium = criarBotao(
            largura * 0.40, altura * 0.155,
            "botaoSuperPremium", "botaoSuperPremiumPressionado",
            0.35, 0.4, 0.3,
            () => this.transicaoPara("")
        );

        // Estante à esquerda
        this.estante = this.add.image(centroEsquerdaX, altura * 0.6, "estanteVazia")
            .setScale(1) // Adicionado 1 para evitar erro caso vazio
            .setDepth(-1);

        // Posições X das rações recalculadas para alinhar com o centroEsquerdaX (0.30)
        const colunasRacao = [largura * 0.18, largura * 0.30, largura * 0.42];
        const linhasRacao = [altura * 0.37, altura * 0.605, altura * 0.845];

        // Grupo Super Premium
        this.racoesSuperPremium = [
            new Racao(this, colunasRacao[0], linhasRacao[0], racaoGrandeFilhote),
            new Racao(this, colunasRacao[1], linhasRacao[0], racaoGrandeAdulto),
            new Racao(this, colunasRacao[2], linhasRacao[0], racaoGrandeSenior),
            new Racao(this, colunasRacao[0], linhasRacao[1], racaoMediaFilhote),
            new Racao(this, colunasRacao[1], linhasRacao[1], racaoMediaAdulto),
            new Racao(this, colunasRacao[2], linhasRacao[1], racaoMediaSenior),
            new Racao(this, colunasRacao[0], linhasRacao[2], racaoPequenaFilhote),
            new Racao(this, colunasRacao[1], linhasRacao[2], racaoPequenaAdulto),
            new Racao(this, colunasRacao[2], linhasRacao[2], racaoPequenaSenior),
        ];
        this.racoesSuperPremium.forEach(r => r.sprite.setScale(0.125));

        // Grupo Standard
        this.racoesStandard = [
            new Racao(this, colunasRacao[0], linhasRacao[0], racaoGrandeFilhote),
            new Racao(this, colunasRacao[1], linhasRacao[0], racaoGrandeAdulto),
            new Racao(this, colunasRacao[2], linhasRacao[0], racaoGrandeSenior),
            new Racao(this, colunasRacao[0], linhasRacao[1], racaoMediaFilhote),
            new Racao(this, colunasRacao[1], linhasRacao[1], racaoMediaAdulto),
            new Racao(this, colunasRacao[2], linhasRacao[1], racaoMediaSenior),
            new Racao(this, colunasRacao[0], linhasRacao[2], racaoPequenaFilhote),
            new Racao(this, colunasRacao[1], linhasRacao[2], racaoPequenaAdulto),
            new Racao(this, colunasRacao[2], linhasRacao[2], racaoPequenaSenior),
        ];
        this.racoesStandard.forEach(r => {
            r.sprite.setScale(0.125);
            r.sprite.setVisible(false);
        });

        // ==========================================
        // COLUNA DIREITA (Popup e Botão Comprar)
        // ==========================================

        this.fundoTemplateRacao = this.add.image(centroDireitaX, altura * 0.56, "fundoTemplateRacao")
            .setScale(altura * 0.00075);

        // >>> ALTERAÇÃO AQUI: Mudado de 0.47 para 0.55 para ficar mais pra baixo <<<
        this.containerTexto = this.add.container(centroDireitaX, altura * 0.55);

        const titulo = this.add.text(0, -altura*0.15, "Compre sua ração!", {
            fontSize: "22px", color: "#000", fontFamily: '"Press Start 2P"', align: "center"
        }).setScale(altura*0.00125).setOrigin(0.5);

        const subtitulo = this.add.text(0, altura*0.02, "Escolha o tipo de\n\nração ideal para seu\n\npet entre Super\n\nPremium e Standard", {
            fontSize: "18px", color: "#000", fontFamily: '"Press Start 2P"', align: "center", wordWrap: { width: 450 }
        }).setScale(altura*0.0013).setOrigin(0.5);

        this.containerTexto.add([titulo, subtitulo]);

        this.botaoComprar = criarBotao(
            centroDireitaX, altura * 0.85, 
            "botaoComprar", "botaoComprarPressionado",
            0.35, 0.4, 0.30,
            () => this.transicaoPara("")
        ).setScale(0.35).setVisible(false).setAlpha(0);

        this.containerInfo = this.add.container(centroDireitaX, altura * 0.47)
            .setScale(altura * 0.0009)
            .setVisible(false).setAlpha(0);

        this.composicaoRacao = this.add.image(0, 0, "composicaoRacao");
        this.imagemRacaoInfo = this.add.image(-160, -70, "").setScale(0.18);

        this.textoTipo = this.add.text(0, -217, "", { fontSize: "32px", color: "#000", fontFamily: '"Press Start 2P"', align: "center" }).setOrigin(0.5);
        this.textoPorte = this.add.text(75, -138, "", { fontSize: "16px", color: "#006600", fontFamily: '"Press Start 2P"' }).setOrigin(0, 0.5);
        this.textoIdade = this.add.text(75, -102, "", { fontSize: "16px", color: "#006600", fontFamily: '"Press Start 2P"' }).setOrigin(0, 0.5);
        this.textoChar1 = this.add.text(80, -44, "", { fontSize: "16px", color: "#000", fontFamily: '"Press Start 2P"', align: "center", wordWrap: { width: 300 } }).setOrigin(0.5);
        this.textoChar2 = this.add.text(80, 18, "", { fontSize: "16px", color: "#000", fontFamily: '"Press Start 2P"', align: "center", wordWrap: { width: 300 } }).setOrigin(0.5);

        const porcentagem = { fontSize: "12px", color: "#8B4513", fontFamily: '"Press Start 2P"' };
        this.textoTrigo = this.add.text(-170, 204, "", porcentagem).setOrigin(0.5);
        this.textoCarne = this.add.text(-60, 204, "", porcentagem).setOrigin(0.5);
        this.textoOsso = this.add.text(51, 204, "", porcentagem).setOrigin(0.5);
        this.textoGordura = this.add.text(165, 204, "", porcentagem).setOrigin(0.5);

        this.containerInfo.add([
            this.composicaoRacao, this.imagemRacaoInfo, this.textoTipo, this.textoPorte, this.textoIdade, 
            this.textoChar1, this.textoChar2, this.textoTrigo, this.textoCarne, this.textoOsso, this.textoGordura
        ]);

        // ==========================================
        // INTERAÇÕES E RESIZE
        // ==========================================

        const todasRacoes = [...this.racoesSuperPremium, ...this.racoesStandard];

        todasRacoes.forEach((racao) => {
            racao.sprite.setInteractive({ useHandCursor: true });

            racao.sprite.on("pointerover", () => this.tweens.add({ targets: racao.sprite, scale: 0.14, duration: 100, ease: "Power2" }));
            racao.sprite.on("pointerout", () => this.tweens.add({ targets: racao.sprite, scale: 0.125, duration: 100, ease: "Power2" }));

            racao.sprite.on("pointerup", () => {
                this.tweens.add({
                    targets: this.containerTexto, alpha: 0, duration: 200, ease: "Power2",
                    onComplete: () => this.containerTexto.setVisible(false)
                });

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

                this.composicaoRacao.setVisible(true);
                
                this.containerInfo.setAlpha(0).setVisible(true);
                this.botaoComprar.setVisible(true);
                
                this.tweens.add({ 
                    targets: [this.containerInfo, this.botaoComprar], 
                    alpha: 1, 
                    duration: 250, 
                    ease: "Power2" 
                });
            });
        });

        // >>> Listener de resize robusto <<<
        this.scale.on("resize", (gameSize) => {
            const w = gameSize.width;
            const h = gameSize.height;

            this.cameras.resize(w, h);
            this.fundo.setDisplaySize(w, h).setPosition(w / 2, h / 2);
            
            this.estante.setPosition(w * 0.30, h * 0.6);
            this.botaoStandard.setPosition(w * 0.20, h * 0.15);
            this.botaoSuperPremium.setPosition(w * 0.40, h * 0.15);

            this.fundoTemplateRacao.setPosition(w * 0.70, h * 0.56).setScale(h * 0.00065); // Mantive 0.56 igual na criação
            
            // >>> ALTERAÇÃO AQUI: Atualizado também no resize (0.55) <<<
            this.containerTexto.setPosition(w * 0.70, h * 0.55);
            
            this.containerInfo.setPosition(w * 0.70, h * 0.47).setScale(h * 0.0009);
            this.botaoComprar.setPosition(w * 0.70, h * 0.85);

            const novasColunas = [w * 0.18, w * 0.30, w * 0.42];
            const novasLinhas = [h * 0.37, h * 0.605, h * 0.845];
            
            const reposicionarRacoes = (racoesArray) => {
                let index = 0;
                for (let i = 0; i < 3; i++) { 
                    for (let j = 0; j < 3; j++) { 
                        if(racoesArray[index]) {
                            racoesArray[index].sprite.setPosition(novasColunas[j], novasLinhas[i]);
                        }
                        index++;
                    }
                }
            };

            reposicionarRacoes(this.racoesSuperPremium);
            reposicionarRacoes(this.racoesStandard);
        });
    }
}