
// Importa o objeto cachorroGeral, que contém informações globais sobre o pet
import { cachorroGeral } from "./cachorroGeral.js"

// Define a classe Cachorro, responsável por criar e controlar o sprite do cachorro
export class Cachorro {

  constructor(scene, x, y) {
    // Guarda a cena atual para poder manipular elementos dentro dela
    this.scene = scene

    // Referência ao estado geral do pet (ex.: normal, sujo, limpo)
    this.pet = cachorroGeral.pet

    // Cria o sprite do cachorro na cena, na posição (x, y), com a textura "cachorro"
    this.sprite = scene.add.sprite(x, y, "cachorro").setScale(0.5);

    // Cria as animações do cachorro (se ainda não existirem)
    this.criarAnimacoes()

    // Atualiza a animação inicial de acordo com o estado do pet
    this.atualizarAnimacao()
  }

  // Cria as animações do cachorro
  criarAnimacoes() {
    // Se a animação "cachorro_normal" já existe, não recria
    if (this.scene.anims.exists("cachorro_normal")) return

    // Animação do cachorro em estado normal
    this.scene.anims.create({
      key: "cachorro_normal",
      frames: this.scene.anims.generateFrameNumbers("cachorro", { start: 0, end: 1 }),
      frameRate: 4,
      repeat: -1 // repete infinitamente
    })

    // Animação do cachorro sujo
    this.scene.anims.create({
      key: "cachorro_sujo",
      frames: this.scene.anims.generateFrameNumbers("cachorro", { start: 0, end: 1 }),
      frameRate: 4,
      repeat: -1
    })

    // Animação do cachorro limpo
    this.scene.anims.create({
      key: "cachorro_limpo",
      frames: this.scene.anims.generateFrameNumbers("cachorro", { start: 0, end: 1 }),
      frameRate: 4,
      repeat: -1
    })
  }

  // Atualiza a animação do cachorro de acordo com o estado atual do pet
  atualizarAnimacao() { // "gambiarra pai" (comentário do autor original)
    if (this.pet.estado === "normal") {
      this.sprite.play("cachorro_normal")
    }

    if (this.pet.estado === "sujo") {
      this.sprite.play("cachorro_sujo")
    }

    if (this.pet.estado === "limpo") {
      this.sprite.play("cachorro_limpo")
    }
  }
}

