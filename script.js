document.addEventListener('DOMContentLoaded', function() {
    // --- Elementos do DOM ---
    const detalhesFesta = document.getElementById('detalhesFesta');
    const videoAniversario = document.getElementById('videoAniversario');
    const balloonGameSection = document.getElementById('balloonGameSection');
    const balloonsToPopTargetTextEl = document.getElementById('balloonsToPopTargetText');
    const balloonsPoppedCountTextEl = document.getElementById('balloonsPoppedCountText');
    const balloonsTargetCountTextEl = document.getElementById('balloonsTargetCountText');
    const balloonGameFeedbackEl = document.getElementById('balloonGameFeedback');

    // --- Configurações do Jogo de Balões ---
    const TOTAL_BALLOONS_TO_POP = 10; // Quantos balões o usuário precisa estourar
    const MAX_ACTIVE_BALLOONS = 6;   // Máximo de balões na tela ao mesmo tempo
    const BALLOON_SPAWN_INTERVAL = 1200; // Intervalo para tentar criar um novo balão (em ms)
    const BALLOON_COLORS = ['#FF69B4', '#C71585', '#FFB6C1', '#DB7093', '#FF1493', '#FFC0CB']; // Novas cores pink/fúcsia

    let balloonsPopped = 0;
    let mainObjectiveAchieved = false; // Nova flag para controlar a revelação principal
    let balloonSpawnTimer;

    function initBalloonGame() {
        balloonsToPopTargetTextEl.textContent = TOTAL_BALLOONS_TO_POP;
        balloonsTargetCountTextEl.textContent = TOTAL_BALLOONS_TO_POP;
        updatePoppedCountDisplay();
        mainObjectiveAchieved = false; // Reseta a flag ao iniciar/reiniciar
        balloonSpawnTimer = setInterval(spawnBalloon, BALLOON_SPAWN_INTERVAL);
    }

    function spawnBalloon() {
        const activeBalloons = document.querySelectorAll('.game-balloon').length;
        if (activeBalloons >= MAX_ACTIVE_BALLOONS) {
            return; // Não cria mais balões se o limite foi atingido
        }

        const balloon = document.createElement('div');
        balloon.classList.add('game-balloon');

        // Estilo e Posição Aleatória
        balloon.style.backgroundColor = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
        balloon.style.left = Math.random() * (window.innerWidth - 70) + 'px'; // 70 é a largura do balão
        balloon.style.animationDuration = (Math.random() * 5 + 6) + 's'; // Duração da animação entre 6s e 11s

        balloon.addEventListener('click', handleBalloonPop);
        balloon.addEventListener('animationend', () => {
            // Remove o balão se ele flutuar para fora da tela sem ser estourado
            if (balloon.parentNode) {
                balloon.remove();
            }
        });

        document.body.appendChild(balloon);
    }

    function handleBalloonPop(event) {
        const poppedBalloon = event.target;
        poppedBalloon.remove(); // Remove o balão estourado

        balloonsPopped++;
        updatePoppedCountDisplay();

        if (balloonsPopped >= TOTAL_BALLOONS_TO_POP && !mainObjectiveAchieved) {
            revealPartyDetails();
        }
    }

    function updatePoppedCountDisplay() {
        balloonsPoppedCountTextEl.textContent = balloonsPopped;
    }

    function revealPartyDetails() { // Função renomeada e modificada
        mainObjectiveAchieved = true; // Marca que o objetivo principal foi alcançado

        balloonGameFeedbackEl.textContent = 'Parabéns! Você conseguiu!';
        balloonGameFeedbackEl.className = 'feedback success';

        // Esconde a seção do jogo e mostra os detalhes da festa
        if(balloonGameSection) balloonGameSection.classList.add('hidden'); // Ou style.display = 'none'

        detalhesFesta.classList.remove('hidden');
        detalhesFesta.style.display = 'block'; // Garante visibilidade

        if (videoAniversario) {
            videoAniversario.play().catch(error => {
                console.log("Autoplay do vídeo pode ter sido bloqueado:", error);
            });
        }

        // Os balões continuarão a ser gerados e poderão ser estourados
        // O balloonSpawnTimer NÃO é limpo aqui
    }

    // Inicia o jogo
    if (balloonGameSection) { // Garante que a seção do jogo exista antes de iniciar
        initBalloonGame();
    }
});