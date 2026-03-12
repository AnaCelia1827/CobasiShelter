export class cenaHUD extends Phaser.Scene {
    constructor() {
        super({ key: "cenaHUD" });
        this.transicao = false; // Flag para evitar múltiplas transições simultâneas
    }

    create() {
        this.transicao = false; // Reseta flag de transição

        // Configuração do painel lateral (HUD)
        const larguraPainel = 200;                          // Largura do painel
        const painelX = this.scale.width - larguraPainel / 2; // Posição X (lado direito da tela)
        const centroY = this.scale.height / 2;              // Centro vertical da tela
        const topoY = Math.max(100, this.scale.height * 0.12); // Posição inicial dos botões
        const espaco = Math.max(90, this.scale.height * 0.18); // Espaçamento entre botões

        // Cria o retângulo branco que serve de fundo para o painel
        this.add
            .rectangle(painelX, centroY, larguraPainel, this.scale.height, 0xffffff, 1)
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0); // Fixa o painel na tela (não se move com a câmera)

        // Função utilitária para criar botões no painel
        const criarBotao = (indice, textura, cenaAlvo) => {
            const y = topoY + indice * espaco; // Calcula posição Y do botão
            const botao = this.add
                .image(painelX, y, textura) // Cria imagem do botão
                .setInteractive({ useHandCursor: true }) // Torna clicável
                .setScale(0.7) // Define escala
                .setScrollFactor(0); // Fixa na tela

            // Evento de clique → chama transição para cena alvo
            botao.on("pointerdown", () => this.transicionarPara(cenaAlvo));
        };

        // Criação dos botões do HUD
        criarBotao(0, "iconeBanho", "cenaBanho");         // Botão para cena de banho
        criarBotao(1, "iconeRacao", "cenaComida");        // Botão para cena de comida
        criarBotao(2, "iconeCuidados", "cenaCuidado");    // Botão para cena de cuidados
        criarBotao(3, "iconeLazer", "cenaPrincipal");     // Botão para cena principal/lazer
        criarBotao(4, "iconeVoltar", "cenaInicial");      // Botão para voltar ao menu inicial
    }

    // Função responsável por transicionar entre cenas
    transicionarPara(cenaAlvo) {
        if (this.transicao) {
            return; // Evita transições simultâneas
        }

        // Verifica se a cena alvo existe
        if (!this.scene.manager.keys[cenaAlvo]) {
            console.error(`Cena não registrada: ${cenaAlvo}`);
            return;
        }

        // Obtém todas as cenas ativas
        const cenasAtivas = this.scene.manager.getScenes(true);

        // Identifica a cena de jogo ativa (exclui HUD e ficha)
        const cenaJogo = cenasAtivas.find((cena) => {
            const chave = cena.scene.key;
            return chave !== "cenaHUD" && chave !== "ficha";
        });

        // Se já está na cena alvo, não faz nada
        if (cenaJogo?.scene.key === cenaAlvo) {
            return;
        }

        // Marca transição como ativa
        this.transicao = true;

        // Faz fade out da tela
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            // Para todas as cenas ativas, exceto HUD e a cena alvo
            cenasAtivas.forEach((cena) => {
                const chave = cena.scene.key;
                if (chave !== "cenaHUD" && chave !== cenaAlvo) {
                    this.scene.stop(chave);
                }
            });

            // Se a cena alvo não está ativa, inicia ela
            if (!this.scene.isActive(cenaAlvo)) {
                this.scene.launch(cenaAlvo);
            }

            // Garante que o HUD fique por cima
            this.scene.bringToTop("cenaHUD");

            // Faz fade in da nova cena
            this.cameras.main.fadeIn(300, 0, 0, 0);

            // Libera flag de transição
            this.transicao = false;
        });
    }
}
