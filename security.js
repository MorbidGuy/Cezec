(function(){

// =============================
// CONFIGURAÇÃO
// =============================

const _consoleMsg = "🚫 Acesso negado.\nSem acesso ou privilégios para dar continuidade.";
const _overlayMsg = "Acesso Negado: tentativa de atividades suspeitas detectada.";
let _locked = false;

// =============================
// FUNÇÃO DE BLOQUEIO VISUAL
// =============================

function _deny(){
    if(_locked) return;
    _locked = true;

    const overlay = document.createElement("div");
    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:#000;
        color:#ff0000;
        display:flex;
        align-items:center;
        justify-content:center;
        font-family:monospace;
        font-size:22px;
        text-align:center;
        z-index:999999;
    `;
    overlay.innerText = _overlayMsg;
    document.body.appendChild(overlay);
}

// =============================
// MENSAGEM NO CONSOLE
// =============================

function _consoleWarning(){
    console.clear();
    console.log("%c" + _consoleMsg,
        "color:red;font-size:16px;font-weight:bold;");
}

_consoleWarning();

// =============================
// BLOQUEIO DE ATALHOS
// =============================

document.addEventListener("contextmenu", e => {
    e.preventDefault();
    _deny();
});

document.addEventListener("keydown", function(e){

    if(e.key === "F12"){
        e.preventDefault();
        _deny();
    }

    if(e.ctrlKey && e.shiftKey &&
       ["I","J","C"].includes(e.key.toUpperCase())){
        e.preventDefault();
        _deny();
    }

    if(e.ctrlKey &&
       ["u","s","p","f","a","c"].includes(e.key.toLowerCase())){
        e.preventDefault();
        _deny();
    }
});

// =============================
// DETECTOR DEVTOOLS (tamanho)
// =============================

setInterval(function(){
    if(window.outerWidth - window.innerWidth > 160 ||
       window.outerHeight - window.innerHeight > 160){
        _deny();
    }
}, 1000);

// =============================
// ANTI DEBUGGER (pausa)
// =============================

setInterval(function(){
    const start = performance.now();
    debugger;
    const end = performance.now();

    if(end - start > 100){
        _deny();
    }
}, 1000);

// =============================
// DETECTOR DE CONSOLE
// =============================

(function(){
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function(){
            _consoleWarning();
            _deny();
        }
    });

    setInterval(function(){
        console.log(element);
    }, 1000);
})();

})();