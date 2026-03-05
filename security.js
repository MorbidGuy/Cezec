(function(){

// =============================
// CONFIGURAÇÃO
// =============================

const _consoleMsg = "🚫 Acesso negado.\nSem acesso ou privilégios para dar continuidade.";
const _overlayMsg = "Acesso Negado: tentativa de atividades suspeitas detectada.";
let _locked = false;
let _intervals = [];

// =============================
// FUNÇÃO DE BLOQUEIO VISUAL
// =============================

function _deny(){
    if(_locked) return;
    _locked = true;
    
    // Parar verificações para economizar CPU após bloqueio
    _intervals.forEach(i => clearInterval(i));

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
        pointer-events: all !important;
    `;
    overlay.innerText = _overlayMsg;
    document.body.appendChild(overlay);

    try {
        const placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#000"/>' +
            '<text x="50%" y="50%" fill="#fff" font-size="18" text-anchor="middle" dominant-baseline="middle">Imagem protegida</text></svg>'
        );
        document.querySelectorAll('img').forEach(img => {
            try{
                if(!img.dataset._protected){
                    img.dataset._protected = '1';
                    img.dataset._orig = img.src || '';
                    img.src = placeholder;
                    img.srcset = '';
                    img.alt = 'imagem removida';
                }
            }catch(e){}
        });

        document.querySelectorAll('script').forEach(s => {
            try{
                s.type = 'javascript/blocked';
                if(s.src) s.removeAttribute('src');
                try{ s.textContent = ''; }catch(e){}
            }catch(e){}
        });

        document.querySelectorAll('link[rel="stylesheet"], style').forEach(st => {
            try{ st.disabled = true; }catch(e){}
        });

        document.querySelectorAll('*').forEach(el => {
            try{
                [ ...el.attributes ].forEach(attr => {
                    if(attr && attr.name && attr.name.indexOf('on') === 0){
                        el.removeAttribute(attr.name);
                    }
                });
            }catch(e){}
        });
    } catch (e) {
    }
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

const idSize = setInterval(function(){
    if(window.outerWidth - window.innerWidth > 160 ||
       window.outerHeight - window.innerHeight > 160){
        _deny();
    }
}, 1000);
_intervals.push(idSize);

// =============================
// ANTI DEBUGGER (pausa)
// =============================

const idDebug = setInterval(function(){
    const start = performance.now();
    debugger;
    const end = performance.now();

    if(end - start > 100){
        _deny();
    }
}, 1000);
_intervals.push(idDebug);

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

    const idLog = setInterval(function(){
        console.log(element);
    }, 1000);
    _intervals.push(idLog);
})();

})();