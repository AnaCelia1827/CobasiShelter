
import { cenaInicial } from "./Cenas/cenaInicial.js";
import { cenaBanho } from "./Cenas/cenaBanho.js";
import { cenaConfiguracoes } from "./Cenas/cenaConfiguracoes.js";
import { cenaComida} from "./Cenas/cenaComida.js";
import { cenaPrincipal } from "./Cenas/cenaPrincipal.js";
import { cenaHUD } from "./componentes/cenaHUD.js";
import { cenaCuidado } from "./Cenas/cenaCuidado.js";
import { jogoRacao } from "./Cenas/jogoRacao.js";
import { ficha } from "./componentes/ficha.js";
import { cenaCarregamento } from "./Cenas/cenaCarregamento.js";

export let gameState = {};

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
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
        cenaConfiguracoes,
        cenaBanho,
        cenaComida,
        cenaCuidado,
        cenaPrincipal,
        jogoRacao,
        cenaHUD,
        ficha
    ]
};

new Phaser.Game(config);

