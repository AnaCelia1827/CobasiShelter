import { introScene } from "./Scenes/introScenes.js";
import { bathScene } from "./Scenes/bathScene.js";
import { settingsScene } from "./Scenes/settingsScene.js";
import { foodScene } from "./Scenes/foodScene.js";
import { gameScene } from "./Scenes/gameScene.js";
import { hudScene } from "./componentes/hudScene.js";
import { cuidadoCena } from "./Scenes/cuidadoCena.js";
import { jogoRacao } from "./Scenes/jogoRacao.js";
import { ficha } from "./componentes/ficha.js";
import { PreloadScene } from "./Scenes/preloadScene.js";


export let gameState = {

     barras: {
        comida:  11,
        lazer:   11,
        limpeza: 11,
        saude:    11,
    }
};

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
        PreloadScene,
        introScene,
        settingsScene,
        bathScene,
        foodScene,
        gameScene,
        cuidadoCena,
        jogoRacao,
        hudScene,
        ficha
        
    ]
};

new Phaser.Game(config);
