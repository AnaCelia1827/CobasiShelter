export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        // Menu
        this.load.image("bg", "assets/bgInicial.png");
        this.load.image("botaoJogar", "assets/botaoJogar.png");
        this.load.image("botaoTutorial", "assets/botaoTutorial.png");
        this.load.image("botaoSair", "assets/botaoSair.png");
        this.load.image("botaoConfiguracoes", "assets/botaoConfiguracoes.png");
        this.load.image("retornoInicio", "assets/retornoInicio.png");
        this.load.image("settings", "assets/settings.png");

        // HUD
        this.load.image("iconeBanho", "assets/iconeBanho.png");
        this.load.image("iconeRacao", "assets/iconeRacao.png");
        this.load.image("iconeCuidados", "assets/iconeCuidados.png");
        this.load.image("iconeLazer", "assets/iconeLazer.png");
        this.load.image("iconeVoltar", "assets/iconeVoltar.png");

        // Cenas de gameplay
        this.load.image("bgRacao", "assets/bgRacao.png");
        this.load.image("bgLimpo", "assets/bgLimpo.png");
        this.load.image("bgGameScene", "assets/bgGameScene.png");
        this.load.image("banheiro", "assets/banheiro.png");
        this.load.image("bgBanheiro", "assets/bgBanheiro.png");
        this.load.image("estanteVazia", "assets/estanteVazia.png");
        this.load.image("estanteRacao", "assets/estanteRacao.png");
        this.load.image("racaoVazia", "assets/racaoVazia.png");
        this.load.image("mineFicha", "assets/mineFicha.png");
        this.load.image("botaoVoltar", "assets/botaoVoltar.png");
        this.load.image("chuveiro", "assets/chuveiro.png");
        this.load.image("sabao", "assets/barrasabao.png");
        this.load.image("toalha", "assets/toalha.png");
        this.load.image("bolhas", "assets/bolhas.png");

        // Racoes
        this.load.image("racaoGA", "assets/Racoes/racaoGA.png");
        this.load.image("racaoGF", "assets/Racoes/racaoGF.png");
        this.load.image("racaoGV", "assets/Racoes/racaoGV.png");
        this.load.image("racaoMA", "assets/Racoes/racaoMA.png");
        this.load.image("racaoMF", "assets/Racoes/racaoMF.png");
        this.load.image("racaoMV", "assets/Racoes/racaoMV.png");

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
        this.load.spritesheet("agua", "assets/agua.png", {
            frameWidth: 480,
            frameHeight: 480
        });
    }

    create() {
        this.scene.start("introScene");
    }
}
