import { Cachorro } from "./cachorro.js"
import { gameState } from "../../main.js"

export class GerenciadorCachorros {
  constructor(scene) {
    this.scene = scene
    this.cachorros = []
    this.cachorroAtual = null
  }

  criarCachorro(x, y, dados) {
    const cachorro = new Cachorro(this.scene, x, y, "cachorroCaramelo", dados)
    this.cachorros.push(cachorro)
    this.cachorroAtual = cachorro
    return cachorro
  }

  mudarEstadoPorId(id, estado) {
    const cachorro = this.cachorros.find(c => c.dados.id === id)
    if (cachorro) {
      cachorro.mudarEstado(estado)
    }
  }

  verificarCompletude() {
    // Verifica se todas as barras chegaram a 0
    const barrasZero = 
      gameState.barras.comida <= 0 &&
      gameState.barras.lazer <= 0 &&
      gameState.barras.limpeza <= 0 &&
      gameState.barras.saude <= 0

    // Se todas as barras estão em 0 e ainda é Caramelo, muda para Herói
    if (barrasZero && gameState.pets.cachorroCaramelo === true) {
      this.mudarParaCachorroHeroi()
    }
  }

  mudarParaCachorroHeroi() {
    gameState.pets.cachorroCaramelo = false
    gameState.pets.cachorroHeroi = true
    gameState.trocar = true
    
    // Reseta as barras para 11
    gameState.barras.comida = 11
    gameState.barras.lazer = 11
    gameState.barras.limpeza = 11
    gameState.barras.saude = 11

    gameState.pulga = true
    
    if (this.cachorroAtual) {
      this.cachorroAtual.mudarSprite("cachorroHeroi")
    }
  }

  mudarParaCachorroCaramelo() {
    gameState.pets.cachorroCaramelo = true
    gameState.pets.cachorroHeroi = false
    
    if (this.cachorroAtual) {
      this.cachorroAtual.mudarSprite("cachorroCaramelo")
    }
  }
}