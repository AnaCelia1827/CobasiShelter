import { gameState } from '../main.js';
import { cachorroGeral } from "./controleCachorro/cachorroGeral.js"

export class ficha extends Phaser.Scene {
    constructor() {
        super({ key: 'ficha'});
    }


    // Carrega as imagens, sprites e sons necessários para a cena
    preload(){
       
        this.load.image('estanteVazia', 'assets/estanteVazia.png');
        this.load.image('racaoVazia', 'assets/racaoVazia.png');
        this.load.image('mineFicha', 'assets/mineFicha.png');
        this.load.image('botaoVoltar', 'assets/botaoVoltar.png');
       
       
    }

   
    create(){

    const fichaContainer = this.add.container(800,300)

    const fundo = this.add.rectangle(0,0,500,350,0xf0e8bb)
    fundo.setOrigin(0.5)

    const pet = cachorroGeral.pet

    const nome = this.add.text(0,-120,"Nome: " + pet.nome).setOrigin(0.5)
    const peso = this.add.text(0,-80,"Peso: " + pet.peso).setOrigin(0.5)
    const idade = this.add.text(0,-40,"Idade: " + pet.idade).setOrigin(0.5)
    const porte = this.add.text(0,0,"Porte: " + pet.porte).setOrigin(0.5)
    const estado = this.add.text(0,40,"Estado: " + pet.estado).setOrigin(0.5)

    const historia = this.add.text(0,80,"Historia: " + pet.historia,{
        align:"center",
        wordWrap:{width:420}
    }).setOrigin(0.5)

    fichaContainer.add([
        fundo,
        nome,
        peso,
        idade,
        porte,
        estado,
        historia
    ])

}
        update(){
        
        }
    

        
    
        
}