import { gameState } from '../main.js'
import { Cachorro } from "../componentes/controleCachorro/cachorroAnimacao.js"

export class foodScene extends Phaser.Scene {

    constructor(){
        super({ key: 'foodScene' })
    }

    create(){

        // garante que a HUD esteja rodando
        if (!this.scene.isActive('hudScene')) {
            this.scene.launch('hudScene')
        }

        this.scene.bringToTop('hudScene')

        // função de efeito hover
        const hoverPressEffect = (scene, target, scaleNormal, scaleHover) => {

            target.on('pointerover', () => {
                scene.tweens.add({
                    targets: target,
                    scaleX: scaleHover,
                    scaleY: scaleHover,
                    duration: 200,
                    ease: 'Power2'
                })
            })

            target.on('pointerdown', () => {
                scene.tweens.add({
                    targets: target,
                    scaleX: scaleNormal * 0.9,
                    scaleY: scaleNormal * 0.9,
                    duration: 150,
                    yoyo: true
                })
            })

            target.on('pointerout', () => {
                scene.tweens.add({
                    targets: target,
                    scaleX: scaleNormal,
                    scaleY: scaleNormal,
                    duration: 180,
                    ease: 'Power2'
                })
            })
        }

        // fundo
        this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            'bgRacao'
        )
        .setDisplaySize(this.scale.width, this.scale.height)
        .setDepth(-1)

        // estante
        gameState.estante = this.add.image(300,600,'estanteRacao')
        .setScale(0.5)
        .setInteractive({ useHandCursor:true })

        hoverPressEffect(this, gameState.estante, 0.5, 0.6)

        gameState.estante.on('pointerdown', () => {

            this.cameras.main.fadeOut(100,0,0,0)

            this.cameras.main.once('camerafadeoutcomplete', () => {

                // troca de cena
                this.scene.switch('jogoRacao')

            })

        })

        // sprite ração
        this.add.image(700,750,'racaoVazia')
        .setScale(0.2)
        .setDepth(100)

        // cachorro
        this.cachorro = new Cachorro(this,920,600)

        // ficha
        gameState.bilhete = this.add.image(1350,100,'mineFicha')
        .setScale(0.1)
        .setInteractive({ useHandCursor:true })

        hoverPressEffect(this, gameState.bilhete, 0.1, 0.13)

        gameState.bilhete.on('pointerdown', () => {

            if(this.scene.isActive('ficha')){
                this.scene.stop('ficha')
            } 
            else{
                this.scene.launch('ficha')
            }

        })

    }

}