import { Barra } from "./barras"

export class barraAnimacao {

  constructor(scene,x,y){

    this.scene = scene
    this.pet = Barra.pet

    this.sprite = scene.add.sprite(x,y,"barra").setScale(0.5)

    this.criarAnimacoes()
    this.atualizarAnimacao()

  }

  criarAnimacoes(){

    if(this.scene.anims.exists("barra_vazia")) return

    this.scene.anims.create({
      key:"barra_vazia",
      frames:this.scene.anims.generateFrameNumbers("barra",{start:11,end:11}),
      frameRate:1,
      repeat:-1
    })

    this.scene.anims.create({
      key:"barra_media",
      frames:this.scene.anims.generateFrameNumbers("barra",{start:5,end:5}),
      frameRate:1,
      repeat:-1
    })

    this.scene.anims.create({
      key:"barra_cheia",
      frames:this.scene.anims.generateFrameNumbers("barra",{start:1,end:1}),
      frameRate:1,
      repeat:-1
    })

  }

  atualizarAnimacao(){

    if(this.pet.fome === 0){
      this.sprite.play("barra_vazia")
    }

    if(this.pet.fome > 0 && this.pet.fome < 15){
      this.sprite.play("barra_media")
    }

    if(this.pet.fome >= 15){
      this.sprite.play("barra_cheia")
    }

  }

}