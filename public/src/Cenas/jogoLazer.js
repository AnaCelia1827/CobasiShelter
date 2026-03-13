// Importa o objeto global gameState e a classe Cachorro
import { gameState } from "../main.js";
import { Cachorro } from "../componentes/controleCachorro/cachorroAnimacao.js";

export class jogoLazer extends Phaser.Scene {
    constructor() {
        super({ key: "jogoLazer" });
        // Contador de jogadas — incrementa toda vez que a bola é lançada
        this.acertos = 0;
    }

    create() {
        // Define gravidade padrão para objetos com física
        this.physics.world.gravity.y = 300;

        // Garante que a HUD esteja ativa
        if (!this.scene.isActive("cenaHUD")) {
            this.scene.launch("cenaHUD");
        } else if (this.scene.isSleeping("cenaHUD")) {
            this.scene.wake("cenaHUD");
        }
        this.scene.bringToTop("cenaHUD");

        // Música de fundo
        if (!gameState.musica) {
            gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        }
        if (!gameState.musica.isPlaying) {
            gameState.musica.play();
        }

        // Fundo da cena (por enquanto reutiliza o do banheiro)
        this.add.image(this.scale.width / 2, this.scale.height / 2, "bgBanheiro")
            .setDisplaySize(this.scale.width, this.scale.height);

        // Instancia cachorro
        this.cachorro = new Cachorro(this, 920, 600);
        this.physics.add.existing(this.cachorro.sprite);
        this.cachorro.sprite.body.setAllowGravity(false);
        this.cachorro.sprite.body.immovable = true;

        // Bola interativa
        this.objeto = this.physics.add.image(200, 500, "bolaLaranja")
            .setScale(0.2)
            .setCollideWorldBounds(false);

        this.objeto.body.setAllowGravity(false);
        this.posicaoInicial = { x: 200, y: 500 };

        // Reinicia contador de jogadas
        this.acertos = 0;

        // Gráfico para desenhar trajetória
        this.trajetoria = this.add.graphics();

        // Configura bola como arrastável
        this.objeto.setInteractive({ useHandCursor: true });
        this.input.setDraggable(this.objeto);

        // Evento de arrastar bola
        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            this.desenharTrajetoria(gameObject);
        });

        // Ao soltar a bola → conta jogada
        this.input.on("dragend", (pointer, gameObject) => {
            const forcaX = (this.posicaoInicial.x - gameObject.x) * 3;
            const forcaY = (this.posicaoInicial.y - gameObject.y) * 3;
            gameObject.body.setAllowGravity(true);
            gameObject.body.setVelocity(forcaX, forcaY);
            this.trajetoria.clear();

            // Incrementa contador
            this.acertos++;

            // A cada 4 jogadas → reduz barra de lazer
            if (this.acertos % 4 === 0) {
                gameState.barras.lazer = Phaser.Math.Clamp(
                    gameState.barras.lazer - 11, 0, 11
                );
            }
        });

        // Colisão bola ↔ cachorro
        this.physics.add.overlap(this.objeto, this.cachorro.sprite, () => {
            this.resetarObjeto();
            this.teleportarCachorro();
        });
    }

    update() {
        // Se bola sair da tela → reseta
        if (
            this.objeto.y > this.scale.height + 50 ||
            this.objeto.x < -50 ||
            this.objeto.x > this.scale.width + 50
        ) {
            this.resetarObjeto();
        }
    }

    // Desenha trajetória prevista da bola
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

    // Reseta bola para posição inicial
    resetarObjeto() {
        this.objeto.setPosition(this.posicaoInicial.x, this.posicaoInicial.y);
        this.objeto.body.stop();
        this.objeto.body.setVelocity(0, 0);
        this.objeto.body.setAllowGravity(false);
    }

    // Teleporta cachorro para posição aleatória
    teleportarCachorro() {
        const novaX = Phaser.Math.Between(200, 1000);
        this.cachorro.sprite.setPosition(novaX, 600);
    }
}
