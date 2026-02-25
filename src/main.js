//A variável abaixo é global, sendo que ela é utilizada para criar mais variáveis
let gameState = {
}
/* Esse trecho gera as configurações básicas do jogo. O type cria o tipo de tela , que geralmente é do tipo CANVAS.O width gera a largura do tela do jogo no navegador, que no caso será a tela inteira, de maneira analoga, funciona o height,mas para altura.O comando scene cria a ordem das cenas que começa com introScene e depois vai para settingsScene*/
var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    audio: {
        disableWebAudio: false,
        noAudio: false,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [introScene, settingsScene, bathScene]
};

var game = new Phaser.Game(config);