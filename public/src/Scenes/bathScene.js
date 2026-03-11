import { gameState } from "../main.js";

export class bathScene extends Phaser.Scene {
    constructor() {
        super({ key: "bathScene" });

        this.activeTool = null;
        this.waterSpawnAccumulator = 0;
        this.tempoSecando = 0;
        this.quantidade = 0;
        this.threshold = 30;
        this.ultimoX = 0;
        this.ultimoY = 0;

        this.sabaoHome = { x: 600, y: 720 };
        this.chuveiroHome = { x: 770, y: 750 };
        this.toalhaHome = { x: 940, y: 720 };
    }

    create() {
        if (!this.scene.isActive("hudScene")) {
            this.scene.launch("hudScene");
        } else if (this.scene.isSleeping("hudScene")) {
            this.scene.wake("hudScene");
        }
        this.scene.bringToTop("hudScene");

        this.activeTool = null;
        this.waterSpawnAccumulator = 0;
        this.tempoSecando = 0;
        this.quantidade = 0;

        gameState.banheiro = this.add
            .image(this.scale.width / 2, this.scale.height / 2, "bgBanheiro")
            .setDisplaySize(this.scale.width, this.scale.height);

        gameState.dog = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, "dogSujo").setScale(0.5);
        gameState.dog.setImmovable(true);
        gameState.dog.body.allowGravity = false;

        this.ensureAnimations();
        gameState.dog.play("dogSujoAnim");

        gameState.sabao = this.add
            .follower(new Phaser.Curves.Path(400, 500), this.sabaoHome.x, this.sabaoHome.y, "sabao")
            .setInteractive()
            .setDepth(3)
            .setScale(0.12);
        gameState.chuveiro = this.add
            .follower(new Phaser.Curves.Path(400, 500), this.chuveiroHome.x, this.chuveiroHome.y, "chuveiro")
            .setInteractive()
            .setDepth(3)
            .setScale(0.25);
        gameState.toalha = this.add
            .follower(new Phaser.Curves.Path(400, 500), this.toalhaHome.x, this.toalhaHome.y, "toalha")
            .setInteractive()
            .setDepth(3)
            .setScale(0.2);

        this.physics.add.existing(gameState.sabao);
        gameState.sabao.body.setSize(gameState.sabao.displayWidth, gameState.sabao.displayHeight);
        this.physics.add.existing(gameState.chuveiro);
        gameState.chuveiro.body.setSize(gameState.chuveiro.displayWidth, gameState.chuveiro.displayHeight);
        this.physics.add.existing(gameState.toalha);
        gameState.toalha.body.setSize(gameState.toalha.displayWidth, gameState.toalha.displayHeight);

        gameState.bolhas = this.physics.add.group({ maxSize: 80 });
        gameState.gotas = this.physics.add.group({ maxSize: 160 });

        this.physics.add.overlap(gameState.gotas, gameState.bolhas, (gota, bolha) => {
            this.recycleBody(gota);
            this.recycleBody(bolha);
        });

