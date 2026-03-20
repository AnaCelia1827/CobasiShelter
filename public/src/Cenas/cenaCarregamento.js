// Exporta a cena responsável por carregar todos os assets (imagens, sprites, sons, etc.)
export class cenaCarregamento extends Phaser.Scene {
    constructor() {
        // Define a chave da cena como "cenaCarregamento"
        super({ key: "cenaCarregamento" });
    }

    preload() {
        // Tela Inicial
        this.load.image("bgInicial", "assets/tela-inicial/bgInicial.png"); // Fundo da tela inicial
        this.load.image("bgPrincipal", "assets/tela-principal/bgPrincipal.png");         // Fundo principal
        this.load.image("bgLazer", "assets/bgLazer.png")
        // Botões da tela inicial em diferentes estados (normal, crescendo, pressionado)
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
        this.load.image("retornoInicio", "assets/tela-configuracoes/retornoInicio.png"); // Botão de voltar
        this.load.image("configuracoes", "assets/tela-configuracoes/configuracoes.png"); // Fundo de configurações
        this.load.image("botaoOff", "assets/tela-configuracoes/botaoOff.png");           // Botão desligado
        this.load.image("botaoOn", "assets/tela-configuracoes/botaoOn.png");             // Botão ligado

        // Ícones das barras de status
        this.load.image("iconeFome", "assets/Icones/iconeFome.png");
        this.load.image("iconeFelicidade", "assets/Icones/iconeFelicidade.png");
        this.load.image("iconeSaude", "assets/Icones/iconeSaude.png");
        this.load.image("iconeSujeira", "assets/Icones/iconeSujeira.png");

        // Spritesheet da barra de status
        this.load.spritesheet("barra", "assets/Icones/BarraStatus.png", {
            frameWidth: 144,
            frameHeight: 32
        });

        // HUD (interface do jogo)
        this.load.image("bgHUD", "assets/bg.HUD.png");
        this.load.image("iconeBanho", "assets/iconeBanho.png");
        this.load.image("iconeRacao", "assets/iconeRacao.png");
        this.load.image("iconeCuidados", "assets/iconeCuidados.png");
        this.load.image("iconeLazer", "assets/iconeLazer.png");
        this.load.image("iconeVoltar", "assets/iconeVoltar.png");
        this.load.image("cobasiCoin", "assets/moeda.png"); 
        // Tela de Cuidado
        this.load.image("bgCuidado", "assets/tela-cuidado/bgCuidado.png");
        this.load.image("pulga1", "assets/tela-cuidado/pulga1.png");
        this.load.image("bandeja", "assets/tela-cuidado/bandeja.png");


        // Cenas de gameplay
        this.load.image("bgRacao", "assets/tela-alimentacao/bgRacao.png");
        this.load.image("bgLimpo", "assets/bgLimpo.png");
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
        this.load.image("bolaLaranja","assets/bolaLaranja.png");
        this.load.image("bgVeterinario", "assets/tela-veterinario/bgVeterinario.png");
        this.load.image("lupa", "assets/tela-veterinario/lupa.png")

        // Tela de storytelling/tutorial
        this.load.image("tutorial1", "assets/tutorial1.png");
        this.load.image("tutorial2", "assets/tutorial2.png");
        this.load.image("tutorial3", "assets/tutorial3.png");
        this.load.image("tutorial4", "assets/tutorial4.png");
        this.load.image("tutorial5", "assets/tutorial5.png");
        this.load.image("tutorial6", "assets/tutorial6.png");
        this.load.image("tutorial7", "assets/tutorial7.png");
        this.load.image("tutorial8", "assets/tutorial8.png");
        this.load.image("tutorial9", "assets/tutorial9.png");
        this.load.image("tutorial10", "assets/tutorial10.png");
        this.load.image("tutorial11", "assets/tutorial11.png");

        // Rações refinadas
        this.load.image("racaoGA", "assets/Racoes/otimizadas/racaoGA.png");
        this.load.image("racaoGF", "assets/Racoes/otimizadas/racaoGF.png");
        this.load.image("racaoGV", "assets/Racoes/otimizadas/racaoGV.png");
        this.load.image("racaoMA", "assets/Racoes/otimizadas/racaoMA.png");
        this.load.image("racaoMF", "assets/Racoes/otimizadas/racaoMF.png");
        this.load.image("racaoMV", "assets/Racoes/otimizadas/racaoMV.png");
        this.load.image("racaoPA", "assets/Racoes/otimizadas/racaoPA.png");
        this.load.image("racaoPF", "assets/Racoes/otimizadas/racaoPF.png");
        this.load.image("racaoPV", "assets/Racoes/otimizadas/racaoPV.png");

        // Botões Standard e Super Premium
        this.load.image("botaoStandard", "assets/botaoStandardNormal.png");
        this.load.image("botaoStandardPressionado", "assets/botaoStandardPressionado.png");
        this.load.image("botaoSuperPremium", "assets/botaoSuperPremiumNormal.png");
        this.load.image("botaoSuperPremiumPressionado", "assets/botaoSuperPremiumPressionado.png");
        this.load.image("templateRacao", "assets/templateRacao.png");
        this.load.image("fundoTemplateRacao", "assets/fundoTemplateRacao.png");

        // Áudio
        this.load.audio("musica", "assets/trilhaSonora.mp3");

        // Spritesheets do cachorro e água
        this.load.spritesheet("cachorroCaramelo", "assets/cachorroCaramelo.png", {
            frameWidth: 626,
            frameHeight: 655
        });
        this.load.spritesheet("agua", "assets/tela-banho/agua.png", {
            frameWidth: 480,
            frameHeight: 480
        });

        //Imagens jogo Alimentação
        
        this.load.image('bgFoodScene', 'assets/tela-alimentacao/fundoracao.png');
        this.load.image('dogPlayer', 'assets/dogPlayer.png');
        this.load.image('foodNormal', 'assets/foodNormal.png');
        this.load.image('foodSuperPremium', 'assets/foodSuperPremium.png');
        this.load.image('foodChocolate', 'assets/foodChocolate.png');
        this.load.image('heart', 'assets/heart.png');
        this.load.image('retornoInicio', 'assets/retornoInicio.png');
    
    }

    create() {
        // Após carregar todos os assets, inicia a cena inicial do jogo
        this.scene.start("cenaInicial");
    }
}
