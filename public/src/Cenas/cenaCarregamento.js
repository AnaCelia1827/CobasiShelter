export class cenaCarregamento extends Phaser.Scene {
    constructor() {
        super({ key: "cenaCarregamento" });
    }

    preload() {
        // Tela Inicial
        this.load.image("bgInical", "assets/tela-inicial/bgInicial.png");
        this.load.image("botaoJogarNormal", "assets/tela-inicial/botaoJogarNormal.png");
        this.load.image("botaoJogarCrescendo", "assets/tela-inicial/botaoJogarCrescendo.png");
        this.load.image("botaoJogarPressionado", "assets/tela-inicial/botaoJogarPressionado.png");
        this.load.image("botaoSairNormal", "assets/tela-inicial/botaoSairNormal.png");
        this.load.image("botaoSairCrescendo", "assets/tela-inicial/botaoSairCrescendo.png");
        this.load.image("botaoSairPressionado", "assets/tela-inicial/botaoSairPressionado.png");
        this.load.image("botaoConfiguracoesNormal", "assets/tela-inicial/botaoConfiguracoesNormal.png");
        this.load.image("botaoConfiguracoesCrescendo", "assets/tela-inicial/botaoConfiguracoesCrescendo.png");
        this.load.image("botaoConfiguracoesPressionado", "assets/tela-inicial/botaoConfiguracoesPressionado.png");

        // Tela Configurações
        this.load.image("retornoInicio", "assets/tela-configuracoes/retornoInicio.png");
        this.load.image("configuracoes", "assets/tela-configuracoes/configuracoes.png");
        this.load.image("botaoOff", "assets/tela-configuracoes/botaoOff.png");
        this.load.image("botaoOn", "assets/tela-configuracoes/botaoOn.png");
        
        // HUD
        this.load.image("iconeBanho", "assets/iconeBanho.png");
        this.load.image("iconeRacao", "assets/iconeRacao.png");
        this.load.image("iconeCuidados", "assets/iconeCuidados.png");
        this.load.image("iconeLazer", "assets/iconeLazer.png");
        this.load.image("iconeVoltar", "assets/iconeVoltar.png");

        // Cenas de gameplay
        this.load.image("bgRacao", "assets/tela-alimentacao/bgRacao.png");
        this.load.image("bgLimpo", "assets/bgLimpo.png");
        this.load.image("bgGameScene", "assets/bgGameScene.png");
        this.load.image("bgBanheiro", "assets/tela-banho/bgBanheiro.png");
        this.load.image("estanteVazia", "assets/tela-alimentacao/estanteVazia.png");
        this.load.image("estanteRacao", "assets/tela-alimentacao/estanteRacao.png");
        this.load.image("racaoVazia", "assets/tela-alimentacao/racaoVazia.png");
        this.load.image("mineFicha", "assets/mineFicha.png");
        this.load.image("botaoVoltar", "assets/botaoVoltar.png");
        this.load.image("chuveiro", "assets/tela-banho/chuveiro.png");
        this.load.image("sabao", "assets/tela-banho/barrasabao.png");
        this.load.image("toalha", "assets/tela-banho/toalha.png");
        this.load.image("bolhas", "assets/tela-banho/bolhas.png");

        // OTIMIZACAO: usar texturas menores evita decode/upload inicial muito pesado na primeira entrada da cena de rações.
        this.load.image("racaoGA", "assets/Racoes/otimizadas/racaoGA.png");
        this.load.image("racaoGF", "assets/Racoes/otimizadas/racaoGF.png");
        this.load.image("racaoGV", "assets/Racoes/otimizadas/racaoGV.png");
        this.load.image("racaoMA", "assets/Racoes/otimizadas/racaoMA.png");
        this.load.image("racaoMF", "assets/Racoes/otimizadas/racaoMF.png");
        this.load.image("racaoMV", "assets/Racoes/otimizadas/racaoMV.png");

        // Audio
        this.load.audio("musica", "assets/trilhaSonora.mp3");

        // Spritesheets
        this.load.spritesheet("cachorro", "assets/dogLimpo.png", {
            frameWidth: 720,
            frameHeight: 960
        });
        this.load.spritesheet("dogEspuma", "assets/dogEspumado.png", {
            frameWidth: 720,
            frameHeight: 960
        });
        this.load.spritesheet("dogSujo", "assets/dogSujo.png", {
            frameWidth: 720,
            frameHeight: 960
        });
        this.load.spritesheet("dogLimpo", "assets/dogLimpo.png", {
            frameWidth: 720,
            frameHeight: 960
        });
        this.load.spritesheet("agua", "assets/tela-banho/agua.png", {
            frameWidth: 480,
            frameHeight: 480
        });
    }

    create() {
        this.scene.start("cenaInicial");
    }
}
