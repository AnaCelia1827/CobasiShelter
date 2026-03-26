import { gameState } from "../main.js";
import { Barra } from "./barras/barras.js";

export class HUD extends Phaser.Scene {
    constructor() {
        super({ key: "HUD" });
        this.transicao = false; // Flag para evitar múltiplas transições simultâneas
    }

    create() {
        this.transicao = false;

        // Configuração inicial do painel lateral
        const larguraPainel = this.scale.width * 0.2;
        const painelX = this.scale.width - larguraPainel / 2;
        const centroY = this.scale.height / 2;

        // Ícone e texto das moedas
        this.coinIcon = this.add.image(this.scale.width - this.scale.width*0.1, this.scale.height*0.05, "cobasiCoin")
            .setScale(this.scale.height*0.0008)
            .setScrollFactor(0)
            .setDepth(1000);

        this.coinText = this.add.text(this.scale.width - this.scale.width*0.09, this.scale.height*0.045,
            gameState.cobasiCoins,
            {
                fontFamily: '"Press Start 2P"',
                fontSize: "16px",
                color: "#ffffff"
            })
            .setScrollFactor(0)
            .setDepth(1000)
            .setScale(this.scale.height*0.0013);

        // Ícones e barras de status
        this.iconeFome = this.add.image(this.scale.width*0.05, this.scale.height*0.08, "iconeFome").setScale(this.scale.height*0.002);
        this.barraComida = new Barra(this, this.scale.width*0.15, this.scale.height*0.08, gameState.barras.comida);
        this.barraComida.sprite.setScale(this.scale.height*0.002);

        this.iconeFelicidade = this.add.image(this.scale.width*0.05, this.scale.height*0.16, "iconeFelicidade").setScale(this.scale.height*0.002);
        this.barraLazer = new Barra(this, this.scale.width*0.15, this.scale.height*0.16, gameState.barras.lazer);
        this.barraLazer.sprite.setScale(this.scale.height*0.002);

        this.iconeSujeira = this.add.image(this.scale.width*0.05, this.scale.height*0.24, "iconeSujeira").setScale(this.scale.height*0.002);
        this.barraLimpeza = new Barra(this, this.scale.width*0.15, this.scale.height*0.24, gameState.barras.limpeza);
        this.barraLimpeza.sprite.setScale(this.scale.height*0.002);

        this.iconeSaude = this.add.image(this.scale.width*0.05, this.scale.height*0.32, "iconeSaude").setScale(this.scale.height*0.002);
        this.barraSaude = new Barra(this, this.scale.width*0.15, this.scale.height*0.32, gameState.barras.saude);
        this.barraSaude.sprite.setScale(this.scale.height*0.002);

        // Fundo do painel lateral
        this.painel = this.add.rectangle(painelX, centroY, larguraPainel, this.scale.height, 0xffffff, 1)
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0);

        // Botões do painel
        this.botoes = [];

        const botaoBanho = this.add.image(painelX, this.scale.height*0.2, "iconeBanho")
            .setInteractive({ useHandCursor: true })
            .setScale(this.scale.height*0.001)
            .setScrollFactor(0);
        botaoBanho.on("pointerdown", () => this.transicionarPara("cenaBanho"));
        this.botoes.push({ botao: botaoBanho, cenaAlvo: "cenaBanho" });

        const botaoRacao = this.add.image(painelX, this.scale.height*0.4, "iconeRacao")
            .setInteractive({ useHandCursor: true })
            .setScale(this.scale.height*0.001)
            .setScrollFactor(0);
        botaoRacao.on("pointerdown", () => this.transicionarPara("cenaComida"));
        this.botoes.push({ botao: botaoRacao, cenaAlvo: "cenaComida" });

        const botaoCuidados = this.add.image(painelX, this.scale.height*0.6, "iconeCuidados")
            .setInteractive({ useHandCursor: true })
            .setScale(this.scale.height*0.001)
            .setScrollFactor(0);
        botaoCuidados.on("pointerdown", () => this.transicionarPara("cenaVeterinario"));
        this.botoes.push({ botao: botaoCuidados, cenaAlvo: "cenaVeterinario" });

        const botaoLazer = this.add.image(painelX, this.scale.height*0.8, "iconeLazer")
            .setInteractive({ useHandCursor: true })
            .setScale(this.scale.height*0.001)
            .setScrollFactor(0);
        botaoLazer.on("pointerdown", () => this.transicionarPara("cenaLazer"));
        this.botoes.push({ botao: botaoLazer, cenaAlvo: "cenaLazer" });

        const botaoVoltar = this.add.image(painelX, this.scale.height*0.95, "iconeVoltar")
            .setInteractive({ useHandCursor: true })
            .setScale(this.scale.height*0.001)
            .setScrollFactor(0);
        botaoVoltar.on("pointerdown", () => this.transicionarPara("cenaPrincipal"));
        this.botoes.push({ botao: botaoVoltar, cenaAlvo: "cenaPrincipal" });

