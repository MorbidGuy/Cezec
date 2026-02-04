/**
 * Script de Proteção de Interface - v2.0
 * Finalidade: Dificultar cópia e inspeção básica.
 */
(function() {
    'use strict';

    // 1. Bloqueio de Menu de Contexto (Clique Direito)
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // 2. Bloqueio de Atalhos de Teclado
    document.addEventListener('keydown', (e) => {
        // Bloqueia F12
        if (e.key === 'F12') {
            e.preventDefault();
        }

        // Bloqueia Ctrl+Shift+I, J, C (DevTools)
        if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
            e.preventDefault();
        }

        // Bloqueia Ctrl+U (Ver Código Fonte) e Ctrl+S (Salvar)
        if (e.ctrlKey && ['u', 's'].includes(e.key.toLowerCase())) {
            e.preventDefault();
        }

        // Bloqueia Ctrl+C e Ctrl+V (Opcional - remova se quiser permitir copiar)
        if (e.ctrlKey && ['c', 'v', 'a'].includes(e.key.toLowerCase())) {
            e.preventDefault();
        }
    });

    // 3. Detecção de Debugger (Anti-Inspecionar)
    // Se o console for aberto, o 'debugger' causa um lag que limpa a tela
    setInterval(() => {
        const tempoInicial = performance.now();
        debugger; 
        const tempoFinal = performance.now();
        
        if (tempoFinal - tempoInicial > 100) {
            console.clear();
            console.warn("%cACESSO RESTRITO", "color: red; font-size: 20px; font-weight: bold;");
        }
    }, 1000);

    // 4. Bloqueio de Seleção e Arraste (Visual)
    document.addEventListener('selectstart', (e) => e.preventDefault());
    document.addEventListener('dragstart', (e) => e.preventDefault());

    // 5. Injeção de CSS para reforçar o bloqueio de seleção
    const style = document.createElement('style');
    style.textContent = `
        /* Desativa seleção de texto em todo o corpo */
        body {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        /* Protege imagens de serem arrastadas ou salvas facilmente */
        img {
            pointer-events: none;
            -webkit-user-drag: none;
        }
    `;
    document.head.appendChild(style);

    console.clear();
})();