import { gameState } from "../main.js";
import { GerenciadorCachorros } from "../componentes/controleCachorro/gerenciadorCachorros.js";
import { cachorrosBase } from "../componentes/controleCachorro/cachorrosBase.js";

export class cenaLazer extends Phaser.Scene {
    constructor() {
        super({ key: "cenaLazer" });
    }

    create() {
        // HUD
        if (!this.scene.isActive("HUD")) {
            this.scene.launch("HUD");
        }
        this.scene.bringToTop("HUD");

        if (!gameState.musica) gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        if (!gameState.musica.isPlaying) gameState.musica.play();

        const largura = this.scale.width;
        const altura = this.scale.height;
        const posicaoX = largura - largura * 0.2;
        const posicaoY = altura;

        // 1. Fundo
        this.fundo = this.add.image(posicaoX / 2, posicaoY / 2, "bgLazer")
            .setDisplaySize(posicaoX, posicaoY);
   
       // 2. Cachorro + Pulgas (Usando Container)
        this.gerenciadorCachorros = new GerenciadorCachorros(this);
        
        // Criamos o cachorro em 0,0 para ficar alinhado dentro do container
        this.cachorro = this.gerenciadorCachorros.criarCachorro(0, 0, cachorrosBase[0]);
        
        const elementosContainer = [this.cachorro.sprite];

        // Cria a animação da pulga (caso não tenha sido criada globalmente)
        if (!this.anims.exists("pulgaAnim")) {
            this.anims.create({
                key: "pulgaAnim",
                frames: this.anims.generateFrameNumbers("pulgas", { start: 0, end: 1 }), 
                frameRate: 1,
                repeat: -1
            });
        }

        // Cria o sprite da pulga
        this.pulgas = this.add.sprite(0, 0, "pulgas")
            .setOrigin(0.5)
            .setScale(posicaoY * 0.0015); 

        this.pulgas.play("pulgaAnim");
        this.pulgas.setVisible(gameState.pulga);

        // Adiciona a pulga na lista do container
        elementosContainer.push(this.pulgas);

        // Cria o container agrupando o cachorro e a pulga nas coordenadas originais da cenaLazer
        this.containerCachorro = this.add.container(
            posicaoX / 1.95, 
            posicaoY / 1.5, 
            elementosContainer
        );

        // A escala agora é aplicada no container, afetando ambos
        this.containerCachorro.setScale(posicaoY * 0.0006);

        // Aplica a física no sprite do cachorro, que agora está dentro do container
        this.physics.add.existing(this.cachorro.sprite);
        this.cachorro.sprite.body.setAllowGravity(false);
        this.cachorro.sprite.body.immovable = true;

        // 3. Petisco (BOTÃO)
        this.petiscoBtn = this.add.image(posicaoX / 1.2, posicaoY / 1.1, 'petisco');
        this.petiscoBtn.setScale(0.2); 

        this.petiscoBtn.setInteractive({ useHandCursor: true });

        // --- EVENTOS DO BOTÃO ---
        this.petiscoBtn.on('pointerdown', () => {
            this.scene.start('jogoLazer');
        });

        this.petiscoBtn.on('pointerover', () => {
            this.petiscoBtn.setScale(0.25); 
        });

        this.petiscoBtn.on('pointerout', () => {
            this.petiscoBtn.setScale(0.2); 
        });

        // 4. TELA DE INSTRUÇÕES (Aparece apenas na primeira vez)
        if (!gameState.instrucoesLazerVistas) {
            this.mostrarInstrucoes(posicaoX, posicaoY);
        }
    }
    
    update(){
        // Verifica a troca de estado do cachorro
        if (gameState.trocar) {
            this.gerenciadorCachorros.mudarParaCachorroHeroi();
        }
        
        // Atualiza a visibilidade da pulga dinamicamente
        if (this.pulgas) {
            this.pulgas.setVisible(gameState.pulga);
        }
    }

    // ================= MÉTODOS ADICIONAIS =================

    /**
   /**
   /**
    /**
     * Cria um overlay escuro e exibe a imagem de instruções.
     * Clicar na tela fecha as instruções e salva no gameState.
     */
    mostrarInstrucoes(posicaoX, posicaoY) {
        // Traz a cena de Lazer para cima do HUD temporariamente
        this.scene.bringToTop();

        // Vamos centralizar na tela TODA (e não só na área jogável) para ficar mais elegante
        const centroX = this.scale.width / 2;
        const centroY = this.scale.height / 2;

        const fundoEscuro = this.add.rectangle(centroX, centroY, 8000, 8000, 0x000000, 0.7)
            .setDepth(100)
            .setInteractive();

        const telaInstrucao = this.add.image(centroX, centroY, 'instrucaoLazer')
            .setDepth(101)
            .setInteractive({ useHandCursor: true }); 

        // --- AJUSTE DE TAMANHO DA IMAGEM ---
        const limiteLargura = this.scale.width * 0.8;
        const limiteAltura = this.scale.height * 0.8;

        const escalaX = limiteLargura / telaInstrucao.width;
        const escalaY = limiteAltura / telaInstrucao.height;

        const escalaFinal = Math.min(escalaX, escalaY);
        telaInstrucao.setScale(escalaFinal);
        // ------------------------------------

        const fecharInstrucoes = () => {
            fundoEscuro.destroy();
            telaInstrucao.destroy();
            gameState.instrucoesLazerVistas = true; 
            
            // DEVOLVE O HUD PARA O TOPO QUANDO FECHAR
            this.scene.bringToTop("HUD");
        };

        fundoEscuro.on('pointerdown', fecharInstrucoes);
        telaInstrucao.on('pointerdown', fecharInstrucoes);
    }
}