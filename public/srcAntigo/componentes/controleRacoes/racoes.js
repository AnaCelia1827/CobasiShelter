export class Racao {

    // Variável estática: guarda qual ração está selecionada no momento
    static selecionada = null;

    constructor(scene, x, y, dados) {
        // Cena onde a ração será exibida
        this.scene = scene;

        // Copia todas as informações do objeto "dados" para a instância
        Object.assign(this, dados);

        // Cria sprite da ração na tela
        this.sprite = scene.add
            .image(x, y, dados.sprite)      // Usa imagem definida em "dados.sprite"
            .setDisplaySize(144, 209)       // Define tamanho fixo
            .setInteractive({ useHandCursor: true }); // Torna clicável

        // Evento de clique na ração
        this.sprite.on("pointerdown", () => {

            // Remove destaque da ração anterior, se houver
            if (Racao.selecionada) {
                Racao.selecionada.sprite.clearTint();
            }

            // Define esta ração como a selecionada
            Racao.selecionada = this;

            // Aplica destaque visual (tinta amarela)
            this.sprite.setTint(0xffff00);

            // Atualiza painel lateral com informações da ração
            if (scene.atualizarPainel) {
                scene.atualizarPainel(this);
            }
        });
    }
}
