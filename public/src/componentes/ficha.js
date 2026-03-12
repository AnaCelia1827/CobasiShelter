// Importa o estado global do cachorro
import { cachorroGeral } from "./controleCachorro/cachorroGeral.js";

export class ficha extends Phaser.Scene {
    constructor() {
        super({ key: "ficha" }); // Define a chave da cena como "ficha"
    }

    create() {
        // Acessa os dados atuais do pet (nome, peso, idade, etc.)
        const pet = cachorroGeral.pet;

        // Cria um container centralizado para agrupar todos os elementos da ficha
        const fichaContainer = this.add.container(this.scale.width * 0.5, this.scale.height * 0.38);

        // Fundo da ficha (retângulo bege)
        const fundo = this.add.rectangle(0, 0, 500, 350, 0xf0e8bb);
        fundo.setOrigin(0.5); // Centraliza o retângulo

        // Texto com informações do pet
        const nome = this.add.text(0, -120, `Nome: ${pet.nome}`).setOrigin(0.5);
        const peso = this.add.text(0, -80, `Peso: ${pet.peso}`).setOrigin(0.5);
        const idade = this.add.text(0, -40, `Idade: ${pet.idade}`).setOrigin(0.5);
        const porte = this.add.text(0, 0, `Porte: ${pet.porte}`).setOrigin(0.5);
        const estado = this.add.text(0, 40, `Estado: ${pet.estado}`).setOrigin(0.5);

        // Texto da história do pet, com quebra automática de linha
        const historia = this.add
            .text(0, 80, `Historia: ${pet.historia}`, {
                align: "center",             // Centraliza o texto
                wordWrap: { width: 420 }     // Define largura máxima para quebra de linha
            })
            .setOrigin(0.5);

        // Adiciona todos os elementos ao container
        fichaContainer.add([fundo, nome, peso, idade, porte, estado, historia]);
    }
}
