import { gameState } from "../main.js";


const TOOL_HOMES = {
    sabao:    { x: 600, y: 720 },
    chuveiro: { x: 770, y: 750 },
    toalha:   { x: 940, y: 720 },
};

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

       

        gameState.dog = this.physics.add
            .sprite(this.scale.width / 2, this.scale.height / 2, "dogSujo")
            .setScale(0.5);
        gameState.dog.setImmovable(true);
        gameState.dog.body.allowGravity = false;

        this.ensureAnimations();
        gameState.dog.play("dogSujoAnim");

        const toolConfigs = [
            { key: "sabao",    texture: "sabao",    scale: 0.12 },
            { key: "chuveiro", texture: "chuveiro", scale: 0.25 },
            { key: "toalha",   texture: "toalha",   scale: 0.2  },
        ];

        toolConfigs.forEach(({ key, texture, scale }) => {
            const home = TOOL_HOMES[key];
            const tool = this.add
                .follower(new Phaser.Curves.Path(400, 500), home.x, home.y, texture)
                .setInteractive()
                .setDepth(3)
                .setScale(scale);

            this.physics.add.existing(tool);
            tool.body.setSize(tool.displayWidth, tool.displayHeight);
            tool.on("pointerdown", () => this.toggleTool(key));
            gameState[key] = tool;
        });

        gameState.bolhas = this.physics.add.group({ maxSize: 80 });
        gameState.gotas  = this.physics.add.group({ maxSize: 160 });

        this.physics.add.overlap(gameState.gotas, gameState.bolhas, (gota, bolha) => {
            this.recycleBody(gota);
            this.recycleBody(bolha);
        });

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.activeTool = null;
            this.waterSpawnAccumulator = 0;
            this.tempoSecando = 0;
        });
    }

    ensureAnimations() {
        const anims = [
            { key: "dogSujoAnim",   texture: "dogSujo",   end: 1, rate: 4 },
            { key: "aguaAnim",      texture: "agua",      end: 5, rate: 8 },
            { key: "dogEspumaAnim", texture: "dogEspuma", end: 1, rate: 4 },
            { key: "dogLimpoAnim",  texture: "dogLimpo",  end: 1, rate: 4 },
        ];

        anims.forEach(({ key, texture, end, rate }) => {
            if (!this.anims.exists(key)) {
                this.anims.create({
                    key,
                    frames: this.anims.generateFrameNumbers(texture, { start: 0, end }),
                    frameRate: rate,
                    repeat: -1,
                });
            }
        });
    }

    getToolByName(toolName) {
        return gameState[toolName] ?? null;
    }

    getToolHome(toolName) {
        return TOOL_HOMES[toolName] ?? null;
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
        const home = this.getToolHome(toolName);
        if (!tool || !home) return;

        tool.stopFollow?.();
        const path = new Phaser.Curves.Path(tool.x, tool.y);
        path.lineTo(home.x, home.y);
        tool.setPath(path);
        tool.startFollow({ duration: 250, repeat: 0 });
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
        if (this.activeTool !== "sabao") return;

        this.ultimoX = gameState.sabao.x;
        this.ultimoY = gameState.sabao.y;

        const { x, y } = this.input.activePointer;
        gameState.sabao.x = x;
        gameState.sabao.y = y;
        gameState.sabao.body.reset(x, y);

        const distX = Math.abs(x - gameState.dog.x);
        const distY = Math.abs(y - gameState.dog.y);
        const moveu =
            Math.abs(x - this.ultimoX) > this.threshold ||
            Math.abs(y - this.ultimoY) > this.threshold;

        if (distX < 200 && distY < 250 && this.quantidade < 50 && moveu) {
            this.spawnBubble();
        }
    }

    updateChuveiro(delta) {
        if (this.activeTool !== "chuveiro") {
            this.waterSpawnAccumulator = 0;
            return;
        }

        const { x, y } = this.input.activePointer;
        gameState.chuveiro.x = x;
        gameState.chuveiro.y = y;
        gameState.chuveiro.body.reset(x, y);

        this.waterSpawnAccumulator += delta;
        if (this.waterSpawnAccumulator < 70) return;

        this.waterSpawnAccumulator = 0;
        this.spawnDrop();
    }

    updateToalha() {
        if (this.activeTool !== "toalha") {
            this.tempoSecando = 0;
            return;
        }

        const { x, y } = this.input.activePointer;
        gameState.toalha.x = x;
        gameState.toalha.y = y;
        gameState.toalha.body.reset(x, y);

        if (gameState.dog.texture.key !== "dogEspuma") {
            this.tempoSecando = 0;
            return;
        }

        const distX = Math.abs(x - gameState.dog.x);
        const distY = Math.abs(y - gameState.dog.y);

        if (distX < 200 && distY < 250) {
            this.tempoSecando += 1;
            if (this.tempoSecando >= 90) {
                gameState.dog.setTexture("dogLimpo");
                gameState.dog.play("dogLimpoAnim");


                  gameState.barras.limpeza = Phaser.Math.Clamp(
              gameState.barras.limpeza -3, 0, 11
            );
                this.tempoSecando = 0;
            }
            return;
        }

        this.tempoSecando = 0;
    }

spawnBubble() {
    // ✅ bolhas spawnam ao redor do cachorro em vez de posição fixa
    const x = Phaser.Math.RND.between(gameState.dog.x - 80, gameState.dog.x + 80);
    const y = Phaser.Math.RND.between(gameState.dog.y - 100, gameState.dog.y + 100);
    const bubble = gameState.bolhas.get(x, y, "bolhas");
    if (!bubble) return;

    bubble.setActive(true).setVisible(true).setScale(0.13);
    bubble.body.enable = true;
    bubble.body.reset(x, y);
    bubble.body.setSize(bubble.displayWidth, bubble.displayHeight, true);
    this.quantidade += 1;
}

    spawnDrop() {
        const x = gameState.chuveiro.x;
        const y = gameState.chuveiro.y + gameState.chuveiro.displayHeight / 2;
        const drop = gameState.gotas.get(x, y, "agua");
        if (!drop) return;

        drop.setActive(true).setVisible(true).setScale(0.1);
        drop.body.enable = true;
        drop.body.reset(x, y);
        drop.play("aguaAnim", true);
        drop.body.setSize(drop.displayWidth, drop.displayHeight, true);
        drop.body.setVelocityY(100);
    }

    cleanupDrops() {
        gameState.gotas.children.iterate((drop) => {
            if (drop?.active && drop.y > this.scale.height + 120) {
                this.recycleBody(drop);
            }
        });
    }

    recycleBody(obj) {
        if (!obj) return;
        obj.body?.stop();
        if (obj.body) obj.body.enable = false;
        obj.setActive(false).setVisible(false).setPosition(-200, -200);
    }
}