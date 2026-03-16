//  o objeto global gameState do arquivo principal
import { gameState } from "../main.js";

// Cena responsável pelo minigame de remover pulgas
export class cenaCuidado extends Phaser.Scene {
    constructor() {
        super({ key: "cenaCuidado" });

        // Variáveis de controle do minigame
        this.totalPulgas = 12;          // Quantidade total de pulgas
        this.pulgasRemovidas = 0;       // Quantas já foram capturadas
        this.pontuacao = 0;             // Pontuação acumulada
        this.minigameFinalizado = false;// Flag para saber se terminou
        this.pincaEquipada = false;     // Se a pinça já foi equipada
        this.bonusMeioGanho = false;    // Se já ganhou bônus na metade
    }

    create() {
        // Garante que a cena HUD esteja ativa
        if (!this.scene.isActive("cenaHUD")) {
            this.scene.launch("cenaHUD");
        } else if (this.scene.isSleeping("cenaHUD")) {
            this.scene.wake("cenaHUD");
        }
        this.scene.bringToTop("cenaHUD");

        // Fundo da cena
        this.add.image(this.scale.width / 2, this.scale.height / 2, "bgCuidado")
            .setDisplaySize(this.scale.width, this.scale.height);

        // Garante que animação da pulga e textura da pinça existam
        this.garantirAnimacaoPulga();
        this.garantirTexturaPinca();

        // Reinicia variáveis de estado
        this.tempoInicialMs = this.time.now;
        this.pulgasRemovidas = 0;
        this.pontuacao = 0;
        this.minigameFinalizado = false;
        this.pincaEquipada = false;
        this.bonusMeioGanho = false;

        // Inicializa moedas se não existirem
        gameState.cobasiCoins = gameState.cobasiCoins ?? 0;

        // Grupo de pulgas com física
        this.pulgas = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize: this.totalPulgas
        });

        // Cria elementos da cena
        this.criarTextosInfo();    // Placar (tempo, progresso, dica)
        this.criarFerramentaPinca(); // Pinça interativa
        this.spawnPulgasIniciais();  // Pulgas iniciais

        // Timer que atualiza o tempo a cada 100ms
        this.timerEvent = this.time.addEvent({
            delay: 100,
            callback: this.atualizarTextoTempo,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        // Só funciona se pinça estiver equipada e minigame não finalizado
        if (!this.pincaEquipada || this.minigameFinalizado) return;

        const ponteiro = this.input.activePointer;

        // Pinça segue o cursor
        if (this.pinca) {
            this.pinca.setPosition(ponteiro.x + 18, ponteiro.y + 14);
        }

        // Verifica clique perto de alguma pulga
        if (ponteiro.isDown) {
            this.pulgas.children.iterate((pulga) => {
                if (!pulga || !pulga.active) return;

                const distancia = Phaser.Math.Distance.Between(
                    ponteiro.x, ponteiro.y,
                    pulga.x, pulga.y
                );

                if (distancia < 40) {
                    this.capturarPulga(pulga);
                }
            });
        }
    }

    // Cria textos de tempo, progresso e dica
    criarTextosInfo() {
        const direita = this.scale.width - 20;

        this.textoTempo = this.add.text(direita, 30, "Tempo: 0s", {
            fontFamily: "Arial", fontSize: "28px", color: "#ffffff",
            stroke: "#000000", strokeThickness: 5, align: "right"
        }).setOrigin(1, 0).setDepth(50);

        this.textoProgresso = this.add.text(direita, 72, `Pulgas: 0/${this.totalPulgas}`, {
            fontFamily: "Arial", fontSize: "24px", color: "#ffe08a",
            stroke: "#000000", strokeThickness: 4, align: "right"
        }).setOrigin(1, 0).setDepth(50);

        this.textoDica = this.add.text(direita, 110, "Clique na pinca\npara equipar", {
            fontFamily: "Arial", fontSize: "20px", color: "#ffd166",
            stroke: "#000000", strokeThickness: 4, align: "right"
        }).setOrigin(1, 0).setDepth(50);
    }

    // Cria pinça interativa
    criarFerramentaPinca() {
        this.pinca = this.add.image(140, this.scale.height - 120, "pincaTool")
            .setDepth(60)
            .setInteractive({ useHandCursor: true });

        const escala = Math.min(140 / this.pinca.width, 140 / this.pinca.height, 1.2);
        this.pinca.setScale(escala);

        this.pinca.on("pointerdown", () => {
            if (this.pincaEquipada) return;

            this.pincaEquipada = true;
            this.input.setDefaultCursor("none"); // esconde cursor padrão
            this.textoDica.setText("Pinca equipada!\nCapture as pulgas");
            this.pinca.disableInteractive();
        });
    }

    // Cria todas as pulgas iniciais
    spawnPulgasIniciais() {
        for (let i = 0; i < this.totalPulgas; i++) {
            this.spawnPulga();
        }
    }

    // Cria uma pulga em posição aleatória
    spawnPulga() {
        const x = Phaser.Math.Between(120, this.scale.width - 280);
        const y = Phaser.Math.Between(100, this.scale.height - 100);

        const pulga = this.pulgas.get(x, y, "pulga");
        if (!pulga) return;

        pulga.setActive(true).setVisible(true);
        pulga.body.setAllowGravity(false);
        pulga.body.stop();
        pulga.setScale(0.12).setDepth(10);
        pulga.play("pulgaAnim", true);

        this.moverPulga(pulga);
    }

    // Captura pulga ao clicar perto
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

    // Mostra popup ao capturar metade das pulgas
    mostrarPopupMetade() {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        const fundo = this.add.rectangle(cx, cy, 500, 200, 0x000000, 0.8)
            .setStrokeStyle(4, 0x9be564).setDepth(80);

        const texto = this.add.text(cx, cy, "Metade das pulgas removidas!", {
            fontFamily: "Arial", fontSize: "32px", color: "#ffffff"
        }).setOrigin(0.5).setDepth(81);

        this.time.delayedCall(2000, () => {
            fundo.destroy();
            texto.destroy();
        });
    }

    // Move pulga para posição aleatória continuamente
    moverPulga(pulga) {
        this.tweens.killTweensOf(pulga);

        const x = Phaser.Math.Between(120, this.scale.width - 280);
        const y = Phaser.Math.Between(100, this.scale.height - 100);

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

        // Atualiza o texto de tempo decorrido
    atualizarTextoTempo() {
        if (this.minigameFinalizado) return;
        const segundos = Math.floor((this.time.now - this.tempoInicialMs) / 1000);
        this.textoTempo.setText(`Tempo: ${segundos}s`);
    }

    // Finaliza o minigame quando todas as pulgas são removidas
    finalizarMinigame() {
        if (this.minigameFinalizado) return;
        this.minigameFinalizado = true;
        this.input.setDefaultCursor("default"); // volta cursor padrão

        // Calcula tempo total
        const segundos = Math.ceil((this.time.now - this.tempoInicialMs) / 1000);
        // Calcula estrelas com base no tempo
        const estrelas = this.calcularEstrelas(segundos);
        // Calcula moedas com base nas estrelas
        const moedas = this.calcularMoedas(estrelas);

        // Atualiza moedas globais
        gameState.cobasiCoins += moedas;
        // Mostra painel de resultado
        this.mostrarPainelResultado(segundos, estrelas, moedas);
    }

    // Calcula estrelas de desempenho
    calcularEstrelas(segundos) {
        if (segundos <= 30) return 3; // rápido → 3 estrelas
        if (segundos <= 45) return 2; // médio → 2 estrelas
        return 1;                     // lento → 1 estrela
    }

    // Calcula moedas com base nas estrelas
    calcularMoedas(estrelas) {
        if (estrelas === 3) return 120;
        if (estrelas === 2) return 80;
        return 50;
    }

    // Mostra painel final com resultado do minigame
    mostrarPainelResultado(segundos, estrelas, moedas) {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        // Fundo do painel
        this.add.rectangle(cx, cy, 620, 330, 0x000000, 0.78)
            .setStrokeStyle(4, 0xffd166)
            .setDepth(70);

        // Texto título
        this.add.text(cx, cy - 80, "Minigame concluido!", {
            fontSize: "44px", color: "#ffffff"
        }).setOrigin(0.5).setDepth(71);

        // Tempo gasto
        this.add.text(cx, cy - 20, `Tempo: ${segundos}s`, {
            fontSize: "30px", color: "#ffffff"
        }).setOrigin(0.5).setDepth(71);

        // Estrelas conquistadas
        this.add.text(cx, cy + 30, `Estrelas: ${"★".repeat(estrelas)}`, {
            fontSize: "36px", color: "#ffd166"
        }).setOrigin(0.5).setDepth(71);

        // Moedas recebidas
        this.add.text(cx, cy + 80, `Coins: +${moedas}`, {
            fontSize: "30px", color: "#9be564"
        }).setOrigin(0.5).setDepth(71);
    }

    // Garante que a animação da pulga exista
    garantirAnimacaoPulga() {
        if (this.anims.exists("pulgaAnim")) return;

        this.anims.create({
            key: "pulgaAnim",
            frames: this.anims.generateFrameNumbers("pulga", { start: 0, end: 1 }),
            frameRate: 7,
            repeat: -1
        });
    }

    // Gera textura da pinça dinamicamente (desenho via código)
    garantirTexturaPinca() {
        if (this.textures.exists("pincaTool")) return;

        const g = this.make.graphics({ x: 0, y: 0, add: false });

        // Desenha linhas da pinça
        g.lineStyle(10, 0xdddddd);
        g.beginPath();
        g.moveTo(14, 122);
        g.lineTo(54, 12);
        g.moveTo(44, 122);
        g.lineTo(72, 12);
        g.strokePath();

        // Desenha círculo da ponta
        g.fillStyle(0x555555);
        g.fillCircle(63, 12, 6);

        // Gera textura final
        g.generateTexture("pincaTool", 88, 132);
        g.destroy();
    }
}
