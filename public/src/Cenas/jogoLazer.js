// Importa o objeto global gameState e a classe Cachorro
import { gameState } from "../main.js";
import { Cachorro } from "../componentes/controleCachorro/cachorroAnimacao.js";

export class jogoLazer extends Phaser.Scene {
    constructor() {
        super({ key: "jogoLazer" });
        this.acertos = 0; // Contador de jogadas
    }

    create() {
        this.physics.world.gravity.y = 300;

        // HUD
        if (!this.scene.isActive("cenaHUD")) {
            this.scene.launch("cenaHUD");
        } else if (this.scene.isSleeping("cenaHUD")) {
            this.scene.wake("cenaHUD");
        }
        this.scene.bringToTop("cenaHUD");

        // Música
        if (!gameState.musica) {
            gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        }
        if (!gameState.musica.isPlaying) {
            gameState.musica.play();
        }

        const posicaoX = this.scale.width - this.scale.width * 0.2;
        const posicaoY = this.scale.height;

        // Fundo
        this.fundo = this.add.image(posicaoX / 2, posicaoY / 2, "bgLazer")
            .setDisplaySize(posicaoX, posicaoY);

        // Cachorro
        this.cachorro = new Cachorro(this, posicaoX / 2, (posicaoY / 2)+(posicaoY / 2)*0.25);
        this.physics.add.existing(this.cachorro.sprite);
        this.cachorro.sprite.setScale(posicaoY*0.0006)
        this.cachorro.sprite.body.setAllowGravity(false);
        this.cachorro.sprite.body.immovable = true;

        // Bola
        this.objeto = this.physics.add.image(posicaoX*0.1, ((posicaoY / 2)+(posicaoY / 2)*0.25), "bolaLaranja")
            .setScale(posicaoY*0.0002)
            .setCollideWorldBounds(false);

        this.objeto.body.setAllowGravity(false);
        this.posicaoInicial = { x: posicaoX*0.1, y: ((posicaoY / 2)+(posicaoY / 2)*0.25) };

        this.acertos = 0;
        this.trajetoria = this.add.graphics();

        this.objeto.setInteractive({ useHandCursor: true });
        this.input.setDraggable(this.objeto);

        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            this.desenharTrajetoria(gameObject);
        });

        this.input.on("dragend", (pointer, gameObject) => {
            const forcaX = (this.posicaoInicial.x - gameObject.x) * 3;
            const forcaY = (this.posicaoInicial.y - gameObject.y) * 3;
            gameObject.body.setAllowGravity(true);
            gameObject.body.setVelocity(forcaX, forcaY);
            this.trajetoria.clear();

            this.acertos++;
            if (this.acertos % 4 === 0) {
                gameState.barras.lazer = Phaser.Math.Clamp(
                    gameState.barras.lazer - 11, 0, 11
                );
            }
        });

        this.physics.add.overlap(this.objeto, this.cachorro.sprite, () => {
            this.resetarObjeto();
            this.teleportarCachorro();
        });

        // >>> Listener de resize<<<
        this.scale.on("resize", (tamanhoTela) => {
            const { width: largura, height: altura } = tamanhoTela;

            // Atualiza posição inicial da bola
            this.posicaoInicial = { 
                x: largura * 0.1, 
                y: (altura / 2) + (altura / 2) * 0.25 
            };

            // Atualiza fundo
            this.fundo
            .setDisplaySize(largura - largura * 0.2, altura)
            .setPosition((largura - largura * 0.2) / 2, altura / 2);

            // Atualiza bola
            this.objeto.setPosition(this.posicaoInicial.x, this.posicaoInicial.y).setScale(posicaoY*0.0002);

            // Atualiza cachorro (usando sprite!)
            this.cachorro.sprite.setPosition(
                (largura - largura * 0.2) / 2, 
                (altura / 2) + (altura / 2) * 0.25
            );
            this.cachorro.sprite.setScale(altura * 0.0006);
        });

    }

    update() {
        if (
            this.objeto.y > this.scale.height + 50 ||
            this.objeto.x < -50 ||
            this.objeto.x > this.scale.width + 50
        ) {
            this.resetarObjeto();
        }
    }

    desenharTrajetoria(gameObject) {
        this.trajetoria.clear();
        this.trajetoria.lineStyle(2, 0xff0000, 1);

        const forcaX = (this.posicaoInicial.x - gameObject.x) * 3;
        const forcaY = (this.posicaoInicial.y - gameObject.y) * 3;

        const g = this.physics.world.gravity.y;
        const passos = 30;
        const dt = 0.05;

        let x0 = this.posicaoInicial.x;
        let y0 = this.posicaoInicial.y;

        this.trajetoria.beginPath();
        this.trajetoria.moveTo(x0, y0);

        for (let i = 0; i < passos; i++) {
            const t = i * dt;
            const px = x0 + forcaX * t;
            const py = y0 + forcaY * t + 0.5 * g * t * t;
            this.trajetoria.lineTo(px, py);
        }

        this.trajetoria.strokePath();
    }

    resetarObjeto() {
        this.objeto.setPosition(this.posicaoInicial.x, this.posicaoInicial.y);
        this.objeto.body.stop();
        this.objeto.body.setVelocity(0, 0);
        this.objeto.body.setAllowGravity(false);
    }

    teleportarCachorro() {
        const novaX = Phaser.Math.Between(200, this.scale.width - 200);
        const novaY = this.scale.height * 0.8;
        this.cachorro.sprite.setPosition(novaX, novaY);
    }
}
