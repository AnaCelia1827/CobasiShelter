
import { cachorroGeral } from "../controleCachorro/cachorroGeral.js"
export class Racao {

    constructor(scene, x, y, dados){

        this.scene = scene

        // informações da ração
        this.nome = dados.nome
        this.fome = dados.fome
        this.descricao = dados.descricao
        this.id = dados.id

        // sprite da ração
        this.sprite = scene.add.image(x, y, dados.sprite)
        .setScale(0.018)
        .setInteractive({useHandCursor:true})

        // clique
        this.sprite.on('pointerdown', ()=>{
           

         const pet = cachorroGeral.pet

            if(pet.id === this.id){
                console.log(pet.id);
                console.log(this.id);

                console.log("ração correta");
                
            }else{
                console.log("errado");
            }
        

        });

    }

    mostrarInfo(){

        

    }

}
