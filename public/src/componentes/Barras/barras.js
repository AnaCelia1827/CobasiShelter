import { barraComida, barraFelicidade, barraLimpeza, barraSaude } from "./dadosBarras.js"

class Barra{

  constructor(){
    this.iconeC = { ...barraComida }
    this.iconeF = { ...barraFelicidade }
    this.iconeL = { ...barraLimpeza }
    this.iconeS = { ...barraSaude }///copia todos os  dados para a classe cachorro
  }

  sujar(){
    this.pet.estado = "barra_pequena"//muda as animações
  }

  limpar(){
    this.pet.estado = "barra_media"
  }

  normal(){
    this.pet.estado = "barra_grande"
  }

}

export const  barra= new Barra()