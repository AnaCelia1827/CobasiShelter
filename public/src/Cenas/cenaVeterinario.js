import { gameState } from "../main.js"
import { GerenciadorCachorros } from "../componentes/controleCachorro/gerenciadorCachorros.js"
import { cachorrosBase } from "../componentes/controleCachorro/cachorrosBase.js"

export class cenaVeterinario extends Phaser.Scene {
    constructor() {
        super({ key: "cenaVeterinario" });
        this.achouPulga = false;
    }

    create() {
        // --- NOVIDADE 1: Lendo o cérebro global ---
        // Se a lupa já foi usada no passado, bloqueia imediatamente.
        if (gameState.lupaJaUsada) {
            this.achouPulga = true;
        } else {
            this.achouPulga = false;
        }

        if (!this.scene.isActive("cenaHUD")) this.scene.launch("cenaHUD");
        this.scene.bringToTop("cenaHUD");

        if (!gameState.musica) gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        if (!gameState.musica.isPlaying) gameState.musica.play();

        const posicaoX = this.scale.width - this.scale.width * 0.2;
        const posicaoY = this.scale.height;

        // 👇 usa estado atual do cachorro (sincronizado com CenaBanho e outras)
        // cachorrosBase[0].estado não deve ser sobrescrito para preservar progresso

        this.gerenciadorCachorros = new GerenciadorCachorros(this)

        this.cachorro = this.gerenciadorCachorros.criarCachorro(
            posicaoX / 2,
            posicaoY / 2.3,
            cachorrosBase[0]
        )
        this.physics.add.existing(this.cachorro.sprite)
        this.cachorro.sprite.setScale(posicaoY * 0.0006)
        this.cachorro.sprite.body.setAllowGravity(false)
        this.cachorro.sprite.body.immovable = true


        this.fundo = this.add.image(posicaoX / 2, posicaoY / 2, "bgVeterinario")
            .setDisplaySize(posicaoX, posicaoY);

        // 3. Texto de Instrução
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

        this.cachorro = this.gerenciadorCachorros.criarCachorro(
            posicaoX / 2,
            posicaoY / 2.3,
            cachorrosBase[0]
        )
        
        const lupaX = posicaoX / 2;
        const lupaY = posicaoY - (posicaoY * 0.15); 

        this.lupa = this.add.image(lupaX, lupaY, "lupa")
            .setOrigin(0.5, 0.5) 
            .setScale(0.8) 
            .setDepth(10);
            
        // --- NOVIDADE 2: Controle de Interação ---
        // Só deixa o jogador clicar e arrastar a lupa se ela AINDA NÃO foi usada
        if (!gameState.lupaJaUsada) {
            this.lupa.setInteractive({ useHandCursor: true });
            this.input.setDraggable(this.lupa);
        } else {
            // Opcional: Deixa a lupa um pouquinho transparente pra mostrar que está desativada
            this.lupa.setAlpha(0.5); 
        }
        
        // --- LÓGICA DE ARRASTAR E EFEITOS DA LUPA ---

        // Quando CLICA / COMEÇA a segurar a lupa
        this.lupa.on('dragstart', () => {
            if (this.achouPulga) return;
            this.lupa.setScale(0.9); 
            this.textoInstrucao.setVisible(true); 
        });

        // Enquanto ARRASTA a lupa
        this.lupa.on('drag', (pointer, dragX, dragY) => {
            if (this.achouPulga) return; 

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

        // --- NOVIDADE 3: Salvando o progresso no cérebro ---
        gameState.lupaJaUsada = true; // Avisa que a lupa foi usada com sucesso!

        // O texto continua visível enquanto o zoom acontece
        this.textoInstrucao.setVisible(true);

        // Posiciona a pulga exatamente no centro da lupa
        this.pulga.setPosition(this.lupa.x, this.lupa.y);

        // Animação da Pulga
        this.tweens.add({
            targets: this.pulga,
            scale: 1.5, 
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