import { gameState } from "../main.js";

export class cenaCuidado extends Phaser.Scene {
    constructor() {
        super({ key: "cenaCuidado" });
        this.pontuacao = 0;
        this.maxPulgas = 12;
        this.totalPulgas = 12;
        this.pulgasRemovidas = 0;
        this.tempoInicialMs = 0;
        this.minigameFinalizado = false;
        this.pincaEquipada = false;
    }

    create() {
        this.add.image(this.scale.width/2, this.scale.height/2, "bgCuidado")
            .setDisplaySize(this.scale.width, this.scale.height);

        this.garantirAnimacaoPulga();
        this.garantirTexturaPinca();

        this.pontuacao = 0;
        this.pulgasRemovidas = 0;
        this.minigameFinalizado = false;
        this.pincaEquipada = false;
        this.tempoInicialMs = this.time.now;
        gameState.cobasiCoins = gameState.cobasiCoins ?? 0;

        this.pulgas = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize: this.totalPulgas
        });

        this.spawnTimer = this.time.addEvent({
            delay: 700,
            callback: this.spawnPulga,
            callbackScope: this,
            loop: true
        });

        this.criarTextosInfo();
        this.criarFerramentaPinca();
        this.spawnPulgasIniciais();
        this.atualizarTextoTempo();

        this.timerEvent = this.time.addEvent({
            delay: 100,
            callback: this.atualizarTextoTempo,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        if (!this.pincaEquipada || !this.pinca || this.minigameFinalizado) return;
        const ponteiro = this.input.activePointer;
        this.pinca.setPosition(ponteiro.x + 18, ponteiro.y + 14);
    }

    criarTextosInfo() {
        this.textoTempo = this.add.text(24, 24, "Tempo: 0s", {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 5
        }).setDepth(50);

        this.textoProgresso = this.add.text(24, 64, `Pulgas: 0/${this.totalPulgas}`, {
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#ffe08a",
            stroke: "#000000",
            strokeThickness: 4
        }).setDepth(50);

        this.textoDica = this.add.text(24, 104, "Clique na pinça para equipar.", {
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

        const ladoMax = 140;
        const escalaLargura = ladoMax / this.pinca.width;
        const escalaAltura = ladoMax / this.pinca.height;
        const escalaNormalizada = Math.min(escalaLargura, escalaAltura, 1.2);
        this.pinca.setScale(escalaNormalizada);

        this.pinca.on("pointerdown", () => {
            if (this.pincaEquipada) return;
            this.pincaEquipada = true;
            this.input.setDefaultCursor("none");
            this.textoDica.setText("Pinça equipada. Remova todas as pulgas!");
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

        pulga.body.setAllowGravity(false);
        pulga.body.stop();
        pulga.setScale(0.12);
        pulga.setDepth(10);
        pulga.setInteractive({ useHandCursor: true });
        pulga.play("pulgaAnim", true); // nome consistente

        pulga.removeAllListeners("pointerdown");
        pulga.on("pointerdown", () => this.tentarCapturarPulga(pulga));

        this.moverPulga(pulga);
    }

    tentarCapturarPulga(pulga) {
        if (this.minigameFinalizado) return;

        if (!this.pincaEquipada) {
            this.textoDica.setText("Equipe a pinça para remover as pulgas.");
            return;
        }

        this.reciclarPulga(pulga);
        this.pulgasRemovidas += 1;
        this.textoProgresso.setText(`Pulgas: ${this.pulgasRemovidas}/${this.totalPulgas}`);

        if (this.pulgasRemovidas >= this.totalPulgas) {
            this.finalizarMinigame();
        }
    }

    moverPulga(pulga) {
        this.tweens.killTweensOf(pulga);

        const destinoX = Phaser.Math.Between(120, this.scale.width - 220);
        const destinoY = Phaser.Math.Between(100, this.scale.height - 100);

        this.tweens.add({
            targets: pulga,
            x: destinoX,
            y: destinoY,
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
        if (this.minigameFinalizado || !this.textoTempo) return;
        const segundos = Math.floor((this.time.now - this.tempoInicialMs) / 1000);
        this.textoTempo.setText(`Tempo: ${segundos}s`);
    }

    finalizarMinigame() {
        if (this.minigameFinalizado) return;

        this.minigameFinalizado = true;
        this.timerEvent?.remove(false);
        this.input.setDefaultCursor("default");

        this.pulgas?.children.iterate((pulga) => {
            if (!pulga) return;
            this.tweens.killTweensOf(pulga);
            pulga.disableInteractive();
        });

        const segundos = Math.max(1, Math.ceil((this.time.now - this.tempoInicialMs) / 1000));
        const estrelas = this.calcularEstrelas(segundos);
        const moedasGanhas = this.calcularMoedas(estrelas);
        gameState.cobasiCoins += moedasGanhas;

        this.mostrarPainelResultado(segundos, estrelas, moedasGanhas);
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

        mostrarPainelResultado(segundos, estrelas, moedasGanhas) {
        const centroX = this.scale.width / 2;
        const centroY = this.scale.height / 2;
        const estrelasTxt = `${"*".repeat(estrelas)}${"-".repeat(3 - estrelas)}`;

        this.add.rectangle(centroX, centroY, 620, 330, 0x000000, 0.78)
            .setStrokeStyle(4, 0xffd166, 1)
            .setDepth(70);

        this.add.text(centroX, centroY - 100, "Minigame concluído!", {
            fontFamily: "Arial",
            fontSize: "44px",
            color: "#ffffff"
        }).setOrigin(0.5).setDepth(71);

        this.add.text(centroX, centroY - 35, `Tempo final: ${segundos}s`, {
            fontFamily: "Arial",
            fontSize: "30px",
            color: "#ffffff"
        }).setOrigin(0.5).setDepth(71);

        this.add.text(centroX, centroY + 15, `Estrelas: ${estrelasTxt}`, {
            fontFamily: "Arial",
            fontSize: "36px",
            color: "#ffd166"
        }).setOrigin(0.5).setDepth(71);

        this.add.text(centroX, centroY + 65, `Cobasi Coins: +${moedasGanhas}`, {
            fontFamily: "Arial",
            fontSize: "30px",
            color: "#9be564"
        }).setOrigin(0.5).setDepth(71);

        this.add.text(centroX, centroY + 108, `Total de Coins: ${gameState.cobasiCoins}`, {
            fontFamily: "Arial",
            fontSize: "26px",
            color: "#ffffff"
        }).setOrigin(0.5).setDepth(71);
    }

    garantirAnimacaoPulga() {
        // Corrigido: nome consistente e mais de um frame
        if (this.anims.exists("pulgaAnim")) return;

        this.anims.create({
            key: "pulgaAnim",
            frames: this.anims.generateFrameNumbers("pulga", { start: 0, end: 1 }),
            frameRate: 7,
            repeat: -1
        });
    }

    garantirTexturaPinca() {
        if (this.textures.exists("pincaTool")) return;

        const g = this.make.graphics({ x: 0, y: 0, add: false });
        g.lineStyle(10, 0xdddddd, 1);
        g.beginPath();
        g.moveTo(14, 122);
        g.lineTo(54, 12);
        g.moveTo(44, 122);
        g.lineTo(72, 12);
        g.strokePath();
        g.fillStyle(0x555555, 1);
        g.fillCircle(63, 12, 6);
        g.generateTexture("pincaTool", 88, 132);
        g.destroy();
    }

    reciclarPulga(pulga) {
        this.tweens.killTweensOf(pulga);
        pulga.disableInteractive();
    }
}
