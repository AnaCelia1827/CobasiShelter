import { Cachorro } from "./cachorro.js"

export class GerenciadorCachorros {
  constructor(scene) {
    this.scene = scene
    this.cachorros = []
  }

  criarCachorro(x, y, dados) {
    const cachorro = new Cachorro(this.scene, x, y, dados)
    this.cachorros.push(cachorro)
    return cachorro
  }

  mudarEstadoPorId(id, estado) {
    const cachorro = this.cachorros.find(c => c.dados.id === id)
    if (cachorro) {
      cachorro.mudarEstado(estado)
    }
  }
}