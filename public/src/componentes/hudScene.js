export class hudScene extends Phaser.Scene {

    constructor() {
        super({ key: 'hudScene' });
    }

    preload() {
        this.load.image('iconeBanho', 'assets/iconeBanho.png');
        this.load.image('iconeRacao', 'assets/iconeRacao.png');
        this.load.image('iconeCuidados', 'assets/iconeCuidados.png');
        this.load.image('iconeLazer', 'assets/iconeLazer.png');
        this.load.image('iconeVoltar', 'assets/iconeVoltar.png');
    }

    create() {


        // OTIMIZACAO/UX: substituir coordenadas fixas (1600, y) por this.scale.width evita HUD fora da tela em resolucoes menores.
        const fundoHUD = this.add.rectangle(
        1600,                // posição X
        this.scale.height / 2, // centro vertical
        200,                 // largura
        this.scale.height,   // altura
        0xffffff,       // cor cobasi
        1                  // transparência
    );

    fundoHUD.setOrigin(0.5, 0.5);
    fundoHUD.setScrollFactor(0);


        const criarBotao = (x, y, textura, cenaDestino) => {

            const botao = this.add.image(x, y, textura)
                .setInteractive()
                .setScale(0.7)
                .setScrollFactor(0);

            botao.on('pointerdown', () => {
                // OTIMIZACAO: bloquear clique repetido durante a transicao evita multiplos fade/listeners concorrentes.

                this.cameras.main.fadeOut(500, 0, 0, 0);

                this.cameras.main.once('camerafadeoutcomplete', () => {

                    const cenasAtivas = this.scene.manager.getScenes(true);

                    // OTIMIZACAO: evitar stop/launch de todas as cenas a cada clique; preferir sleep/wake ou switch para reduzir recriacao.
                    cenasAtivas.forEach(scene => {
                        if (scene.scene.key !== 'hudScene') {
                            this.scene.stop(scene.scene.key);
                        }
                    });

                    this.scene.launch(cenaDestino);
                    this.scene.bringToTop('hudScene');

                    this.cameras.main.fadeIn(500, 0, 0, 0);
                });
            });
        };

        criarBotao(1600, 100, 'iconeBanho', 'bathScene');
        criarBotao(1600, 250, 'iconeRacao', 'foodScene');
        criarBotao(1600, 400, 'iconeCuidados', 'cuidadoCena');
        criarBotao(1600, 550, 'iconeLazer', 'gameScene');
        criarBotao(1600, 700, 'iconeVoltar', 'introScene');
    }
}
