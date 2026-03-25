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
import { gameState } from "../main.js";
import { ficha } from "../componentes/ficha.js";

export class cenaRacaoSuperPremium extends Phaser.Scene {
    constructor() {
        super({ key: "cenaRacaoSuperPremium" });
    }

    create() {

        const pet = cachorrosBase[0];

        // Deixa o HUD invisível
        this.scene.stop("HUD");

        this.transicao = false;

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

        // Função predefinida para criação de botões
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
            () => {
                // Se você tiver uma lógica de transição personalizada, substitua aqui
                this.scene.start("cenaRacaoStandart") 
            }
        );

        // Botão SuperPremium
        this.botaoSuperPremium = criarBotao(
            this.scale.width * 0.35, this.scale.height * 0.15,
            "botaoSuperPremium", "botaoSuperPremiumPressionado",
            0.5, 0.55, 0.45,
            () => {} // Já estamos nela, não faz nada
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
        this.racoesSuperPremium.forEach(r => r.sprite.setScale(0.38));


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

        // Torna todas as rações clicáveis
        const todasRacoes = [...this.racoesSuperPremium, ...this.racoesStandard];

        todasRacoes.forEach((racao) => {
            racao.sprite.setInteractive({ useHandCursor: true });

            racao.sprite.on("pointerover", () => {
                this.tweens.add({ targets: racao.sprite, scale: 0.45, duration: 200, ease: "Power2" });
            });

            racao.sprite.on("pointerout", () => {
                this.tweens.add({ targets: racao.sprite, scale: 0.38, duration: 200, ease: "Power2" });
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
                // Limpa o texto de feedback de erro se o jogador clicar em outra ração
                if (this.textoFeedback) {
                    this.textoFeedback.setText("");
                }

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

        // Container único com TUDO do painel direito
        this.containerPainel = this.add.container(
            this.scale.width * 0.68,
            this.scale.height * 0.47
        );

        // Fundo do template das informações das rações
        this.fundoTemplateRacao = this.add.image(
            this.scale.width * 0.68,
            this.scale.height * 0.47,
            "fundoTemplateRacao"
        ).setScale(this.scale.height * 0.00085);

        // Container invisível para centralizar o texto no template
        this.containerTexto = this.add.container(
            this.fundoTemplateRacao.x,
            this.fundoTemplateRacao.y
        );

        const titulo = this.add.text(0, -200, "Compre sua ração!",
            {
                fontSize: "28px",
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

        // Adiciona o texto inicial no container
        this.containerTexto.add([titulo, subtitulo]);
        // === TEXTO DE FEEDBACK ===
        this.textoFeedback = this.add.text(
            this.scale.width * 0.68, 
            this.scale.height * 0.83, // Fica abaixo do botão
            "",
            {
                fontSize: "14px",
                color: "#ff0000",
                fontFamily: '"Press Start 2P"',
                align: "center",
                wordWrap: { width: 350 }
            }
        ).setOrigin(0.5);

        // === BOTÃO COMPRAR ===
        this.botaoComprar = criarBotao(
            this.scale.width * 0.68, this.scale.height * 0.75,
            "botaoComprar", "botaoComprarPressionado",
            0.25, 0.27, 0.23,
            () => {
                // 1. Verifica se alguma ração foi selecionada
                if (!Racao.selecionada) {
                    this.textoFeedback.setText("SELECIONE UMA RAÇÃO PRIMEIRO!");
                    this.textoFeedback.setColor("#ff0000"); // Vermelho
                    return;
                }

                // 2. Compara o ID da ração com o ID do cachorro
                if (Racao.selecionada.id === pet.id) {
                    // Acertou!
                    this.textoFeedback.setText("ACERTOU! ESSA É A RAÇÃO IDEAL!\nRedirecionando...");
                    this.textoFeedback.setColor("#006600"); // Verde

                    // Desativa o botão
                    this.botaoComprar.disableInteractive();

                    // Aguarda 1.5s e muda de cena
                    this.time.delayedCall(1500, () => {
                        Racao.selecionada = null; // Limpa a ração selecionada
                        this.scene.start("jogoAlimentacao"); // Redireciona
                    });
                } else {
                    // Errou!
                    this.textoFeedback.setText("ESSA RAÇÃO NÃO É IDEAL.\nESCOLHA OUTRA RAÇÃO.");
                    this.textoFeedback.setColor("#ff0000"); // Vermelho
                }
            }
        ).setScale(0.25);

        // Container com as informações e imagens ao clicar na ração
        this.containerInfo = this.add.container(
            this.scale.width * 0.68,
            this.scale.height * 0.43
        )
        .setScale(this.scale.height * 0.0009)
        .setVisible(false).setAlpha(0);

        // A imagem entra no container no X: 0, Y: 0 (centro)
        this.composicaoRacao = this.add.image(0, 0, "composicaoRacao").setScale(1.2);

        // Imagem da ração clicada (ao lado das informações)
        this.imagemRacaoInfo = this.add.image(-215, -60, "").setScale(0.6);

        // Título (super Premium / standard)
        this.textoTipo = this.add.text(0, -250, "", {
            fontSize: "48px", color: "#000", fontFamily: '"Press Start 2P"', align: "center"
        }).setOrigin(0.5);

        // Porte 
        this.textoPorte = this.add.text(100, -165, "", {
            fontSize: "20px", 
            color: "#006600", 
            fontFamily: '"Press Start 2P"'
        }).setOrigin(0, 0.5);

        // Idade 
        this.textoIdade = this.add.text(100, -120, "", {
            fontSize: "20px", 
            color: "#006600", 
            fontFamily: '"Press Start 2P"'
        }).setOrigin(0, 0.5);

        // Mini descrição 1
        this.textoChar1 = this.add.text(105, -54, "", {
            fontSize: "19px", 
            color: "#000", 
            fontFamily: '"Press Start 2P"', 
            align: "center", 
            wordWrap: { width: 500 }
        }).setOrigin(0.5);

        // Mini descrição 2
        this.textoChar2 = this.add.text(105, 18, "", {
            fontSize: "19px", 
            color: "#000", 
            fontFamily: '"Press Start 2P"', 
            align: "center", 
            wordWrap: { width: 500 }
        }).setOrigin(0.5);

        // Porcentagens nutricionais
        const porcentagem = { fontSize: "14px", color: "#8B4513", fontFamily: '"Press Start 2P"' };
        this.textoTrigo = this.add.text(-205, 250, "", porcentagem).setOrigin(0.5);
        this.textoCarne = this.add.text(-70, 250, "", porcentagem).setOrigin(0.5);
        this.textoOsso = this.add.text(65, 250, "", porcentagem).setOrigin(0.5);
        this.textoGordura = this.add.text(200, 250, "", porcentagem).setOrigin(0.5);

        // Colocando textos e a imagem da ração por cima do container (imagem)
        this.containerInfo.add([
            this.composicaoRacao,
            this.imagemRacaoInfo,
            this.textoTipo, this.textoPorte, this.textoIdade, 
            this.textoChar1, this.textoChar2,
            this.textoTrigo, this.textoCarne, this.textoOsso, this.textoGordura
        ]);

        // >>> Listener de resize <<<
        this.scale.on("resize", (gameSize) => {
            const largura = gameSize.width;
            const altura = gameSize.height;

            this.cameras.resize(largura, altura);
            this.fundo.setDisplaySize(largura, altura).setPosition(largura / 2, altura / 2);
            this.estante.setPosition(largura / 4, altura * 0.6);
        });
    }
};
