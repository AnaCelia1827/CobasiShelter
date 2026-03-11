import { cachorroGeral } from "./controleCachorro/cachorroGeral.js";

export class ficha extends Phaser.Scene {
    constructor() {
        super({ key: "ficha" });
    }

    create() {
        const pet = cachorroGeral.pet;
        const fichaContainer = this.add.container(this.scale.width * 0.5, this.scale.height * 0.38);

        const fundo = this.add.rectangle(0, 0, 500, 350, 0xf0e8bb);
        fundo.setOrigin(0.5);

        const nome = this.add.text(0, -120, `Nome: ${pet.nome}`).setOrigin(0.5);
        const peso = this.add.text(0, -80, `Peso: ${pet.peso}`).setOrigin(0.5);
        const idade = this.add.text(0, -40, `Idade: ${pet.idade}`).setOrigin(0.5);
        const porte = this.add.text(0, 0, `Porte: ${pet.porte}`).setOrigin(0.5);
        const estado = this.add.text(0, 40, `Estado: ${pet.estado}`).setOrigin(0.5);

        const historia = this.add
            .text(0, 80, `Historia: ${pet.historia}`, {
                align: "center",
                wordWrap: { width: 420 }
            })
            .setOrigin(0.5);

        fichaContainer.add([fundo, nome, peso, idade, porte, estado, historia]);
    }
}
