//pour liste utilsateur
document.addEventListener("DOMContentLoaded", function() {
    // Section utilisateur connecté (optionnelle)
    const userEmail = localStorage.getItem("loggedInUser");
    const userNameSpan = document.getElementById("userName");
    const userEmailSpan = document.getElementById("userEmail");
    const logoutButton = document.getElementById("logout");

    if (userEmail) {
        const user = JSON.parse(localStorage.getItem(userEmail));
        if (user && userNameSpan && userEmailSpan) {
            userNameSpan.textContent = user.name || user.prenom || "Utilisateur";
            userEmailSpan.textContent = userEmail;
        }
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", function() {
            localStorage.removeItem("loggedInUser");
            alert("Déconnexion réussie.");
            window.location.href = "utilisateur.html";
        });
    }

    // Section réservations (optionnelle)
    const bookingData = JSON.parse(localStorage.getItem('bookingData'));
    if (bookingData) {
        // Afficher les informations personnelles
        const personalInfo = document.getElementById('personalInfo');
        if (personalInfo) {
            personalInfo.innerHTML = `
                <div class="info-item"><span class="info-label">Nom complet :</span> ${bookingData.personalInfo.fullName}</div>
                <div class="info-item"><span class="info-label">Email :</span> ${bookingData.personalInfo.email}</div>
                <div class="info-item"><span class="info-label">Profession :</span> ${bookingData.personalInfo.profession}</div>
                <div class="info-item"><span class="info-label">Durée :</span> 
                    ${bookingData.personalInfo.duration.value} 
                    ${bookingData.personalInfo.duration.type === 'hours' ? 'heures' : 'jours'}
                </div>
                <div class="info-item"><span class="info-label">Date d'arrivée :</span> ${formatDateTime(bookingData.personalInfo.checkin)}</div>
                <div class="info-item"><span class="info-label">Date de départ :</span> ${formatDateTime(bookingData.personalInfo.checkout)}</div>
                <div class="info-item"><span class="info-label">Méthode de paiement :</span> ${getPaymentMethodName(bookingData.personalInfo.paymentMethod)}</div>
            `;
        }

        // Afficher les informations d'hébergement
        const accommodationInfo = document.getElementById('accommodationInfo');
        if (accommodationInfo && bookingData.accommodation.type === 'room') {
            accommodationInfo.innerHTML = `
                <div class="info-item"><span class="info-label">Type :</span> Chambre</div>
                <div class="info-item"><span class="info-label">Numéro :</span> ${bookingData.accommodation.details.number}</div>
                <div class="info-item"><span class="info-label">Prix :</span> ${bookingData.accommodation.details.price}</div>
                <div class="info-item"><span class="info-label">Description :</span> ${bookingData.accommodation.details.description}</div>
            `;
        }
    }

    // Section liste des utilisateurs (toujours visible)
    loadUsersList();

    function loadUsersList() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const tbody = document.querySelector('#usersList tbody');
        const noUsersMessage = document.getElementById('noUsersMessage');
        
        if (users.length === 0) {
            tbody.innerHTML = '';
            noUsersMessage.style.display = 'block';
            return;
        }
        
        noUsersMessage.style.display = 'none';
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.nom || ''} ${user.prenom || ''}</td>
                <td>${user.email || ''}</td>
                <td>${user.telephone || 'Non spécifié'}</td>
                <td>
                    <div class="button-group">
                        <button class="view-reservations-btn" onclick="window.location.href='reservationch.html?userEmail=${encodeURIComponent(user.email)}'">
                            <i class="fas fa-calendar-check"></i> Voir ses réservations
                        </button>
                        <button class="view-comments-btn" onclick="window.location.href='commentaire.html?userEmail=${encodeURIComponent(user.email)}'">
                            <i class="fas fa-comments"></i> Voir ses commentaires
                        </button>
                    </div>
                </td>
                <td>
                    <div class="button-group">
                        <button class="view-reservations-btn" onclick="window.location.href='reservationgh.html?userEmail=${encodeURIComponent(user.email)}'">
                            <i class="fas fa-building"></i> Voir ses réservations
                        </button>
                        <button class="view-comments-btn" onclick="window.location.href='comtt.html?userEmail=${encodeURIComponent(user.email)}'">
                            <i class="fas fa-comment-dots"></i> Voir ses commentaires
                        </button>
                    </div>
                </td>
                <td>
                    <button class="edit-user-btn" onclick="editUser('${user.email}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-user-btn" onclick="deleteUser('${user.email}')">
                        <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
        `).join('');
    }

    function formatDateTime(dateTimeString) {
        const options = { 
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        };
        return new Date(dateTimeString).toLocaleDateString('fr-FR', options);
    }

    function getPaymentMethodName(method) {
        const methods = {
            'credit': 'Carte de crédit',
            'debit': 'Carte bancaire',
            'paypal': 'PayPal',
            'mobile': 'Mobile Money'
        };
        return methods[method] || method;
    }

    // Gestion de la barre latérale
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const overlay = document.createElement('div');
    
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 999;
        display: none;
    `;
    document.body.appendChild(overlay);

    function toggleSidebar() {
        sidebar.classList.toggle('active');
        if (sidebar.classList.contains('active')) {
            overlay.style.display = 'block';
        } else {
            overlay.style.display = 'none';
        }
    }

    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleSidebar();
    });

    overlay.addEventListener('click', function() {
        toggleSidebar();
    });

    // Fermer la barre latérale lors d'un clic en dehors
    document.addEventListener('click', function(e) {
        const isClickInside = sidebar.contains(e.target) || toggleBtn.contains(e.target);
        if (!isClickInside && window.innerWidth <= 1024 && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });

    // Mise à jour des statistiques
    function updateStatistics() {
        const permanentReservations = JSON.parse(localStorage.getItem('permanentReservations') || '{}');
        const guestHouseReservations = JSON.parse(localStorage.getItem('guestHouseReservations') || '{}');
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Calculer les statistiques
        let validRoomReservations = 0;
        let validGuestHouseReservations = 0;
        let totalRevenue = 0;

        // Compter les réservations de chambres valides
        Object.values(permanentReservations).forEach(reservation => {
            if (new Date(reservation.checkOut) > new Date()) {
                validRoomReservations++;
                totalRevenue += parseFloat(reservation.roomPrice || 0) * (reservation.durationValue || 1);
            }
        });

        // Compter les réservations de guest houses valides
        Object.values(guestHouseReservations).forEach(reservation => {
            if (new Date(reservation.checkOut) > new Date()) {
                validGuestHouseReservations++;
                totalRevenue += parseFloat(reservation.roomPrice || 0) * (reservation.durationValue || 1);
            }
        });

        // Mettre à jour l'affichage
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('totalRooms').textContent = validRoomReservations;
        document.getElementById('totalGuestHouses').textContent = validGuestHouseReservations;
        document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString() + ' FCFA';
    }

    // Initialisation
    updateStatistics();
    loadUsersList();

    // Mise à jour automatique des statistiques
    setInterval(updateStatistics, 60000);

    // Gestionnaires d'événements pour la recherche et le filtre
    document.getElementById('searchInput').addEventListener('input', loadUsersList);
    document.getElementById('userTypeFilter').addEventListener('change', loadUsersList);

    // Ajout des styles pour les boutons d'action
    const actionButtonStyles = `
    .edit-user-btn,
    .delete-user-btn {
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin: 0 4px;
        transition: all 0.3s ease;
    }

    .edit-user-btn {
        background-color: #f1c40f;
        color: #2c3e50;
    }

    .delete-user-btn {
        background-color: #e74c3c;
        color: white;
    }

    .edit-user-btn:hover {
        background-color: #f39c12;
    }

    .delete-user-btn:hover {
        background-color: #c0392b;
    }
    `;

    // Ajouter les styles au document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = actionButtonStyles;
    document.head.appendChild(styleSheet);

    // Gestion des conversations (ADMIN)
    displayConversations();

    // Pour la modale de réponse
    window.closeAdminReplyModal = function() {
        document.getElementById('adminReplyModal').style.display = 'none';
    };

    let currentReplyEmail = null;

    window.openAdminReplyModal = function(email, name) {
        currentReplyEmail = email;
        document.getElementById('replyUserName').textContent = name;
        document.getElementById('adminReplyMessage').value = '';
        document.getElementById('adminReplyModal').style.display = 'flex';
    };

    document.getElementById('sendAdminReplyBtn').onclick = function() {
        const message = document.getElementById('adminReplyMessage').value.trim();
        if (!message) return;
        let conversations = JSON.parse(localStorage.getItem('conversations') || '{}');
        if (!conversations[currentReplyEmail]) conversations[currentReplyEmail] = [];
        conversations[currentReplyEmail].push({
            from: "admin",
            message,
            date: new Date().toISOString()
        });
        localStorage.setItem('conversations', JSON.stringify(conversations));
        closeAdminReplyModal();
        displayConversations();
    };

    function displayConversations() {
        const conversations = JSON.parse(localStorage.getItem('conversations') || '{}');
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const listDiv = document.getElementById('conversationsList');
        if (!listDiv) return;
        let html = '';
        Object.entries(conversations).forEach(([email, msgs]) => {
            const user = users.find(u => u.email === email);
            const name = user ? `${user.prenom || ''} ${user.nom || ''}` : email;
            const lastMsg = msgs[msgs.length-1];
            html += `
                <div style="border-bottom:1px solid #eee; padding:1rem 0;">
                    <strong>${name}</strong> (${email})<br>
                    <span style="color:#555;">${lastMsg.from === "admin" ? "Vous" : name} :</span>
                    <span>${lastMsg.message}</span>
                    <button style="float:right;" onclick="openAdminReplyModal('${email}', '${name.replace(/'/g,"\\'")}')">Répondre</button>
                </div>
            `;
        });
        listDiv.innerHTML = html || "<em>Aucun message utilisateur pour l'instant.</em>";
    }
});

