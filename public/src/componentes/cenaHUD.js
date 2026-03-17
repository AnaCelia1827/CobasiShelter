import { gameState } from "../main.js";
import { Barra } from "./Barras/barras.js";

export class cenaHUD extends Phaser.Scene {
    constructor() {
        super({ key: "cenaHUD" });
        this.transicao = false;
    }

    create() {
        this.transicao = false;

        // Configuração inicial do painel
        const larguraPainel = this.scale.width * 0.2;
        const painelX = this.scale.width - larguraPainel / 2;
        const centroY = this.scale.height / 2;
        const topoY = Math.max(100, this.scale.height * 0.12);
        const espaco = Math.max(90, this.scale.height * 0.18);
          
        //adiciona cobasi Coins 
        this.coinIcon = this.add.image(1440, 50, "cobasiCoin") 
        .setScale(0.65) 
        .setScrollFactor(0) 
        .setDepth(1000); 
        
        // Texto das moedas 
        this.coinText = this.add.text(1440, 45, 
            gameState.cobasiCoins, 
            { 
                fontFamily: '"Press Start 2P"', 
                fontSize: "16px", 
                color: "#ffffff" 
            }) 
        .setScrollFactor(0) 
         .setDepth(1000); 
        
         // Ícones e barras
        this.iconeFome = this.add.image(100, 100, "iconeFome").setScale(1.5);
        this.barraComida = new Barra(this, 230, 100, gameState.barras.comida);

        this.iconeFelicidade = this.add.image(100, 160, "iconeFelicidade").setScale(1.5);
        this.barraLazer = new Barra(this, 230, 160, gameState.barras.lazer);

        this.iconeSujeira = this.add.image(100, 220, "iconeSujeira").setScale(1.5);
        this.barraLimpeza = new Barra(this, 230, 220, gameState.barras.limpeza);

        this.iconeSaude = this.add.image(100, 280, "iconeSaude").setScale(1.5);
        this.barraSaude = new Barra(this, 230, 280, gameState.barras.saude);

        // Fundo do painel
        this.painel = this.add.rectangle(painelX, centroY, larguraPainel, this.scale.height, 0xffffff, 1)
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0);

        // Botões
        this.botoes = [];
        const criarBotao = (indice, textura, cenaAlvo) => {
            const y = topoY + indice * espaco;
            const botao = this.add.image(painelX, y, textura)
                .setInteractive({ useHandCursor: true })
                .setScale(0.7)
                .setScrollFactor(0);
            botao.on("pointerdown", () => this.transicionarPara(cenaAlvo));
            this.botoes.push({ botao, indice, cenaAlvo });
        };

        criarBotao(0.5, "iconeBanho", "cenaBanho");
        criarBotao(1.5, "iconeRacao", "cenaComida");
        criarBotao(2.5, "iconeCuidados", "cenaCuidado");
        criarBotao(3.5, "iconeLazer", "jogoLazer");
        criarBotao(4.5, "iconeVoltar", "cenaPrincipal");

        // >>> Listener de resize <<<
        this.scale.on("resize", (gameSize) => {
            const width = gameSize.width;
            const height = gameSize.height;

            const larguraPainel = width * 0.2;
            const painelX = width - larguraPainel / 2;
            const centroY = height / 2;
            const topoY = Math.max(100, height * 0.12);
            const espaco = Math.max(90, height * 0.18);

            this.cameras.resize(width, height);

            // Atualiza painel
            this.painel.setSize(larguraPainel, height).setPosition(painelX, centroY);

            // Atualiza botões
            this.botoes.forEach(({ botao, indice }) => {
                const y = topoY + indice * espaco;
                botao.setPosition(painelX, y);
            });
        });
    }

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

    update() {
        this.barraComida.valor  = gameState.barras.comida;
        this.barraLazer.valor   = gameState.barras.lazer; 
        this.barraLimpeza.valor = gameState.barras.limpeza; 
        this.barraSaude.valor   = gameState.barras.saude;

        this.barraComida.atualizarBarra();
        this.barraLazer.atualizarBarra();
        this.barraLimpeza.atualizarBarra();
        this.barraSaude.atualizarBarra();
         // Atualiza moedas 

        this.coinText.setText(gameState.cobasiCoins); 
    }
}
