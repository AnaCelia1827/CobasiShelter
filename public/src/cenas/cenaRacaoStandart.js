import { gameState } from "../main.js";
import { Racao } from "../componentes/controleRacoes/racoes.js";
import { ficha } from "../componentes/ficha.js";

// Importando APENAS os dados da linha Standart
import {
    standartGrandeFilhote, standartGrandeAdulto, standartGrandeSenior,
    standartMediaFilhote, standartMediaAdulto, standartMediaSenior,
    standartPequenaFilhote, standartPequenaAdulto, standartPequenaSenior
} from "../componentes/controleRacoes/dadosRacoes.js";

export class cenaRacaoStandart extends Phaser.Scene {
    constructor() {
        super({ key: "cenaRacaoStandart" });
    }

    create() {
        const largura = this.scale.width;
        const altura = this.scale.height;

        const centroEsquerdaX = largura * 0.30;
        const centroDireitaX = largura * 0.70;

        // Função predefinida para criar botões
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

        // Função predefinida de feedback ao passar o cursor em cima
        const passarPressionarEfeito = (alvo, escalaNormal, escalaPassar) => {
            alvo.removeAllListeners();

            alvo.on("pointerover", () => {
                this.tweens.add({ targets: alvo, scaleX: escalaPassar, scaleY: escalaPassar, duration: 200 });
            });

            alvo.on("pointerdown", () => {
                this.tweens.add({ targets: alvo, scaleX: escalaNormal * 0.9, scaleY: escalaNormal * 0.9, duration: 150, yoyo: true });
            });

            alvo.on("pointerout", () => {
                this.tweens.add({ targets: alvo, scaleX: escalaNormal, scaleY: escalaNormal, duration: 200 });
            });
        }; 

        // Fundo
        this.fundo = this.add.image(largura / 2, altura / 2, "bgLimpo")
            .setDisplaySize(largura, altura)
            .setDepth(-1);

        // Botão voltar
        this.botaoVoltar = criarBotao(
            this.scale.width*0.95, this.scale.height*0.9, "iconeVoltar", "iconeVoltar",
            1.5, 1.6, 1.4,
            () => this.transicaoPara("cenaComida")
        );

        // Adiciona as moedas do jogador em tempo real
        this.add.image(
            this.scale.width*0.95, 
            this.scale.height*0.06,
           "cobasiCoin").setScale(0.7);

        this.add.text(
            this.scale.width*0.97, 
            this.scale.height*0.06, 
            gameState.cobasiCoins,
            {
                fontSize: "20px",
                color: "#ffffff",
                fontFamily: '"Press Start 2P"',
                align: "center"
            }).setOrigin(0.5);  
        
        // Adiciona a ficha de informações do cachorro
        gameState.bilhete = this.add.image(
            this.scale.width*0.95,
            this.scale.height*0.3,
            'mineFicha')
        .setScale(0.15)
        .setInteractive({ useHandCursor:true });
        passarPressionarEfeito(gameState.bilhete, 0.15, 0.18);

        gameState.bilhete.on('pointerdown', () => {
            if(this.scene.isActive('ficha')){
                this.scene.stop('ficha')
            } 
            else{
                this.scene.launch('ficha')
            }
        });

        // ==========================================
        // COLUNA ESQUERDA (Botões, Estante e Rações)
        // ==========================================

        this.botaoStandard = criarBotao(
            largura * 0.20, altura * 0.15,
            "botaoStandard", "botaoStandardPressionado",
            0.35, 0.4, 0.30,
            () => { /* Já estamos na cena Standard */ }
        );

        this.botaoSuperPremium = criarBotao(
            largura * 0.40, altura * 0.155,
            "botaoSuperPremium", "botaoSuperPremiumPressionado",
            0.35, 0.4, 0.3,
            () => this.scene.start("cenaRacaoSuperPremium")
        );

        this.estante = this.add.image(centroEsquerdaX, altura * 0.6, "estanteVazia")
            .setScale(1)
            .setDepth(-1);

        const colunasRacao = [largura * 0.18, largura * 0.30, largura * 0.42];
        const linhasRacao = [altura * 0.37, altura * 0.605, altura * 0.845];

        // Grupo Standard (Visível)
        this.racoesStandard = [
            new Racao(this, colunasRacao[0], linhasRacao[0], standartGrandeFilhote),
            new Racao(this, colunasRacao[1], linhasRacao[0], standartGrandeAdulto),
            new Racao(this, colunasRacao[2], linhasRacao[0], standartGrandeSenior),
            new Racao(this, colunasRacao[0], linhasRacao[1], standartMediaFilhote),
            new Racao(this, colunasRacao[1], linhasRacao[1], standartMediaAdulto),
            new Racao(this, colunasRacao[2], linhasRacao[1], standartMediaSenior),
            new Racao(this, colunasRacao[0], linhasRacao[2], standartPequenaFilhote),
            new Racao(this, colunasRacao[1], linhasRacao[2], standartPequenaAdulto),
            new Racao(this, colunasRacao[2], linhasRacao[2], standartPequenaSenior),
        ];
        
        this.racoesStandard.forEach(r => {
            r.sprite.setScale(0.3);
            r.sprite.setVisible(true);
        });

        // ==========================================
        // COLUNA DIREITA (Popup, Preço e Botão Comprar)
        // ==========================================

        this.fundoTemplateRacao = this.add.image(centroDireitaX, altura * 0.56, "fundoTemplateRacao")
            .setScale(altura * 0.00075);

        this.containerTexto = this.add.container(centroDireitaX, altura * 0.55);

        const titulo = this.add.text(0, -altura*0.15, "Compre sua ração!", {
            fontSize: "22px", color: "#000", fontFamily: '"Press Start 2P"', align: "center"
        }).setScale(altura*0.00125).setOrigin(0.5);

        const subtitulo = this.add.text(0, altura*0.02, "Escolha o tipo de\n\nração ideal para seu\n\npet entre Super\n\nPremium e Standard", {
            fontSize: "18px", color: "#000", fontFamily: '"Press Start 2P"', align: "center", wordWrap: { width: 450 }
        }).setScale(altura*0.0013).setOrigin(0.5);

        this.containerTexto.add([titulo, subtitulo]);

        this.botaoComprarStandard = criarBotao(
            centroDireitaX, altura * 0.85, 
            "botaoComprarStandard", "botaoComprarStandardPressionado",
            0.35, 0.4, 0.30,
            () => this.executarCompra()
        ).setVisible(false).setAlpha(0);

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

        this.racoesStandard.forEach((racao) => {
            racao.sprite.setInteractive({ useHandCursor: true });

            racao.sprite.on("pointerover", () => this.tweens.add({ targets: racao.sprite, scale: 0.32, duration: 100, ease: "Power2" }));
            racao.sprite.on("pointerout", () => this.tweens.add({ targets: racao.sprite, scale: 0.3, duration: 100, ease: "Power2" }));

            racao.sprite.on("pointerup", () => {
                this.tweens.add({
                    targets: this.containerTexto, alpha: 0, duration: 200, ease: "Power2",
                    onComplete: () => this.containerTexto.setVisible(false)
                });

                this.textoTipo.setText(racao.tipo || "Standard");
                this.textoPorte.setText(racao.porte || "-");
                this.textoIdade.setText(racao.idade || "-");
                this.textoChar1.setText(racao.caracteristicas ? racao.caracteristicas[0] : "");
                this.textoChar2.setText(racao.caracteristicas ? racao.caracteristicas[1] : "");
                this.textoTrigo.setText(racao.nutrientes ? racao.nutrientes.trigo : "");
                this.textoCarne.setText(racao.nutrientes ? racao.nutrientes.carne : "");
                this.textoOsso.setText(racao.nutrientes ? racao.nutrientes.osso : "");
                this.textoGordura.setText(racao.nutrientes ? racao.nutrientes.gordura : "");
                this.imagemRacaoInfo.setTexture(racao.sprite.texture.key);

                // ATUALIZANDO O PREÇO NA TELA (NOVO)
                const valorAtual = racao.valor || 15;
                this.textoPreco.setText(`PREÇO: ${valorAtual} MOEDAS`);

                this.composicaoRacao.setVisible(true);
                
                this.containerInfo.setAlpha(0).setVisible(true);
                this.botaoComprarStandard.setVisible(true);
                
                // INCLUINDO textoPreco NO TWEEN (NOVO)
                this.tweens.add({ 
                    targets: [this.containerInfo, this.botaoComprarStandard], 
                    alpha: 1, 
                    duration: 250, 
                    ease: "Power2" 
                });
            });
        });

        this.scale.on("resize", (gameSize) => {
            const w = gameSize.width;
            const h = gameSize.height;

            this.cameras.resize(w, h);
            this.fundo.setDisplaySize(w, h).setPosition(w / 2, h / 2);
            
            this.textoMoedas.setPosition(w * 0.95, h * 0.05); // Reposiciona HUD
            this.estante.setPosition(w * 0.30, h * 0.6);
            this.botaoStandard.setPosition(w * 0.20, h * 0.15);
            this.botaoSuperPremium.setPosition(w * 0.40, h * 0.15);

            this.fundoTemplateRacao.setPosition(w * 0.70, h * 0.56).setScale(h * 0.00065);
            this.containerTexto.setPosition(w * 0.70, h * 0.55);
            
            this.containerInfo.setPosition(w * 0.70, h * 0.47).setScale(h * 0.0009);
            this.botaoComprarStandard.setPosition(w * 0.70, h * 0.85);

            const novasColunas = [w * 0.18, w * 0.30, w * 0.42];
            const novasLinhas = [h * 0.37, h * 0.605, h * 0.845];
            
            let index = 0;
            for (let i = 0; i < 3; i++) { 
                for (let j = 0; j < 3; j++) { 
                    if(this.racoesStandard[index]) {
                        this.racoesStandard[index].sprite.setPosition(novasColunas[j], novasLinhas[i]);
                    }
                    index++;
                }
            }
        });
    }

