import { Cachorro } from "../componentes/controleCachorro/cachorroAnimacao.js";
import { Barra } from "../componentes/Barras/barras.js";

export class cuidadoCena extends Phaser.Scene {
    constructor() {
        super({ key: "cuidadoCena" });
    }

    create() {
        if (!this.scene.isActive("hudScene")) {
            this.scene.launch("hudScene");
        }
        this.scene.bringToTop("hudScene");

        this.add
            .image(this.scale.width / 2, this.scale.height / 2, "banheiro")
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);



             ///barras
                    this.add.image(100,100, "iconeFome").setScale(1.5);
                    this.barraComida = new Barra(this,230,100, 5);
            
                    this.add.image(100,160, "iconeFelicidade").setScale(1.5);
                    this.barraLazer = new Barra(this,230,160, 7);
            
                    this.add.image(100,220, "iconeSujeira").setScale(1.5);
                    this.barraLimpeza = new Barra(this,230,220, 9);
            
                    this.add.image(100,280, "iconeFome").setScale(1.5);
                    this.barraSaude = new Barra(this,230,280, 6);

        this.cachorro = new Cachorro(this, 920, 600);
    }
}
