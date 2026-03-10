import { gameState } from "../main.js";

export class gameScene extends Phaser.Scene {
    
    constructor(){
        super({ key: 'gameScene' }) // Define a cena com a chave 'gameScene'
    }

    // Carrega as imagens do jogo
    preload(){
        this.load.image('bgGameScene', 'assets/bgGameScene.png') // Fundo da cena
                        
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
        
        // Configura a câmera principal para ocupar toda a tela
        this.cameras.main.setBounds(0, 0, window.innerWidth, window.innerHeight);
        // Adiciona efeito de fade-in (escurecer e aparecer suavemente)
        this.cameras.main.fadeIn(200, 0, 0, 0);

        
    }
}
