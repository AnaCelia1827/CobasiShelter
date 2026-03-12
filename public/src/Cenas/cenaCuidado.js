import { Cachorro } from "../componentes/controleCachorro/cachorroAnimacao.js";

export class cenaCuidado extends Phaser.Scene {
    constructor() {
        super({ key: "cenaCuidado" });
    }

    create() {
        if (!this.scene.isActive("cenaHUD")) {
            this.scene.launch("cenaHUD");
        }
        this.scene.bringToTop("cenaHUD");

        this.add
            .image(this.scale.width / 2, this.scale.height / 2, "banheiro")
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        this.cachorro = new Cachorro(this, 920, 600);
    }
}
