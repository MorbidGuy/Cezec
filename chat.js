document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('chat-widget')) {
        const widgetHTML = `
            <div id="chat-widget" aria-live="polite">
                <div class="chat-header">
                    <span>Atendimento Cezec</span>
                    <button id="close-chat" type="button" aria-label="Fechar">×</button>
                </div>
                <div class="chat-body" role="log"></div>
                <div id="chat-input-area" class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Digite sua mensagem..." aria-label="Mensagem">
                    <button id="send-chat-message" type="button" aria-label="Enviar">Enviar</button>
                </div>
            </div>
        `
        document.body.insertAdjacentHTML('beforeend', widgetHTML)
    }

    const chatWidget = document.getElementById('chat-widget')
    const openChatBtn = document.getElementById('whatsapp-float') || document.querySelector('.whatsapp-float')
    const closeChatBtn = document.getElementById('close-chat')
    const chatBody = chatWidget.querySelector('.chat-body')
    const chatInput = document.getElementById('chat-input')
    const sendMsgBtn = document.getElementById('send-chat-message') || document.getElementById('send-btn')
    const inputArea = document.getElementById('chat-input-area')

    if (chatWidget) chatWidget.style.display = 'none'
    if (!openChatBtn) return

    const config = {
        WHATSAPP_URL: 'https://wa.me/5511958346854',
        DONATIONS_URL: 'doacoes.html',
        MAX_MESSAGES_IN_VIEW: 8,
        MAX_CONTEXT_MESSAGES: 10, // Keeps AI context from growing too large
        AI_TIMEOUT_MS: 8000, // 8 segundos de limite para IA
    }

    let chatIsOpen = false
    const context = []
    let inputLocked = false

    const initialState = {
        text: 'Olá! Sou o assistente do Cezec. Escolha uma opção para eu te ajudar rapidamente:',
        options: ['Nossos Serviços', 'Agendar', 'Endereço e Horários', 'Doações', 'Falar com atendente']
    }

    const lockInput = (lock = true) => {
        inputLocked = lock
        if (chatInput) chatInput.disabled = lock
        if (sendMsgBtn) sendMsgBtn.disabled = lock
    }

    const createMessageElement = (text, sender) => {
        const messageDiv = document.createElement('div')
        messageDiv.classList.add('chat-message', `${sender}-message`)
        messageDiv.textContent = text
        return messageDiv
    }

    const showTypingIndicator = () => {
        const typingDiv = document.createElement('div')
        typingDiv.classList.add('chat-message', 'bot-message')
        typingDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>'
        chatBody.appendChild(typingDiv)
        chatBody.scrollTop = chatBody.scrollHeight
        return typingDiv
    }

    const localBrainRules = [
        { keywords: /^(oi|ol[aá]|bom dia|boa tarde|boa noite)/i, response: { text: 'Olá! Posso te informar sobre nossos serviços, agendamentos ou doações. Como posso ajudar?' } },
        { keywords: /(servi[cç]os|o que fazem|trabalhos|buzios|banho|banhos)/i, response: { text: 'Oferecemos Jogo de Búzios, Banhos de Ervas e trabalhos espirituais. Deseja agendar ou saber preços?', options: ['Agendar', 'Preços', 'Voltar ao início'] } },
        { keywords: /(agend|marcar|consulta|pre[cç]os)/i, response: { text: 'Para agendamentos, valores ou falar com um atendente, por favor entre em contato pelo WhatsApp. Deseja abrir agora?', actions: [{ label: 'Abrir WhatsApp', url: config.WHATSAPP_URL }] } },
        { keywords: /(falar|atendente|humano|pessoa|zap|whatsapp)/i, response: { text: 'Para falar com um atendente, por favor entre em contato pelo WhatsApp. Deseja abrir agora?', actions: [{ label: 'Abrir WhatsApp', url: config.WHATSAPP_URL }] } },
        { keywords: /(endere[cç]|local|onde|hor[aá]rio)/i, response: { text: 'Atualmente nosso atendimento é realizado principalmente via WhatsApp. Entre em contato por lá para mais detalhes.' } },
        { keywords: /(doa|pix|doa[cç][ãa]o|contribui)/i, response: { text: 'Você pode fazer doações via PIX. Veja o QR Code em nossa página de doações.', options: ['Ver Página de Doações'] } },
        { keywords: /(obrigad|valeu|gratid)/i, response: { text: 'Por nada! Fico feliz em ajudar. Se precisar de mais algo, é só chamar.' } },
    ]

    const localBrain = (text) => {
        const t = (text || '').toLowerCase()
        for (const rule of localBrainRules) {
            if (rule.keywords.test(t)) {
                return rule.response
            }
        }
        return null
    }

    const getProxyUrlFromMeta = () => {
        const m = document.querySelector('meta[name="ai-proxy"]')
        return m ? m.getAttribute('content') : null
    }

    const callRemoteAI = async (prompt) => {
        const proxy = getProxyUrlFromMeta() || (window.AI_PROXY_URL || null)
        if (!proxy) return null
        try {
            const controller = new AbortController()
            const id = setTimeout(() => controller.abort(), config.AI_TIMEOUT_MS)
            
            const r = await fetch(proxy, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ prompt, context }),
                signal: controller.signal
            })
            clearTimeout(id)
            if (!r.ok) return null
            const j = await r.json()
            return j.reply || (j.choices && j.choices[0] && (j.choices[0].message && j.choices[0].message.content || j.choices[0].text)) || null
        } catch (e) {
            return null
        }
    }

    const getReply = async (message) => {
        const proxyReply = await callRemoteAI(message)
        if (proxyReply) return { text: proxyReply }

        const local = localBrain(message)
        if (local) return local

        return { text: 'Desculpe, não entendi. Posso te mostrar as opções principais novamente?', options: ['Nossos Serviços', 'Falar com atendente', 'Voltar ao início'] }
    }

    const optionActions = [
        {
            keywords: ['voltar'],
            action: () => {
                chatBody.innerHTML = '';
                context.length = 0; // Limpa o contexto para não confundir a IA
                setTimeout(() => renderBotResponse(initialState), 120);
            }
        },
        {
            keywords: ['agendar', 'whatsapp', 'falar', 'atendente', 'abrir'],
            action: () => {
                lockInput(true);
                const hint = createMessageElement('Abrindo WhatsApp...', 'bot');
                chatBody.appendChild(hint);
                pruneMessages();
                window.open(config.WHATSAPP_URL, '_blank');
                setTimeout(() => {
                    clearConversation(true);
                    lockInput(false);
                }, 900);
            }
        },
        {
            keywords: ['doa', 'pix', 'doações', 'doacoes', 'página de doações'],
            action: () => {
                const hint = createMessageElement('Abrindo página de doações...', 'bot');
                chatBody.appendChild(hint);
                pruneMessages();
                window.open(config.DONATIONS_URL, '_self');
                setTimeout(() => clearConversation(true), 700);
            }
        }
    ];

    const processOption = async (opt) => {
        const low = (opt || '').toLowerCase();

        for (const rule of optionActions) {
            if (rule.keywords.some(kw => low.includes(kw))) {
                rule.action();
                return;
            }
        }

        // Caso padrão: envie para o fluxo (pode acionar localBrain ou proxy)
        handleUserMessage(opt)
    }

    const pruneMessages = () => {
        const msgs = Array.from(chatBody.querySelectorAll('.chat-message'))
        while (msgs.length > config.MAX_MESSAGES_IN_VIEW) {
            const first = msgs.shift()
            if (first) first.remove()
        }
    }

    const renderBotResponse = (resp) => {
        if (!resp) return
        const botMessage = createMessageElement(resp.text, 'bot')
        chatBody.appendChild(botMessage)
        pruneMessages()

        if (resp.options) {
            const optionsContainer = document.createElement('div')
            optionsContainer.classList.add('chat-options')
            resp.options.forEach(opt => {
                const b = document.createElement('button')
                b.classList.add('chat-option-btn')
                b.textContent = opt
                b.addEventListener('click', () => {
                    const um = createMessageElement(opt, 'user')
                    chatBody.appendChild(um)
                    pruneMessages()
                    processOption(opt)
                })
                optionsContainer.appendChild(b)
            })
            chatBody.appendChild(optionsContainer)
        }

        if (resp.actions) {
            const actionsContainer = document.createElement('div')
            actionsContainer.classList.add('chat-actions')
            resp.actions.forEach(a => {
                const b = document.createElement('button')
                b.classList.add('chat-action-btn')
                b.textContent = a.label
                b.addEventListener('click', async () => {
                    // show immediate feedback, then run action and auto-clean
                    const hint = createMessageElement('Abrindo...', 'bot')
                    chatBody.appendChild(hint)
                    pruneMessages()
                    window.open(a.url, '_blank')
                    setTimeout(() => {
                        clearConversation(true)
                    }, 900)
                })
                actionsContainer.appendChild(b)
            })
            chatBody.appendChild(actionsContainer)
        }

        chatBody.scrollTop = chatBody.scrollHeight
    }

    const handleUserMessage = async (text) => {
        if (!text) return
        if (inputLocked) return
        lockInput(true)

        context.push({ role: 'user', content: text })
        // Prune context to avoid it growing too large
        if (context.length > config.MAX_CONTEXT_MESSAGES) {
            // Remove the oldest user/assistant pair
            context.splice(0, 2)
        }

        const typing = showTypingIndicator()
        const reply = await getReply(text)
        if (typing && typing.parentNode) chatBody.removeChild(typing)
        if (reply?.text) {
            context.push({ role: 'assistant', content: reply.text })
            renderBotResponse(reply)
        }
        // pequena folga antes de liberar input
        setTimeout(() => lockInput(false), 250)
    }

    const clearConversation = (close = false) => {
        chatBody.innerHTML = ''
        if (close) {
            chatWidget.style.display = 'none'
            if (openChatBtn) openChatBtn.style.display = 'flex'
            chatIsOpen = false
        }
    }

    const toggleChat = (e) => {
        if (e) e.preventDefault()
        chatIsOpen = !chatIsOpen
        chatWidget.style.display = chatIsOpen ? 'flex' : 'none'
        if (openChatBtn) openChatBtn.style.display = chatIsOpen ? 'none' : 'flex'
        if (chatIsOpen) {
            if (chatInput) setTimeout(() => chatInput.focus(), 100)
            if (chatBody.children.length === 0) renderBotResponse(initialState)
        }
    }

    openChatBtn.addEventListener('click', toggleChat)
    if (closeChatBtn) closeChatBtn.addEventListener('click', toggleChat)

    const submitInput = () => {
        const text = (chatInput && chatInput.value || '').trim()
        if (!text) return
        if (inputLocked) return
        const userMessage = createMessageElement(text, 'user')
        chatBody.appendChild(userMessage)
        if (chatInput) chatInput.value = ''
        pruneMessages()
        handleUserMessage(text)
    }

    if (sendMsgBtn) sendMsgBtn.addEventListener('click', submitInput)
    if (chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') submitInput() })
})