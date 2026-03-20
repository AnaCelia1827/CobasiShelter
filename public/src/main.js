import { jogoAlimentacao } from "./Cenas/jogoAlimentacao.js";
import { cenaInicial } from "./Cenas/cenaInicial.js";
import { cenaBanho } from "./Cenas/cenaBanho.js";
import { cenaConfiguracoes } from "./Cenas/cenaConfiguracoes.js";
import { cenaComida } from "./Cenas/cenaComida.js";
//import { cenaTutorial } from "./Cenas/cenaTutorial.js";
import { cenaPrincipal } from "./Cenas/cenaPrincipal.js";
import { jogoLazer } from "./Cenas/jogoLazer.js";
import { cenaHUD } from "./componentes/cenaHUD.js";
import { cenaCuidado } from "./Cenas/cenaCuidado.js";
import { jogoRacao } from "./Cenas/jogoRacao.js";
import { ficha } from "./componentes/ficha.js";
import { cenaCarregamento } from "./Cenas/cenaCarregamento.js";
import {cenaVeterinario } from "./Cenas/cenaVeterinario.js";

// Objeto global para armazenar estados do jogo
export let gameState = {
    barras: {
        comida:  11,
        lazer:   11,
        limpeza: 11,
        saude:   11
    },
      cobasiCoins: 20, 
      recompensas: { 
      banho: false 

     } 
};

// Configuração principal do Phaser
const config = {
    type: Phaser.AUTO,
    
    width: window.innerWidth,

    // Altura sempre igual à altura total da janela
    height: window.innerHeight,

    scale: {
        mode: Phaser.Scale.RESIZE,          // ativa redimensionamento automático
        autoCenter: Phaser.Scale.CENTER_BOTH // centraliza o jogo na tela
    },

    audio: {
        disableWebAudio: false,
        noAudio: false
    },

    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },

    scene: [
        cenaCarregamento,
        cenaInicial,
        //cenaTutorial,
        jogoAlimentacao,
        cenaConfiguracoes,
        cenaBanho,
        cenaComida,
        cenaCuidado,
        cenaVeterinario,
        cenaPrincipal,
        jogoRacao,
        cenaHUD,
        jogoLazer,
        ficha
    ]
};

// Inicializa o jogo
const game = new Phaser.Game(config);