    // ==========================================
    // LÓGICA DE COMPRA
    // ==========================================
    executarCompra() {
        const selecionada = Racao.selecionada;

        if (!selecionada) {
            console.log("Nenhuma ração selecionada!");
            return;
        }

        const valorDaRacao = selecionada.valor || 15;

        if (gameState.cobasiCoins >= valorDaRacao) {
            gameState.cobasiCoins -= valorDaRacao;
            console.log(`Compra efetuada! Saldo restante: ${gameState.cobasiCoins}`);
            
            // ATUALIZA O HUD DE MOEDAS APÓS COMPRA BEM SUCEDIDA (NOVO)
            this.textoMoedas.setText(`MOEDAS: ${gameState.cobasiCoins}`);

            this.exibirFeedbackCompra(true, valorDaRacao);
            
        } else {
            console.log("Saldo insuficiente para comprar a ração.");
            this.exibirFeedbackCompra(false, valorDaRacao);
        }
    }

    exibirFeedbackCompra(sucesso, valor) {
        const cor = sucesso ? "#009900" : "#ff0000";
        const msg = sucesso ? `- ${valor} MOEDAS` : "SALDO INSUFICIENTE";
        
        const feedback = this.add.text(this.scale.width * 0.70, this.scale.height * 0.85, msg, {
            fontFamily: '"Press Start 2P"',
            fontSize: "20px",
            color: cor,
            stroke: "#ffffff",
            strokeThickness: 4
        }).setOrigin(0.5);

        this.tweens.add({
            targets: feedback,
            y: feedback.y - 50,
            alpha: 0,
            duration: 1500,
            ease: "Power2",
            onComplete: () => feedback.destroy()
        });
    }

    // Transição do botão comprar para cena do mini game de alimentação
    transicaoPara(chaveCena) {
        if (this.transicao) return;

        this.transicao = true;
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            if (this.scene.isActive("ficha")) {
                this.scene.stop("ficha");
            }
            this.scene.start(chaveCena);
        });
    }
}