import { GerenciadorCachorros } from "../componentes/controleCachorro/gerenciadorCachorros.js"
import { cachorrosBase } from "../componentes/controleCachorro/cachorrosBase.js"
import { gameState } from "../main.js";

export class cenaComida extends Phaser.Scene {
    
    constructor() {
        super({ key: "cenaComida" });
        this.transicao = false;
    }

    create() {
        this.transicao = false;

        if (!this.scene.isActive("HUD")) {
            this.scene.launch("HUD");
        } else if (this.scene.isSleeping("HUD")) {
            this.scene.wake("HUD");
        }
        this.scene.bringToTop("HUD");

        const posicaoX = (this.scale.width - this.scale.width * 0.2);
        const posicaoY = this.scale.height;

        const passarPressionarEfeito = (alvo, escalaNormal, escalaPassar) => {
            alvo.removeAllListeners();

            alvo.on("pointerover", () => {
                this.tweens.add({ targets: alvo, scaleX: escalaPassar, scaleY: escalaPassar, duration: 200 });
            });

            alvo.on("pointerdown", () => {
                this.tweens.add({ targets: alvo, scaleX: escalaNormal * 0.9, scaleY: escalaNormal * 0.9, duration: 150, yoyo: true });
            });

            alvo.on("pointerout", () => {
                this.tweens.add({ targets: alvo, scaleX: escalaNormal, scaleY: escalaNormal, duration: 200 });
            });
        };

        this.fundo = this.add.image(posicaoX / 2, posicaoY / 2, "bgRacao")
            .setDisplaySize(posicaoX, posicaoY)
            .setDepth(-1);

        const estante = this.add.image(posicaoX * 0.25, posicaoY * 0.68, "estanteRacao")
            .setScale(posicaoY * 0.0006)
            .setInteractive({ useHandCursor: true });

        passarPressionarEfeito(estante, estante.scaleX, estante.scaleX * 1.1);

        estante.on("pointerdown", () => {
            const cenaHUD = this.scene.manager.getScene("HUD");
            if (cenaHUD && cenaHUD.transicionarPara) {
                cenaHUD.transicionarPara("cenaRacaoStandart");
            } else {
                this.scene.start("cenaRacaoStandart");
            }
        });

        // Adiciona a ficha de informações do cachorro
        gameState.bilhete = this.add.image(
            this.scale.width * 0.7, 
            this.scale.height * 0.25,
            'mineFicha')
        .setScale(0.15)
        .setInteractive({ useHandCursor:true });
        passarPressionarEfeito(gameState.bilhete, 0.15, 0.18);

        gameState.bilhete.on('pointerdown', () => {
            if(this.scene.isActive('ficha')) {
                this.scene.stop('ficha')
            } else {
                this.scene.launch('ficha')
            }
        });

        const racaoVazia = this.add.image((posicaoX / 2) + (posicaoX / 2) * 0.1, posicaoY / 2 + posicaoY * 0.4, "racaoVazia")
            .setScale(posicaoY * 0.0002);

        // ==========================================
        // SISTEMA DE CACHORRO + PULGAS NO CONTAINER
        // ==========================================
        this.gerenciadorCachorros = new GerenciadorCachorros(this)

        // Criamos o cachorro na posição 0,0 porque ele vai para dentro do container
        this.cachorro = this.gerenciadorCachorros.criarCachorro(0, 0, cachorrosBase[0])
        const elementosContainer = [this.cachorro.sprite];

        // Cria a animação da pulga (se ainda não existir)
        if (!this.anims.exists("pulgaAnim")) {
            this.anims.create({
                key: "pulgaAnim",
                frames: this.anims.generateFrameNumbers("pulgas", { start: 0, end: 1 }), 
                frameRate: 1,  
                repeat: -1     
            });
        }

        // Cria o sprite animado da pulga
        this.pulgas = this.add.sprite(0, 0, "pulgas")
            .setOrigin(0.5)
            .setScale(posicaoY * 0.0015); // Mantendo a proporção visual das outras cenas

        this.pulgas.play("pulgaAnim");
        this.pulgas.setVisible(gameState.pulga); 
        elementosContainer.push(this.pulgas); 

        // Calcula a posição onde o cachorro deveria estar
        const dogX = (posicaoX / 2) + (posicaoX / 2) * 0.4;
        const dogY = (posicaoY / 2) + (posicaoY / 2) * 0.25;

        // Cria o container com o cachorro e as pulgas
        this.containerCachorro = this.add.container(dogX, dogY, elementosContainer);
        this.containerCachorro.setScale(posicaoY * 0.0007);
        // ==========================================
    }

    update() {
        // Atualiza a visibilidade da pulga em tempo real
        if (this.pulgas) {
            this.pulgas.setVisible(gameState.pulga);
        }
    }
}