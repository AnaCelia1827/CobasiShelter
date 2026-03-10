import { gameState } from '../main.js';


export class bathScene extends Phaser.Scene {
    constructor() {
        super({ key: 'bathScene' });
    }

    // Variáveis que armazenam a informação se o jogador clicou nos objetos.
    mouseSabao = false;
    mousechuveiro = false;
    mouseToalha = false;

    // Carrega as imagens, sprites e sons necessários para a cena
    preload(){
        // OTIMIZACAO: mover estes loads para PreloadScene evita recarregar assets ao reiniciar a cena.
        this.load.image('banheiro', 'assets/bgBanheiro.png');
        this.load.image('chuveiro', 'assets/chuveiro.png');
        this.load.spritesheet('dogEspuma', 'assets/dogEspumado.png', { frameWidth: 720, frameHeight: 960 });
        this.load.spritesheet('dogSujo', 'assets/dogSujo.png', { frameWidth: 720, frameHeight: 960 });
        this.load.spritesheet('dogLimpo', 'assets/dogLimpo.png', { frameWidth: 720, frameHeight: 960 });
        this.load.audio('musica', 'assets/trilhaSonora.mp3');
        this.load.spritesheet('agua', 'assets/agua.png', { frameWidth: 480, frameHeight: 480 });
        this.load.image('sabao', 'assets/barrasabao.png');
        this.load.image('toalha', 'assets/toalha.png');
        this.load.image('bolhas', 'assets/bolhas.png');
    }

