class bathScene extends Phaser.Scene {
    constructor() {
        super({ key: 'bathScene' });
    }
    mauseSabao = false;
    mauseChoveiro = false;
    mauseToalha = false;

    preload(){
        this.load.image('bg', 'assets/bginicial.png');
        this.load.image('dogSujo', 'assets/alienigena.png');
        this.load.image('dogEspuma', 'assets/alienigena.png');
        this.load.image('dogLimpo', 'assets/alienigena.png');
        this.load.image('star', 'assets/star.png');
        this.load.audio('musica', 'assets/trilhaSonora.mp3');
    }

    create(){
        // fundo e cachorro
        gameState.bg = this.add.image(window.innerWidth/2, window.innerHeight/2, 'bg')
            .setDisplaySize(window.innerWidth, window.innerHeight);

        gameState.dogSujo = this.physics.add.image(window.innerWidth/2, window.innerHeight/2, 'dogSujo')
            .setDisplaySize(400,400);

        // objetos como PathFollower
        gameState.sabao = this.add.follower(new Phaser.Curves.Path(400, 500), 500, 600, 'dogSujo').setInteractive().setDepth(3);
        gameState.choveiro = this.add.follower(new Phaser.Curves.Path(400, 500), 700, 600, 'dogSujo').setInteractive().setDepth(3);
        gameState.toalha = this.add.follower(new Phaser.Curves.Path(400, 500), 900, 600, 'dogSujo').setInteractive().setDepth(3);

        // adiciona corpo físico e ajusta tamanho
        this.physics.add.existing(gameState.sabao);
        gameState.sabao.body.setSize(gameState.sabao.displayWidth, gameState.sabao.displayHeight);

        this.physics.add.existing(gameState.choveiro);
        gameState.choveiro.body.setSize(gameState.choveiro.displayWidth, gameState.choveiro.displayHeight);

        this.physics.add.existing(gameState.toalha);
        gameState.toalha.body.setSize(gameState.toalha.displayWidth, gameState.toalha.displayHeight);

        gameState.stars = this.physics.add.group(); 
        gameState.novas = this.physics.add.group(); 
        gameState.quantidade = 0;

        gameState.ultimoX = gameState.sabao.x;
        gameState.ultimoY = gameState.sabao.y;

        // overlap com o cachorro
        this.physics.add.overlap(gameState.sabao, gameState.dogSujo, () => { 
            if (gameState.quantidade < 50 && (Math.abs(gameState.sabao.x - gameState.ultimoX) > 20 || Math.abs(gameState.sabao.y - gameState.ultimoY) > 20)){
                let star = gameState.stars.create( Phaser.Math.RND.between(760, 1160), Phaser.Math.RND.between(340, 740), 'star' );
                gameState.quantidade++;
            }}, null, this); 
        this.physics.add.overlap(gameState.novas, gameState.stars, (nova, star) => { star.destroy(); nova.destroy(); }, null, this);

        // eventos de clique com if/else
        gameState.sabao.on('pointerdown', () => {
            if (this.mauseSabao === true) {
                // estava seguindo o mouse → desliga e cria caminho
                this.mauseSabao = false;
                let novoPath = new Phaser.Curves.Path(gameState.sabao.x, gameState.sabao.y);
                novoPath.lineTo(400, 500);
                gameState.sabao.setPath(novoPath);
                gameState.sabao.startFollow({ duration: 1000, repeat: 0 });
            } else {
                // não estava seguindo o mouse → liga
                this.mauseSabao = true;
            }
        });

        gameState.choveiro.on('pointerdown', () => {
            if (this.mauseChoveiro === true) {
                this.mauseChoveiro = false;
                let novoPath = new Phaser.Curves.Path(gameState.choveiro.x, gameState.choveiro.y);
                novoPath.lineTo(700, 500);
                gameState.choveiro.setPath(novoPath);
                gameState.choveiro.startFollow({ duration: 1000, repeat: 0 });
            } else {
                this.mauseChoveiro = true;
            }
        });

        gameState.toalha.on('pointerdown', () => {
            if (this.mauseToalha === true) {
                this.mauseToalha = false;
                let novoPath = new Phaser.Curves.Path(gameState.toalha.x, gameState.toalha.y);
                novoPath.lineTo(900, 500);
                gameState.toalha.setPath(novoPath);
                gameState.toalha.startFollow({ duration: 1000, repeat: 0 });
            } else {
                this.mauseToalha = true;
            }
        });
    }

    update(){
        if (this.mauseSabao === true){ 
            gameState.sabao.x = this.input.activePointer.x;
            gameState.sabao.y = this.input.activePointer.y; 
            gameState.sabao.body.reset(this.input.activePointer.x, this.input.activePointer.y); 
        } 
        if (this.mauseChoveiro === true){
            gameState.choveiro.x = this.input.activePointer.x;
            gameState.choveiro.y = this.input.activePointer.y; 
            gameState.choveiro.body.reset(this.input.activePointer.x, this.input.activePointer.y);
            let novaStar = gameState.novas.create( gameState.choveiro.x, gameState.choveiro.y + gameState.choveiro.height/2, 'star' );
            novaStar.body.setVelocityY(100); 
        }
        if (this.mauseToalha === true){ 
            gameState.toalha.x = this.input.activePointer.x; 
            gameState.toalha.y = this.input.activePointer.y; 
            gameState.toalha.body.reset(this.input.activePointer.x, this.input.activePointer.y);
        } 
    }
}
