document.addEventListener('DOMContentLoaded', function() {
    // --- Elementos do DOM ---
    const detalhesFesta = document.getElementById('detalhesFesta');
    const videoAniversario = document.getElementById('videoAniversario');
    // Elementos para a interação do presente/vídeo
    const imagemDoPresente = document.getElementById('imagemDoPresente');
    const areaPresente = document.getElementById('areaPresente');
    const videoWrapper = document.getElementById('videoWrapper'); // Este é o .video-container que agora tem um ID

    const balloonGameSection = document.getElementById('balloonGameSection');
    const balloonsToPopTargetTextEl = document.getElementById('balloonsToPopTargetText');
    const balloonsPoppedCountTextEl = document.getElementById('balloonsPoppedCountText');
    const balloonsTargetCountTextEl = document.getElementById('balloonsTargetCountText');
    const balloonGameFeedbackEl = document.getElementById('balloonGameFeedback');

    // --- Configurações do Jogo de Balões (se aplicável) ---
    const TOTAL_BALLOONS_TO_POP = 10; // Quantos balões o usuário precisa estourar
    const MAX_ACTIVE_BALLOONS = 6;   // Máximo de balões na tela ao mesmo tempo
    const BALLOON_SPAWN_INTERVAL = 1200; // Intervalo para tentar criar um novo balão (em ms)
    const BALLOON_COLORS = ['#FF69B4', '#C71585', '#FFB6C1', '#DB7093', '#FF1493', '#FFC0CB']; // Novas cores pink/fúcsia

    let balloonsPopped = 0;
    let mainObjectiveAchieved = false; // Nova flag para controlar a revelação principal
    let balloonSpawnTimer;

    // --- Inicialização do Jogo de Balões ---
    if (balloonGameSection && balloonsToPopTargetTextEl && balloonsTargetCountTextEl && balloonsPoppedCountTextEl) {
        function initBalloonGame() {
            balloonsToPopTargetTextEl.textContent = TOTAL_BALLOONS_TO_POP;
            balloonsTargetCountTextEl.textContent = TOTAL_BALLOONS_TO_POP;
            updatePoppedCountDisplay();
            mainObjectiveAchieved = false; // Reseta a flag ao iniciar/reiniciar
            balloonSpawnTimer = setInterval(spawnBalloon, BALLOON_SPAWN_INTERVAL);
        }
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
            revealMainContent(); // Nome mais genérico, já que pode não ser só detalhes da festa
        }
    }

    function updatePoppedCountDisplay() {
        if (balloonsPoppedCountTextEl) {
            balloonsPoppedCountTextEl.textContent = balloonsPopped;
        }
    }

    function revealMainContent() { // Função para revelar o conteúdo principal após o jogo
        mainObjectiveAchieved = true; // Marca que o objetivo principal foi alcançado

        if (balloonGameFeedbackEl) {
            balloonGameFeedbackEl.textContent = 'Parabéns! Você conseguiu!';
            balloonGameFeedbackEl.className = 'feedback success';
        }

        // Esconde a seção do jogo e mostra os detalhes da festa
        if(balloonGameSection) balloonGameSection.classList.add('hidden'); // Ou style.display = 'none'

        detalhesFesta.classList.remove('hidden');
        detalhesFesta.style.display = 'block'; // Garante visibilidade

        // Os balões continuarão a ser gerados e poderão ser estourados
        // O balloonSpawnTimer NÃO é limpo aqui
        // O vídeo NÃO é iniciado aqui, pois agora ele depende do clique no presente.
    }

    // --- Lógica para o Presente/Vídeo ---
    if (imagemDoPresente && areaPresente && videoWrapper && videoAniversario) {
        imagemDoPresente.addEventListener('click', () => {
            // Esconde a área do presente (imagem e texto de incentivo)
            areaPresente.style.display = 'none';
            
            // Mostra o contêiner do vídeo
            videoWrapper.style.display = 'block';
            
            // Tira o mudo do vídeo
            videoAniversario.muted = false;
            
            // Tenta reproduzir o vídeo.
            // Como o atributo 'autoplay' foi removido da tag <video> no HTML,
            // o vídeo só começará a tocar agora, após este clique.
            // A linha 'videoAniversario.muted = false;' acima garante que ele toque com som.
            videoAniversario.play().catch(error => {
                console.error("Erro ao tentar reproduzir o vídeo após clique no presente:", error);
                // Navegadores podem ter políticas estritas sobre autoplay com som.
                // Como isso ocorre após uma interação do usuário (clique), geralmente é permitido.
                // Se houver problemas, os controles do vídeo (<video controls>)
                // permitirão que o usuário dê play manualmente.
            });
        });
    } else {
        // Log para ajudar a identificar se algum elemento do presente/vídeo não foi encontrado
        console.warn('Não foi possível inicializar a funcionalidade do presente/vídeo. Elementos ausentes:');
        if (!imagemDoPresente) console.warn('- imagemDoPresente não encontrada');
        if (!areaPresente) console.warn('- areaPresente não encontrado');
        if (!videoWrapper) console.warn('- videoWrapper não encontrado');
        if (!videoAniversario) console.warn('- videoAniversario não encontrado');
    }

    // --- Inicia o jogo de balões (se a seção existir) ---
    if (balloonGameSection) { // Garante que a seção do jogo exista antes de iniciar
        initBalloonGame();
    }
});
