// Espera o conteúdo do HTML ser completamente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', function() {
    // --- PONTOS DE CUSTOMIZAÇÃO ---
    const RESPOSTA_CORRETA = "mapa"; // Mude para a resposta da sua charada/brincadeira.
    const MENSAGEM_SUCESSO = "Correto! 🎉 Você é demais!";
    const MENSAGEM_ERRO_DICA = "Ops, não foi dessa vez! Tente novamente. Dica: é algo que você usa para se localizar em viagens.";
    // --- FIM DOS PONTOS DE CUSTOMIZAÇÃO ---

    const botaoVerificar = document.getElementById('botaoVerificar');
    const inputResposta = document.getElementById('respostaEnigma');
    const detalhesFesta = document.getElementById('detalhesFesta');
    const feedbackElement = document.getElementById('feedback');
    const videoAniversario = document.getElementById('videoAniversario');

    function verificarResposta() {
        const respostaUsuario = inputResposta.value.trim().toLowerCase(); 

        // Limpa classes de feedback anteriores
        feedbackElement.classList.remove('success', 'error');

        if (respostaUsuario === RESPOSTA_CORRETA) {
            detalhesFesta.classList.remove('hidden');
            feedbackElement.textContent = MENSAGEM_SUCESSO;
            feedbackElement.classList.add('success');
            if (videoAniversario) {
                // Tenta reproduzir o vídeo
                videoAniversario.play().catch(error => {
                    // O autoplay pode ser bloqueado pelo navegador mesmo com 'muted'
                    // O usuário ainda pode clicar no play manualmente através dos controles
                    console.warn("Autoplay do vídeo foi impedido pelo navegador:", error);
                });
            }
        } else {
            detalhesFesta.classList.add('hidden'); // Garante que os detalhes fiquem escondidos se errar
            feedbackElement.textContent = MENSAGEM_ERRO_DICA;
            feedbackElement.classList.add('error');
            inputResposta.focus(); // Coloca o foco de volta no campo de resposta
            inputResposta.select(); // Seleciona o texto para facilitar a correção
        }
    }

    // Adiciona event listeners apenas se os elementos existirem
    if (botaoVerificar && inputResposta && detalhesFesta && feedbackElement && videoAniversario) {
        botaoVerificar.addEventListener('click', verificarResposta);

        inputResposta.addEventListener('keypress', function(event) {
            // Verifica se a tecla pressionada foi "Enter" (código 13)
            if (event.key === 'Enter' || event.keyCode === 13) {
                verificarResposta();
            }
        });
    } else {
        console.error("Um ou mais elementos essenciais do convite não foram encontrados no DOM.");
    }

    // --- EFEITO DE BALÕES FLUTUANTES ---
    function createBalloonEffect() {
        const balloonColors = [
            'rgba(255, 105, 180, 0.7)', // Rosa
            'rgba(135, 206, 250, 0.7)', // Azul claro
            'rgba(255, 215, 0, 0.7)',   // Dourado
            'rgba(144, 238, 144, 0.7)', // Verde claro
            'rgba(255, 160, 122, 0.7)'  // Salmão claro
        ];

        function createSingleBalloon() {
            const balloon = document.createElement('div');
            balloon.classList.add('balloon');

            // Posição horizontal aleatória
            balloon.style.left = Math.random() * 95 + 'vw'; // vw = viewport width

            // Duração da animação aleatória (velocidade)
            const animationDuration = Math.random() * 8 + 7; // Entre 7 e 15 segundos
            balloon.style.animationDuration = animationDuration + 's';

            // Delay aleatório para não começarem todos juntos
            // balloon.style.animationDelay = Math.random() * 2 + 's'; // Opcional: se quiser um delay inicial

            // Cor aleatória
            balloon.style.backgroundColor = balloonColors[Math.floor(Math.random() * balloonColors.length)];

            document.body.appendChild(balloon);

            // Remove o balão do DOM após a animação terminar para não sobrecarregar
            balloon.addEventListener('animationend', function() {
                balloon.remove();
            });
        }

        setInterval(createSingleBalloon, 1500); // Cria um novo balão a cada 1.5 segundos
    }
    createBalloonEffect(); // Inicia o efeito dos balões

    // --- EFEITO DE FOGOS DE ARTIFÍCIO ---
    function createFireworksEffect() {
        const fireworkColors = [
            '#FFD700', // Gold
            '#FF4500', // OrangeRed
            '#FF69B4', // HotPink (usado no tema)
            '#00FFFF', // Aqua
            '#7FFF00', // Chartreuse
            '#FFFFFF'  // White
        ];

        function launchFirework() {
            const startX = Math.random() * window.innerWidth;
            const endY = Math.random() * (window.innerHeight / 2); // Explode na metade superior da tela
            const duration = Math.random() * 2 + 1; // Duração da subida: 1 a 3 segundos

            const rocket = document.createElement('div');
            rocket.classList.add('firework-particle'); // Reutiliza a classe para a subida
            rocket.style.left = startX + 'px';
            rocket.style.bottom = '0px';
            rocket.style.width = '3px';
            rocket.style.height = '10px';
            rocket.style.backgroundColor = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
            
            document.body.appendChild(rocket);

            // Animação de subida simples com JS (poderia ser CSS @keyframes rise também)
            rocket.animate([
                { bottom: '0px', opacity: 1 },
                { bottom: `${window.innerHeight - endY}px`, opacity: 0.5 }
            ], {
                duration: duration * 1000,
                easing: 'ease-out'
            }).onfinish = () => {
                rocket.remove();
                explode(startX, window.innerHeight - endY); // Posição X da subida, Posição Y da explosão
            };
        }

        function explode(x, y) {
            const particleCount = 50 + Math.floor(Math.random() * 50); // Entre 50 e 100 partículas

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('firework-particle');
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.width = (Math.random() * 3 + 2) + 'px'; // Tamanho 2px a 5px
                particle.style.height = particle.style.width;
                particle.style.backgroundColor = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];

                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 100 + 50; // Distância da explosão
                const particleDuration = Math.random() * 1000 + 800; // Duração da partícula: 0.8s a 1.8s

                document.body.appendChild(particle);

                particle.animate([
                    { transform: `translate(0, 0) scale(1)`, opacity: 1 },
                    { transform: `translate(${Math.cos(angle) * speed}px, ${Math.sin(angle) * speed}px) scale(0)`, opacity: 0 }
                ], {
                    duration: particleDuration,
                    easing: 'ease-out'
                }).onfinish = () => particle.remove();
            }
        }
        setInterval(launchFirework, 2500); // Lança um novo fogo de artifício a cada 2.5 segundos
    }
    createFireworksEffect(); // Inicia o efeito dos fogos
});