        // Listener de resize para ajustar elementos dinamicamente
        const handleResizeHUD = (tamanhoTela) => {
            const { width: largura, height: altura } = tamanhoTela;

            const larguraPainel = largura * 0.2;
            const painelX = largura - larguraPainel / 2;
            const centroY = altura / 2;

            // Painel lateral
            this.painel.setSize(larguraPainel, altura).setPosition(painelX, centroY);

            // Botões (mantendo proporções verticais)
            this.botoes[0].botao.setPosition(painelX, altura * 0.2).setScale(altura * 0.001);
            this.botoes[1].botao.setPosition(painelX, altura * 0.4).setScale(altura * 0.001);
            this.botoes[2].botao.setPosition(painelX, altura * 0.6).setScale(altura * 0.001);
            this.botoes[3].botao.setPosition(painelX, altura * 0.8).setScale(altura * 0.001);
            this.botoes[4].botao.setPosition(painelX, altura * 0.95).setScale(altura * 0.001);

            // Moedas
            this.coinIcon.setPosition(largura - largura * 0.1, altura * 0.05).setScale(altura * 0.0008);
            this.coinText.setPosition(largura - largura * 0.09, altura * 0.045).setScale(altura * 0.0013);

            // Ícones e barras (ajustados para espaçamento proporcional)
            this.iconeFome.setPosition(largura * 0.05, altura * 0.08).setScale(altura * 0.002);
            this.barraComida.sprite.setPosition(largura * 0.15, altura * 0.08).setScale(altura * 0.002);

            this.iconeFelicidade.setPosition(largura * 0.05, altura * 0.16).setScale(altura * 0.002);
            this.barraLazer.sprite.setPosition(largura * 0.15, altura * 0.16).setScale(altura * 0.002);

            this.iconeSujeira.setPosition(largura * 0.05, altura * 0.24).setScale(altura * 0.002);
            this.barraLimpeza.sprite.setPosition(largura * 0.15, altura * 0.24).setScale(altura * 0.002);

            this.iconeSaude.setPosition(largura * 0.05, altura * 0.32).setScale(altura * 0.002);
            this.barraSaude.sprite.setPosition(largura * 0.15, altura * 0.32).setScale(altura * 0.002);
        };

        this.scale.on("resize", handleResizeHUD);

        this.events.on('shutdown', () => {
            this.scale.off("resize", handleResizeHUD);
        });

    }

    // Função de transição de cenas com fade e parada da música
    transicionarPara(cenaAlvo) {
        if (this.transicao) return;
        if (!this.scene.manager.keys[cenaAlvo]) {
            console.error(`Cena não registrada: ${cenaAlvo}`);
            return;
        }

        const cenasAtivas = this.scene.manager.getScenes(true);
        const cenaJogo = cenasAtivas.find(cena => {
            const chave = cena.scene.key;
            return chave !== "cenaHUD" && chave !== "ficha";
        });

        if (cenaJogo?.scene.key === cenaAlvo) return;

        this.transicao = true;
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            cenasAtivas.forEach(cena => {
                const chave = cena.scene.key;
                if (chave !== "cenaHUD" && chave !== cenaAlvo) {
                    this.scene.stop(chave);
                }
            });
            if (!this.scene.isActive(cenaAlvo)) {
                this.scene.launch(cenaAlvo);
            }
            this.scene.bringToTop("cenaHUD");
            this.cameras.main.fadeIn(300, 0, 0, 0);
            this.transicao = false;
        });
    }


    // Atualização contínua dos elementos do HUD
    update() {
        // Atualiza valores das barras com base no estado do jogo
        this.barraComida.valor  = gameState.barras.comida;
        this.barraLazer.valor   = gameState.barras.lazer;
        this.barraLimpeza.valor = gameState.barras.limpeza;
        this.barraSaude.valor   = gameState.barras.saude;

        // Re-renderiza as barras
        this.barraComida.atualizarBarra();
        this.barraLazer.atualizarBarra();
        this.barraLimpeza.atualizarBarra();
        this.barraSaude.atualizarBarra();

        // Atualiza quantidade de moedas exibida
        this.coinText.setText(gameState.cobasiCoins);

        // Verifica se todas as barras estão a 0 e evolui o cachorro
        this.verificarManutencaoCachorro();
    }

    verificarManutencaoCachorro() {
        // Verifica se todas as barras chegaram a 0
        const barrasZero = 
            gameState.barras.comida <= 0 &&
            gameState.barras.lazer <= 0 &&
            gameState.barras.limpeza <= 0 &&
            gameState.barras.saude <= 0

        // Se todas as barras estão em 0 e ainda é Caramelo, volta para cenaPrincipal
        if (barrasZero && gameState.pets.cachorroCaramelo === true && !this.transicao) {
            this.transicionarPara("cenaPrincipal")
        }
    }
}
