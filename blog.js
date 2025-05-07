document.addEventListener("DOMContentLoaded", function() {
    const commentForm = document.getElementById("commentForm");
    const commentList = document.getElementById("commentList");
    const commentInput = document.getElementById("comment");

    function loadComments() {
        const comments = JSON.parse(localStorage.getItem("blogComments")) || [];
        commentList.innerHTML = comments.length ? "" : "<li>Aucun commentaire pour le moment.</li>";
        
        comments.forEach(comment => {
            const li = document.createElement("li");
            li.textContent = comment;
            commentList.appendChild(li);
        });
    }
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
    commentForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const commentText = commentInput.value.trim();
        if (!commentText) {
            alert("Veuillez écrire un commentaire avant d'envoyer.");
            return;
        }
        
        let comments = JSON.parse(localStorage.getItem("blogComments")) || [];
        comments.push(commentText);
        localStorage.setItem("blogComments", JSON.stringify(comments));
        
        commentInput.value = "";
        loadComments();
    });

    loadComments();
});
document.addEventListener("DOMContentLoaded", function () {
    // Récupérer tous les boutons "Lire la suite"
    const readMoreButtons = document.querySelectorAll(".read-more");

    // Définir les liens des articles correspondants
    const articleLinks = [
        "https://fr.wikipedia.org/wiki/Route_des_P%C3%AAches", // Lien pour le premier article
        "https://avecnet.net/les-meilleurs-conseils-de-voyage-pour-une-experience-inoubliable/"  // Lien pour le deuxième article
    ];

    // Ajouter un écouteur d'événement sur chaque bouton
    readMoreButtons.forEach((button, index) => {
        button.addEventListener("click", function () {
            window.location.href = articleLinks[index];
        });
    });
});
