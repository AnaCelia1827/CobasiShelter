import { cachorrosBase } from "./controleCachorro/cachorrosBase.js";
import { gameState } from "../main.js"; // Importação do estado global adicionada

export class ficha extends Phaser.Scene {
    constructor() {
        super({ key: "ficha" }); // Define a chave da cena como "ficha"
    }

    create() {
        // Verifica no estado global qual cachorro está ativo
        let pet;
        if (gameState.pets.cachorroHeroi) {
            pet = cachorrosBase[1]; // Puxa os dados do Herói
        } else {
            pet = cachorrosBase[0]; // Puxa os dados do Caramelo
        }

        // Cria um container centralizado para agrupar os elementos da ficha
        const fichaContainer = this.add.container(
            this.scale.width * 0.5,   // Centraliza horizontalmente
            this.scale.height * 0.38  // Ajusta posição vertical
        );

        // Fundo da ficha (retângulo bege)
        const fundo = this.add.rectangle(0, 0, 500, 350, 0xf0e8bb);
        fundo.setOrigin(0.5); // Centraliza origem

        // Estilo de texto em pixel art
        const estiloPixel = {
            fontFamily: '"Press Start 2P"',
            fontSize: "14px",
            color: "#000000"
        };

        // Título da ficha
        const titulo = this.add.text(-220, -120, `Ficha do Animal`, estiloPixel)
            .setOrigin(0, 0.5);

        // Informações básicas do pet
        const nome = this.add.text(-220, -80, `Nome: ${pet.nome}`, estiloPixel)
            .setOrigin(0, 0.5);

        const peso = this.add.text(-220, -40, `Peso: ${pet.peso}`, estiloPixel)
            .setOrigin(0, 0.5);

        const idade = this.add.text(-220, 0, `Idade: ${pet.idade}`, estiloPixel)
            .setOrigin(0, 0.5);

        const porte = this.add.text(-220, 40, `Porte: ${pet.porte}`, estiloPixel)
            .setOrigin(0, 0.5);

        const estado = this.add.text(-220, 80, `Estado: ${pet.estado}`, estiloPixel)
            .setOrigin(0, 0.5);

        // História do pet (com quebra de linha automática)
        const historia = this.add.text(-220, 120, `Historia: ${pet.historia}`, {
            ...estiloPixel,
            align: "left",
            wordWrap: { width: 420 } // Limita largura do texto
        }).setOrigin(0, 0);

        // Adiciona todos os elementos ao container
        fichaContainer.add([fundo, titulo, nome, peso, idade, porte, estado, historia]);
    }
}