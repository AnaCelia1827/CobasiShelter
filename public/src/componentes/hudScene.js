import { gameState } from "../main.js";
import { Barra} from "./Barras/barras.js";

export class hudScene extends Phaser.Scene {
    constructor() {
        super({ key: "hudScene" });
        this.isTransitioning = false;
    }

    create() {
        this.isTransitioning = false;

        const panelWidth = 200;
        const panelX = this.scale.width - panelWidth / 2;
        const centerY = this.scale.height / 2;
        const topY = Math.max(100, this.scale.height * 0.12);
        const spacing = Math.max(90, this.scale.height * 0.18);

            //  barras nepai
        this.add.image(100, 100, "iconeFome").setScale(1.5);
        this.barraComida = new Barra(this, 230, 100, gameState.barras.comida);

        this.add.image(100, 160, "iconeFelicidade").setScale(1.5);
        this.barraLazer = new Barra(this, 230, 160, gameState.barras.lazer);

        this.add.image(100, 220, "iconeSujeira").setScale(1.5);
        this.barraLimpeza = new Barra(this, 230, 220, gameState.barras.limpeza);

        this.add.image(100, 280, "iconeSaude").setScale(1.5);
        this.barraSaude = new Barra(this, 230, 280, gameState.barras.saude);

        this.add
            .rectangle(panelX, centerY, panelWidth, this.scale.height, 0xffffff, 1)
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0);

        const createButton = (index, texture, targetScene) => {
            const y = topY + index * spacing;
            const button = this.add
                .image(panelX, y, texture)
                .setInteractive({ useHandCursor: true })
                .setScale(0.7)
                .setScrollFactor(0);

            button.on("pointerdown", () => this.transitionTo(targetScene));
        };

        createButton(0, "iconeBanho", "bathScene");
        createButton(1, "iconeRacao", "foodScene");
        createButton(2, "iconeCuidados", "cuidadoCena");
        createButton(3, "iconeLazer", "gameScene");
        createButton(4, "iconeVoltar", "introScene");
    }

    transitionTo(targetScene) {
        if (this.isTransitioning) {
            return;
        }

        if (!this.scene.manager.keys[targetScene]) {
            console.error(`Cena nao registrada: ${targetScene}`);
            return;
        }

        const activeScenes = this.scene.manager.getScenes(true);
        const gameplayScene = activeScenes.find((scene) => {
            const key = scene.scene.key;
            return key !== "hudScene" && key !== "ficha";
        });

        if (gameplayScene?.scene.key === targetScene) {
            return;
        }

        this.isTransitioning = true;
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            activeScenes.forEach((scene) => {
                const key = scene.scene.key;
                if (key !== "hudScene" && key !== targetScene) {
                    this.scene.stop(key);
                }
            });

            if (!this.scene.isActive(targetScene)) {
                this.scene.launch(targetScene);
            }

            this.scene.bringToTop("hudScene");
            this.cameras.main.fadeIn(300, 0, 0, 0);
            this.isTransitioning = false;
        });
    }

    update() {
    this.barraComida.valor  = gameState.barras.comida;
    this.barraLazer.valor   = gameState.barras.felicidade;  
    this.barraLimpeza.valor =  gameState.barras.limpeza; 
    this.barraSaude.valor   = gameState.barras.saude;

    this.barraComida.atualizarBarra();
    this.barraLazer.atualizarBarra();
    this.barraLimpeza.atualizarBarra();
    this.barraSaude.atualizarBarra();
}
}
