import { gameState } from "../main.js"; // Ajuste os '../' se o caminho for diferente!

export class jogoLazer extends Phaser.Scene {
    constructor() {
        super({ key: "jogoLazer" });
        this.pontos = 0; 
    }

    /**
     * Método de inicialização. Chamado uma vez quando a cena começa.
     * Configura física, cenário, jogador, controles e colisões.
     */
    create() {
        // Zera as variáveis de controle sempre que a fase reiniciar
        this.pontos = 0;
        this.jogoAcabou = false;
        this.minigameFinalizado = false; // <-- CORREÇÃO: Faltava zerar isso aqui!
        this.transicao = false;

        this.physics.world.gravity.y = 800;

        // --------------- MÚSICA ----------------
        if (!gameState.musica) {
            gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        }
        if (!gameState.musica.isPlaying) {
            gameState.musica.play();
        }

        const largura = this.scale.width;
        const altura = this.scale.height;

        // ---------------- CENÁRIO E BACKGROUND ----------------
        const alturaImgBg = this.textures.get("bgLazer").getSourceImage().height;
        const escalaBg = altura / alturaImgBg;

        this.fundo = this.add.tileSprite(0, 0, 8000, altura, "bgLazer").setOrigin(0, 0);
        this.fundo.setTileScale(escalaBg, escalaBg); 

        const alturaDoChao = altura * 0.9;
        
        // Limites do mundo físico e da câmera
        this.physics.world.setBounds(0, 0, 8000, alturaDoChao);
        this.cameras.main.setBounds(0, 0, 8000, altura);

        // ---------------- CACHORRO (JOGADOR) ----------------
        this.cachorro = this.physics.add.sprite(largura * 0.15, alturaDoChao - 200, 'cachorroCorrendo');
        this.cachorro.setCollideWorldBounds(true);
        this.cachorro.setScale(0.5); 
        this.cachorro.setDepth(10); 
        
        // Ajuste da Hitbox do Cachorro
        let dogW = this.cachorro.width;
        let dogH = this.cachorro.height;
        this.cachorro.body.setSize(dogW * 0.7, dogH * 0.5);
        this.cachorro.body.setOffset(dogW * 0.15, dogH * 0.5);

        // Animação de corrida
        this.anims.create({
            key: 'correr',
            frames: this.anims.generateFrameNumbers('cachorroCorrendo', { start: 0, end: 1 }),
            frameRate: 7, 
            repeat: -1 
        });
        this.cachorro.anims.play('correr', true);

        // A câmera segue o cachorro
        this.cameras.main.startFollow(this.cachorro, true, 1, 1, -largura * 0.2, 0);
        
        // ---------------- CONTROLES ----------------
        this.teclado = this.input.keyboard.createCursorKeys();

        // ---------------- GRUPOS DE FÍSICA ----------------
        this.petiscos = this.physics.add.group({ allowGravity: false, immovable: true });
        this.obstaculos = this.physics.add.group({ allowGravity: false, immovable: true });
        this.camasElasticas = this.physics.add.group({ allowGravity: false, immovable: true });

        // Gera os obstáculos e petiscos pela fase
        this.gerarPercurso(alturaDoChao);

        // ---------------- COLISÕES ----------------
        this.physics.add.overlap(this.cachorro, this.petiscos, this.coletarPetisco, null, this);
        this.physics.add.collider(this.cachorro, this.obstaculos, this.baterNoObstaculo, null, this);
        this.physics.add.collider(this.cachorro, this.camasElasticas, this.usarCamaElastica, null, this);

        // ---------------- UI (HUD LOCAL) ----------------
        this.textoPontos = this.add.text(largura - 30, 30, 'Petiscos: 0', { 
            fontFamily: '"Press Start 2P", monospace', 
            fontSize: '24px', 
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(20);

        // ---------------- REDIMENSIONAMENTO (RESIZE) ----------------
        this.scale.on("resize", (tamanhoTela) => {
            const { width: w, height: h } = tamanhoTela;
            this.fundo.setSize(8000, h);
            const novaEscalaBg = h / alturaImgBg;
            this.fundo.setTileScale(novaEscalaBg, novaEscalaBg);

            const novaAlturaDoChao = h * 0.9;
            this.physics.world.setBounds(0, 0, 8000, novaAlturaDoChao);
            this.cameras.main.setBounds(0, 0, 8000, h);
            
            this.textoPontos.setPosition(w - 30, 30);
        });
        
        this.scene.stop("HUD");
    }

    /**
     * Loop principal do jogo. Executado a cada frame.
     */
    update() {
        if (this.jogoAcabou) return; 

        // --- VERIFICA SE PASSOU DIRETO PELO PETISCÃO (DERROTA) ---
        if (this.petiscaoFinal && this.petiscaoFinal.active) {
            if (this.cachorro.x > this.petiscaoFinal.x + 100) {
                this.scene.restart(); 
            }
        }

        // --- VELOCIDADE PROGRESSIVA ---
        let velocidadeAtual = Math.min(300 + (this.cachorro.x * 0.05), 700);
        this.cachorro.setVelocityX(velocidadeAtual);
        
        this.cachorro.anims.timeScale = velocidadeAtual / 300; 

        const noChao = this.cachorro.body.blocked.down || this.cachorro.body.touching.down;

        // --- CONTROLES ---
        if (this.teclado.up.isDown) {
            this.pular();
        } else if (this.teclado.down.isDown) {
            this.abaixar(noChao);
        } else {
            this.cachorro.setScale(0.5, 0.5); 
        }

        // --- CONTROLE DE ANIMAÇÕES ---
        if (!noChao) {
            this.cachorro.anims.pause(this.cachorro.anims.currentAnim.frames[0]);
        } else {
            if (this.cachorro.anims.isPaused) {
                this.cachorro.anims.resume();
            }
            if (!this.cachorro.anims.isPlaying) {
                this.cachorro.play('correr', true);
            }
        }
    }

    pular() {
        if (this.jogoAcabou) return; 

        const noChao = this.cachorro.body.blocked.down || this.cachorro.body.touching.down;

        if (noChao) {
            this.cachorro.setVelocityY(-550);
            this.cachorro.setFrame(0); 
        }
    }

    abaixar(noChao) {
        if (this.jogoAcabou) return;

        if (!noChao) {
            this.cachorro.setVelocityY(1000); 
        } 
        
        this.cachorro.setScale(0.5, 0.41); 
    }

    gerarPercurso(alturaDoChao) {
        let fimDaFase = 7000;
        let tiposPetiscos = [true, true, true, false, false, false, false, false];
        
        Phaser.Utils.Array.Shuffle(tiposPetiscos);

        for (let x = 600; x <= fimDaFase; x += 800) {
            let posX = x + 400; 

            if (x === fimDaFase) {
                let cama = this.camasElasticas.create(posX, alturaDoChao - 25, 'camaElastica').setScale(0.5).setDepth(5);
                cama.body.setSize(cama.width * 0.4, cama.height * 0.1); 
                cama.body.setOffset(cama.width * 0.4, cama.height * 0.5); 

                let yPetiscao = alturaDoChao - 450; 
                let petiscoAlto = this.petiscos.create(posX + 300, yPetiscao, 'petisco').setScale(0.3).setDepth(5);
                
                petiscoAlto.body.setSize(petiscoAlto.width * 0.4, petiscoAlto.height * 0.4);
                petiscoAlto.body.setOffset(petiscoAlto.width * 0.3, petiscoAlto.height * 0.3);
                
                petiscoAlto.tint = 0xffd700; 
                petiscoAlto.isSuper = true;

                this.petiscaoFinal = petiscoAlto;
            } 
            else {
                let obs = this.obstaculos.create(posX, alturaDoChao - 50, 'obstaculo').setScale(2).setDepth(5);
                let raio = obs.width * 0.30; 
                obs.body.setCircle(raio, obs.width * 0.35, obs.height * 0.4);

                let yPetisco = alturaDoChao - 150; 
                let petisco = this.petiscos.create(x, yPetisco, 'petisco').setScale(0.15).setDepth(5);
                petisco.body.setSize(petisco.width * 0.3, petisco.height * 0.3);

                let ehEstragado = tiposPetiscos.shift();

                if (ehEstragado) {
                    petisco.isEstragado = true;
                    petisco.tint = 0x55ff55; 
                } else {
                    petisco.isEstragado = false;
                }
            }
        }
    }

    usarCamaElastica(cachorro, cama) {
        if (cachorro.body.velocity.y >= 0) {
            const constanteElasticaK = 800;  
            const deformacaoX = 0.6;         
            const forcaElastica = constanteElasticaK * deformacaoX; 
            const puloBase = 550;
            const velocidadeFinal = -(puloBase + forcaElastica); 
            
            cachorro.setVelocityY(velocidadeFinal);
            cachorro.setScale(0.5, 0.5); 
            cachorro.setFrame(0); 
        }
    }

    coletarPetisco(cachorro, petisco) {
        petisco.disableBody(true, true); 
        
        if (petisco.isEstragado) {
            this.pontos = Math.max(0, this.pontos - 1);
            this.textoPontos.setText('Petiscos: ' + this.pontos);

            gameState.barras.felicidade = Phaser.Math.Clamp(gameState.barras.felicidade - 10, 0, 100);
            
            cachorro.tint = 0xff0000;
            this.time.delayedCall(500, () => {
                cachorro.clearTint(); 
            });

        } 
        else {
            this.pontos += 1;
            this.textoPontos.setText('Petiscos: ' + this.pontos);
            
            let recompensa = petisco.isSuper ? 20 : 5;
            gameState.barras.felicidade = Phaser.Math.Clamp(gameState.barras.felicidade + recompensa, 0, 100);
            
            if (petisco.isSuper) {
                this.vencerJogo();
            }
        }
        
        this.events.emit("atualizarHUD"); 
    }

    baterNoObstaculo(cachorro, obstaculo) {
        this.scene.restart();
    }

    vencerJogo() {
        if (this.jogoAcabou) return; 
        this.jogoAcabou = true;

        this.physics.pause();
        this.cachorro.anims.pause();

        const meioX = this.cameras.main.worldView.x + (this.scale.width / 2);
        const meioY = this.scale.height / 2;

        this.add.image(meioX, meioY, '', {
            fontFamily: '"Press Start 2P", monospace', 
            fontSize: '40px', 
            fill: '#00ff00',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5).setDepth(30);
        
        // CORREÇÃO: Aguarda 2 segundos com o texto na tela e vai direto para a função que transiciona
        this.time.delayedCall(2000, () => {
            this.finalizarMinigame();
        });
    }
    
    finalizarMinigame() {
        if (this.minigameFinalizado) return;
        this.minigameFinalizado = true;
        this.input.setDefaultCursor("default");

        const estrelas = this.calcularEstrelas(this.pontos);
        const moedas = this.calcularMoedas(estrelas);

        gameState.cobasiCoins += moedas;
        
        // CORREÇÃO: Transiciona imediatamente, sem o delay extra que estava escondendo o texto
        this.scene.start("cenaLazer"); 
    }
    
    calcularEstrelas(pontos) {
        if (pontos >= 5) return 3; 
        if (pontos >= 3) return 2; 
        return 1;                  
    }

    calcularMoedas(estrelas) {
        if (estrelas === 3) return 20;
        if (estrelas === 2) return 10;
        return 5; 
    }
}