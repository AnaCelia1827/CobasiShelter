import {
    racaoGrandeFilhote,
    racaoGrandeAdulto,
    racaoGrandeVelho,
    racaoMediaAdulto,
    racaoMediaFilhote,
    racaoMediaVelho,
    racaoPequenaAdulto,
    racaoPequenaFilhote,
    racaoPequenaVelho
} from "../componentes/controleRacoes/dadosRacoes.js";

import { Racao } from "../componentes/controleRacoes/racoes.js";
import { cachorroGeral } from "../componentes/controleCachorro/cachorroGeral.js";

export class jogoRacao extends Phaser.Scene {

    constructor() {
        super({ key: "jogoRacao" });
    }

    create() {


        // desativa HUD
if (this.scene.isActive("hudScene")) {
    this.scene.sleep("hudScene");
}

// efeito hover e clique
const hoverPressEffect = (target, scaleNormal, scaleHover) => {

    target.on("pointerover", () => {
        this.tweens.add({
            targets: target,
            scaleX: scaleHover,
            scaleY: scaleHover,
            duration: 200,
            ease: "Power2"
        });
    });

    target.on("pointerdown", () => {
        this.tweens.add({
            targets: target,
            scaleX: scaleNormal * 0.9,
            scaleY: scaleNormal * 0.9,
            duration: 150,
            yoyo: true
        });
    });

    target.on("pointerout", () => {
        this.tweens.add({
            targets: target,
            scaleX: scaleNormal,
            scaleY: scaleNormal,
            duration: 200
        });
    });
};

// fundo
this.add
.image(this.scale.width / 2, this.scale.height / 2, "bgLimpo")
.setDisplaySize(this.scale.width, this.scale.height)
.setDepth(-1);

// botão voltar
const voltar = this.add
.image(100, 100, "botaoVoltar")
.setScale(0.01)
.setInteractive({ useHandCursor: true });

hoverPressEffect(voltar, 0.01, 0.012);

                    voltar.on("pointerdown", () => {

                        if (this.scene.isSleeping("hudScene")) {
                            this.scene.wake("hudScene");
                        }

                        this.scene.start("foodScene");

                    });

                    // estante
                    this.add
                    .image(500, 500, "estanteVazia")
                    .setScale(1.3)
                    .setDepth(-1);

            // RAÇÕES
            this.r1 = new Racao(this, 300, 300, racaoGrandeAdulto);
            this.r2 = new Racao(this, 500, 300, racaoGrandeFilhote);
            this.r3 = new Racao(this, 700, 300, racaoGrandeVelho);

            this.r4 = new Racao(this, 300, 500, racaoMediaAdulto);
            this.r5 = new Racao(this, 500, 500, racaoMediaFilhote);
            this.r6 = new Racao(this, 700, 500, racaoMediaVelho);

            this.r7 = new Racao(this, 300, 700, racaoPequenaAdulto);
            this.r8 = new Racao(this, 500, 700, racaoPequenaFilhote);
            this.r9 = new Racao(this, 700, 700, racaoPequenaVelho);

       

        const pet = cachorroGeral.pet;

        this.add.image(this.scale.width/2, this.scale.height/2, "bgLimpo")
        .setDisplaySize(this.scale.width, this.scale.height)
        .setDepth(-1);

        this.add.image(500,500,"estanteVazia")
        .setScale(1.3)
        .setDepth(-1);

       

        // PAINEL
        const painel = this.add.container(1100,400);

        const fundo = this.add.graphics();
        fundo.fillStyle(0xffffff,1);
        fundo.lineStyle(6,0xff7a00);
        fundo.strokeRoundedRect(-200,-200,600,600,20);
        fundo.fillRoundedRect(-200,-200,600,600,20);

        const mensagem = this.add.text(-170,-170,"Selecione uma ração.",{
            fontFamily:'"Press Start 2P"',
            fontSize:"12px",
            color:"#000",
            wordWrap:{width:340}
        });

        // FUNÇÃO QUE ATUALIZA O PAINEL
        this.atualizarPainel = (racao) => {

            mensagem.setText(
                `Ração selecionada:

                Nome: ${racao.nome}

                ${racao.descricao}

                Porte: ${racao.porte}
                Idade: ${racao.idade}`
                            );

                        };

        // BOTÃO VERIFICAR
        const verificar = this.add.text(100,350,"Verificar",{
            fontFamily:'"Press Start 2P"',
            fontSize:"14px",
            backgroundColor:"#ffa500",
            color:"#ffffff",
            padding:{x:30,y:20}
        })
        .setOrigin(0.5)
        .setInteractive();

        verificar.on("pointerdown",()=>{

            const racao = Racao.selecionada;

            if(!racao){
                mensagem.setText("Falta selecionar uma ração.");
                return;
            }

            if(
                racao.id === pet.id 
                
            ){

                mensagem.setText(
                        ` Acertou!

                        Essa é a ração ideal
                        para o cachorro.`
                );

                this.time.delayedCall(2000,()=>{
                    console.log("beta");
                });

            }else{

                mensagem.setText(
            `Essa ração não é ideal.

            Cachorro:
            Porte: ${pet.porte}
            Idade: ${pet.idade}


            Escolha outra ração.`
                            );

                        }

        });

        painel.add([fundo,mensagem,verificar]);

    }

}