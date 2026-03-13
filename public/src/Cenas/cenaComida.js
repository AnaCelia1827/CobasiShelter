// Importa a classe Cachorro, responsável pela animação e controle do cachorro
import { Cachorro } from "../componentes/controleCachorro/cachorroAnimacao.js";

// Define a cena "cenaComida"
export class cenaComida extends Phaser.Scene {
    
    constructor() {
        super({ key: "cenaComida" });
        this.transicao = false; // Flag para evitar múltiplas transições de cena
    }

    create() {
        this.transicao = false; // Reseta flag de transição

        // Garante que a cena HUD esteja ativa
        if (!this.scene.isActive("cenaHUD")) {
            this.scene.launch("cenaHUD");
        } else if (this.scene.isSleeping("cenaHUD")) {
            this.scene.wake("cenaHUD");
        }
        this.scene.bringToTop("cenaHUD");

        // Pré-carrega texturas da ração para evitar travamentos
        this.preCarregarTexturasRacao();

        // Função auxiliar para aplicar efeitos visuais ao passar o mouse e clicar
        const passarPressionarEfeito = (alvo, escalaNormal, escalaPassar) => {
            // Aumenta escala ao passar o mouse
            alvo.on("pointerover", () => {
                this.tweens.add({
                    targets: alvo,
                    scaleX: escalaPassar,
                    scaleY: escalaPassar,
                    duration: 200,
                    ease: "Power2"
                });
            });

            // Reduz escala ao clicar (efeito de pressão)
            alvo.on("pointerdown", () => {
                this.tweens.add({
                    targets: alvo,
                    scaleX: escalaNormal * 0.9,
                    scaleY: escalaNormal * 0.9,
                    duration: 150,
                    yoyo: true // volta ao tamanho original
                });
            });

            // Retorna à escala normal ao sair com o mouse
            alvo.on("pointerout", () => {
                this.tweens.add({
                    targets: alvo,
                    scaleX: escalaNormal,
                    scaleY: escalaNormal,
                    duration: 200,
                    ease: "Power2"
                });
            });
        };

        // Fundo da cena (imagem da cozinha/ração)
        this.add
            .image(this.scale.width / 2, this.scale.height / 2, "bgRacao")
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        // Estante de ração interativa
        const estante = this.add.image(300, 600, "estanteRacao").setScale(0.5).setInteractive({ useHandCursor: true });
        passarPressionarEfeito(estante, 0.5, 0.6);

        // Evento de clique na estante → transição para minijogo da ração
        estante.on("pointerdown", () => {
            if (this.transicao) {
                return; // Evita múltiplos cliques
            }

            this.transicao = true;
            this.cameras.main.fadeOut(100, 0, 0, 0); // Faz fade out da tela
            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("jogoRacao"); // Inicia cena do minijogo
            });
        });

        // Ícone de pote de ração vazio
        this.add.image(700, 750, "racaoVazia").setScale(0.2).setDepth(100);

        // Instancia o cachorro na cena
        this.cachorro = new Cachorro(this, 920, 600);

        // Bilhete interativo (abre ficha informativa)
        const bilhete = this.add.image(1350, 100, "mineFicha").setScale(0.1).setInteractive({ useHandCursor: true });
        passarPressionarEfeito(bilhete, 0.1, 0.13);

        // Evento de clique no bilhete → abre/fecha ficha
        bilhete.on("pointerdown", () => {
            if (this.scene.isActive("ficha")) {
                this.scene.stop("ficha"); // Fecha ficha se já estiver aberta
                return;
            }

            this.scene.launch("ficha"); // Abre ficha
            this.scene.bringToTop("Ficha"); // Garante que fique visível
            this.scene.bringToTop("cenaHUD");
        });

        // Evento ao encerrar a cena → fecha ficha se estiver aberta
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            if (this.scene.isActive("ficha")) {
                this.scene.stop("ficha");
            }
        });
    }

    // Pré-carrega texturas da ração para evitar travamentos
    preCarregarTexturasRacao() {
        if (this.registry.get("texturas_racao_precarregadas")) {
            return; // Se já foi pré-carregado, não faz nada
        }

        // Lista de texturas que serão pré-carregadas
        const chavesPreCarregadas = [
            "bgLimpo", "estanteVazia", "botaoVoltar",
            "racaoGA", "racaoGF", "racaoGV",
            "racaoMA", "racaoMF", "racaoMV",
            "racaoPA", "racaoPF", "racaoPV"
        ];

        // Cria sprites invisíveis para forçar carregamento
        const spritesPreCarregados = chavesPreCarregadas.map((chave, indice) =>
            this.add.image(2 + indice, 2, chave).setScale(0.001).setAlpha(0.001).setDepth(-9999)
        );

        // Após pequeno delay, destrói sprites e marca como pré-carregado
        this.time.delayedCall(50, () => {
            spritesPreCarregados.forEach((sprite) => sprite.destroy());
            this.registry.set("texturas_racao_precarregadas", true);
        });
    }
}
