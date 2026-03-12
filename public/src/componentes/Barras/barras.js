export class Barra {
    constructor(scene, x, y, valor = 0) {
        this.scene = scene;
        this.valor = valor;
        this.sprite = scene.add.sprite(x, y, "barra").setScale(1.5);
        this.atualizarBarra();
    }

    atualizarBarra() {
        this.valor = Phaser.Math.Clamp(this.valor, 0, 9);
        this.sprite.setFrame(Math.floor(this.valor));
    }

    alterar(delta) {
        this.valor = Phaser.Math.Clamp(this.valor + delta, 0, 9);
        this.atualizarBarra();
    }
}