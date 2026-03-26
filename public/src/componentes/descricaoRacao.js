import { cachorrosBase } from "./controleCachorro/cachorrosBase.js";
import { Racao } from "./controleRacoes/racoes.js";
import { gameState } from "../main.js"; // Importando o estado global para saber qual cachorro está ativo

export class Descricao extends Phaser.Scene {

    constructor() {
        super({ key: "Descricao" }); // Define a chave da cena
    }

    create() {
        // Verifica no estado global qual cachorro está ativo para validação
        let pet;
        if (gameState.pets.cachorroHeroi) {
            pet = cachorrosBase[1]; // Dados do Herói
        } else {
            pet = cachorrosBase[0]; // Dados do Caramelo
        }

        // Cria um container centralizado para agrupar os elementos do painel
        const painel = this.add.container(
            this.scale.width * 0.5,
            this.scale.height * 0.5
        );

        // FUNDO do painel (retângulo arredondado com borda)
        const fundo = this.add.graphics();
        fundo.fillStyle(0xffffff, 1);          // Cor de preenchimento branco
        fundo.lineStyle(6, 0xff7a00);          // Borda laranja
        fundo.strokeRoundedRect(-260, -180, 520, 360, 20); // Borda arredondada
        fundo.fillRoundedRect(-260, -180, 520, 360, 20);   // Preenchimento

        // TÍTULO do painel
        const titulo = this.add.text(0, -140, "INFORMAÇÕES", {
            fontFamily: '"Press Start 2P"',
            fontSize: "20px",
            color: "#ff7a00"
        }).setOrigin(0.5);

        // TEXTO inicial (mensagem) alinhado à esquerda
        const mensagem = this.add.text(-220, -40, "Clique em verificar para analisar a ração.", {
            fontFamily: '"Press Start 2P"',
            fontSize: "16px",
            color: "#000000",
            align: "left",
            wordWrap: { width: 440 } // Quebra de linha automática
        }).setOrigin(0, 0.5);

        // BOTÃO centralizado no painel
        const verificar = this.add.text(
            0,
            120,
            "VERIFICAR",
            {
                fontFamily: '"Press Start 2P"',
                fontSize: "18px",
                backgroundColor: "#ffa500", // Fundo laranja
                color: "#000",              // Texto preto
                padding: { x: 15, y: 8 }    // Espaçamento interno
            }
        )
        .setOrigin(0.5)
        .setInteractive(); // Torna clicável

        // Evento de clique no botão "VERIFICAR"
        verificar.on("pointerdown", () => {
            const racaoEscolhida = Racao.pet; // Obtém ração escolhida

            // Caso nenhuma ração tenha sido selecionada
            if (!racaoEscolhida) {
                mensagem.setText("FALTA SELECIONAR UMA RAÇÃO.");
                return;
            }

            // Se a ração escolhida corresponde ao pet atual
            if (racaoEscolhida.id === pet.id) {
                mensagem.setText(
`ACERTOU!

ESSA É A RAÇÃO IDEAL
PARA O CACHORRO.

PORTE: ${pet.porte}
IDADE: ${pet.idade}`
                );
            } else {
                // Caso contrário, mostra mensagem de erro
                mensagem.setText(
`ESSA RAÇÃO NÃO É IDEAL.

ESCOLHA OUTRA RAÇÃO.`
                );
            }
        });

        // Adiciona todos os elementos ao container painel
        painel.add([fundo, titulo, mensagem, verificar]);
    }
}