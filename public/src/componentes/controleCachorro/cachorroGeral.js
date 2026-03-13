// Importa os dados iniciais do cachorro (estado padrão e atributos)

import { cachorroInicial } from "./dadosCachorros.js"

class CachorroGeral {


  constructor() {
    // Cria o objeto "pet" copiando todos os dados do cachorro inicial
    // Isso garante que cada instância comece com os mesmos atributos definidos em cachorroInicial
    this.pet = { ...cachorroInicial }
  }

  // Método para deixar o cachorro sujo
  sujar() {
    this.pet.estado = "sujo" // altera o estado, usado para mudar animações
  }

  // Método para deixar o cachorro limpo
  limpar() {
    this.pet.estado = "limpo"
  }

  // Método para retornar o cachorro ao estado normal
  normal() {
    this.pet.estado = "normal"
  }
}

// Exporta uma instância única de CachorroGeral
// Isso funciona como um "singleton": todas as cenas compartilham o mesmo estado do cachorro
export const cachorroGeral = new CachorroGeral()

