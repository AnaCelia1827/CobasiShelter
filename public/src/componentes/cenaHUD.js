export class cenaHUD extends Phaser.Scene {
    constructor() {
        super({ key: "cenaHUD" });
        this.transicao = false;
    }

    create() {
        this.transicao = false;

        const larguraPainel = 200;
        const painelX = this.scale.width - larguraPainel / 2;
        const centroY = this.scale.height / 2;
        const topoY = Math.max(100, this.scale.height * 0.12);
        const espaco = Math.max(90, this.scale.height * 0.18);

        this.add
            .rectangle(painelX, centroY, larguraPainel, this.scale.height, 0xffffff, 1)
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0);

        const criarBotao = (indice, textura, cenaAlvo) => {
            const y = topoY + indice * espaco;
            const botao = this.add
                .image(painelX, y, textura)
                .setInteractive({ useHandCursor: true })
                .setScale(0.7)
                .setScrollFactor(0);

            botao.on("pointerdown", () => this.transicionarPara(cenaAlvo));
        };

        criarBotao(0, "iconeBanho", "cenaBanho");
        criarBotao(1, "iconeRacao", "cenaComida");
        criarBotao(2, "iconeCuidados", "cenaCuidado");
        criarBotao(3, "iconeLazer", "cenaPrincipal");
        criarBotao(4, "iconeVoltar", "cenaInicial");
    }

    transicionarPara(cenaAlvo) {
        if (this.transicao) {
            return;
        }

        if (!this.scene.manager.keys[cenaAlvo]) {
            console.error(`Cena não registrada: ${cenaAlvo}`);
            return;
        }

        const cenasAtivas = this.scene.manager.getScenes(true);
        const cenaJogo = cenasAtivas.find((cena) => {
            const chave = cena.scene.key;
            return chave !== "cenaHUD" && chave !== "ficha";
        });

        if (cenaJogo?.scene.key === cenaAlvo) {
            return;
        }

        this.transicao = true;
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            cenasAtivas.forEach((cena) => {
                const chave = cena.scene.key;
                if (chave !== "cenaHUD" && chave !== cenaAlvo) {
                    this.scene.stop(chave);
                }
            });

            if (!this.scene.isActive(cenaAlvo)) {
                this.scene.launch(cenaAlvo);
            }

            this.scene.bringToTop("cenaHUD");
            this.cameras.main.fadeIn(300, 0, 0, 0);
            this.transicao = false;
        });
    }
}
