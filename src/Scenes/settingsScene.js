class settingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'settingsScene' });
    }
      // Carrega as imagens do jogo
    preload() {
        this.load.image('bg', 'assets/bgInicial.png'); //Essa é a imagem do planode fundo

        // Carrega as imagens dos botões
        this.load.image('botaoJogar', 'assets/botãoJogar.png');
        this.load.image('botaoTutorial', 'assets/botãoTutorial.png');
        this.load.image('botaoSair', 'assets/botãoSair.png');
        this.load.image('botaoConfiguraçoes', 'assets/botãoConfigurações.png');
        this.load.image('retornoInicio', 'assets/retornoInicio.png');

        // Carrega a imagem de configurações
        this.load.image('settings', 'assets/settings.png');

        // Carrega a música de fundo
        this.load.audio('musica', 'assets/trilhaSonora.mp3');
    }
    //Gera as imagens do jogo,as animações e os efeitos de transição
    create() {

        //Toca a música de fundo em loop com volume reduzido
        gameState.musica = this.sound.add('musica', { loop: true, volume: 0.5 });
        gameState.musica.play();

        gameState.retangulo = this.add.rectangle(window.innerWidth/2, window.innerHeight/2, 200, 100, 0x000000).setAlpha(0.5).setDisplaySize(window.innerWidth, window.innerHeight); //Adiciona um retângulo preto com opacidade de 50%
        
        gameState.bg = this.add.image(window.innerWidth/2, window.innerHeight/2, 'bg').setDisplaySize(window.innerWidth, window.innerHeight);  //Adiciona uma imagem a partir do centro da tela do jogo

        //Adiciona os botões de volta para o início do jogo e de configurações
        gameState.botaoJogar = this.add.image(250, 300, 'botaoJogar').setScale(0.5,0.5).setInteractive({ useHandCursor: true });
        gameState.botaoTutorial = this.add.image(250, 400, 'botaoTutorial').setScale(0.5,0.5).setInteractive({ useHandCursor: true });
        gameState.botaoSair = this.add.image(250, 500, 'botaoSair').setScale(0.5,0.5).setInteractive({ useHandCursor: true });
        gameState.botaoConfiguraçoes = this.add.image(80, 600, 'botaoConfiguraçoes').setScale(0.5,0.5).setInteractive({ useHandCursor: true });
        gameState.retornoInicio = this.add.image(1060, 165, 'retornoInicio').setScale(0.35,0.35).setInteractive({ useHandCursor: true });

        //Cria a imagens da tela de configurações
        gameState.settings = this.add.image(1000, 300, 'settings').setScale(0.8,0.8);
        
        //Define a profundidade da imagem de fundo para -1, garantindo que ela fique atrás de outros elementos
        gameState.bg .depth = -1;
        gameState.botaoJogar.depth = -1; 
        gameState.botaoTutorial.depth = -1;
        gameState.botaoSair.depth = -1;
        gameState.botaoConfiguraçoes.depth = -1;
        gameState.retangulo.depth = 0;
        gameState.settings.depth = 1; 
        gameState.retornoInicio.depth = 2;

        this.cameras.main.setBounds(0,0,window.innerWidth,window.innerHeight); //A camera principal ocupa todo o tamanho da tela
        
        this.cameras.main.fadeIn(200, 0,0,0);//Adiciona um efeito de escurecer

        /* Quando o usuário colocar o cursor em cima do botão ele aumenta de tamanho */
        gameState.retornoInicio.on('pointerover', () => {
            this.tweens.add({
                targets: gameState.retornoInicio,
                scaleX: 0.4,
                scaleY: 0.4,
                duration: 200,
                ease: 'Power2'
            });
        });

        // Quando o usuário retirar o cursor de cima do botão, ele volta ao normal
        gameState.retornoInicio.on('pointerout', () => {
            this.tweens.add({
                targets: gameState.retornoInicio,
                scaleX: 0.35,
                scaleY: 0.35,
                duration: 200,
                ease: 'Power2'
            });
        });
        // Quando o usuário clica no botão ele será redirecionado para tela de configurações
        gameState.retornoInicio.on('pointerdown', () => {
            this.cameras.main.fadeOut(200, 0,0,0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                gameState.musica.stop(); //Para a música de fundo
                this.scene.start('introScene');
            });
        });
    }

    update() {}
}