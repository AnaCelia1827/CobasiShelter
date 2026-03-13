

export class Racao {

    static selecionada = null;

    constructor(scene, x, y, dados) {

        this.scene = scene;

        this.nome = dados.nome;
        this.idade = dados.idade;
        
        this.ingredientes = dados.ingredientes;

        this.exemplos = dados.exemplos;
        this.descricao = dados.descricao;
        this.id = dados.id;

        this.sprite = scene.add
            .image(x, y, dados.sprite)
            .setDisplaySize(144, 209)
            .setInteractive({ useHandCursor: true });

        this.sprite.on("pointerdown", () => {

            // remove destaque da anterior
            if (Racao.selecionada) {
                Racao.selecionada.sprite.clearTint();
            }
            // seleciona atual
            Racao.selecionada = this;

            // destaque amarelo
            this.sprite.setTint(0xffff00);

            // atualiza painel
            if (scene.atualizarPainel) {
                scene.atualizarPainel(this);
            }

        });

    }

}