document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('chat-widget')) {
        const widgetHTML = `
            <div id="chat-widget">
                <div class="chat-header">
                    <span>Atendimento Cezec</span>
                    <button id="close-chat" type="button" aria-label="Fechar">×</button>
                </div>
                <div class="chat-body"></div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Digite sua mensagem...">
                    <button id="send-chat-message" type="button" aria-label="Enviar">➤</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    const chatWidget = document.getElementById('chat-widget');
    const openChatBtn = document.getElementById('whatsapp-float') || document.querySelector('.whatsapp-float');
    const closeChatBtn = document.getElementById('close-chat');
    const chatBody = chatWidget.querySelector('.chat-body');
    const chatInput = document.getElementById('chat-input');
    const sendMsgBtn = document.getElementById('send-chat-message') || document.getElementById('send-btn');
    const inputArea = document.getElementById('chat-input-area');

    if (!openChatBtn) return;

    let chatIsOpen = false;
    let awaitingInputFor = null;

    const chatFlow = {
        start: {
            text: 'Olá! Sou o assistente virtual do Cezec. Como posso te ajudar hoje?',
            options: [
                { text: 'Nossos Serviços', next: 'servicos' },
                { text: 'Agendar uma consulta', next: 'agendamento' },
                { text: 'Endereço e Horários', next: 'endereco' },
                { text: 'Tirar Dúvidas', next: 'tirar_duvidas' },
            ],
            isInput: false,
        },
        servicos: {
            text: 'Oferecemos diversos trabalhos espirituais, como consultas com Búzios, banhos de ervas e trabalhos para abertura de caminhos. Qual deles te interessa mais?',
            options: [
                { text: 'Jogo de Búzios', next: 'buzios' },
                { text: 'Banhos de Ervas', next: 'banhos' },
                { text: 'Voltar ao início', next: 'start' },
            ],
            isInput: false,
        },
        agendamento: {
            text: 'Para agendar uma consulta, por favor, nos chame diretamente no WhatsApp para um atendimento personalizado.',
            options: [
                { text: 'Abrir WhatsApp', action: () => window.open('https://wa.me/5511958346854', '_blank') },
                { text: 'Voltar ao início', next: 'start' },
            ],
            isInput: false,
        },
        endereco: {
            text: 'No momento estamos de mudanças, e não temos um endereço fixo. Nosso atendimento é feito principalmente via WhatsApp. Para mais informações entre em contato conosco por lá!',
            options: [{ text: 'Voltar ao início', next: 'start' }],
            isInput: false,
        },
        buzios: {
            text: 'A consulta com o Jogo de Búzios é um momento de orientação e clareza. O agendamento é feito pelo WhatsApp.',
            options: [
                { text: 'Agendar agora', action: () => window.open('https://wa.me/5511958346854', '_blank') },
                { text: 'Ver outros serviços', next: 'servicos' },
            ],
            isInput: false,
        },
        banhos: {
            text: 'Nossos banhos de ervas são preparados para limpeza e energização. Para saber mais, fale conosco no WhatsApp.',
            options: [
                { text: 'Falar no WhatsApp', action: () => window.open('https://wa.me/5511958346854', '_blank') },
                { text: 'Voltar ao início', next: 'start' },
            ],
            isInput: false,
        },
        tirar_duvidas: {
            text: 'Com certeza! Para que eu possa te direcionar da melhor forma, me diga primeiro como gostaria de ser chamado(a).',
            isInput: true,
            next: 'abrir_whatsapp_duvida'
        },
        abrir_whatsapp_duvida: {
            text: 'Obrigado, {{name}}! Para um atendimento personalizado e para tirar todas as suas dúvidas, por favor, nos chame diretamente no WhatsApp. Estaremos te esperando!',
            options: [
                { text: 'Abrir WhatsApp', action: 'open_whatsapp_duvida' },
                { text: 'Voltar ao início', next: 'start' }
            ],
            isInput: false
        },
    };


    const toggleChat = (e) => {
        if (e) e.preventDefault();
        chatIsOpen = !chatIsOpen;
        chatWidget.style.display = chatIsOpen ? 'flex' : 'none';
        openChatBtn.style.display = chatIsOpen ? 'none' : 'flex';
        if (chatIsOpen && chatBody.children.length === 0) {
            navigateTo('start');
        }
    };

    const createMessageElement = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', `${sender}-message`);
        messageDiv.textContent = text;
        return messageDiv;
    };

    const showTypingIndicator = () => {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('chat-message', 'bot-message');
        typingDiv.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
        chatBody.appendChild(typingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
        return typingDiv;
    };

    const navigateTo = (nodeKey, params = {}) => {
        const node = chatFlow[nodeKey];
        if (!node) return;

        if (nodeKey === 'start') {
            chatBody.innerHTML = '';
        }

        const typingIndicator = showTypingIndicator();

        setTimeout(() => {
            chatBody.removeChild(typingIndicator);

            let botText = node.text;
            if (params.name) {
                botText = botText.replace('{{name}}', params.name);
            }
            const botMessage = createMessageElement(botText, 'bot');
            chatBody.appendChild(botMessage);

            const oldOptions = chatBody.querySelectorAll('.chat-options');
            oldOptions.forEach(opt => opt.remove());

            if (inputArea) {
                if (node.isInput) {
                    inputArea.style.display = 'flex';
                    if (chatInput) chatInput.focus();
                    awaitingInputFor = node.next;
                } else {
                    inputArea.style.display = 'none';
                    awaitingInputFor = null;
                }
            }

            if (node.options && node.options.length > 0) {
                const optionsContainer = document.createElement('div');
                optionsContainer.classList.add('chat-options');

                node.options.forEach(option => {
                    const optionBtn = document.createElement('button');
                    optionBtn.classList.add('chat-option-btn');
                    optionBtn.textContent = option.text;
                    optionBtn.addEventListener('click', () => {
                        const userMessage = createMessageElement(option.text, 'user');
                        chatBody.appendChild(userMessage);

                        if (option.next) {
                            navigateTo(option.next, params);
                        } else if (option.action === 'open_whatsapp_duvida') {
                            const name = params.name || 'visitante';
                            const message = encodeURIComponent(`Olá! Meu nome é ${name} e gostaria de tirar algumas dúvidas.`);
                            window.open(`https://wa.me/5511958346854?text=${message}`, '_blank');
                        } else if (option.action) {
                            option.action();
                        }
                    });
                    optionsContainer.appendChild(optionBtn);
                });
                chatBody.appendChild(optionsContainer);
            }

            chatBody.scrollTop = chatBody.scrollHeight;
        }, 800);
    };

    openChatBtn.addEventListener('click', toggleChat);
    closeChatBtn.addEventListener('click', toggleChat);

    const handleTextInput = () => {
        if (!chatInput) return;
        const text = chatInput.value.trim();
        if (text) {
            const userMessage = createMessageElement(text, 'user');
            chatBody.appendChild(userMessage);
            chatInput.value = '';
            chatBody.scrollTop = chatBody.scrollHeight;

            if (awaitingInputFor) {
                const nextNodeKey = awaitingInputFor;
                awaitingInputFor = null;
                navigateTo(nextNodeKey, { name: text });
            } else {
                setTimeout(() => {
                    const response = createMessageElement("Desculpe, no momento só consigo responder através das opções.", 'bot');
                    chatBody.appendChild(response);
                    chatBody.scrollTop = chatBody.scrollHeight;
                }, 800);
            }
        }
    };

    if (sendMsgBtn) sendMsgBtn.addEventListener('click', handleTextInput);
    if (chatInput) chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleTextInput();
    });
});