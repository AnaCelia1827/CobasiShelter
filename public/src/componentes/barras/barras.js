// Número total de frames no spritesheet BarraStatus.png (0 a 9 = 10 frames)
const BARRA_FRAMES_TOTAL = 10;
const BARRA_VALOR_MIN = 0;
const BARRA_VALOR_MAX = 9;

export class Barra {
    constructor(scene, x, y, valor = BARRA_VALOR_MAX) {
        this.scene = scene;
        // Valor inicial já limitado ao intervalo válido
        this.valor = Phaser.Math.Clamp(valor, BARRA_VALOR_MIN, BARRA_VALOR_MAX);
        // Cria o sprite; setFrame(0) garante que o spritesheet seja validado imediatamente
        this.sprite = scene.add.sprite(x, y, "barra");
        this.sprite.setFrame(0);
        this.atualizarBarra();
    }

    // Atualiza o frame do sprite de acordo com o valor atual.
    // Frame 0 = barra cheia, frame 9 = barra vazia.
    atualizarBarra() {
        // Garante valor dentro dos limites antes de calcular o frame
        this.valor = Phaser.Math.Clamp(this.valor, BARRA_VALOR_MIN, BARRA_VALOR_MAX);

        // Mapeia valor (0–9) para frame (0–9)
        const frame = Phaser.Math.Clamp(Math.floor(this.valor), 0, BARRA_FRAMES_TOTAL - 1);
        this.sprite.setFrame(frame);
    }

    // Altera o valor da barra por um delta e atualiza visualmente
    alterar(delta) {
        this.valor = Phaser.Math.Clamp(this.valor + delta, BARRA_VALOR_MIN, BARRA_VALOR_MAX);
        this.atualizarBarra();
    }
}
