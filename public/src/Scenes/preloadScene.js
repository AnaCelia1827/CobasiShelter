export class PreloadScene extends Phaser.Scene {

    constructor(){
        super("PreloadScene")
    }

    preload(){
        //asseits de jogoRcao
        this.load.image('bgLimpo', 'assets/bgLimpo.png');
        this.load.image('estanteVazia', 'assets/estanteVazia.png');
        this.load.image('racaoVazia', 'assets/racaoVazia.png');
       // this.load.image('mineFicha', 'assets/mineFicha.png');
        this.load.image('botaoVoltar', 'assets/botaoVoltar.png');
        this.load.image('racaoGA', 'assets/Racoes/racaoGA.png');
        this.load.image('racaoGF', 'assets/Racoes/racaoGF.png');
        this.load.image('racaoGV', 'assets/Racoes/racaoGV.png');
        this.load.image('racaoMA', 'assets/Racoes/racaoMA.png');
        this.load.image('racaoMF', 'assets/Racoes/racaoMF.png');
        this.load.image('racaoMV', 'assets/Racoes/racaoMV.png');

        //asets de food scene
        this.load.image('bgRacao', 'assets/bgRacao.png');
        this.load.image('estanteRacao', 'assets/estanteRacao.png');
        //racaovazia
        this.load.image('mineFicha', 'assets/mineFicha.png');
        this.load.spritesheet( "cachorro","assets/dogLimpo.png", { frameWidth: 720, frameHeight: 960 } );
       

    }

    create(){

       //this.scene.start("foodScene")
      this.scene.start("jogoRacao");

    }

}