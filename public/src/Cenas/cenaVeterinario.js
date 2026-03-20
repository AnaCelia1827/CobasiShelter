// Importa o objeto global gameState e a classe Cachorro
import { gameState } from "../main.js";
import { Cachorro } from "../componentes/controleCachorro/cachorroAnimacao.js";

export class cenaVeterinario extends Phaser.Scene {
    constructor() {
        super({ key: "cenaVeterinario" });
        this.acertos = 0; 
        this.achouPulga = false; 
    }

    create() {
        this.achouPulga = false;

        // HUD e Música (Mantidos iguais)
        if (!this.scene.isActive("cenaHUD")) this.scene.launch("cenaHUD");
        else if (this.scene.isSleeping("cenaHUD")) this.scene.wake("cenaHUD");
        this.scene.bringToTop("cenaHUD");

        if (!gameState.musica) gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        if (!gameState.musica.isPlaying) gameState.musica.play();

        const posicaoX = this.scale.width - this.scale.width * 0.2;
        const posicaoY = this.scale.height;

        // 1. Fundo
        this.fundo = this.add.image(posicaoX / 2, posicaoY / 2, "bgVeterinario")
            .setDisplaySize(posicaoX, posicaoY);

        // 2. Cachorro
        this.cachorro = new Cachorro(this, posicaoX / 2, posicaoY / 2.3);
        this.physics.add.existing(this.cachorro.sprite);
        this.cachorro.sprite.setScale(posicaoY * 0.0006);
        this.cachorro.sprite.body.setAllowGravity(false);
        this.cachorro.sprite.body.immovable = true;

        // 3. Texto de Instrução (Criado invisível inicialmente)
        this.textoInstrucao = this.add.text(posicaoX / 2, posicaoY * 0.12, "Ache as pulgas e retire elas.", {
            fontFamily: '"Press Start 2P", Arial', 
            fontSize: "20px",
            color: "#ffd166",
            stroke: "#000000",
            strokeThickness: 4,
            align: "center"
        })
        .setOrigin(0.5, 0.5) 
        .setDepth(20)
        .setVisible(false); 

        // 4. Imagem da Pulga
        this.pulga = this.add.image(0, 0, "pulga1")
            .setOrigin(0.5, 0.5) 
            .setScale(0)   
            .setDepth(11);

        // 5. Lupa
        const lupaX = posicaoX / 2;
        const lupaY = posicaoY - (posicaoY * 0.15); 

        this.lupa = this.add.image(lupaX, lupaY, "lupa")
            .setOrigin(0.5, 0.5) 
            .setScale(0.8) 
            .setDepth(10)
            .setInteractive({ useHandCursor: true });
        
        // --- LÓGICA DE ARRASTAR E EFEITOS DA LUPA ---
        this.input.setDraggable(this.lupa);

        // Quando CLICA / COMEÇA a segurar a lupa
        this.lupa.on('dragstart', () => {
            if (this.achouPulga) return;
            this.lupa.setScale(0.9); 
            this.textoInstrucao.setVisible(true); 
        });

        // Enquanto ARRASTA a lupa
        this.lupa.on('drag', (pointer, dragX, dragY) => {
            if (this.achouPulga) return; // Se já achou a pulga, a lupa trava no lugar (é isso que causa o "congelamento" intencional)

            this.lupa.x = dragX;
            this.lupa.y = dragY;

            // Checa a distância entre a lupa e o centro do cachorro
            const distancia = Phaser.Math.Distance.Between(
                this.lupa.x, this.lupa.y, 
                this.cachorro.sprite.x, this.cachorro.sprite.y
            );

            // Raio de detecção
            if (distancia < 150) {
                this.darZoomNaPulga();
            }
        });

        // Quando SOLTA a lupa
        this.lupa.on('dragend', () => {
            if (this.achouPulga) return; 
            this.lupa.setScale(0.8); 
            this.textoInstrucao.setVisible(false); 
        });
    }

    // --- FUNÇÃO DE ZOOM ---
    darZoomNaPulga() {
        if (this.achouPulga) return;
        this.achouPulga = true;

        // O texto continua visível enquanto o zoom acontece
        this.textoInstrucao.setVisible(true);

        // Posiciona a pulga exatamente no centro da lupa
        this.pulga.setPosition(this.lupa.x, this.lupa.y);

        // Animação da Pulga
        this.tweens.add({
            targets: this.pulga,
            
            scale: 1.9, 
            duration: 600, 
            ease: 'Back.easeOut', 
            onComplete: () => {
                this.time.delayedCall(1500, () => {
                    
                   
                    gameState.cachorroTemPulga = true; 
                    
                    // Vai para a próxima tela
                    this.scene.start("cenaCuidado"); 
                });
            }
        });
    }

    update(time, delta) {
        if (this.cachorro && typeof this.cachorro.update === 'function') {
            this.cachorro.update(time, delta);
        }
    }
}