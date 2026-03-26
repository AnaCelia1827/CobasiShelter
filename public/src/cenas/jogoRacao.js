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
        // 1. CHAMA A INSTRUÇÃO LOGO NO INÍCIO (Com Depth alto para não ser coberta)
        this.mostrarInstrucoes();

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

        // 2. FUNDO E ELEMENTOS DO JOGO
        this.fundo = this.add.image(this.scale.width / 2, this.scale.height / 2, "bgLimpo")
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        this.estante = this.add.image(this.scale.width / 4, this.scale.height * 0.6, "estanteVazia")
            .setScale(1.2)
            .setDepth(0);

        // Botões de Categoria
        this.botaoStandard = criarBotao(this.scale.width * 0.15, this.scale.height * 0.145, "botaoStandard", "botaoStandardPressionado", 0.5, 0.55, 0.45);
        this.botaoSuperPremium = criarBotao(this.scale.width * 0.35, this.scale.height * 0.15, "botaoSuperPremium", "botaoSuperPremiumPressionado", 0.5, 0.55, 0.45);

        // Grupos de Rações
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
        this.racoesSuperPremium.forEach(r => {
            r.sprite.setScale(0.125).setDepth(1);
            r.sprite.setInteractive({ useHandCursor: true });
            
            // Evento de clique na ração
            r.sprite.on("pointerup", () => this.exibirInfoRacao(r));
        });

        // Template de Informação (Lado Direito)
        this.fundoTemplateRacao = this.add.image(this.scale.width * 0.58, this.scale.height * 0.47, "fundoTemplateRacao")
            .setScale(this.scale.height * 0.00065);

        this.containerTexto = this.add.container(this.fundoTemplateRacao.x, this.fundoTemplateRacao.y);
        
        const titulo = this.add.text(0, -200, "Compre sua ração!", { fontSize: "30px", color: "#000", fontFamily: '"Press Start 2P"', align: "center" }).setOrigin(0.5);
        const subtitulo = this.add.text(0, 0, "Escolha a ração\nideal para seu pet", { fontSize: "20px", color: "#000", fontFamily: '"Press Start 2P"', align: "center" }).setOrigin(0.5);
        this.containerTexto.add([titulo, subtitulo]);

        // Listener de Resize corrigido
        this.scale.on("resize", (gameSize) => {
            this.cameras.resize(gameSize.width, gameSize.height);
            this.fundo.setDisplaySize(gameSize.width, gameSize.height).setPosition(gameSize.width / 2, gameSize.height / 2);
        });
    }
}