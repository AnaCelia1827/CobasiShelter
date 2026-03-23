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


        // Fundo
        this.fundo = this.add.image(this.scale.width / 2, this.scale.height / 2, "bgCuidado")
            .setDisplaySize(this.scale.width, this.scale.height);

        this.garantirTexturaPinca();

        // Reset variáveis
        this.pulgasRemovidas = 0;
        this.pontuacao = 0;
        this.minigameFinalizado = false;
        this.pincaEquipada = false;
        this.bonusMeioGanho = false;
        this.pulgaSegurada = null;
        
        // Reseta flag de instruções
        this.instrucoesLidas = false;

        gameState.cobasiCoins = gameState.cobasiCoins ?? 0;

        // Posição da Bandeja
        const posXBandeja = this.scale.width/2; // Mantida na esquerda, mas discretamente
        const posYBandeja = this.scale.height *0.9
        this.bandeja = this.add.image(posXBandeja, posYBandeja, "bandeja")
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

        // LÓGICA DE PEGAR E SOLTAR
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

        // Listener de resize
        this.scale.on("resize", (gameSize) => {
            const largura = gameSize.width;
            const altura = gameSize.height;

            this.cameras.resize(largura, altura);
            this.fundo.setDisplaySize(largura, altura).setPosition(largura / 2, altura / 2);

            // Reposiciona textos de info discretos
            this.textoTempo.setPosition(100, 30);
            this.textoProgresso.setPosition(largura - 40, 30);

            if (this.bandeja) {
                this.bandeja.setPosition(100, altura / 2);
            }

            if (this.pinca) {
                this.pinca.setPosition(largura / 2, altura - 120); // Centralizada na prateleira
            }

            // Pulgas agora ocupam todo espaço, inclusive atrás da bandeja
            this.pulgas.children.iterate((pulga) => {
                if (pulga && pulga.active && pulga !== this.pulgaSegurada) {
                    const x = Phaser.Math.Between(50, largura - 50); 
                    const y = Phaser.Math.Between(80, altura - 80);
                    pulga.setPosition(x, y);
                }
            });
        });
    }

    update() {
        // Só funciona se instruções lidas, pinça equipada e minigame não finalizado
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

    // Função para mostrar instruções no início
    mostrarInstrucoes() {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        const grupoInstrucoes = this.add.group();

        const fundo = this.add.rectangle(cx, cy, this.scale.width, this.scale.height, 0x000000, 0.85)
            .setDepth(100);
        fundo.setInteractive(); 

        const titulo = this.add.text(cx, cy - 120, "COMO JOGAR", {
            fontFamily: '"Press Start 2P", Arial', 
            fontSize: "35px", // <-- AJUSTADO PARA MEIO-TERMO
            color: "#ffd166",
            align: "center"
        }).setOrigin(0.5).setDepth(101);

        const texto = this.add.text(cx, cy + 20, 
            "Clique e arraste as pulgas\n" +
            "uma a uma ate a bandeja\n" +
            "na parte inferior para coleta-las.", 
        {
            fontFamily: '"Press Start 2P", Arial', 
            fontSize: "18px", // <-- AJUSTADO PARA MEIO-TERMO
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
    
    // Função que começa o jogo de verdade
    iniciarMinigameAposInstrucoes() {
        this.instrucoesLidas = true;
        
        // Ativa o timer
        this.tempoInicialMs = this.time.now;
        this.timerEvent = this.time.addEvent({
            delay: 100,
            callback: this.atualizarTextoTempo,
            callbackScope: this,
            loop: true
        });
        
        // Faz as pulgas começarem a se mexer
        this.pulgas.children.iterate((pulga) => {
            if (pulga && pulga.active) {
                this.moverPulga(pulga);
            }
        });
        
        // Mostra popup rápida: "Clique na Pinça!"
        this.mostrarPopupInstrucaoPinca();
    }

    mostrarPopupInstrucaoPinca() {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;
        const textoPopup = this.add.text(cx, cy, "Clique na Pinca\npara equipar!", {
            fontFamily: '"Press Start 2P", Arial', 
            fontSize: "16px", // <-- AJUSTADO PARA MEIO-TERMO
            color: "#ffd166",
            stroke: "#000000", strokeThickness: 8, align: "center"
        }).setOrigin(0.5).setDepth(80);
        
        this.time.delayedCall(2000, () => {
            textoPopup.destroy();
        });
    }

    // Cria textos de tempo e progresso no TOPO, sem HUD lateral
    criarTextosInfo() {
        const largura = this.scale.width;

        // Tempo na esquerda
        this.textoTempo = this.add.text(62, 58, "Tempo: 0s", {
            fontFamily: '"Press Start 2P", Arial', 
            fontSize: "20px", // <-- AJUSTADO PARA MEIO-TERMO
            color: "#ffffff",
            stroke: "#000000", strokeThickness: 5, align: "left"
        }).setOrigin(0, 0).setDepth(50);

        // Progresso na direita
        this.textoProgresso = this.add.text(290, 30, `Pulgas:0/${this.totalPulgas}`, {
            fontFamily: '"Press Start 2P", Arial', 
            fontSize: "20px", // <-- AJUSTADO PARA MEIO-TERMO
            color: "#ffffff",
            stroke: "#000000", strokeThickness: 4, align: "right"
        }).setOrigin(1, 0).setDepth(50);
    }

    // Cria pinça interativa
    criarFerramentaPinca() {
        // Pinça centralizada na prateleira
        this.pinca = this.add.image(this.scale.width / 2, this.scale.height - 120, "pincaTool")
            .setDepth(60)
            .setInteractive({ useHandCursor: true });

        const escala = Math.min(140 / this.pinca.width, 140 / this.pinca.height, 1.2);
        this.pinca.setScale(escala);

        this.pinca.on("pointerdown", () => {
            if (this.pincaEquipada) return;

            this.pincaEquipada = true;
            this.input.setDefaultCursor("none"); // esconde cursor padrão
            this.pinca.disableInteractive();
        });
    }

    spawnPulgasIniciais() {
        for (let i = 0; i < this.totalPulgas; i++) {
            this.spawnPulga();
        }
    }

    spawnPulga() {
        // Area de spawn maximizada para toda a tela
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const y = Phaser.Math.Between(80, this.scale.height - 80); // Começa abaixo dos textos do topo

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

        // Bônus na metade
        if (this.pulgasRemovidas === 6 && !this.bonusMeioGanho) {
            this.bonusMeioGanho = true;
            gameState.barras.saude = Phaser.Math.Clamp(gameState.barras.saude - 5, 0, 11);
            this.mostrarPopupMetade();
        }

        // Finaliza minigame ao capturar todas
        if (this.pulgasRemovidas >= this.totalPulgas) {
            gameState.barras.saude = Phaser.Math.Clamp(gameState.barras.saude - 11, 0, 11);
            this.finalizarMinigame();
        }
    }

    mostrarPopupMetade() {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 5;

        const fundo = this.add.rectangle(cx, cy, 700, 50, 0x000000, 0.8)
            .setStrokeStyle(4, 0x9be564).setDepth(20);

        const texto = this.add.text(cx, cy, "Metade das\npulgas removidas!", {
            fontFamily: '"Press Start 2P", Arial', 
            fontSize: "15px", // <-- AJUSTADO PARA MEIO-TERMO
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

        // Area de movimento maximizada
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

        this.add.rectangle(cx, cy, 620, 330, 0x000000, 0.78)
            .setStrokeStyle(4, 0xffd166)
            .setDepth(70);

        this.add.text(cx, cy - 80, "Minigame concluido!", {
            fontFamily: '"Press Start 2P", Arial', 
            fontSize: "26px", // <-- AJUSTADO PARA MEIO-TERMO
            color: "#ffffff"
        }).setOrigin(0.5).setDepth(71);

        this.add.text(cx, cy - 20, `Tempo: ${segundos}s`, {
            fontFamily: '"Press Start 2P", Arial',
            fontSize: "16px", // <-- AJUSTADO PARA MEIO-TERMO
            color: "#ffffff"
        }).setOrigin(0.5).setDepth(71);

        this.add.text(cx, cy + 30, `Estrelas: ${"★".repeat(estrelas)}`, {
            fontFamily: '"Press Start 2P", Arial',
            fontSize: "20px", // <-- AJUSTADO PARA MEIO-TERMO
            color: "#ffd166"
        }).setOrigin(0.5).setDepth(71);

        this.add.text(cx, cy + 80, `Cobasi Coins: +${moedas}`, {
            fontFamily: '"Press Start 2P", Arial',
            fontSize: "16px", // <-- AJUSTADO PARA MEIO-TERMO
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