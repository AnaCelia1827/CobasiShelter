import { gameState } from "../main.js";
// Vamos importar o Gerenciador em vez do Cachorro direto
import { GerenciadorCachorros } from "../componentes/controleCachorro/gerenciadorCachorros.js";
import { cachorrosBase } from "../componentes/controleCachorro/cachorrosBase.js";

export class cenaLazer extends Phaser.Scene {
    constructor() {
        super({ key: "cenaLazer" });
    }

    create() {
    
        // HUD
        if (!this.scene.isActive("HUD")) {
            this.scene.launch("HUD")
        }
        this.scene.bringToTop("HUD")

        if (!gameState.musica) gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        if (!gameState.musica.isPlaying) gameState.musica.play();

        const posicaoX = this.scale.width - this.scale.width * 0.2;
        const posicaoY = this.scale.height;

        // 1. Fundo
        this.fundo = this.add.image(posicaoX / 2, posicaoY / 2, "bgLazer")
            .setDisplaySize(posicaoX, posicaoY);
   
       // 2. Cachorro (Usando o Gerenciador, igual na tela principal!)
        this.gerenciadorCachorros = new GerenciadorCachorros(this);
        
        // O gerenciador sabe exatamente como montar os dados antes de chamar a classe Cachorro
        this.cachorro = this.gerenciadorCachorros.criarCachorro(posicaoX / 1.95, posicaoY / 1.5, cachorrosBase[0]);

        // Agora que ele foi criado certinho, pegamos o sprite dele para colocar a física e o tamanho
        this.physics.add.existing(this.cachorro.sprite);
        this.cachorro.sprite.setScale(posicaoY * 0.0006);
        this.cachorro.sprite.body.setAllowGravity(false);
        this.cachorro.sprite.body.immovable = true;

        // 3. Petisco (BOTÃO)
        // Posicionando o petisco um pouco acima do cachorro para não sobrepor
        this.petiscoBtn = this.add.image(posicaoX / 1.2, posicaoY / 1.1, 'petisco');
        this.petiscoBtn.setScale(0.2); // Ajuste a escala conforme ficar melhor na sua tela

        // Torna a imagem interativa e muda o cursor do mouse para a "mãozinha"
        this.petiscoBtn.setInteractive({ useHandCursor: true });

        // --- EVENTOS DO BOTÃO ---

        // Quando CLICAR, vai para o jogoLazer
        this.petiscoBtn.on('pointerdown', () => {
            this.scene.start('jogoLazer');
        });

        // Quando PASSAR O MOUSE por cima (Hover), o petisco aumenta um pouquinho
        this.petiscoBtn.on('pointerover', () => {
            this.petiscoBtn.setScale(0.25); 
        });

        // Quando TIRAR O MOUSE de cima, volta ao tamanho normal
        this.petiscoBtn.on('pointerout', () => {
            this.petiscoBtn.setScale(0.2); 
        });
       
    }
}