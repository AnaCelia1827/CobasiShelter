import { gameState } from '../main.js';
import { Cachorro } from "../componentes/controleCachorro/cachorroAnimacao.js"

export class cuidadoCena extends Phaser.Scene {
    constructor() {
        super({ key: 'cuidadoCena' });
    }


    // Carrega as imagens, sprites e sons necessários para a cena
    preload(){
        this.load.image('banheiro', 'assets/banheiro.png');
        this.load.image('racaoVazia', 'assets/racaoVazia.png'); 
        this.load.spritesheet( "cachorro","assets/dogLimpo.png", { frameWidth: 720, frameHeight: 960 } );
    }

   
    create(){

          if (!this.scene.isActive('hudScene')) {
             this.scene.launch('hudScene');
        }
        
        this.scene.bringToTop('hudScene');

        



         this.add.image(window.innerWidth/2, window.innerHeight/2, 'banheiro')
            .setDisplaySize(window.innerWidth, window.innerHeight)
            .setDepth(-1);

       

         this.cachorro = new Cachorro(this,920,600);
    }
            
        
}