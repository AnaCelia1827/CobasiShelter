import { introScene } from "./Scenes/introScenes.js";
import { bathScene } from "./Scenes/bathScene.js";
import { settingsScene } from "./Scenes/settingsScene.js";
import { foodScene } from "./Scenes/foodScene.js";
import { gameScene } from "./Scenes/gameScene.js";
import { hudScene } from "./componentes/hudScene.js";
import { cuidadoCena } from "./Scenes/cuidadoCena.js";
import { jogoRacao } from "./Scenes/jogoRacao.js";
import {ficha} from "./componentes/ficha.js"
import { PreloadScene } from "./Scenes/preloadScene.js";


export let gameState = {

};

const config = {
    
    type: Phaser.AUTO,
   
    width: window.innerWidth,//1080x1920
    height: window.innerHeight,
    
    audio: {
        disableWebAudio: false,
        noAudio: false,
    },
   
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }, // Sem gravidade
            debug: false 
        }
    },
    // Organização das cenas do jogo
    scene: [
       // introScene,
       //settingsScene,
       //gameScene,
      //bathScene,
       
        
        //cuidadoCena,
        PreloadScene,
        // foodScene,
        jogoRacao,
        hudScene,
        ficha
    ]
};

const game = new Phaser.Game(config);