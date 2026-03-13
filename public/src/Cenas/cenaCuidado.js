
import { Cachorro } from "../componentes/controleCachorro/cachorroAnimacao.js";

export class cenaCuidado extends Phaser.Scene {
    constructor() {
        super({ key: "cenaCuidado" });
        this.score = 0;
        this.maxFleas = 12;
    }

    create() {
        if (!this.scene.isActive("cenaHUD")) {
            this.scene.launch("cenaHUD");
        } else if (this.scene.isSleeping("cenaHUD")) {
            this.scene.wake("cenaHUD");
        }
    }


        this.cachorro = new Cachorro(this, 920, 600);
        this.add.image(this.scale.width / 2, this.scale.height / 2, "bgCuidado")
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        this.ensureFleaAnimation();
        this.score = 0;
        this.fleas = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize: this.maxFleas
        });

        // OTIMIZACAO: um unico timer de spawn evita varios timers por pulga e reduz custo da cena.
        this.spawnTimer = this.time.addEvent({
            delay: 700,
            callback: this.spawnFlea,
            callbackScope: this,
            loop: true
        });

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.spawnTimer?.remove(false);
            this.fleas?.children.iterate((flea) => {
                if (!flea) {
                    return;
                }
                this.tweens.killTweensOf(flea);
                flea.removeAllListeners();
            });
        });
    }

    spawnFlea() {
        if (this.fleas.countActive(true) >= this.maxFleas) {
            return;
        }

        const x = Phaser.Math.Between(120, this.scale.width - 220);
        const y = Phaser.Math.Between(100, this.scale.height - 100);
        const flea = this.fleas.get(x, y, "pulga");

        if (!flea) {
            return;
        }

        flea.setActive(true).setVisible(true);
        flea.body.enable = true;
        flea.body.setAllowGravity(false);
        flea.body.stop();
        flea.setScale(0.12);
        flea.setInteractive({ useHandCursor: true });
        // OTIMIZACAO/UX: animacao em loop deixa a pulga viva e melhora leitura visual do alvo.
        flea.play("pulgaAnim", true);

        flea.removeAllListeners("pointerdown");
        flea.on("pointerdown", () => {
            this.recycleFlea(flea);
            this.score += 1;
        });

        this.moveFlea(flea);
    }

    moveFlea(flea) {
        this.tweens.killTweensOf(flea);

        const targetX = Phaser.Math.Between(120, this.scale.width - 220);
        const targetY = Phaser.Math.Between(100, this.scale.height - 100);

        // OTIMIZACAO: mover por tween elimina fisica com velocidade aleatoria continua e deixa o custo previsivel.
        this.tweens.add({
            targets: flea,
            x: targetX,
            y: targetY,
            // OTIMIZACAO/UX: duracao maior deixa o movimento da pulga mais lento e previsivel para o clique.
            duration: Phaser.Math.Between(1800, 3200),
            ease: "Sine.easeInOut",
            onComplete: () => {
                if (flea.active) {
                    this.moveFlea(flea);
                }
            }
        });
    }

    ensureFleaAnimation() {
        if (this.anims.exists("pulgaAnim")) {
            return;
        }

        this.anims.create({
            key: "pulgaAnim",
            // OTIMIZACAO/BUGFIX: sprite sheet da pulga tem 2 frames validos; usar mais frames gerava corte.
            frames: this.anims.generateFrameNumbers("pulga", { start: 0, end: 1 }),
            frameRate: 7,
            repeat: -1
        });
    }

    recycleFlea(flea) {
        this.tweens.killTweensOf(flea);
        flea.disableInteractive();
        flea.body.stop();
        flea.body.enable = false;
        flea.setActive(false).setVisible(false);
        flea.setPosition(-200, -200);

    }
}
