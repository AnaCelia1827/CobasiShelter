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

        //icons de barras
        this.load.image("iconeFome", "assets/Icones/iconeFome.png");
        this.load.image("iconeFelicidade", "assets/Icones/iconeFelicidade.png");
        this.load.image("iconeSaude", "assets/Icones/iconeSaude.png");
        this.load.image("iconeSujeira", "assets/Icones/iconeSujeira.png");

        //Barras 
        this.load.spritesheet("barra", "assets/Icones/BarraStatus.png", {
            frameWidth: 144,
            frameHeight: 32
        });

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

        // OTIMIZACAO: usar texturas menores evita decode/upload inicial muito pesado na primeira entrada da cena de rações.
        this.load.image("racaoGA", "assets/Racoes/otimizadas/racaoGA.png");
        this.load.image("racaoGF", "assets/Racoes/otimizadas/racaoGF.png");
        this.load.image("racaoGV", "assets/Racoes/otimizadas/racaoGV.png");
        this.load.image("racaoMA", "assets/Racoes/otimizadas/racaoMA.png");
        this.load.image("racaoMF", "assets/Racoes/otimizadas/racaoMF.png");
        this.load.image("racaoMV", "assets/Racoes/otimizadas/racaoMV.png");
        this.load.image("racaoPV", "assets/Racoes/otimizadas/racaoPV.png");
        this.load.image("racaoPF", "assets/Racoes/otimizadas/racaoPF.png");
        this.load.image("racaoPA", "assets/Racoes/otimizadas/racaoPA.png");
       

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
        //this.scene.start("introScene");
        this.scene.start("jogoRacao");
    }
}
