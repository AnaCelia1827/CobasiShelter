//A variável abaixo é global, sendo que ela é utilizada para criar mais variáveis
let gameState = {
}

//Estabelece as configurações do jogo
var config = {

    //Adiciona o tipo de apresentação automaticamente
    type: Phaser.AUTO,

    //Estabele a largura e altura para toda tela
    width: window.innerWidth,
    height: window.innerHeight,

    //Configurações de audio
    audio: {
        disableWebAudio: false,
        noAudio: false,
    },

    //Adiciona fisiva no jogo
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },

    // Organiza as cenas
    scene: [introScene, settingsScene,gameScene, bathScene]
};

//Aplica as configurações no jogo
var game = new Phaser.Game(config);