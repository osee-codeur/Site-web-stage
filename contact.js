document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();
        
        if (!name || !email || !message) {
            formMessage.textContent = "Veuillez remplir tous les champs.";
            formMessage.style.color = "red";
            return;
        }
        
        alert("Message envoyé avec succès ! Nous vous répondrons bientôt.");
        contactForm.reset();
        formMessage.textContent = "Votre message a été envoyé.";
        formMessage.style.color = "green";
    });
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector("nav ul");

    // Gestion de l'ouverture et de la fermeture du menu
    menuToggle.addEventListener("click", function () {
        navMenu.classList.toggle("active");
    });

    // Empêcher le menu de se cacher lorsque le curseur quitte la nav-bar
    let isMouseOverMenu = false;

    navMenu.addEventListener("mouseenter", function () {
        isMouseOverMenu = true; // Le curseur est sur le menu
    });

    navMenu.addEventListener("mouseleave", function () {
        isMouseOverMenu = false; // Le curseur quitte le menu
    });

    document.addEventListener("click", function (event) {
        // Fermer le menu uniquement si le clic est en dehors du menu et du bouton
        if (!navMenu.contains(event.target) && !menuToggle.contains(event.target) && !isMouseOverMenu) {
            navMenu.classList.remove("active");
        }
    });

    // Gestion de la conversation utilisateur
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const conversationDiv = document.getElementById('userConversation');
    const replyForm = document.getElementById('userReplyForm');
    const replyMsg = document.getElementById('userReplyMessage');

    function displayUserConversation() {
        if (!currentUser) {
            conversationDiv.innerHTML = "<em>Veuillez vous connecter pour voir vos messages.</em>";
            replyForm.style.display = "none";
            return;
        }
        let conversations = JSON.parse(localStorage.getItem('conversations') || '{}');
        let msgs = conversations[currentUser.email] || [];
        if (msgs.length === 0) {
            conversationDiv.innerHTML = "<em>Aucune conversation pour l'instant.</em>";
        } else {
            conversationDiv.innerHTML = msgs.map(msg => `
                <div style="margin-bottom:0.5rem;">
                    <strong style="color:${msg.from === 'admin' ? '#2196F3' : '#333'};">
                        ${msg.from === 'admin' ? 'Admin' : (currentUser.prenom || currentUser.nom || 'Vous')}
                    </strong> : ${msg.message}
                    <div style="font-size:0.8em; color:#888;">${new Date(msg.date).toLocaleString('fr-FR')}</div>
                </div>
            `).join('');
        }
    }

    if (replyForm) {
        replyForm.onsubmit = function(e) {
            e.preventDefault();
            if (!currentUser) return;
            const message = replyMsg.value.trim();
            if (!message) return;
            let conversations = JSON.parse(localStorage.getItem('conversations') || '{}');
            if (!conversations[currentUser.email]) conversations[currentUser.email] = [];
            conversations[currentUser.email].push({
                from: "user",
                name: currentUser.prenom || currentUser.nom || "",
                message,
                date: new Date().toISOString()
            });
            localStorage.setItem('conversations', JSON.stringify(conversations));
            replyMsg.value = '';
            displayUserConversation();
        };
    }

    displayUserConversation();
});
