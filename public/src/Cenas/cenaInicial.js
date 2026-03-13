// Importa o objeto global gameState do arquivo principal
import { gameState } from "../main.js";

// Define a cena "cenaInicial", que é a tela principal do jogo
export class cenaInicial extends Phaser.Scene {
    constructor() {
        super({ key: "cenaInicial" });
        this.transicao = false; // Flag para evitar múltiplas transições de cena
    }

    create() {
        // Para garantir que a HUD não fique ativa ao iniciar
        this.scene.stop("cenaHUD");
        this.transicao = false;

        // Música de fundo: cria e inicia se ainda não estiver tocando
        if (!gameState.musica) {
            gameState.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        }
        if (!gameState.musica.isPlaying) {
            gameState.musica.play();
        }

        // Fundo da cena inicial
        this.add
            .image(this.scale.width / 2, this.scale.height / 2, "bgInical")
            .setDisplaySize(this.scale.width, this.scale.height);

        // Função utilitária para criar botões com troca de textura e animação de escala
        const criarBotao = (x, y, texturaNormal, texturaOver, texturaDown, escalaBase, escalaHover, escalaDown, callback) => {
            // Cria botão interativo
            const botao = this.add.image(x, y, texturaNormal).setScale(escalaBase).setInteractive({ useHandCursor: true });

            // Evento ao passar o mouse → muda textura e aumenta escala
            botao.on("pointerover", () => {
                botao.setTexture(texturaOver);
                this.tweens.add({ targets: botao, scale: escalaHover, duration: 150, ease: "Power2" });
            });

            // Evento ao retirar o mouse → volta textura e escala originais
            botao.on("pointerout", () => {
                botao.setTexture(texturaNormal);
                this.tweens.add({ targets: botao, scale: escalaBase, duration: 150, ease: "Power2" });
            });

            // Evento ao clicar → textura pressionada e escala reduzida
            botao.on("pointerdown", () => {
                botao.setTexture(texturaDown);
                this.tweens.add({ targets: botao, scale: escalaDown, duration: 100, ease: "Power2" });
            });

            // Evento ao soltar clique → textura hover e executa callback
            botao.on("pointerup", () => {
                botao.setTexture(texturaOver);
                this.tweens.add({ targets: botao, scale: escalaHover, duration: 100, ease: "Power2" });
                if (callback) callback();
            });

            return botao;
        };

        // Botão Jogar → inicia cena principal
        criarBotao(
            window.innerWidth / 7 + 28, window.innerWidth / 3,
            "botaoJogarNormal", "botaoJogarCrescendo", "botaoJogarPressionado",
            0.085, 0.1, 0.08,
            () => this.transitionTo("cenaTutorial")
        );

        // Botão Sair → fecha o jogo
        criarBotao(
            window.innerWidth / 7 - 150, window.innerWidth / 2 - 100,
            "botaoSairNormal", "botaoSairCrescendo", "botaoSairPressionado",
            0.065, 0.08, 0.06,
            () => this.game.destroy(true)
        );

        // Botão Configurações → abre cena de configurações
        criarBotao(
            window.innerWidth / 7 + 200, window.innerWidth / 2 - 100,
            "botaoConfiguracoesNormal", "botaoConfiguracoesCrescendo", "botaoConfiguracoesPressionado",
            0.85, 0.95, 0.75,
            () => this.transitionTo("cenaConfiguracoes")
        );

        

        // Configuração da câmera (fade in inicial)
        this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
        this.cameras.main.fadeIn(200, 0, 0, 0);
    }

    // Função para transição entre cenas com efeito de fade
    transitionTo(sceneKey) {
        if (this.transicao) return; // Evita múltiplas transições

        this.transicao = true;
        this.cameras.main.fadeOut(300, 0, 0, 0); // Fade out da tela
        this.cameras.main.once("camerafadeoutcomplete", () => {
            // Para música antes de trocar de cena
            if (gameState.musica?.isPlaying) {
                gameState.musica.stop();
            }
            // Inicia a cena desejada
            this.scene.start(sceneKey);
        });
    }
}
