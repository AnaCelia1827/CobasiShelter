import { Cachorro } from "../componentes/controleCachorro/cachorroAnimacao.js";

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

        this.cachorro = new Cachorro(this, 920, 600);
    }
}