    // Gera os elementos visuais do jogo, animações e efeitos de transição
    create(){

           if (!this.scene.isActive('hudScene')) {
        this.scene.launch('hudScene');
        }

        this.scene.bringToTop('hudScene');

        // Adiciona o fundo para ocupar toda a tela
        gameState.banheiro = this.add.image(window.innerWidth/2, window.innerHeight/2, 'banheiro')
            .setDisplaySize(window.innerWidth, window.innerHeight);

        // Adiciona o cachorro com física
        gameState.dog = this.physics.add.sprite(window.innerWidth/2, window.innerHeight/2, 'dogSujo').setScale(0.5);
        gameState.dog.setImmovable(true);
        gameState.dog.body.allowGravity = false;
        // OTIMIZACAO: proteger criacao de animacoes com this.anims.exists(...) para evitar custo em reinicio de cena.

        // Cria animações para os diferentes estados do cachorro
        this.anims.create({
            key: 'dogSujoAnim',
            frames: this.anims.generateFrameNumbers('dogSujo', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'aguaAnim',
            frames: this.anims.generateFrameNumbers('agua', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'dogEspumaAnim',
            frames: this.anims.generateFrameNumbers('dogEspuma', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'dogLimpoAnim',
            frames: this.anims.generateFrameNumbers('dogLimpo', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });

        // Ativa a animação inicial do cachorro sujo
        gameState.dog.play('dogSujoAnim');

        // Cria objetos interativos (sabão, chuveiro e toalha) como PathFollower
        gameState.sabao = this.add.follower(new Phaser.Curves.Path(400, 500), 600, 720, 'sabao').setInteractive().setDepth(3).setScale(0.120);
        gameState.chuveiro = this.add.follower(new Phaser.Curves.Path(400, 500), 770, 750, 'chuveiro').setInteractive().setDepth(3).setScale(0.25);
        gameState.toalha = this.add.follower(new Phaser.Curves.Path(400, 500), 940, 720, 'toalha').setInteractive().setDepth(3).setScale(0.20);

        // Adiciona corpo físico aos objetos e ajusta tamanho
        this.physics.add.existing(gameState.sabao);
        gameState.sabao.body.setSize(gameState.sabao.displayWidth, gameState.sabao.displayHeight);
        this.physics.add.existing(gameState.chuveiro);
        gameState.chuveiro.body.setSize(gameState.chuveiro.displayWidth, gameState.chuveiro.displayHeight);
        this.physics.add.existing(gameState.toalha);
        gameState.toalha.body.setSize(gameState.toalha.displayWidth, gameState.toalha.displayHeight);

        // Adiciona grupos de objetos com física (bolhas e gotas de água) gameState.stars = this.physics.add.group();
        gameState.bolhas = this.physics.add.group(); 
        gameState.gotas = this.physics.add.group(); 
        // OTIMIZACAO: usar pool com maxSize/createMultiple nesses grupos reduz alocacao continua e pausas de GC.


        // Variáveis de controle da lógica do jogo
        gameState.quantidade = 0;
        gameState.quantidadeBolha = 50;
        gameState.secar = 100;
        gameState.ultimoX = 0;
        gameState.ultimoY = 0;
        gameState.threshold = 30; 
        gameState.tempoSecando = 0;
        gameState.tempoParaSecar = 90; 

        // Detecta overlap entre gotas de água e bolhas
        // OTIMIZACAO: overlap entre grupos grandes escala mal; limitar objetos ativos e limpar entidades fora da tela.
        this.physics.add.overlap(gameState.gotas, gameState.bolhas, (gota, bolha) => { bolha.destroy(); gota.destroy(); gameState.quantidadeBolha--; }, null, this);

        // Eventos de clique para alternar entre seguir o mouse ou voltar à posição inicial
        gameState.sabao.on('pointerdown', () => {
            if (this.mouseSabao === true) {
                // estava seguindo o mouse → desliga e cria caminho
                this.mouseSabao = false;
                // se soltou antes de completar, reseta o progresso
                if (gameState.quantidade < 50) {
                    gameState.quantidade = 0;
                }

                // Cria uma trajetoria para o sabao voltar para posição inicial
                let novoPath = new Phaser.Curves.Path(gameState.sabao.x, gameState.sabao.y);
                novoPath.lineTo(600, 720);

                //Aplica a trajetoria
                gameState.sabao.setPath(novoPath);

                // Inicia a trajetoria e estabelece o tempo da animação
                gameState.sabao.startFollow({ duration: 1000, repeat: 0 });

            } else {

                // Não estava seguindo o mouse → liga
                this.mouseSabao = true;

                // Atualiza a ultima posição
                gameState.ultimoX = gameState.sabao.x;
                gameState.ultimoY = gameState.sabao.y;

            } 
        });
        gameState.chuveiro.on('pointerdown', () => {
            if (this.mousechuveiro === true) {

                // estava seguindo o mouse → desliga e cria caminho
                this.mousechuveiro = false;

                // Cria uma trajetoria para o chuveiro voltar para a posição inicial
                let novoPath = new Phaser.Curves.Path(gameState.chuveiro.x, gameState.chuveiro.y);
                novoPath.lineTo(770, 750);

                //Aplica a trajetoria
                gameState.chuveiro.setPath(novoPath);

                // Inicia a trajetoria e estabelece o tempo da animação
                gameState.chuveiro.startFollow({ duration: 1000, repeat: 0 });

            } else {

                // Não estava seguindo o mouse → liga
                this.mousechuveiro = true;

            }
        });
        gameState.toalha.on('pointerdown', () => {
            if (this.mouseToalha === true) {

                // estava seguindo o mouse → desliga e cria caminho
                this.mouseToalha = false;

                 // Cria uma trajetoria para o chuveiro voltar para a posição inicial
                let novoPath = new Phaser.Curves.Path(gameState.toalha.x, gameState.toalha.y);
                novoPath.lineTo(940, 720);

                //Aplica a trajetoria
                gameState.toalha.setPath(novoPath);

                // Inicia a trajetoria e estabelece o tempo da animação
                gameState.toalha.startFollow({ duration: 1000, repeat: 0 });

            } else {

                // Não estava seguindo o mouse → liga
                this.mouseToalha = true;

            }
        });
    }

    update(){
    
        // Controle do sabão
        if (this.mouseSabao === true){ 
        
            // Atualiza posição do sabão para seguir o mouse
            gameState.ultimoX = gameState.sabao.x;
            gameState.ultimoY = gameState.sabao.y;
            gameState.sabao.x = this.input.activePointer.x;
            gameState.sabao.y = this.input.activePointer.y; 
            gameState.sabao.body.reset(this.input.activePointer.x, this.input.activePointer.y);

            // Calcula distância entre sabão e cachorro
            let distX = Math.abs(gameState.sabao.x - gameState.dog.x);
            let distY = Math.abs(gameState.sabao.y - gameState.dog.y);

            // Verifica se o sabão se moveu além do limite definido
            let moveu = Math.abs(gameState.sabao.x - gameState.ultimoX) > gameState.threshold || 
                    Math.abs(gameState.sabao.y - gameState.ultimoY) > gameState.threshold;

            // Se estiver perto do cachorro e em movimento, cria bolhas
            if (distX < 200 && distY < 250 && gameState.quantidade < 50 && moveu){
                // OTIMIZACAO: trocar create/destroy por reuse via setActive/setVisible evita travadas por coleta de lixo.
                let bolha = gameState.bolhas.create(
                    Phaser.Math.RND.between(700, 830), 
                    Phaser.Math.RND.between(280, 600), 
                    'bolhas'
                );
                bolha.setScale(0.13); 
                gameState.quantidade++;
            }
        } 

        // Controle do chuveiro
        if (this.mousechuveiro === true){
            // Atualiza posição do chuveiro para seguir o mouse
            gameState.chuveiro.x = this.input.activePointer.x;
            gameState.chuveiro.y = this.input.activePointer.y; 
            gameState.chuveiro.body.reset(this.input.activePointer.x, this.input.activePointer.y);

            // Cria uma nova gota de água animada
            // OTIMIZACAO CRITICA: aqui nasce 1 gota por frame (~60/s) sem limite; usar timer (10-15/s), pool e limpeza off-screen.
            let gota = gameState.gotas.create(
                gameState.chuveiro.x, 
                gameState.chuveiro.y + gameState.chuveiro.displayHeight/2, 
                'agua'
            );
            gota.play('aguaAnim');
            gota.setScale(0.1); 
            gota.body.setVelocityY(100); 
            // OTIMIZACAO: definir lifespan/maxY para remover gota fora da tela e impedir acumulo infinito.
        }

        // Controle da toalha
        if (this.mouseToalha === true){ 
            // Atualiza posição da toalha para seguir o mouse
            gameState.toalha.x = this.input.activePointer.x; 
            gameState.toalha.y = this.input.activePointer.y; 
            gameState.toalha.body.reset(this.input.activePointer.x, this.input.activePointer.y);

            // Só funciona se o cachorro já estiver com espuma
            if (gameState.dog.texture.key === 'dogEspuma') {
                let distX = Math.abs(gameState.toalha.x - gameState.dog.x);
                let distY = Math.abs(gameState.toalha.y - gameState.dog.y);

                // Se a toalha estiver próxima do cachorro, incrementa tempo de secagem
                if (distX < 200 && distY < 250) {
                    gameState.tempoSecando++; 
                    if (gameState.tempoSecando >= gameState.tempoParaSecar) {
                        gameState.dog.setTexture('dogLimpo');
                        gameState.dog.play('dogLimpoAnim');
                        gameState.tempoSecando = 0;
                    }
                } else {
                    gameState.tempoSecando = 0; // Saiu de cima → reseta
                }
            }
        } else {
            gameState.tempoSecando = 0; // Soltou a toalha → reseta
        }

        // Troca sprite do cachorro quando limpeza completa
        if (gameState.quantidade >= 50){
            gameState.dog.setTexture('dogEspuma');  
            gameState.dog.play('dogEspumaAnim');
            gameState.quantidade = 0;              
            gameState.quantidadeBolha = 50;
        }
    }
}
