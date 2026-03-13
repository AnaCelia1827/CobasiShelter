import { gameState } from "../main.js";

export class cenaCuidado extends Phaser.Scene {
    constructor() {
        super({ key: "cenaCuidado" });

        // variáveis de estado
        this.totalPulgas = 12;
        this.pulgasRemovidas = 0;
        this.pontuacao = 0;
        this.minigameFinalizado = false;
        this.pincaEquipada = false;
        this.bonusMeioGanho = false;
    }

    create() {
        // HUD
        if (!this.scene.isActive("cenaHUD")) {
            this.scene.launch("cenaHUD");
        } else if (this.scene.isSleeping("cenaHUD")) {
            this.scene.wake("cenaHUD");
        }

        // fundo
        this.add.image(this.scale.width / 2, this.scale.height / 2, "bgCuidado")
            .setDisplaySize(this.scale.width, this.scale.height);

        // animações e texturas
        this.garantirAnimacaoPulga();
        this.garantirTexturaPinca();

        // inicialização
        this.tempoInicialMs = this.time.now;
        this.pulgasRemovidas = 0;
        this.pontuacao = 0;
        this.minigameFinalizado = false;
        this.pincaEquipada = false;
        this.bonusMeioGanho = false;

        gameState.cobasiCoins = gameState.cobasiCoins ?? 0;

        this.pulgas = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize: this.totalPulgas
        });

        this.criarTextosInfo();
        this.criarFerramentaPinca();
        this.spawnPulgasIniciais();

        this.timerEvent = this.time.addEvent({
            delay: 100,
            callback: this.atualizarTextoTempo,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        if (!this.pincaEquipada || this.minigameFinalizado) return;

        const ponteiro = this.input.activePointer;

        if (this.pinca) {
            this.pinca.setPosition(ponteiro.x + 18, ponteiro.y + 14);
        }

        if (ponteiro.isDown) {
            this.pulgas.children.iterate((pulga) => {
                if (!pulga || !pulga.active) return;

                const distancia = Phaser.Math.Distance.Between(
                    ponteiro.x,
                    ponteiro.y,
                    pulga.x,
                    pulga.y
                );

                if (distancia < 40) {
                    this.capturarPulga(pulga);
                }
            });
        }
    }

    criarTextosInfo() {
        this.textoTempo = this.add.text(24, 24, "Tempo:0s", {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 5
        }).setDepth(50);

        this.textoProgresso = this.add.text(24, 64, `Pulgas:0/${this.totalPulgas}`, {
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#ffe08a",
            stroke: "#000000",
            strokeThickness: 4
        }).setDepth(50);

        this.textoDica = this.add.text(24, 104, "Clique na pinça para equipar", {
            fontFamily: "Arial",
            fontSize: "24px",
            color: "#ffd166",
            stroke: "#000000",
            strokeThickness: 4
        }).setDepth(50);
    }

    criarFerramentaPinca() {
        this.pinca = this.add.image(140, this.scale.height - 120, "pincaTool")
            .setDepth(60)
            .setInteractive({ useHandCursor: true });

        const escala = Math.min(140 / this.pinca.width, 140 / this.pinca.height, 1.2);
        this.pinca.setScale(escala);

        this.pinca.on("pointerdown", () => {
            if (this.pincaEquipada) return;

            this.pincaEquipada = true;
            this.input.setDefaultCursor("none");
            this.textoDica.setText("Pinça equipada! Capture as pulgas");
            this.pinca.disableInteractive();
        });
    }

    spawnPulgasIniciais() {
        for (let i = 0; i < this.totalPulgas; i++) {
            this.spawnPulga();
        }
    }

    spawnPulga() {
        const x = Phaser.Math.Between(120, this.scale.width - 220);
        const y = Phaser.Math.Between(100, this.scale.height - 100);

        const pulga = this.pulgas.get(x, y, "pulga");
        if (!pulga) return;

        pulga.setActive(true).setVisible(true);
        pulga.body.setAllowGravity(false);
        pulga.body.stop();
        pulga
            .setOrigin(0.5, 0.5)
            .setScale(0.15)
            .setDepth(10);
        pulga.play("pulgaAnim", true);

        this.moverPulga(pulga);
    }

    capturarPulga(pulga) {
        if (!pulga.active) return;

        this.tweens.killTweensOf(pulga);
        pulga.setActive(false).setVisible(false);
        if (pulga.body) pulga.body.enable = false;

        this.pulgasRemovidas++;
        this.pontuacao++;

        this.textoProgresso.setText(`Pulgas:${this.pulgasRemovidas}/${this.totalPulgas}`);

        if (this.pulgasRemovidas === 6 && !this.bonusMeioGanho) {
            this.bonusMeioGanho = true;
            gameState.barras.limpeza = Phaser.Math.Clamp(gameState.barras.limpeza - 10, 0, 11);
            this.mostrarPopupMetade();
        }

        if (this.pulgasRemovidas >= this.totalPulgas) {
            this.finalizarMinigame();
        }
    }

    mostrarPopupMetade() {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        const fundo = this.add.rectangle(cx, cy, 500, 200, 0x000000, 0.8)
            .setStrokeStyle(4, 0x9be564)
            .setDepth(80);

        const texto = this.add.text(cx, cy, "Metade das pulgas removidas!", {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#ffffff"
        }).setOrigin(0.5).setDepth(81);

        this.time.delayedCall(2000, () => {
            fundo.destroy();
            texto.destroy();
        });
    }

    moverPulga(pulga) {
        this.tweens.killTweensOf(pulga);

        const x = Phaser.Math.Between(120, this.scale.width - 220);
        const y = Phaser.Math.Between(100, this.scale.height - 100);

        this.tweens.add({
            targets: pulga,
            x: x,
            y: y,
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
        if (this.minigameFinalizado) return;
        const segundos = Math.floor((this.time.now - this.tempoInicialMs) / 1000);
        this.textoTempo.setText(`Tempo:${segundos}s`);
    }

    finalizarMinigame() {
        if (this.minigameFinalizado) return;
        this.minigameFinalizado = true;
        this.input.setDefaultCursor("default");

        const segundos = Math.ceil((this.time.now - this.tempoInicialMs) / 1000);
        const estrelas = this.calcularEstrelas(segundos);
        const moedas = this.calcularMoedas(estrelas);

        gameState.cobasiCoins += moedas;
        this.mostrarPainelResultado(segundos, estrelas, moedas);
    }

    calcularEstrelas(segundos) {
        if (segundos <= 30) return 3;
        if (segundos <= 45) return 2;
        return 1;
    }

    calcularMoedas(estrelas) {
        if (estrelas === 3) return 120;
        if (estrelas === 2) return 80;
        return 50;
    }

        mostrarPainelResultado(segundos, estrelas, moedas) {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        this.add.rectangle(cx, cy, 620, 330, 0x000000, 0.78)
            .setStrokeStyle(4, 0xffd166)
            .setDepth(70);

        this.add.text(cx, cy - 80, "Minigame concluído!", {
            fontSize: "44px",
            color: "#ffffff"
        }).setOrigin(0.5);

        this.add.text(cx, cy - 20, `Tempo:${segundos}s`, {
            fontSize: "30px",
            color: "#ffffff"
        }).setOrigin(0.5);

        this.add.text(cx, cy + 30, `Estrelas:${"*".repeat(estrelas)}`, {
            fontSize: "36px",
            color: "#ffd166"
        }).setOrigin(0.5);

        this.add.text(cx, cy + 80, `Coins:+${moedas}`, {
            fontSize: "30px",
            color: "#9be564"
        }).setOrigin(0.5);
    }

    garantirAnimacaoPulga() {
        if (this.anims.exists("pulgaAnim")) return;

        this.anims.create({
            key: "pulgaAnim",
            // Usa os quadros da mesma coluna para evitar jitter horizontal causado pelo padding desigual.
            frames: this.anims.generateFrameNumbers("pulga", { frames: [0, 2] }),
            frameRate: 7,
            repeat: -1
        });
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