// Fonction globale pour voir les réservations d'un utilisateur
function viewUserReservations(userEmail) {
    // Stocker l'email de l'utilisateur à visualiser
    localStorage.setItem('viewingUserEmail', userEmail);
    
    // Récupérer les données de l'utilisateur
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === userEmail);
    
    if (user) {
        // Créer un objet bookingData similaire à une réservation normale
        const bookingData = {
            personalInfo: {
                fullName: `${user.prenom || ''} ${user.nom || ''}`.trim() || 'Non spécifié',
                email: user.email || 'Non spécifié',
                profession: user.profession || 'Non spécifié',
                duration: {
                    value: 1, // Valeur par défaut
                    type: 'jours' // Type par défaut
                },
                checkin: new Date().toISOString(), // Date actuelle par défaut
                checkout: new Date(Date.now() + 86400000).toISOString(), // Date +1 jour par défaut
                paymentMethod: 'credit' // Méthode par défaut
            },
            accommodation: {
                type: 'room',
                details: {
                    number: 'N/A',
                    price: 'Non spécifié',
                    description: 'Non spécifié'
                }
            }
        };

        // Si l'utilisateur a des réservations, utiliser la dernière pour les détails
        if (user.reservations && user.reservations.length > 0) {
            const lastReservation = user.reservations[user.reservations.length - 1];
            bookingData.personalInfo.duration.value = lastReservation.durationValue || 1;
            bookingData.personalInfo.duration.type = lastReservation.durationType || 'jours';
            bookingData.personalInfo.checkin = lastReservation.checkIn || bookingData.personalInfo.checkin;
            bookingData.personalInfo.checkout = lastReservation.checkOut || bookingData.personalInfo.checkout;
            bookingData.personalInfo.paymentMethod = lastReservation.paymentMethod || 'credit';
            
            if (lastReservation.roomId) {
                bookingData.accommodation.details.number = lastReservation.roomId;
            }
            if (lastReservation.price) {
                bookingData.accommodation.details.price = lastReservation.price;
            }
            if (lastReservation.description) {
                bookingData.accommodation.details.description = lastReservation.description;
            }
        }

        localStorage.setItem('bookingData', JSON.stringify(bookingData));
    }
    
    // Rediriger vers la page des réservations
    window.location.href = 'mesreservation.html';
}

