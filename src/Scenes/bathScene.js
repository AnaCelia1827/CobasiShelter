class bathScene extends Phaser.Scene {
    constructor() {
        super({ key: 'bathScene' });
    }
    mouseSabao = false;
    mousechuveiro = false;
    mouseToalha = false;

    preload(){
        this.load.image('banheiro', 'assets/banheiro.png');
        this.load.image('chuveiro', 'assets/chuveiro.png');
        this.load.spritesheet('dogEspuma', 'assets/dogEspumado.png', { frameWidth: 720, frameHeight: 960 });
        this.load.spritesheet('dogSujo', 'assets/dogSujo.png', { frameWidth: 720, frameHeight: 960 });
        this.load.spritesheet('dogLimpo', 'assets/dogLimpo.png', { frameWidth: 720, frameHeight: 960 });
        this.load.image('star', 'assets/star.png');
        this.load.audio('musica', 'assets/trilhaSonora.mp3');
        this.load.spritesheet('agua', 'assets/agua.png', { frameWidth: 480, frameHeight: 480 });
        this.load.image('sabao', 'assets/barrasabao.png');
        this.load.image('toalha', 'assets/toalha.png');
        this.load.image('bolhas', 'assets/bolhas.png');
    }

    create(){
        // fundo e cachorro
        gameState.banheiro = this.add.image(window.innerWidth/2, window.innerHeight/2, 'banheiro')
            .setDisplaySize(window.innerWidth, window.innerHeight);

        gameState.dog = this.physics.add.sprite(window.innerWidth/2, window.innerHeight/2, 'dogSujo').setScale(0.5);
        gameState.dog.setImmovable(true);
        gameState.dog.body.allowGravity = false;

        // animação do cachorro sujo
        this.anims.create({
            key: 'dogSujoAnim',
            frames: this.anims.generateFrameNumbers('dogSujo', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });

        // animação da agua
        this.anims.create({
            key: 'aguaAnim',
            frames: this.anims.generateFrameNumbers('agua', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        // animação do cachorro com espuma
        this.anims.create({
            key: 'dogEspumaAnim',
            frames: this.anims.generateFrameNumbers('dogEspuma', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });

        // animação do cachorro limpo
        this.anims.create({
            key: 'dogLimpoAnim',
            frames: this.anims.generateFrameNumbers('dogLimpo', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });

        gameState.dog.play('dogSujoAnim');

        // objetos como PathFollower
        gameState.sabao = this.add.follower(new Phaser.Curves.Path(400, 500), 600, 720, 'sabao').setInteractive().setDepth(3).setScale(0.120);
        gameState.chuveiro = this.add.follower(new Phaser.Curves.Path(400, 500), 770, 750, 'chuveiro').setInteractive().setDepth(3).setScale(0.25);
        gameState.toalha = this.add.follower(new Phaser.Curves.Path(400, 500), 940, 720, 'toalha').setInteractive().setDepth(3).setScale(0.20);

        // adiciona corpo físico e ajusta tamanho
        this.physics.add.existing(gameState.sabao);
        gameState.sabao.body.setSize(gameState.sabao.displayWidth, gameState.sabao.displayHeight);

        this.physics.add.existing(gameState.chuveiro);
        gameState.chuveiro.body.setSize(gameState.chuveiro.displayWidth, gameState.chuveiro.displayHeight);

        this.physics.add.existing(gameState.toalha);
        gameState.toalha.body.setSize(gameState.toalha.displayWidth, gameState.toalha.displayHeight);

        gameState.stars = this.physics.add.group(); 
        gameState.novas = this.physics.add.group(); 
        gameState.quantidade = 0;
        gameState.quantidadeBolha = 50;
        gameState.secar = 100;
        gameState.ultimoX = 0;
        gameState.ultimoY = 0;
        gameState.threshold = 30; 
        gameState.tempoSecando = 0;
        gameState.tempoParaSecar = 90; 

        // overlap com o cachorro removido - detecção manual no update()
        this.physics.add.overlap(gameState.novas, gameState.stars, (nova, star) => { star.destroy(); nova.destroy(); gameState.quantidadeBolha--; }, null, this);

        // eventos de clique com if/else
        gameState.sabao.on('pointerdown', () => {
            if (this.mouseSabao === true) {
                // estava seguindo o mouse → desliga e cria caminho
                this.mouseSabao = false;
                // se soltou antes de completar, reseta o progresso
                if (gameState.quantidade < 50) {
                    gameState.quantidade = 0;
                }
                let novoPath = new Phaser.Curves.Path(gameState.sabao.x, gameState.sabao.y);
                novoPath.lineTo(600, 720);
                gameState.sabao.setPath(novoPath);
                gameState.sabao.startFollow({ duration: 1000, repeat: 0 });
            } else {
                // não estava seguindo o mouse → liga
                this.mouseSabao = true;
                gameState.ultimoX = gameState.sabao.x;
                gameState.ultimoY = gameState.sabao.y;
            } 
        });

        gameState.chuveiro.on('pointerdown', () => {
            if (this.mousechuveiro === true) {
                this.mousechuveiro = false;
                let novoPath = new Phaser.Curves.Path(gameState.chuveiro.x, gameState.chuveiro.y);
                novoPath.lineTo(770, 750);
                gameState.chuveiro.setPath(novoPath);
                gameState.chuveiro.startFollow({ duration: 1000, repeat: 0 });
            } else {
                this.mousechuveiro = true;
            }
        });

        gameState.toalha.on('pointerdown', () => {
            if (this.mouseToalha === true) {
                this.mouseToalha = false;
                let novoPath = new Phaser.Curves.Path(gameState.toalha.x, gameState.toalha.y);
                novoPath.lineTo(940, 720);
                gameState.toalha.setPath(novoPath);
                gameState.toalha.startFollow({ duration: 1000, repeat: 0 });
            } else {
                this.mouseToalha = true;
            }
        });
    }

    update(){
        if (this.mouseSabao === true){ 
            gameState.ultimoX = gameState.sabao.x;
            gameState.ultimoY = gameState.sabao.y;

            gameState.sabao.x = this.input.activePointer.x;
            gameState.sabao.y = this.input.activePointer.y; 
            gameState.sabao.body.reset(this.input.activePointer.x, this.input.activePointer.y);

            // detecção manual de distância entre sabão e cachorro (sem física)
            let distX = Math.abs(gameState.sabao.x - gameState.dog.x);
            let distY = Math.abs(gameState.sabao.y - gameState.dog.y);
            let moveu = Math.abs(gameState.sabao.x - gameState.ultimoX) > gameState.threshold || 
                        Math.abs(gameState.sabao.y - gameState.ultimoY) > gameState.threshold;

            if (distX < 200 && distY < 250 && gameState.quantidade < 50 && moveu){
                let star = gameState.stars.create( Phaser.Math.RND.between(700, 830), Phaser.Math.RND.between(280, 600), 'bolhas' );
                star.setScale(0.13); 
                gameState.quantidade++;
            }
        } 
        if (this.mousechuveiro === true){
            gameState.chuveiro.x = this.input.activePointer.x;
            gameState.chuveiro.y = this.input.activePointer.y; 
            gameState.chuveiro.body.reset(this.input.activePointer.x, this.input.activePointer.y);
            let novaStar = gameState.novas.create( gameState.chuveiro.x, gameState.chuveiro.y + gameState.chuveiro.displayHeight/2, 'agua' );
            novaStar.play('aguaAnim');
            novaStar.setScale(0.1); 
            novaStar.body.setVelocityY(100); 
        }
        if (this.mouseToalha === true){ 
            gameState.toalha.x = this.input.activePointer.x; 
            gameState.toalha.y = this.input.activePointer.y; 
            gameState.toalha.body.reset(this.input.activePointer.x, this.input.activePointer.y);

            // só seca se o cachorro já estiver com espuma
            if (gameState.dog.texture.key === 'dogEspuma') {
                // detecção manual de distância igual ao sabão
                let distX = Math.abs(gameState.toalha.x - gameState.dog.x);
                let distY = Math.abs(gameState.toalha.y - gameState.dog.y);

                if (distX < 200 && distY < 250) {
                    gameState.tempoSecando++; // incrementa enquanto estiver em cima
                    if (gameState.tempoSecando >= gameState.tempoParaSecar) {
                        gameState.dog.setTexture('dogLimpo');
                        gameState.dog.play('dogLimpoAnim');
                        gameState.tempoSecando = 0;
                    }
                } else {
                    gameState.tempoSecando = 0; // reseta se sair de cima
                }
            }
        } else {
            gameState.tempoSecando = 0; // reseta se soltar a toalha
        }
        // troca sprite quando limpeza estiver completa
        if (gameState.quantidade >= 50){
            gameState.dog.setTexture('dogEspuma');  
            gameState.dog.play('dogEspumaAnim');
            gameState.quantidade = 0;              
            gameState.quantidadeBolha = 50;
        }
    }
}