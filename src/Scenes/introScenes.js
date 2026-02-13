//Gera uma nova cena chamada introScene
class introScene extends Phaser.Scene {
    constructor() {
        super({ key: 'introScene' });
    }
    // Carrega as imagens do jogo
    preload() {
        this.load.image('bg', 'assets/bgInicial.png'); //Essa é a imagem do planode fundo
        this.load.image('botaoJogar', 'assets/botaoJogar.png'); //A imagem do botão
        this.load.image('botaoTutorial', 'assets/botaoTutorial.png');
        this.load.image('botaoSair', 'assets/botaoSair.png');
        this.load.image('botaoConfiguraçoes', 'assets/botaoConfiguraçoes.png');
        this.load.audio('musica', 'assets/trilhaSonora.mp3'); //Carrega a música de fundo
    }
    //Gera as imagens do jogo,as animações e os efeitos de transição
    create() {
        gameState.musica = this.sound.add('musica', { loop: true, volume: 0.5 });
        gameState.musica.play();

        //Função para criar o efeito de hover e pressionar nos botões
        function hoverPressEffect(scene, target, scaleNormal, scaleHover) {
            target.on('pointerover', () => {
                scene.tweens.add({
                    targets: target,
                    scaleX: scaleHover,
                    scaleY: scaleHover,
                    duration: 200,
                    ease: 'Power2'
                });
            });

            target.on('pointerdown', () => {
                scene.tweens.add({
                    targets: target,
                    scaleX: 0.45,
                    scaleY: 0.45,
                    duration: 180,
                    ease: 'Power2',
                    yoyo: true,
                    });
            });
            target.on('pointerout', () => {
                scene.tweens.add({
                    targets: target,
                    scaleX: scaleNormal,
                    scaleY: scaleNormal,
                    duration: 200,
                    ease: 'Power2'
                });
            });
        }

        this.add.image(window.innerWidth/2, window.innerHeight/2, 'bg').setDisplaySize(window.innerWidth, window.innerHeight);  //Adiciona uma imagem a partir do centro da tela do jogo

        //Cria um botão que é interativo para usuário
        gameState.botaoJogar = this.add.image((window.innerWidth/6)+20, 380, 'botaoJogar').setScale(0.5,0.5).setInteractive({ useHandCursor: true });
        gameState.botaoTutorial = this.add.image((window.innerWidth/6)+20, 480, 'botaoTutorial').setScale(0.5,0.5).setInteractive({ useHandCursor: true });
        gameState.botaoSair = this.add.image((window.innerWidth/6)+20, 580, 'botaoSair').setScale(0.5,0.5).setInteractive({ useHandCursor: true });
        gameState.botaoConfiguraçoes = this.add.image((window.innerWidth/6)+20,680, 'botaoConfiguraçoes').setScale(0.5,0.5).setInteractive({ useHandCursor: true });
        

        this.cameras.main.setBounds(0,0,window.innerWidth,window.innerHeight); //A camera principal ocupa todo o tamanho da tela
        this.cameras.main.fadeIn(200, 0,0,0);//Adiciona um efeito de escurecer

        /* Aplicação da função hoverPressEffect para cada botão */
        hoverPressEffect(this, gameState.botaoJogar, 0.5, 0.6);
        hoverPressEffect(this, gameState.botaoTutorial, 0.5, 0.6);
        hoverPressEffect(this, gameState.botaoSair, 0.5, 0.6);
        hoverPressEffect(this, gameState.botaoConfiguraçoes, 0.5, 0.6);

        // Quando o usuário clica no botão configurações ele será redirecionado para tela de configurações
        gameState.botaoConfiguraçoes.on('pointerdown', () => {
            this.cameras.main.fadeOut(300, 0,0,0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('settingsScene');
                gameState.musica.stop(); //Para a música de fundo
            });
        });
    }

    update() {}
}
