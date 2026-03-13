import { cachorroGeral } from "./controleCachorro/cachorroGeral.js";
import { Racao } from "./controleRacoes/racoes.js";

export class Descricao extends Phaser.Scene {

constructor(){
super({ key:"Descricao" })
}

create(){

const pet = cachorroGeral.pet

const painel = this.add.container(
this.scale.width * 0.5,
this.scale.height * 0.5
)


// FUNDO
const fundo = this.add.graphics()

fundo.fillStyle(0xffffff,1)
fundo.lineStyle(6,0xff7a00)

fundo.strokeRoundedRect(-260,-180,520,360,20)
fundo.fillRoundedRect(-260,-180,520,360,20)


// TITULO
const titulo = this.add.text(0,-140,"INFORMAÇÕES",{
fontFamily:'"Press Start 2P"',
fontSize:"20px",
color:"#ff7a00"
})
.setOrigin(0.5)


// TEXTO (ALINHADO À ESQUERDA)
const mensagem = this.add.text(-220,-40,"Clique em verificar para analisar a ração.",{
fontFamily:'"Press Start 2P"',
fontSize:"16px",
color:"#000000",
align:"left",
wordWrap:{width:440}
})
.setOrigin(0,0.5)


// BOTÃO CENTRALIZADO NO PAINEL
const verificar = this.add.text(
0,
120,
"VERIFICAR",
{
fontFamily:'"Press Start 2P"',
fontSize:"18px",
backgroundColor:"#ffa500",
color:"#000",
padding:{x:15,y:8}
})
.setOrigin(0.5)
.setInteractive()



verificar.on("pointerdown",()=>{

const racaoEscolhida = Racao.pet

if(!racaoEscolhida){

mensagem.setText(
"FALTA SELECIONAR UMA RAÇÃO."
)

return
}

if(
racaoEscolhida.id === pet.id
){

mensagem.setText(
`ACERTOU!

ESSA É A RAÇÃO IDEAL
PARA O CACHORRO.

PORTE: ${pet.porte}
IDADE: ${pet.idade}`
)

}else{

mensagem.setText(
`ESSA RAÇÃO NÃO É IDEAL.

ESCOLHA OUTRA RAÇÃO.`
)

}

})


painel.add([fundo,titulo,mensagem,verificar])

}

}