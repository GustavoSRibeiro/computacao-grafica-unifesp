// Seleciona o canvas e obtém o contexto 2D
const canvas = document.querySelector('#c');
const ctx = canvas.getContext('2d');

// Configura a resolução do canvas para 2000x1000 pixels reais
canvas.width = 800;
canvas.height = 560;

// Variáveis globais
let paddle1Y = canvas.height / 2 - 35;
let paddle2Y = canvas.height / 2 - 35;
let paddle1Height = 100;
let paddle2Height = 100;
const paddleWidth = 20;
let paddle1X = 0; // Posição inicial da raquete esquerda (Jogador 1)
let paddle2X = canvas.width - paddleWidth; // Posição inicial da raquete direita (Jogador 2)

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
const initialBallSpeedX = 2;
const initialBallSpeedY = 2;
let ballSpeedX = initialBallSpeedX;
let ballSpeedY = initialBallSpeedY;
const ballSize = 10;

// Variáveis do placar
let scorePlayer1 = 0;
let scorePlayer2 = 0;

// Velocidade inicial das raquetes e fator de aumento de velocidade
const initialPaddleMoveSpeed = 6;
let paddleMoveSpeed = initialPaddleMoveSpeed;
const paddleSpeedIncrease = 1;

// Variáveis para calcular o efeito de rotação
let paddle1SpeedX = 0;
let paddle1SpeedY = 0;
let paddle2SpeedX = 0;
let paddle2SpeedY = 0;
const spinFactor = 0.8;
const speedIncreaseFactor = 0.5;
const paddleImpactFactor = 0.5; // Novo fator para o impacto da raquete

// Controle de teclas
const keys = {};


// Controle de teclas
document.addEventListener('keydown', function(event) {
    keys[event.key] = true;
});

document.addEventListener('keyup', function(event) {
    keys[event.key] = false;
});

// Função para redefinir a bola e as velocidades após um ponto
function resetBallAndSpeeds() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;

    // Reinicia as velocidades para os valores iniciais
    ballSpeedX = initialBallSpeedX * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = initialBallSpeedY * (Math.random() > 0.5 ? 1 : -1);
    paddleMoveSpeed = initialPaddleMoveSpeed;
}

// Função para aumentar a velocidade da bola a cada 5 segundos
function increaseBallSpeed() {
    ballSpeedX += (ballSpeedX > 0 ? speedIncreaseFactor : -speedIncreaseFactor);
    ballSpeedY += (ballSpeedY > 0 ? speedIncreaseFactor : -speedIncreaseFactor);
}

setInterval(increaseBallSpeed, 5000);

let lastFrameTime = 0;
const FPS = 80;

function gameLoop(currentTime) {
    const deltaTime = currentTime - lastFrameTime;

    if (deltaTime >= 1000 / FPS) {
        lastFrameTime = currentTime;

        // Salva as posições anteriores das raquetes
        let previousPaddle1X = paddle1X;
        let previousPaddle1Y = paddle1Y;
        let previousPaddle2X = paddle2X;
        let previousPaddle2Y = paddle2Y;

        // Controles dos paddles com limites de movimento no eixo X (metade da tela)
        if (keys['ArrowUp']) paddle2Y -= paddleMoveSpeed;
        if (keys['ArrowDown']) paddle2Y += paddleMoveSpeed;
        if (keys['ArrowLeft']) paddle2X = Math.max(canvas.width / 2, paddle2X - paddleMoveSpeed);
        if (keys['ArrowRight']) paddle2X = Math.min(canvas.width - paddleWidth, paddle2X + paddleMoveSpeed);

        if (keys['w'] || keys['W']) paddle1Y -= paddleMoveSpeed;
        if (keys['s'] || keys['S']) paddle1Y += paddleMoveSpeed;
        if (keys['a'] || keys['A']) paddle1X = Math.max(0, paddle1X - paddleMoveSpeed);
        if (keys['d'] || keys['D']) paddle1X = Math.min(canvas.width / 2 - paddleWidth, paddle1X + paddleMoveSpeed);

        // Limita as posições das raquetes dentro do canvas
        paddle1Y = Math.max(Math.min(paddle1Y, canvas.height - paddle1Height), 100);
        paddle2Y = Math.max(Math.min(paddle2Y, canvas.height - paddle2Height), 100);

        // Calcula as velocidades das raquetes
        paddle1SpeedX = paddle1X - previousPaddle1X;
        paddle1SpeedY = paddle1Y - previousPaddle1Y;
        paddle2SpeedX = paddle2X - previousPaddle2X;
        paddle2SpeedY = paddle2Y - previousPaddle2Y;

        // Atualização da posição da bola
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballY - ballSize < 100) { 
            ballSpeedY = -ballSpeedY;
        }
        // Colisões com as bordas superior e inferior
        if (ballY + ballSize > canvas.height) {
            ballSpeedY = -ballSpeedY;
        }

        // Verifica se a bola saiu dos limites para marcar ponto
        if (ballX + ballSize < 0) {
            scorePlayer2++;
            resetBallAndSpeeds();
        } else if (ballX - ballSize > canvas.width) {
            scorePlayer1++;
            resetBallAndSpeeds();
        }

        // Colisões com as raquetes
        if (ballX - ballSize < paddle1X + paddleWidth && ballY > paddle1Y && ballY < paddle1Y + paddle1Height) {
            ballX = paddle1X + paddleWidth + ballSize; // Corrige a posição para fora do paddle
            // Ajusta as velocidades da bola com base na velocidade da raquete
            ballSpeedX = -ballSpeedX + paddle1SpeedX * paddleImpactFactor;
            ballSpeedY += paddle1SpeedY * paddleImpactFactor;
        }
        if (ballX + ballSize > paddle2X && ballY > paddle2Y && ballY < paddle2Y + paddle2Height) {
            ballX = paddle2X - ballSize; // Corrige a posição para fora do paddle
            // Ajusta as velocidades da bola com base na velocidade da raquete
            ballSpeedX = -ballSpeedX + paddle2SpeedX * paddleImpactFactor;
            ballSpeedY += paddle2SpeedY * paddleImpactFactor;
        }

        drawScene();
    }

    requestAnimationFrame(gameLoop);
}

function drawScene() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Placar do jogador 1 em azul
    ctx.fillStyle = 'blue';
    ctx.font = '60px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(scorePlayer1, canvas.width / 2 - 20, 80);

    // Placar do jogador 2 em vermelho
    ctx.fillStyle = 'red';
    ctx.textAlign = 'left';
    ctx.fillText(scorePlayer2, canvas.width / 2 + 20, 80);

    // Desenha a linha da parede superior abaixo do placar
    ctx.strokeStyle = 'white'; // Define a cor da linha
    ctx.lineWidth = 2;         // Define a espessura da linha
    ctx.beginPath();
    ctx.moveTo(0, 100);        // Ponto inicial da linha (x: 0, y: 100)
    ctx.lineTo(canvas.width, 100); // Ponto final da linha (x: largura do canvas, y: 100)
    ctx.stroke();              // Desenha a linha


    // Definir a cor e desenhar a raquete do jogador 1
    ctx.fillStyle = 'blue';
    ctx.fillRect(paddle1X, paddle1Y, paddleWidth, paddle1Height);

    // Definir a cor e desenhar a raquete do jogador 2
    ctx.fillStyle = 'red';
    ctx.fillRect(paddle2X, paddle2Y, paddleWidth, paddle2Height);

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();

}


requestAnimationFrame(gameLoop);
