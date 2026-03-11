import { cachorroGeral } from "../controleCachorro/cachorroGeral.js";

export class Racao {
    constructor(scene, x, y, dados) {
        this.scene = scene;

        // informacoes da racao
        this.nome = dados.nome;
        this.fome = dados.fome;
        this.descricao = dados.descricao;
        this.id = dados.id;

        // OTIMIZACAO: manter tamanho final fixo desacopla o layout da resolucao da textura e permite usar arquivos menores.
        this.sprite = scene.add.image(x, y, dados.sprite).setDisplaySize(144, 209).setInteractive({ useHandCursor: true });

        this.sprite.on("pointerdown", () => {
            const pet = cachorroGeral.pet;

            if (pet.id === this.id) {
                console.log(pet.id);
                console.log(this.id);
                console.log("racao correta");
            } else {
                console.log("errado");
            }
        });
    }

    mostrarInfo() {}
}
