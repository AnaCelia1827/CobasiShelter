import { gameState } from "../main.js"
import { GerenciadorCachorros } from "../componentes/controleCachorro/gerenciadorCachorros.js"
import { cachorrosBase } from "../componentes/controleCachorro/cachorrosBase.js"

export class jogoLazer extends Phaser.Scene {
    constructor() {
        super({ key: "jogoLazer" });
    }

    create() {
        this.physics.world.gravity.y = 300;

        if (!this.scene.isActive("cenaHUD")) {
            this.scene.launch("cenaHUD");
        }
        this.scene.bringToTop("cenaHUD");

        if (!gameState.musica) {
            gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        }
        if (!gameState.musica.isPlaying) {
            gameState.musica.play();
        }

        const posicaoX = this.scale.width - this.scale.width * 0.2;
        const posicaoY = this.scale.height;

        this.fundo = this.add.image(posicaoX / 2, posicaoY / 2, "bgLazer")
            .setDisplaySize(posicaoX, posicaoY);

        // 👇 usa estado atual do cachorro (sincronizado com CenaBanho e outras)
        // cachorrosBase[0].estado não deve ser sobrescrito para preservar progresso

        this.gerenciadorCachorros = new GerenciadorCachorros(this)

        this.cachorro = this.gerenciadorCachorros.criarCachorro(
            posicaoX / 2,
            (posicaoY / 2) + (posicaoY / 2) * 0.25,
            cachorrosBase[0]
        )

        this.physics.add.existing(this.cachorro.sprite)
        this.cachorro.sprite.setScale(posicaoY * 0.0006)
        this.cachorro.sprite.body.setAllowGravity(false)
        this.cachorro.sprite.body.immovable = true
    }
}