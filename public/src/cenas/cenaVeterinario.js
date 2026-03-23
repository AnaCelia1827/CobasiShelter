import { gameState } from "../main.js"
import { GerenciadorCachorros } from "../componentes/controleCachorro/gerenciadorCachorros.js"
import { cachorrosBase } from "../componentes/controleCachorro/cachorrosBase.js"

export class cenaVeterinario extends Phaser.Scene {
    
    constructor() {
        super({ key: "cenaVeterinario" });
        this.achouPulga = false;
    }

    create() {

        // --- Estado global ---
        this.achouPulga = gameState.lupaJaUsada || false;

        if (!this.scene.isActive("HUD")) this.scene.launch("HUD");
        this.scene.bringToTop("HUD");

        if (!gameState.musica) {
            gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        }
        if (!gameState.musica.isPlaying) gameState.musica.play();

        const posicaoX = this.scale.width- this.scale.width*0.2;
        const posicaoY = this.scale.height;

        // --- Fundo (primeiro!) ---
        this.fundo = this.add.image(posicaoX / 2, posicaoY / 2, "bgVeterinario")
            .setDisplaySize(posicaoX, posicaoY);

        // --- Gerenciador ---
        this.gerenciadorCachorros = new GerenciadorCachorros(this);

        // --- Cachorro ---
        this.cachorro = this.gerenciadorCachorros.criarCachorro(
            posicaoX / 2,
            posicaoY / 2.3,
            cachorrosBase[0]
        );

        this.physics.add.existing(this.cachorro.sprite);
        this.cachorro.sprite.setScale(posicaoY * 0.0006);
        this.cachorro.sprite.body.setAllowGravity(false);
        this.cachorro.sprite.body.immovable = true;

        // --- Pulga (AGORA EXISTE) ---
        this.pulga = this.add.image(
            this.cachorro.sprite.x,
            this.cachorro.sprite.y,
            "pulga1"
        )
        .setScale(0.1)
        .setDepth(15)
        .setVisible(false);

        // --- Texto ---
        this.textoInstrucao = this.add.text(
            posicaoX / 2,
            posicaoY * 0.12,
            "Ache as pulgas e retire elas.",
            {
                fontFamily: '"Press Start 2P", Arial',
                fontSize: "20px",
                color: "#ffd166",
                stroke: "#000000",
                strokeThickness: 4,
                align: "center"
            }
        )
        .setOrigin(0.5)
        .setDepth(20)
        .setVisible(false);

        // --- Lupa ---
        const lupaX = posicaoX / 2;
        const lupaY = posicaoY * 0.85;

        this.lupa = this.add.image(lupaX, lupaY, "lupa")
            .setOrigin(0.5)
            .setScale(0.8)
            .setDepth(10);

        // Interação
        if (!gameState.lupaJaUsada) {
            this.lupa.setInteractive({ useHandCursor: true });
            this.input.setDraggable(this.lupa);
        } else {
            this.lupa.setAlpha(0.5);
        }

        // --- Eventos ---

        this.lupa.on('dragstart', () => {
            if (this.achouPulga) return;

            this.lupa.setScale(0.9);
            this.textoInstrucao.setVisible(true);
        });

        this.lupa.on('drag', (pointer, dragX, dragY) => {
            if (this.achouPulga) return;

            this.lupa.x = dragX;
            this.lupa.y = dragY;

            const distancia = Phaser.Math.Distance.Between(
                this.lupa.x,
                this.lupa.y,
                this.cachorro.sprite.x,
                this.cachorro.sprite.y
            );

            if (distancia < 150) {
                this.darZoomNaPulga();
            }
        });

        this.lupa.on('dragend', () => {
            if (this.achouPulga) return;

            this.lupa.setScale(0.8);
            this.textoInstrucao.setVisible(false);
        });
    }

    // --- Zoom ---
    darZoomNaPulga() {
        if (this.achouPulga) return;

        this.achouPulga = true;
        gameState.lupaJaUsada = true;

        this.textoInstrucao.setVisible(true);

        // Mostra pulga
        this.pulga.setVisible(true);
        this.pulga.setPosition(this.lupa.x, this.lupa.y);

        this.tweens.add({
            targets: this.pulga,
            scale: 1.5,
            duration: 600,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.time.delayedCall(1500, () => {
                    gameState.cachorroTemPulga = true;
                    this.scene.start("cenaCuidado");
                });
            }
        });
    }

    update(time, delta) {
        if (this.cachorro?.update) {
            this.cachorro.update(time, delta);
        }
    }
}