        gameState.sabao.on("pointerdown", () => this.toggleTool("sabao"));
        gameState.chuveiro.on("pointerdown", () => this.toggleTool("chuveiro"));
        gameState.toalha.on("pointerdown", () => this.toggleTool("toalha"));

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.activeTool = null;
            this.waterSpawnAccumulator = 0;
            this.tempoSecando = 0;
        });
    }

    ensureAnimations() {
        if (!this.anims.exists("dogSujoAnim")) {
            this.anims.create({
                key: "dogSujoAnim",
                frames: this.anims.generateFrameNumbers("dogSujo", { start: 0, end: 1 }),
                frameRate: 4,
                repeat: -1
            });
        }

        if (!this.anims.exists("aguaAnim")) {
            this.anims.create({
                key: "aguaAnim",
                frames: this.anims.generateFrameNumbers("agua", { start: 0, end: 5 }),
                frameRate: 8,
                repeat: -1
            });
        }

        if (!this.anims.exists("dogEspumaAnim")) {
            this.anims.create({
                key: "dogEspumaAnim",
                frames: this.anims.generateFrameNumbers("dogEspuma", { start: 0, end: 1 }),
                frameRate: 4,
                repeat: -1
            });
        }

        if (!this.anims.exists("dogLimpoAnim")) {
            this.anims.create({
                key: "dogLimpoAnim",
                frames: this.anims.generateFrameNumbers("dogLimpo", { start: 0, end: 1 }),
                frameRate: 4,
                repeat: -1
            });
        }
    }

    toggleTool(toolName) {
        if (this.activeTool === toolName) {
            this.returnToolHome(toolName);

            if (toolName === "sabao" && this.quantidade < 50) {
                this.quantidade = 0;
            }

            this.activeTool = null;
            return;
        }

        if (this.activeTool) {
            this.returnToolHome(this.activeTool);
        }

        this.activeTool = toolName;
    }

    returnToolHome(toolName) {
        const tool = this.getToolByName(toolName);
        if (!tool) {
            return;
        }

        const home = this.getToolHome(toolName);
        if (!home) {
            return;
        }

        if (tool.stopFollow) {
            tool.stopFollow();
        }

        const path = new Phaser.Curves.Path(tool.x, tool.y);
        path.lineTo(home.x, home.y);
        tool.setPath(path);
        tool.startFollow({ duration: 250, repeat: 0 });
    }

    getToolByName(toolName) {
        if (toolName === "sabao") {
            return gameState.sabao;
        }
        if (toolName === "chuveiro") {
            return gameState.chuveiro;
        }
        if (toolName === "toalha") {
            return gameState.toalha;
        }
        return null;
    }

    getToolHome(toolName) {
        if (toolName === "sabao") {
            return this.sabaoHome;
        }
        if (toolName === "chuveiro") {
            return this.chuveiroHome;
        }
        if (toolName === "toalha") {
            return this.toalhaHome;
        }
        return null;
    }

    update(time, delta) {
        this.updateSabao();
        this.updateChuveiro(delta);
        this.updateToalha();
        this.cleanupDrops();

        if (this.quantidade >= 50 && gameState.dog.texture.key !== "dogEspuma") {
            gameState.dog.setTexture("dogEspuma");
            gameState.dog.play("dogEspumaAnim");
            this.quantidade = 0;
        }
    }

    updateSabao() {
        if (this.activeTool !== "sabao") {
            return;
        }

        this.ultimoX = gameState.sabao.x;
        this.ultimoY = gameState.sabao.y;

        gameState.sabao.x = this.input.activePointer.x;
        gameState.sabao.y = this.input.activePointer.y;
        gameState.sabao.body.reset(this.input.activePointer.x, this.input.activePointer.y);

        const distX = Math.abs(gameState.sabao.x - gameState.dog.x);
        const distY = Math.abs(gameState.sabao.y - gameState.dog.y);
        const moveu =
            Math.abs(gameState.sabao.x - this.ultimoX) > this.threshold ||
            Math.abs(gameState.sabao.y - this.ultimoY) > this.threshold;

        if (distX < 200 && distY < 250 && this.quantidade < 50 && moveu) {
            this.spawnBubble();
        }
    }

    updateChuveiro(delta) {
        if (this.activeTool !== "chuveiro") {
            this.waterSpawnAccumulator = 0;
            return;
        }

        gameState.chuveiro.x = this.input.activePointer.x;
        gameState.chuveiro.y = this.input.activePointer.y;
        gameState.chuveiro.body.reset(this.input.activePointer.x, this.input.activePointer.y);

        this.waterSpawnAccumulator += delta;
        if (this.waterSpawnAccumulator < 70) {
            return;
        }

        this.waterSpawnAccumulator = 0;
        this.spawnDrop();
    }

    updateToalha() {
        if (this.activeTool !== "toalha") {
            this.tempoSecando = 0;
            return;
        }

        gameState.toalha.x = this.input.activePointer.x;
        gameState.toalha.y = this.input.activePointer.y;
        gameState.toalha.body.reset(this.input.activePointer.x, this.input.activePointer.y);

        if (gameState.dog.texture.key !== "dogEspuma") {
            this.tempoSecando = 0;
            return;
        }

        const distX = Math.abs(gameState.toalha.x - gameState.dog.x);
        const distY = Math.abs(gameState.toalha.y - gameState.dog.y);

        if (distX < 200 && distY < 250) {
            this.tempoSecando += 1;
            if (this.tempoSecando >= 90) {
                gameState.dog.setTexture("dogLimpo");
                gameState.dog.play("dogLimpoAnim");
                this.tempoSecando = 0;
            }
            return;
        }

        this.tempoSecando = 0;
    }

    spawnBubble() {
        const x = Phaser.Math.RND.between(700, 830);
        const y = Phaser.Math.RND.between(280, 600);
        const bubble = gameState.bolhas.get(x, y, "bolhas");

        if (!bubble) {
            return;
        }

        bubble.setActive(true).setVisible(true);
        bubble.setScale(0.13);
        bubble.body.enable = true;
        bubble.body.reset(x, y);
        bubble.body.setSize(bubble.displayWidth, bubble.displayHeight, true);
        this.quantidade += 1;
    }

    spawnDrop() {
        const x = gameState.chuveiro.x;
        const y = gameState.chuveiro.y + gameState.chuveiro.displayHeight / 2;
        const drop = gameState.gotas.get(x, y, "agua");

        if (!drop) {
            return;
        }

        drop.setActive(true).setVisible(true);
        drop.body.enable = true;
        drop.body.reset(x, y);
        drop.setScale(0.1);
        drop.play("aguaAnim", true);
        drop.body.setSize(drop.displayWidth, drop.displayHeight, true);
        drop.body.setVelocityY(100);
    }

    cleanupDrops() {
        gameState.gotas.children.iterate((drop) => {
            if (!drop || !drop.active) {
                return;
            }

            if (drop.y > this.scale.height + 120) {
                this.recycleBody(drop);
            }
        });
    }

    recycleBody(obj) {
        if (!obj) {
            return;
        }

        if (obj.body) {
            obj.body.stop();
            obj.body.enable = false;
        }
        obj.setActive(false).setVisible(false);
        obj.setPosition(-200, -200);
    }
}
