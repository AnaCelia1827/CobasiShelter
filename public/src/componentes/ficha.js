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

        const estiloPixel = {
            fontFamily: '"Press Start 2P"',
            fontSize: "14px",
            color: "#000000"
        };

        const nome = this.add.text(-220, -120, `Nome: ${pet.nome}`, estiloPixel).setOrigin(0, 0.5);
        const peso = this.add.text(-220, -80, `Peso: ${pet.peso}`, estiloPixel).setOrigin(0, 0.5);
        const idade = this.add.text(-220, -40, `Idade: ${pet.idade}`, estiloPixel).setOrigin(0, 0.5);
        const porte = this.add.text(-220, 0, `Porte: ${pet.porte}`, estiloPixel).setOrigin(0, 0.5);
        const estado = this.add.text(-220, 40, `Estado: ${pet.estado}`, estiloPixel).setOrigin(0, 0.5);

        const historia = this.add.text(-220, 80, `Historia: ${pet.historia}`, {
            ...estiloPixel,
            align: "left",
            wordWrap: { width: 420 }
        }).setOrigin(0, 0);

        fichaContainer.add([fundo, nome, peso, idade, porte, estado, historia]);
    }
}