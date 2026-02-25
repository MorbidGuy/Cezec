document.addEventListener("DOMContentLoaded", function() {
    // mark current nav
    try {
        const currentLocation = location.href;
        document.querySelectorAll('.nav-menu li a').forEach(item => {
            if(item.href === currentLocation) item.classList.add('active');
        });
    } catch (e) { }

    // hamburger toggle
    try {
        const hamburger = document.querySelector(".hamburger");
        const navMenu = document.querySelector(".nav-menu");
        if (hamburger && navMenu) {
            hamburger.addEventListener("click", () => {
                hamburger.classList.toggle("active");
                navMenu.classList.toggle("active");
            });
        }
    } catch (e) { }

    // copy phone
    try {
        const btnCopyPhone = document.getElementById("btn-copy-phone");
        if(btnCopyPhone){
            btnCopyPhone.addEventListener("click", () => {
                const phoneText = document.getElementById("phone-text").innerText;
                navigator.clipboard.writeText(phoneText).then(() => {
                    btnCopyPhone.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => btnCopyPhone.innerHTML = '<i class="fas fa-copy"></i>', 2000);
                }).catch(() => alert("Copie o telefone: " + phoneText));
            });
        }
    } catch (e) { }

    // copy pix
    try {
        const btnCopy = document.getElementById("btn-copy");
        if(btnCopy){
            btnCopy.addEventListener("click", () => {
                const pixText = document.getElementById("pix-text").innerText;
                navigator.clipboard.writeText(pixText).then(() => {
                    btnCopy.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => btnCopy.innerHTML = '<i class="fas fa-copy"></i>', 2000);
                }).catch(() => alert("Copie a chave: " + pixText));
            });
        }
    } catch (e) { }

});
