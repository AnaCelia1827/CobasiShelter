import { cachorroGeral } from "./cachorroGeral.js"

export class Cachorro {

  constructor(scene,x,y){

    this.scene = scene
    this.pet = cachorroGeral.pet

    this.sprite = scene.add.sprite(x,y,"cachorro").setScale(0.5);
    this.criarAnimacoes()
    this.atualizarAnimacao()

  }

  criarAnimacoes(){

    if(this.scene.anims.exists("cachorro_normal")) return

    this.scene.anims.create({
      key:"cachorro_normal",
      frames:this.scene.anims.generateFrameNumbers("cachorro",{start:0,end:1}),
      frameRate:4,
      repeat:-1
    })

    this.scene.anims.create({
      key:"cachorro_sujo",
      frames:this.scene.anims.generateFrameNumbers("cachorro",{start:0,end:1}),
      frameRate:4,
      repeat:-1
    })

    this.scene.anims.create({
      key:"cachorro_limpo",
      frames:this.scene.anims.generateFrameNumbers("cachorro",{start:0,end:1}),
      frameRate:4,
      repeat:-1
    })

  }

  atualizarAnimacao(){// gambiarra pai

    if(this.pet.estado === "normal"){
      this.sprite.play("cachorro_normal")
    }

    if(this.pet.estado === "sujo"){
      this.sprite.play("cachorro_sujo")
    }

    if(this.pet.estado === "limpo"){
      this.sprite.play("cachorro_limpo")
    }

  }

}