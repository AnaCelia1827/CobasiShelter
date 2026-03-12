// Importa o estado global do cachorro
import { cachorroGeral } from "../controleCachorro/cachorroGeral.js";

export class Racao {
    constructor(scene, x, y, dados) {
        this.scene = scene;

        // Informações da ração recebidas pelo parâmetro "dados"
        this.nome = dados.nome;          // Nome da ração
        this.fome = dados.fome;          // (Provavelmente usado para reduzir a fome do pet)
        this.descricao = dados.descricao;// Texto explicativo da ração
        this.id = dados.id;              // Identificador único da ração

        // OTIMIZAÇÃO: define tamanho fixo para o sprite da ração
        // Isso desacopla o layout da resolução da textura e permite usar arquivos menores
        this.sprite = scene.add.image(x, y, dados.sprite)
            .setDisplaySize(144, 209)    // Define tamanho fixo
            .setInteractive({ useHandCursor: true }); // Torna o sprite interativo (clicável)

        // Evento de clique na ração
        this.sprite.on("pointerdown", () => {
            const pet = cachorroGeral.pet; // Acessa o estado global do cachorro

            // Verifica se a ração corresponde ao ID do cachorro
            if (pet.id === this.id) {
                console.log(pet.id);       // Mostra ID do cachorro
                console.log(this.id);      // Mostra ID da ração
                console.log("racao correta"); // Mensagem de acerto
            } else {
                console.log("errado");     // Mensagem de erro
            }
        });
    }

    // Método futuro para mostrar informações detalhadas da ração
    mostrarInfo() {}
}
