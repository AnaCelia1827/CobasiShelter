/**
 * CENA: cenaTutorial
 *
 * Exibe uma sequência de imagens que contam a história do jogo.
 * Agora responsiva: imagens e botões se adaptam ao redimensionamento da tela.
 */
export class cenaTutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'cenaTutorial' });
        this.indiceAtual = 1;
        this.totalCenas = 11;
    }

    preload() {
        for (let i = 1; i <= this.totalCenas; i++) {
            this.load.image(`tutorial${i}`, `assets/tutorial${i}.png`);
        }
    }

    create() {
        this.indiceAtual = 1;

        // Imagem centralizada e responsiva
        this.imagemTutorial = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            `tutorial${this.indiceAtual}`
        ).setOrigin(0.5).setDepth(0)
         .setDisplaySize(this.scale.width, this.scale.height);

        // Texto de progresso
        this.textoProgresso = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height - 40,
            `${this.indiceAtual} / ${this.totalCenas}`,
            {
                fontFamily: 'Arial',
                fontSize: '22px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setDepth(10);

        // Botão anterior
        this.botaoAnterior = this.add.text(
            80, this.cameras.main.centerY,
            '◀',
            {
                fontFamily: 'Arial',
                fontSize: '52px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 5
            }
        ).setOrigin(0.5).setDepth(10).setInteractive({ useHandCursor: true });

        this.botaoAnterior.on('pointerover', () => this.botaoAnterior.setStyle({ color: '#ffdd00' }));
        this.botaoAnterior.on('pointerout',  () => this.botaoAnterior.setStyle({ color: '#ffffff' }));
        this.botaoAnterior.on('pointerdown', () => this.irParaCena(this.indiceAtual - 1));

        // Botão próximo
        this.botaoProximo = this.add.text(
            this.cameras.main.width - 80, this.cameras.main.centerY,
            '▶',
            {
                fontFamily: 'Arial',
                fontSize: '52px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 5
            }
        ).setOrigin(0.5).setDepth(10).setInteractive({ useHandCursor: true });

        this.botaoProximo.on('pointerover', () => this.botaoProximo.setStyle({ color: '#ffdd00' }));
        this.botaoProximo.on('pointerout',  () => this.botaoProximo.setStyle({ color: '#ffffff' }));
        this.botaoProximo.on('pointerdown', () => this.irParaCena(this.indiceAtual + 1));

        this.atualizarBotoes();

        // Listener para redimensionamento da tela
        this.scale.on("resize", (gameSize) => {
            const width = gameSize.width;
            const height = gameSize.height;

            this.cameras.resize(width, height);

            // Ajusta imagem
            this.imagemTutorial.setPosition(width / 2, height / 2)
                               .setDisplaySize(width, height);

            // Ajusta texto de progresso
            this.textoProgresso.setPosition(width / 2, height - 40);

            // Ajusta botões
            this.botaoAnterior.setPosition(80, height / 2);
            this.botaoProximo.setPosition(width - 80, height / 2);
        });
    }

    irParaCena(novoIndice) {
        if (novoIndice > this.totalCenas) {
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('cenaPrincipal');
            });
            return;
        }
        if (novoIndice < 1) return;

        this.indiceAtual = novoIndice;
        this.imagemTutorial.setTexture(`tutorial${this.indiceAtual}`);
        this.textoProgresso.setText(`${this.indiceAtual} / ${this.totalCenas}`);
        this.atualizarBotoes();
    }

    atualizarBotoes() {
        this.botaoAnterior.setVisible(this.indiceAtual > 1);

        if (this.indiceAtual === this.totalCenas) {
            this.botaoProximo.setText('JOGAR ▶')
                .setStyle({ fontSize: '32px', color: '#88ff88' });
        } else {
            this.botaoProximo.setText('▶')
                .setStyle({ fontSize: '52px', color: '#ffffff' });
        }
    }
}
