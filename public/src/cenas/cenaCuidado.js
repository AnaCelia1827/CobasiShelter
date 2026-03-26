// o objeto global gameState do arquivo principal
import { gameState } from "../main.js";

// Cena responsável pelo minigame de remover pulgas
export class cenaCuidado extends Phaser.Scene {
    constructor() {
        super({ key: "cenaCuidado" });

        // Variáveis de controle do minigame
        this.totalPulgas = 12;          
        this.pulgasRemovidas = 0;       
        this.pontuacao = 0;             
        this.minigameFinalizado = false;
        this.pincaEquipada = false;     
        this.bonusMeioGanho = false;    
        this.pulgaSegurada = null; 

        // Variável para saber se as instruções foram fechadas
        this.instrucoesLidas = false;
    }

    create() {
         // Para garantir que a HUD não fique ativa ao iniciar
        this.scene.stop("HUD");
        this.transicao = false;

        const largura = this.scale.width;
        const altura = this.scale.height;

        // Fundo
        this.fundo = this.add.image(largura / 2, altura / 2, "bgCuidado")
            .setDisplaySize(largura, altura);

        this.garantirTexturaPinca();

        // Reset variáveis
        this.pulgasRemovidas = 0;
        this.pontuacao = 0;
        this.minigameFinalizado = false;
        this.pincaEquipada = false;
        this.bonusMeioGanho = false;
        this.pulgaSegurada = null;
        this.instrucoesLidas = false;

        gameState.cobasiCoins = gameState.cobasiCoins ?? 0;

        // Posição da Bandeja (Responsiva: Centro inferior)
        this.bandeja = this.add.image(largura / 2, altura * 0.85, "bandeja")
            .setDepth(5)
            .setScale(0.5); 

        // Grupo de pulgas
        this.pulgas = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize: this.totalPulgas
        });

        // Elementos discretos de info no topo
        this.criarTextosInfo();
        
        this.criarFerramentaPinca();
        
        // Cria pulgas, mas elas ficam paradas até ler instruções
        this.spawnPulgasIniciais();

        // --- LÓGICA DE PEGAR E SOLTAR ---
        this.input.on('pointerdown', (pointer) => {
            if (!this.instrucoesLidas || !this.pincaEquipada || this.minigameFinalizado || this.pulgaSegurada) return;
            
            let pulgaMaisProxima = null;
            let menorDistancia = 50; 
            
            this.pulgas.children.iterate((pulga) => {
                if (!pulga || !pulga.active) return;
                const distancia = Phaser.Math.Distance.Between(pointer.x, pointer.y, pulga.x, pulga.y);
                if (distancia < menorDistancia) {
                    menorDistancia = distancia;
                    pulgaMaisProxima = pulga;
                }
            });

            if (pulgaMaisProxima) {
                this.pulgaSegurada = pulgaMaisProxima;
                this.tweens.killTweensOf(pulgaMaisProxima); 
                this.pulgaSegurada.setScale(0.15); 
            }
        });

        this.input.on('pointerup', (pointer) => {
            if (this.pulgaSegurada) {
                const areaBandeja = this.bandeja.getBounds();
                if (Phaser.Geom.Rectangle.ContainsPoint(areaBandeja, pointer)) {
                    this.capturarPulga(this.pulgaSegurada);
                } else {
                    this.pulgaSegurada.setScale(0.12);
                    this.moverPulga(this.pulgaSegurada); 
                }
                this.pulgaSegurada = null;
            }
        });

        // Chama o painel de instruções
        this.mostrarInstrucoes();

        // --- LÓGICA DE RESPONSIVIDADE (RESIZE) ---
        const handleResize = (gameSize) => {
            const novaLargura = gameSize.width;
            const novaAltura = gameSize.height;

            this.cameras.resize(novaLargura, novaAltura);
            
            // Reajusta Fundo
            if (this.fundo) {
                this.fundo.setDisplaySize(novaLargura, novaAltura).setPosition(novaLargura / 2, novaAltura / 2);
            }

            // Reajusta Textos (Ancorados nas margens)
            if (this.textoTempo) this.textoTempo.setPosition(20, 30);
            if (this.textoProgresso) this.textoProgresso.setPosition(novaLargura - 20, 30);

            // Reajusta Bandeja
            if (this.bandeja) {
                this.bandeja.setPosition(novaLargura / 2, novaAltura * 0.85);
            }

            // Reajusta Pinça (Se ainda não foi equipada)
            if (this.pinca && !this.pincaEquipada) {
                this.pinca.setPosition(novaLargura / 2, novaAltura * 0.7);
            }

            // Reajusta Pulgas (Mantém dentro da tela suavemente)
            this.pulgas.children.iterate((pulga) => {
                if (pulga && pulga.active && pulga !== this.pulgaSegurada) {
                    pulga.x = Phaser.Math.Clamp(pulga.x, 50, novaLargura - 50);
                    pulga.y = Phaser.Math.Clamp(pulga.y, 80, novaAltura - 80);
                }
            });
        };

        this.scale.on("resize", handleResize);

        this.events.on('shutdown', () => {
            this.scale.off("resize", handleResize);
        });
    }

    update() {
        if (!this.instrucoesLidas || !this.pincaEquipada || this.minigameFinalizado) return;

        const ponteiro = this.input.activePointer;
        
        // Pinça segue o cursor
        if (this.pinca) {
            this.pinca.setPosition(ponteiro.x + 18, ponteiro.y + 14);
        }

        if (this.pulgaSegurada) {
            this.pulgaSegurada.setPosition(ponteiro.x, ponteiro.y);
        }
    }

    mostrarInstrucoes() {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        const grupoInstrucoes = this.add.group();

        const fundo = this.add.rectangle(cx, cy, this.scale.width, this.scale.height, 0x000000, 0.85)
            .setDepth(100)
            .setInteractive(); 

        const titulo = this.add.text(cx, cy - 120, "COMO JOGAR", {
            fontFamily: '"Press Start 2P", Arial', 
            fontSize: "35px",
            color: "#ffd166",
            align: "center"
        }).setOrigin(0.5).setDepth(101);

        const texto = this.add.text(cx, cy + 20, 
            "Clique e arraste as pulgas\n" +
            "uma a uma ate a bandeja\n" +
            "na parte inferior para coleta-las.", 
        {
            fontFamily: '"Press Start 2P", Arial', 
            fontSize: "18px",
            color: "#ffffff",
            align: "center",
            lineSpacing: 15
        }).setOrigin(0.5).setDepth(101);

        const textoBotao = this.add.text(cx, cy + 180, "[ Clique para Comecar ]", {
            fontFamily: '"Press Start 2P", Arial',
            fontSize: "15px",
            color: "#9be564"
        }).setOrigin(0.5).setDepth(101);
        
        this.tweens.add({
            targets: textoBotao, alpha: 0.5, duration: 600, yoyo: true, loop: -1
        });

        grupoInstrucoes.addMultiple([fundo, titulo, texto, textoBotao]);

        fundo.on('pointerdown', () => {
            grupoInstrucoes.destroy(true); 
            this.iniciarMinigameAposInstrucoes();
        });
    }
    
    iniciarMinigameAposInstrucoes() {
        this.instrucoesLidas = true;
        
        this.tempoInicialMs = this.time.now;
        this.timerEvent = this.time.addEvent({
            delay: 100,
            callback: this.atualizarTextoTempo,
            callbackScope: this,
            loop: true
        });
        
        this.pulgas.children.iterate((pulga) => {
            if (pulga && pulga.active) {
                this.moverPulga(pulga);
            }
        });
        
        this.mostrarPopupInstrucaoPinca();
    }

    mostrarPopupInstrucaoPinca() {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;
        const textoPopup = this.add.text(cx, cy, "Clique na Pinca\npara equipar!", {
            fontFamily: '"Press Start 2P", Arial', 
            fontSize: "16px", 
            color: "#ffd166",
            stroke: "#000000", strokeThickness: 8, align: "center"
        }).setOrigin(0.5).setDepth(80);
        
        this.time.delayedCall(2000, () => {
            textoPopup.destroy();
        });
    }

    criarTextosInfo() {
        const largura = this.scale.width;

        // Tempo na esquerda (ancorado com margem de 20px)
        this.textoTempo = this.add.text(20, 30, "Tempo: 0s", {
            fontFamily: '"Press Start 2P", Arial', 
            fontSize: "20px",
            color: "#ffffff",
            stroke: "#000000", strokeThickness: 5, align: "left"
        }).setOrigin(0, 0).setDepth(50);

        // Progresso na direita (ancorado na direita com margem de 20px)
        this.textoProgresso = this.add.text(largura - 20, 30, `Pulgas: 0/${this.totalPulgas}`, {
            fontFamily: '"Press Start 2P", Arial', 
            fontSize: "20px", 
            color: "#ffffff",
            stroke: "#000000", strokeThickness: 4, align: "right"
        }).setOrigin(1, 0).setDepth(50);
    }

    criarFerramentaPinca() {
        const largura = this.scale.width;
        const altura = this.scale.height;

        this.pinca = this.add.image(largura / 2, altura * 0.7, "pincaTool")
            .setDepth(60)
            .setInteractive({ useHandCursor: true });

        const escala = Math.min(140 / this.pinca.width, 140 / this.pinca.height, 1.2);
        this.pinca.setScale(escala);

        this.pinca.on("pointerdown", () => {
            if (this.pincaEquipada) return;

            this.pincaEquipada = true;
            this.input.setDefaultCursor("none"); 
            this.pinca.disableInteractive();
        });
    }

    spawnPulgasIniciais() {
        for (let i = 0; i < this.totalPulgas; i++) {
            this.spawnPulga();
        }
    }

    spawnPulga() {
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const y = Phaser.Math.Between(80, this.scale.height - 80); 

        const pulga = this.pulgas.get(x, y, "pulga1");
        if (!pulga) return;

        pulga.setActive(true).setVisible(true);
        pulga.body.setAllowGravity(false);
        pulga.body.stop();
        pulga.setScale(0.12).setDepth(10);
    }

    capturarPulga(pulga) {
        if (!pulga.active) return;

        this.tweens.killTweensOf(pulga);
        pulga.setActive(false).setVisible(false);
        if (pulga.body) pulga.body.enable = false;

        this.pulgasRemovidas++;
        this.pontuacao++;

        this.textoProgresso.setText(`Pulgas: ${this.pulgasRemovidas}/${this.totalPulgas}`);

        if (this.pulgasRemovidas === 6 && !this.bonusMeioGanho) {
            this.bonusMeioGanho = true;
            gameState.barras.saude = Phaser.Math.Clamp(gameState.barras.saude - 5, 0, 11);
            this.mostrarPopupMetade();
        }

        if (this.pulgasRemovidas >= this.totalPulgas) {
            gameState.barras.saude = Phaser.Math.Clamp(gameState.barras.saude - 11, 0, 11);
            this.finalizarMinigame();
        }
    }

    mostrarPopupMetade() {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 5;

        // Largura responsiva do fundo
        const larguraFundo = Math.min(700, this.scale.width * 0.9);

        const fundo = this.add.rectangle(cx, cy, larguraFundo, 50, 0x000000, 0.8)
            .setStrokeStyle(4, 0x9be564).setDepth(20);

        const texto = this.add.text(cx, cy, "Metade das\npulgas removidas!", {
            fontFamily: '"Press Start 2P", Arial', 
            fontSize: "15px", 
            color: "#ffffff",
            align: "center"
        }).setOrigin(0.5).setDepth(81);

        this.time.delayedCall(2000, () => {
            fundo.destroy();
            texto.destroy();
        });
    }

    moverPulga(pulga) {
        this.tweens.killTweensOf(pulga);

        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const y = Phaser.Math.Between(80, this.scale.height - 80);

        this.tweens.add({
            targets: pulga,
            x: x, y: y,
            duration: Phaser.Math.Between(1800, 3200),
            ease: "Sine.easeInOut",
            onComplete: () => {
                if (pulga.active && !this.minigameFinalizado) {
                    this.moverPulga(pulga);
                }
            }
        });
    }

    atualizarTextoTempo() {
        if (!this.instrucoesLidas || this.minigameFinalizado) return;
        const segundos = Math.floor((this.time.now - this.tempoInicialMs) / 1000);
        this.textoTempo.setText(`Tempo: ${segundos}s`);
    }

    finalizarMinigame() {
        if (this.minigameFinalizado) return;
        this.minigameFinalizado = true;
        this.input.setDefaultCursor("default");

        const segundos = Math.ceil((this.time.now - this.tempoInicialMs) / 1000);
        const estrelas = this.calcularEstrelas(segundos);
        const moedas = this.calcularMoedas(estrelas);

        gameState.pulga = false;

        gameState.cobasiCoins += moedas;
        this.mostrarPainelResultado(segundos, estrelas, moedas);

        this.time.delayedCall(3500, () => {
            this.scene.start('cenaVeterinario'); 
        });
    }

    calcularEstrelas(segundos) {
        if (segundos <= 30) return 3; 
        if (segundos <= 55) return 2; 
        return 1;                     
    }

    calcularMoedas(estrelas) {
        if (estrelas === 3) return 20;
        if (estrelas === 2) return 10;
        return 0; 
    }

    mostrarPainelResultado(segundos, estrelas, moedas) {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        // Largura responsiva do fundo de resultado
        const larguraPainel = Math.min(620, this.scale.width * 0.9);

        this.add.rectangle(cx, cy, larguraPainel, 330, 0x000000, 0.78)
            .setStrokeStyle(4, 0xffd166)
            .setDepth(70);

        this.add.text(cx, cy - 80, "Minigame concluido!", {
            fontFamily: '"Press Start 2P", Arial', 
            fontSize: "22px", // Tamanho um pouco reduzido para não estourar telas pequenas
            color: "#ffffff"
        }).setOrigin(0.5).setDepth(71);

        this.add.text(cx, cy - 20, `Tempo: ${segundos}s`, {
            fontFamily: '"Press Start 2P", Arial',
            fontSize: "16px",
            color: "#ffffff"
        }).setOrigin(0.5).setDepth(71);

        this.add.text(cx, cy + 30, `Estrelas: ${"★".repeat(estrelas)}`, {
            fontFamily: '"Press Start 2P", Arial',
            fontSize: "20px", 
            color: "#ffd166"
        }).setOrigin(0.5).setDepth(71);

        this.add.text(cx, cy + 80, `Cobasi Coins: +${moedas}`, {
            fontFamily: '"Press Start 2P", Arial',
            fontSize: "16px", 
            color: "#9be564"
        }).setOrigin(0.5).setDepth(71);
    }

    garantirTexturaPinca() {
        if (this.textures.exists("pincaTool")) return;

        const g = this.make.graphics({ x: 0, y: 0, add: false });
        g.lineStyle(10, 0xdddddd);
        g.beginPath();
        g.moveTo(14, 122);
        g.lineTo(54, 12);
        g.moveTo(44, 122);
        g.lineTo(72, 12);
        g.strokePath();

        g.fillStyle(0x555555);
        g.fillCircle(63, 12, 6);

        g.generateTexture("pincaTool", 88, 132);
        g.destroy();
    }
}