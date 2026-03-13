// Importa todas as cenas e componentes do jogo
import { cenaInicial } from "./Cenas/cenaInicial.js";
import { cenaBanho } from "./Cenas/cenaBanho.js";
import { cenaConfiguracoes } from "./Cenas/cenaConfiguracoes.js";
import { cenaComida } from "./Cenas/cenaComida.js";
import { cenaTutorial } from "./Cenas/cenaTutorial.js";
import { cenaPrincipal } from "./Cenas/cenaPrincipal.js";
import { jogoLazer } from "./Cenas/jogoLazer.js";
import { cenaHUD } from "./componentes/cenaHUD.js";
import { cenaCuidado } from "./Cenas/cenaCuidado.js";
import { jogoRacao } from "./Cenas/jogoRacao.js";
import { ficha } from "./componentes/ficha.js";
import { cenaCarregamento } from "./Cenas/cenaCarregamento.js";

// Objeto global para armazenar estados do jogo (música, ferramentas, cachorro, etc.)
export let gameState = {};

// Configuração principal do Phaser
const config = {
    type: Phaser.AUTO, // Phaser escolhe automaticamente entre WebGL ou Canvas
    width: window.innerWidth,  // Largura da tela = largura da janela
    height: window.innerHeight, // Altura da tela = altura da janela

    // Configuração de áudio
    audio: {
        disableWebAudio: false, // Permite usar WebAudio
        noAudio: false          // Garante que o áudio esteja habilitado
    },

    // Configuração de física
    physics: {
        default: "arcade", // Usa o motor de física Arcade (mais simples e leve)

        arcade: {
            gravity: { y: 0 }, // Sem gravidade (objetos não caem automaticamente)
            debug: false       // Desativa visualização de colisões e corpos físicos
        }
    },

    // Lista de cenas que compõem o jogo
    scene: [
        cenaCarregamento,   // Tela de carregamento inicial
        cenaInicial,        // Tela inicial (menu principal)
        cenaTutorial,
        cenaConfiguracoes,  // Tela de configurações
        cenaBanho,          // Minijogo de banho do cachorro
        cenaComida,         // Cena de alimentação
        cenaCuidado,        // Cena de cuidados gerais
        cenaPrincipal,      // Cena principal (provavelmente hub do jogo)
        jogoRacao,          // Minijogo de escolha de ração
        cenaHUD,            // HUD (interface sobreposta)
        jogoLazer,
        ficha               // Ficha informativa do cachorro
    ]
};

// Inicializa o jogo com a configuração definida
new Phaser.Game(config);
