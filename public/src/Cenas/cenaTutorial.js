/**
 * CENA: cenaTutorial
 *
 * Exibe uma sequência de imagens que contam a história do jogo.
 * 
 * CORREÇÃO APLICADA:
 * - Removido o timer automático que trocava as imagens sem controle do jogador.
 * - Adicionados botões de PRÓXIMO (→) e ANTERIOR (←) para o jogador navegar
 *   pelas cenas no seu próprio ritmo.
 * - Adicionado indicador de progresso (ex: "3 / 11") para o jogador saber
 *   onde está na história.
 * - A última cena exibe um botão "JOGAR" para iniciar o jogo.
 */
export class cenaTutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'cenaTutorial' });
        // Índice da imagem atual (começa na primeira)
        this.indiceAtual = 1;
        // Total de imagens de tutorial
        this.totalCenas = 11;
    }

    preload() {
        // Carrega todas as imagens de tutorial dinamicamente
        for (let i = 1; i <= this.totalCenas; i++) {
            this.load.image(`tutorial${i}`, `assets/tutorial${i}.png`);
        }
    }

    create() {
        // Reinicia o índice toda vez que a cena começa
        this.indiceAtual = 1;

        // Exibe a imagem do tutorial centralizada na tela
        this.imagemTutorial = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            `tutorial${this.indiceAtual}`
        ).setOrigin(0.5).setDepth(0);

        // Texto no canto inferior central mostrando "cena X de Y"
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

        // Aparece somente a partir da segunda cena
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
        )
            .setOrigin(0.5)
            .setDepth(10)
            .setInteractive({ useHandCursor: true });

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
        )
            .setOrigin(0.5)
            .setDepth(10)
            .setInteractive({ useHandCursor: true });

        this.botaoProximo.on('pointerover', () => this.botaoProximo.setStyle({ color: '#ffdd00' }));
        this.botaoProximo.on('pointerout',  () => this.botaoProximo.setStyle({ color: '#ffffff' }));
        this.botaoProximo.on('pointerdown', () => this.irParaCena(this.indiceAtual + 1));

        // Atualiza o estado visual dos botões para a cena inicial
        this.atualizarBotoes();
    }

    /**
     * Navega para uma cena específica pelo índice.
     * Se o índice ultrapassar o total, inicia o jogo.
     * Se for menor que 1, não faz nada (já está no começo).
     *
     * @param {number} novoIndice - O índice desejado
     */
    irParaCena(novoIndice) {
        // Se passou da última cena, inicia o jogo
        if (novoIndice > this.totalCenas) {
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('cenaPrincipal');
            });
            return;
        }

        // Não permite ir abaixo do índice 1
        if (novoIndice < 1) return;

        this.indiceAtual = novoIndice;

        // Troca a textura da imagem de tutorial
        this.imagemTutorial.setTexture(`tutorial${this.indiceAtual}`);

        // Atualiza o texto de progresso
        this.textoProgresso.setText(`${this.indiceAtual} / ${this.totalCenas}`);

        // Atualiza visibilidade e texto dos botões
        this.atualizarBotoes();
    }

    /**
     * Ajusta a aparência dos botões de navegação conforme
     * a cena atual (primeira, última ou do meio).
     */
    atualizarBotoes() {
        // Esconde o botão anterior na primeira cena
        this.botaoAnterior.setVisible(this.indiceAtual > 1);

        // Na última cena, muda o texto do botão próximo para "JOGAR"
        if (this.indiceAtual === this.totalCenas) {
            this.botaoProximo.setText('JOGAR ▶').setStyle({ fontSize: '32px', color: '#88ff88' });
        } else {
            this.botaoProximo.setText('▶').setStyle({ fontSize: '52px', color: '#ffffff' });
        }
    }
}
