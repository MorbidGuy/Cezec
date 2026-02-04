(function() {
    'use strict';

    document.addEventListener("DOMContentLoaded", function() {
        const CONFIG = {
            WHATSAPP_NUMBER: "5511958346854",
            TYPING_DELAY: 1500,
        };

        const elements = {
            widget: document.getElementById('chat-widget'),
            toggle: document.getElementById('chat-toggle'),
            close: document.getElementById('close-chat'),
            body: document.getElementById('chat-body'),
            inputArea: document.getElementById('chat-input-area'),
            input: document.getElementById('chat-input'),
            sendBtn: document.getElementById('send-btn')
        };

        let state = {
            step: 0,
            selectedTopic: "",
            userName: "",
            isTyping: false
        };

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function getGreeting() {
            const hour = new Date().getHours();
            if (hour < 12) return "Bom dia";
            if (hour < 18) return "Boa tarde";
            return "Boa noite";
        }

        function scrollToBottom() {
            elements.body.scrollTop = elements.body.scrollHeight;
        }

        elements.toggle.addEventListener('click', () => {
            if (elements.widget.style.display === 'flex') {
                elements.widget.style.display = 'none';
            } else {
                elements.widget.style.display = 'flex';
                if (elements.body.innerHTML.trim() === "") initChat();
            }
        });

        elements.close.addEventListener('click', () => {
            elements.widget.style.display = 'none';
            setTimeout(() => {
                elements.body.innerHTML = '';
                elements.inputArea.style.display = 'none';
                elements.input.value = '';
                state = { step: 0, selectedTopic: "", userName: "", isTyping: false };
            }, 300); 
        });

        function addMessage(text, sender) {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('chat-message', sender === 'bot' ? 'bot-message' : 'user-message');
            msgDiv.innerHTML = sender === 'user' ? escapeHtml(text) : text;
            elements.body.appendChild(msgDiv);
            scrollToBottom();
        }

        function showTyping() {
            if (state.isTyping) return;
            state.isTyping = true;
            const typingDiv = document.createElement('div');
            typingDiv.id = 'typing-indicator';
            typingDiv.classList.add('chat-message', 'bot-message');
            typingDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
            elements.body.appendChild(typingDiv);
            scrollToBottom();
        }

        function removeTyping() {
            const typingDiv = document.getElementById('typing-indicator');
            if (typingDiv) typingDiv.remove();
            state.isTyping = false;
        }

        function initChat() {
            addMessage(`${getGreeting()}! Bem-vindo à Casa Espiritual Zé Corisco. Como podemos te ajudar hoje?`, 'bot');
            const optionsDiv = document.createElement('div');
            optionsDiv.classList.add('chat-options');
            
            const options = [
                { label: "📅 Agendar Consulta", value: "Agendamento" },
                { label: "🕯️ Trabalhos Espirituais", value: "Trabalhos" },
                { label: "❓ Dúvidas Gerais", value: "Dúvidas" }
            ];

            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.classList.add('chat-option-btn');
                btn.innerText = opt.label;
                btn.onclick = () => handleOption(opt);
                optionsDiv.appendChild(btn);
            });
            elements.body.appendChild(optionsDiv);
            scrollToBottom();
        }

        function handleOption(option) {
            addMessage(option.label, 'user');
            state.selectedTopic = option.value;
            
            showTyping();
            setTimeout(() => {
                removeTyping();
                addMessage("Entendi. Para facilitar nosso atendimento, qual é o seu nome?", 'bot');
                elements.inputArea.style.display = 'flex';
                elements.input.focus();
                state.step = 1;
            }, CONFIG.TYPING_DELAY);
        }

        function handleInput() {
            if (state.isTyping) return;
            const text = elements.input.value.trim();
            if (!text) return;

            addMessage(text, 'user');
            elements.input.value = '';
            elements.inputArea.style.display = 'none';
            state.userName = text;

            showTyping();
            setTimeout(() => {
                removeTyping();
                const safeName = escapeHtml(state.userName);
                const message = `Olá! Meu nome é ${state.userName}. Gostaria de falar sobre ${state.selectedTopic}.`;
                const link = `https://api.whatsapp.com/send?phone=${CONFIG.WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
                
                addMessage(`Obrigado, ${safeName}! Clique no botão abaixo para iniciar a conversa no WhatsApp:`, 'bot');
                
                const linkBtn = document.createElement('a');
                linkBtn.href = link;
                linkBtn.target = "_blank";
                linkBtn.className = 'cta-button'; 
                linkBtn.style.display = 'block';
                linkBtn.style.marginTop = '10px';
                linkBtn.style.textAlign = 'center';
                linkBtn.style.color = '#121212';
                linkBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Iniciar Conversa';
                
                elements.body.appendChild(linkBtn);
                scrollToBottom();
            }, CONFIG.TYPING_DELAY);
        }

        elements.sendBtn.addEventListener('click', handleInput);
        elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleInput();
        });
    });
})();