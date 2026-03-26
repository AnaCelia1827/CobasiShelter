import { gameState } from "../../main.js";
import { ESTADOS_CACHORRO } from "./estadosCachorro.js";

export class Cachorro {
  constructor(scene, x, y, pet, dados) {
    this.scene = scene
    this.pet = pet
    this.dados = { ...dados }
    this.x = x
    this.y = y

    this.sprite = scene.add.sprite(x, y, pet)

    this.criarAnimacoes()
    this.atualizarAnimacao()
  }

  criarAnimacoes() {
    const anims = this.scene.anims

    // DEFINA AQUI OS FRAMES DE CADA ESTADO
    const configAnimacoes = {
        [ESTADOS_CACHORRO.FELIZ]: { start: 6, end: 7 },
        [ESTADOS_CACHORRO.SUJO]: { start: 2, end: 3 },
        [ESTADOS_CACHORRO.LIMPO]: { start: 0, end: 1 },
        [ESTADOS_CACHORRO.ENSABOADO]: { start: 4, end: 5 }
    }

    Object.entries(configAnimacoes).forEach(([estado, frames]) => {
      const key = `cachorro_${this.pet}_${estado}`

      if (anims.exists(key)) return

      anims.create({
        key: key,
        frames: anims.generateFrameNumbers(this.pet, frames),
        frameRate: 4,
        repeat: -1
      })
    })
  }

  atualizarAnimacao() {
    const estado = this.dados.estado
    this.sprite.play(`cachorro_${this.pet}_${estado}`)
  }

  mudarEstado(novoEstado) {
    this.dados.estado = novoEstado
    this.atualizarAnimacao()
  }

  mudarSprite(novoSprite) {
    // Muda o sprite do cachorro (para quando evolui/devolve)
    this.pet = novoSprite
    this.sprite.setTexture(novoSprite)
    this.criarAnimacoes()
    this.atualizarAnimacao()
  }
}