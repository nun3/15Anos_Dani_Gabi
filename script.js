document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica do Enigma ---
    const botaoVerificar = document.getElementById('botaoVerificar');
    const respostaEnigmaInput = document.getElementById('respostaEnigma');
    const feedbackEnigma = document.getElementById('feedback');
    const detalhesFesta = document.getElementById('detalhesFesta');
    const videoAniversario = document.getElementById('videoAniversario');

    // Respostas corretas para o enigma (em minúsculas para facilitar a comparação)
    const respostasCorretasEnigma = ["mapa", "um mapa", "o mapa"];

    if (botaoVerificar) {
        botaoVerificar.addEventListener('click', function() {
            const respostaUsuario = respostaEnigmaInput.value.trim().toLowerCase();

            if (respostasCorretasEnigma.includes(respostaUsuario)) {
                feedbackEnigma.textContent = 'Correto! Revelando os detalhes...';
                feedbackEnigma.className = 'feedback success'; // Use classes para estilização
                detalhesFesta.classList.remove('hidden');
                detalhesFesta.style.display = 'block'; // Garante visibilidade se .hidden usa display:none

                if (videoAniversario) {
                    // O vídeo já tem 'autoplay' e 'muted'.
                    // Se precisar forçar o play após revelação (e já estiver mudo):
                    videoAniversario.play().catch(error => {
                        console.log("Vídeo autoplay pode ter sido bloqueado pelo navegador:", error);
                        // Navegadores podem bloquear autoplay com som. 'muted' ajuda.
                    });
                }
            } else {
                feedbackEnigma.textContent = 'Resposta incorreta. Tente novamente!';
                feedbackEnigma.className = 'feedback error'; // Use classes para estilização
                // Opcional: esconder detalhes se já estiverem visíveis e errar novamente
                // detalhesFesta.classList.add('hidden');
                // detalhesFesta.style.display = 'none';
            }
        });
    }

    // --- Integração com EmailJS ---
    const formMensagens = document.getElementById('formMensagens');
    const formFeedback = document.getElementById('formFeedback'); // Div para feedback do formulário

    if (formMensagens) {
        // IMPORTANTE: Substitua 'YOUR_PUBLIC_KEY' pelo seu Public Key do EmailJS
        // Você encontra em Account > API Keys no painel do EmailJS
        emailjs.init({ publicKey: 'kP9lxh5VvGzdz5HSe' });

        formMensagens.addEventListener('submit', function(event) {
            event.preventDefault(); // Previne o envio padrão do formulário

            formFeedback.textContent = 'Enviando...';
            formFeedback.className = 'feedback info'; // Use classes para estilização

            // IMPORTANTE: Substitua pelos seus IDs do EmailJS
            const serviceID = 'service_iyhdiar'; // Do EmailJS > Email Services
            const templateID = 'template_vnt58lc'; // Do EmailJS > Email Templates

            // Coleta os dados do formulário
            // Os nomes dos campos (ex: nomeConvidado) devem corresponder às variáveis no seu template EmailJS (ex: {{nomeConvidado}})
            const templateParams = {
                nomeConvidado: document.getElementById('nomeConvidado').value,
                emailConvidado: document.getElementById('emailConvidado').value,
                confirmacaoPresenca: document.getElementById('confirmacaoPresenca').value,
                mensagemConvidado: document.getElementById('mensagemConvidado').value,
                // Adicione aqui outros parâmetros se o seu template EmailJS os esperar
                // por exemplo: to_name: "Dani e Gabi" (se seu template tiver {{to_name}})
            };

            emailjs.send(serviceID, templateID, templateParams)
                .then(function(response) {
                   console.log('SUCESSO!', response.status, response.text);
                   formFeedback.textContent = 'Mensagem enviada com sucesso! Obrigado por confirmar.';
                   formFeedback.className = 'feedback success';
                   formMensagens.reset(); // Limpa o formulário
                }, function(error) {
                   console.log('FALHA...', error);
                   formFeedback.textContent = 'Falha ao enviar a mensagem. Por favor, tente novamente ou confirme via WhatsApp.';
                   formFeedback.className = 'feedback error';
                });
        });
    }
});

// Sugestão para seu style.css (adicione ou ajuste conforme seu design)
// .feedback.success { color: green; }
// .feedback.error { color: red; }
// .feedback.info { color: blue; }
// .hidden { display: none !important; } /* Garante que a classe hidden funcione */