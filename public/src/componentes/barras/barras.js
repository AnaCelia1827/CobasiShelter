export class Barra {
    constructor(scene, x, y, valor = 0) {
        // Cena onde a barra será exibida
        this.scene = scene;
        // Valor inicial da barra (entre 0 e 10)
        this.valor = valor;
        // Cria o sprite da barra na posição (x, y) usando o spritesheet "barra"
        this.sprite = scene.add.sprite(x, y, "barra").setScale(1.5);
        // Atualiza a barra para refletir o valor inicial
        this.atualizarBarra();
    }

    // Atualiza a barra visualmente de acordo com o valor atual
    atualizarBarra() {
        // Garante que o valor esteja entre 0 e 10
        this.valor = Phaser.Math.Clamp(this.valor, 0, 10);
        // Define o frame do sprite com base no valor (cada frame representa um nível da barra)
        this.sprite.setFrame(Math.floor(this.valor));
    }

    // Altera o valor da barra (incremento ou decremento) e atualiza visualmente
    alterar(delta) {
        // Ajusta o valor somando delta e mantém dentro dos limites
        this.valor = Phaser.Math.Clamp(this.valor + delta, 0, 10);
        // Atualiza sprite para refletir novo valor
        this.atualizarBarra();
    }
}