document.addEventListener("DOMContentLoaded", function() {
    // Récupération de l'utilisateur connecté (sans vérification admin)
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Mise à jour des informations de l'utilisateur dans la sidebar
    if (currentUser) {
        document.getElementById('adminName').textContent = `${currentUser.prenom || ''} ${currentUser.nom || ''}`;
        document.getElementById('adminEmail').textContent = currentUser.email || '';
    } else {
        document.getElementById('adminName').textContent = 'Visiteur';
        document.getElementById('adminEmail').textContent = 'Non connecté';
    }

    // Initialisation des statistiques
    updateStatistics();
    initializeCharts();
    loadUsersList();

    // Gestionnaires d'événements
    document.getElementById('logout').addEventListener('click', handleLogout);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('userTypeFilter').addEventListener('change', handleFilterChange);

    // Mise à jour automatique des données
    setInterval(updateStatistics, 60000); // Mise à jour toutes les minutes

    // Le reste du code reste identique...
    // ... (garder toutes les autres fonctions telles quelles)

    function handleLogout() {
        if (currentUser) {
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                localStorage.removeItem('currentUser');
                showNotification('Déconnexion réussie', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }
        } else {
            window.location.href = 'login.html';
        }
    }

    // Modification de loadUsersList pour afficher tous les utilisateurs
    function loadUsersList() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const usersList = document.getElementById('usersList');
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filterType = document.getElementById('userTypeFilter').value;

        // Filtrer les utilisateurs (sans exclure les admins)
        let filteredUsers = users;

        // Appliquer le filtre de recherche
        if (searchTerm) {
            filteredUsers = filteredUsers.filter(user => 
                user.nom?.toLowerCase().includes(searchTerm) ||
                user.prenom?.toLowerCase().includes(searchTerm) ||
                user.email?.toLowerCase().includes(searchTerm)
            );
        }

        // Appliquer le filtre de type
        if (filterType !== 'all') {
            filteredUsers = filteredUsers.filter(user => {
                const hasActiveReservations = (user.reservations || []).some(res => 
                    new Date(res.checkOut) > new Date()
                );
                return filterType === 'active' ? hasActiveReservations : !hasActiveReservations;
            });
        }

        // Afficher le message si aucun utilisateur
        const noUsersMessage = document.getElementById('noUsersMessage');
        if (filteredUsers.length === 0) {
            usersList.innerHTML = '';
            noUsersMessage.style.display = 'block';
            return;
        }
        noUsersMessage.style.display = 'none';

        // Générer le HTML pour chaque utilisateur
        usersList.innerHTML = filteredUsers.map(user => {
            const lastReservation = getLastReservation(user);
            const status = getUserStatus(user);
            const isAdmin = user.isAdmin ? '<span class="admin-badge">Admin</span>' : '';
            
            return `
                <tr>
                    <td>${user.prenom} ${user.nom} ${isAdmin}</td>
                    <td>${user.email}</td>
                    <td>${lastReservation || 'Aucune réservation'}</td>
                    <td>
                        <span class="status-badge ${status.class}">
                            ${status.text}
                        </span>
                    </td>
                    <td>
                        <button class="action-button view-button" onclick="viewUserDetails('${user.email}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${currentUser && (currentUser.isAdmin || currentUser.email === user.email) ? `
                            <button class="action-button edit-button" onclick="editUser('${user.email}')">
                                <i class="fas fa-edit"></i>
                        </button>
                            ${currentUser.isAdmin ? `
                                <button class="action-button delete-button" onclick="deleteUser('${user.email}')">
                                    <i class="fas fa-trash"></i>
                        </button>
                            ` : ''}
                        ` : ''}
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Le reste du code reste identique...
});

// Fonctions globales pour les actions utilisateur
window.viewUserDetails = function(email) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);
    
    if (user) {
        localStorage.setItem('viewingUserEmail', email);
        window.location.href = 'user-details.html';
    }
    };

window.editUser = function(email) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);
    
    if (user) {
        localStorage.setItem('editingUserEmail', email);
        window.location.href = 'edit-user.html';
    }
};

window.deleteUser = function(email) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = users.filter(u => u.email !== email);
        
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        showNotification('Utilisateur supprimé avec succès', 'success');
        loadUsersList();
    }
};

function updateStatistics() {
    // Récupérer les réservations
    const permanentReservations = JSON.parse(localStorage.getItem('permanentReservations') || '{}');
    const guestHouseReservations = JSON.parse(localStorage.getItem('guestHouseReservations') || '{}');

    // Calculer les statistiques des chambres
    let totalRoomRevenue = 0;
    let validRoomReservations = 0;
    Object.values(permanentReservations).forEach(reservation => {
        const checkOutDate = new Date(reservation.checkOut);
        if (checkOutDate > new Date()) {
            validRoomReservations++;
            totalRoomRevenue += parseFloat(reservation.roomPrice || 0) * reservation.durationValue;
        }
    });

    // Calculer les statistiques des guest houses
    let totalGuestHouseRevenue = 0;
    let validGuestHouseReservations = 0;
    Object.values(guestHouseReservations).forEach(reservation => {
        const checkOutDate = new Date(reservation.checkOut);
        if (checkOutDate > new Date()) {
            validGuestHouseReservations++;
            totalGuestHouseRevenue += parseFloat(reservation.roomPrice || 0) * reservation.durationValue;
        }
    });

    // Mettre à jour les statistiques
    document.querySelector('[data-stat="rooms"]').textContent = validRoomReservations;
    document.querySelector('[data-stat="guesthouses"]').textContent = validGuestHouseReservations;
    document.querySelector('[data-stat="revenue"]').textContent = (totalRoomRevenue + totalGuestHouseRevenue).toLocaleString() + ' FCFA';
                }

// Mettre à jour les statistiques toutes les minutes
setInterval(updateStatistics, 60000);