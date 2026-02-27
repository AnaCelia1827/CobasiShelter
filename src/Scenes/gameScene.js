class gameScene extends Phaser.Scene {
    constructor(){
        super({ key: 'gameScene' }) // Define a cena com a chave 'gameScene'
    }

    // Carrega as imagens do jogo
    preload(){
        this.load.image('bgGameScene', 'assets/bgGameScene.png') // Fundo da cena
        this.load.image('btn', 'assets/btn.png' )                // Botão interativo
    }

    // Gera os elementos visuais do jogo, animações e efeitos de transição
    create(){

        // Adiciona a música em loop com volume reduzido
        gameState.musica = this.sound.add('musica', { loop: true, volume: 0.5 });
        gameState.musica.play();

        // Adiciona a tela de fundo para ocupar todo o navegador
        this.add.image(window.innerWidth/2, window.innerHeight/2, 'bgGameScene')
            .setDisplaySize(window.innerWidth, window.innerHeight)
            .setDepth(-1); // Define profundidade para ficar atrás dos outros elementos
        
        // Adiciona um HUD interativo (botão)
        gameState.btnGameScene = this.add.image(1150, window.innerHeight/2, 'btn')
            .setInteractive({ useHandCursor: true })
            .setScale(0.82); 

        // Configura a câmera principal para ocupar toda a tela
        this.cameras.main.setBounds(0, 0, window.innerWidth, window.innerHeight);

        // Adiciona efeito de fade-in (escurecer e aparecer suavemente)
        this.cameras.main.fadeIn(200, 0, 0, 0);

        // Função para criar efeito de hover e clique no botão
        function hoverPressEffect(scene, target, scaleNormal, scaleHover) {
            
            // Efeito ao passar o mouse por cima
            target.on('pointerover', () => {
                scene.tweens.add({
                    targets: target,
                    scaleX: scaleHover,
                    scaleY: scaleHover,
                    duration: 200,
                    ease: 'Power2'
                });
            });

            // Efeito ao clicar no botão
            target.on('pointerdown', () => {
                scene.tweens.add({
                    targets: target,
                    scaleX: 0.45,
                    scaleY: 0.45,
                    duration: 180,
                    ease: 'Power2',
                    yoyo: true, // Volta ao tamanho original após animação
                });
            });

            // Efeito ao sair com o mouse do botão
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

        // Quando o usuário clica no botão, troca para a cena do banheiro
        gameState.btnGameScene.on('pointerdown', () => {
            // Aplica efeito de fade-out antes de trocar de cena
            this.cameras.main.fadeOut(300, 0, 0, 0);

            // Após o fade-out, inicia a cena 'bathScene'
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('bathScene');
                gameState.musica.stop(); // Para a música de fundo
            });
        });
    }
}
