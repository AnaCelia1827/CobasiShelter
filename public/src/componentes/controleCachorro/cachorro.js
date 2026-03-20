import { ESTADOS_CACHORRO } from "./estadosCachorro.js"

export class Cachorro {
  constructor(scene, x, y, dados) {
    this.scene = scene
    this.dados = { ...dados }

    this.sprite = scene.add.sprite(x, y, "cachorroCaramelo")

    this.criarAnimacoes()
    this.atualizarAnimacao()
  }

  criarAnimacoes() {
    const anims = this.scene.anims

    // 👇 DEFINA AQUI OS FRAMES DE CADA ESTADO
    const configAnimacoes = {
        [ESTADOS_CACHORRO.FELIZ]: { start: 6, end: 7 },
        [ESTADOS_CACHORRO.SUJO]: { start: 2, end: 3 },
        [ESTADOS_CACHORRO.LIMPO]: { start: 0, end: 1 },
        [ESTADOS_CACHORRO.ENSABOADO]: { start: 4, end: 5 }
    }

    Object.entries(configAnimacoes).forEach(([estado, frames]) => {
      const key = `cachorro_${estado}`

      if (anims.exists(key)) return

      anims.create({
        key: key,
        frames: anims.generateFrameNumbers("cachorroCaramelo", frames),
        frameRate: 4,
        repeat: -1
      })
    })
  }

  atualizarAnimacao() {
    const estado = this.dados.estado
    this.sprite.play(`cachorro_${estado}`)
  }

  mudarEstado(novoEstado) {
    this.dados.estado = novoEstado
    this.atualizarAnimacao()
  }
}