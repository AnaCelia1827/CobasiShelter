import { cachorroInicial } from "./dadosCachorros.js"

class CachorroGeral {

  constructor(){
    this.pet = { ...cachorroInicial }//copia todos os  dados para a classe cachorro
  }

  sujar(){
    this.pet.estado = "sujo"//muda as animações
  }

  limpar(){
    this.pet.estado = "limpo"
  }

  normal(){
    this.pet.estado = "normal"
  }

}

export const cachorroGeral = new CachorroGeral()