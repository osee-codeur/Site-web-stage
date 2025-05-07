document.addEventListener("DOMContentLoaded", function() {
    // Récupérer l'utilisateur connecté
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Affichage infos dans la sidebar
    document.getElementById('userName').textContent = `${currentUser.prenom || ''} ${currentUser.nom || ''}`;
    document.getElementById('userEmail').textContent = currentUser.email || '';

    // Affichage infos dans la section profil
    document.getElementById('profileInfo').innerHTML = `
        <p><strong>Nom :</strong> ${currentUser.nom || ''}</p>
        <p><strong>Prénom :</strong> ${currentUser.prenom || ''}</p>
        <p><strong>Âge :</strong> ${currentUser.age || ''}</p>
        <p><strong>Profession :</strong> ${currentUser.profession || ''}</p>
        <p><strong>Téléphone :</strong> ${currentUser.telephone || currentUser.phone || ''}</p>
        <p><strong>Email :</strong> ${currentUser.email || ''}</p>
    `;

    // Gestion photo de profil
    const profilePic = document.getElementById('userProfilePic');
    const profilePicInput = document.getElementById('profilePicInput');
    const deleteProfilePicBtn = document.getElementById('deleteProfilePicBtn');

    // Charger la photo de profil depuis localStorage
    if (currentUser.profilePic) {
        profilePic.src = currentUser.profilePic;
    } else {
        profilePic.src = "me1.jpg"; // image par défaut
    }

    // Changer la photo de profil
    profilePicInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            profilePic.src = evt.target.result;
            currentUser.profilePic = evt.target.result;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            // Mettre à jour dans la liste des users aussi
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            const idx = users.findIndex(u => u.email === currentUser.email);
            if (idx !== -1) {
                users[idx].profilePic = evt.target.result;
                localStorage.setItem('users', JSON.stringify(users));
            }
        };
        reader.readAsDataURL(file);
    });

    // Supprimer la photo de profil
    deleteProfilePicBtn.addEventListener('click', function() {
        if (confirm("Supprimer la photo de profil ?")) {
            profilePic.src = "me1.jpg";
            delete currentUser.profilePic;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            // Mettre à jour dans la liste des users aussi
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            const idx = users.findIndex(u => u.email === currentUser.email);
            if (idx !== -1) {
                delete users[idx].profilePic;
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
    });

    // Déconnexion
    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });

    // Sidebar responsive + overlay
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    function toggleSidebar(force) {
        if (typeof force === "boolean") {
            sidebar.classList.toggle('active', force);
            overlay.classList.toggle('active', force);
        } else {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }
    }

    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleSidebar(true);
    });

    overlay.addEventListener('click', function() {
        toggleSidebar(false);
    });

    document.addEventListener('click', function(e) {
        if (
            window.innerWidth <= 1024 &&
            sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            !toggleBtn.contains(e.target)
        ) {
            toggleSidebar(false);
        }
    });
});

/* Overlay plus léger */
.sidebar-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.18); /* plus léger */
    z-index: 999;
    display: none;
}
@media (max-width: 1024px) {
    .toggle-sidebar { display: flex; }
    .sidebar { transform: translateX(-250px); }
    .sidebar.active { transform: translateX(0); }
    .sidebar-overlay.active { display: block; }
    .main-content { margin-left: 0; width: 100%; }
}
