document.addEventListener("DOMContentLoaded", function() {
    const priceFilter = document.getElementById("price");
    const typeFilter = document.getElementById("type");
    const rooms = document.querySelectorAll(".room-card");
    const guesthouses = document.querySelectorAll(".guesthouse-card");

    function filterRooms() {
        if (!priceFilter) return; // Vérification pour éviter les erreurs si l'élément n'existe pas
        const priceValue = priceFilter.value;
        const typeValue = typeFilter ? typeFilter.value : "all";

        rooms.forEach(room => {
            const roomPrice = parseInt(room.getAttribute("data-price"));
            const roomType = room.getAttribute("data-type");
            let priceMatch = false;
            let typeMatch = typeValue === "all" || roomType === typeValue;

            if (priceValue === "all") {
                priceMatch = true;
            } else if (priceValue === "low" && roomPrice < 20000) {
                priceMatch = true;
            } else if (priceValue === "mid" && roomPrice >= 20000 && roomPrice <= 40000) {
                priceMatch = true;
            } else if (priceValue === "high" && roomPrice > 40000) {
                priceMatch = true;
            }

            if (priceMatch && typeMatch) {
                room.style.display = "block";
            } else {
                room.style.display = "none";
            }
        });
    }

    function filterGuesthouses() {
        if (!priceFilter) return;
        const priceValue = priceFilter.value;

        guesthouses.forEach(guesthouse => {
            const guesthousePrice = parseInt(guesthouse.getAttribute("data-price"));
            let priceMatch = false;

            if (priceValue === "all") {
                priceMatch = true;
            } else if (priceValue === "low" && guesthousePrice < 30000) {
                priceMatch = true;
            } else if (priceValue === "mid" && guesthousePrice >= 30000 && guesthousePrice <= 50000) {
                priceMatch = true;
            } else if (priceValue === "high" && guesthousePrice > 50000) {
                priceMatch = true;
            }

            guesthouse.style.display = priceMatch ? "block" : "none";
        });
    }

    if (priceFilter) priceFilter.addEventListener("change", function() {
        filterRooms();
        filterGuesthouses();
    });
    if (typeFilter) typeFilter.addEventListener("change", filterRooms);
});



/*document.addEventListener("DOMContentLoaded", function() {
    const chooseButtons = document.querySelectorAll(".choose-room");

    chooseButtons.forEach(button => {
        button.addEventListener("click", function() {
            const roomId = this.getAttribute("data-id");
            const roomPrice = this.getAttribute("data-price");
            const roomDetails = this.getAttribute("data-details");

            // Construire l'URL avec les paramètres
            const url = `reserv.html?room=${roomId}&price=${roomPrice}&details=${encodeURIComponent(roomDetails)}`;
            
            // Redirection vers la page de réservation
            window.location.href = url;
        });
    });
});*/

//pour les defilements
document.addEventListener("DOMContentLoaded", function() { 
    document.querySelectorAll(".room-container").forEach(function(container) {
        const carousel = container.querySelector(".room-carousel");
        const prevBtn = container.querySelector(".prev-btn");
        const nextBtn = container.querySelector(".next-btn");
        let index = 0;
        const totalItems = carousel.children.length;

        function updateCarousel() {
            const translateX = -index * 300;
            carousel.style.transform = `translateX(${translateX}px)`;
        }

        prevBtn.addEventListener("click", function() {
            index = (index === 0) ? totalItems - 1 : index - 1;
            updateCarousel();
        });

        nextBtn.addEventListener("click", function() {
            index = (index + 1) % totalItems;
            updateCarousel();
        });
    });
});
//Pour les chronomêtre
document.addEventListener("DOMContentLoaded", function() {
    // Récupérer les informations des réservations depuis localStorage
    const reservations = JSON.parse(localStorage.getItem("reservations")) || {};

    // Vérifier si l'ID de la chambre est présent dans l'URL
    const roomId = window.location.hash.replace("#room-", "");

    // Si l'ID de la chambre existe dans localStorage et dans l'URL, afficher les informations d'occupation
    if (reservations[roomId]) {
        const reservation = reservations[roomId];
        const roomCard = document.querySelector(`.room-card[data-id='${roomId}']`);

        // Afficher les dates de réservation
        const occupiedDates = roomCard.querySelector(`#occupied-dates-${roomId}`);
        const timeLeft = roomCard.querySelector(`#time-left-${roomId}`);
        const reservationInfo = roomCard.querySelector(`#reservation-info-${roomId}`);

        occupiedDates.textContent = `Chambre occupée du ${reservation.checkIn} au ${reservation.checkOut}`;
        reservationInfo.style.display = "block";

        // Fonction pour afficher le temps restant
        function updateTimeLeft() {
            const currentTime = new Date();
            const checkOutDate = new Date(reservation.checkOut);

            if (currentTime < checkOutDate) {
                const timeRemaining = checkOutDate - currentTime;
                const daysLeft = Math.floor(timeRemaining / (1000 * 60 * 60 * 24)); // Convertir en jours
                timeLeft.textContent = `Il reste ${daysLeft} jour(s) avant la sortie.`;
            } else {
                timeLeft.textContent = "La période de réservation est terminée.";
            }
        }

        // Mettre à jour le chronomètre
        updateTimeLeft();
        setInterval(updateTimeLeft, 1000 * 60 * 60 * 24); // Mise à jour tous les jours
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const filterButton = document.getElementById('filter-button');
    const resetButton = document.getElementById('reset-filter');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');

    // Fonction pour filtrer les chambres par prix
    function filterRoomsByPrice(minPrice, maxPrice) {
        const roomCards = document.querySelectorAll('.room-card');
        let anyRoomVisible = false;

        roomCards.forEach(card => {
            const price = parseInt(card.querySelector('.choose-room').dataset.price) || 0;
            const container = card.closest('.room-container');

            if (price >= minPrice && price <= maxPrice) {
                container.style.display = 'flex';
                anyRoomVisible = true;
            } else {
                container.style.display = 'none';
            }
        });

        // Afficher ou masquer le message "Aucun résultat"
        toggleNoResultsMessage(!anyRoomVisible);
    }

    // Fonction pour réinitialiser les filtres
    function resetRoomFilters() {
        document.querySelectorAll('.room-container').forEach(container => {
            container.style.display = 'flex';
        });
        toggleNoResultsMessage(false);
        minPriceInput.value = '';
        maxPriceInput.value = '';
    }

    // Fonction pour afficher/masquer le message "Aucun résultat"
    function toggleNoResultsMessage(show) {
        let message = document.getElementById('no-results-message');
        
        if (show && !message) {
            message = document.createElement('p');
            message.id = 'no-results-message';
            message.textContent = 'Aucune chambre ne correspond à ces critères.';
            message.style.cssText = 'text-align: center; font-weight: bold; color: #ff4444; margin: 20px;';
            document.querySelector('main').prepend(message);
        } else if (!show && message) {
            message.remove();
        }
    }

    // Événement pour le bouton de filtrage
    filterButton.addEventListener('click', function() {
        const minPrice = parseInt(minPriceInput.value) || 0;
        const maxPrice = parseInt(maxPriceInput.value) || Number.MAX_SAFE_INTEGER;
        
        if (minPrice > maxPrice) {
            alert('Le prix minimum ne peut pas être supérieur au prix maximum');
            return;
        }
        
        filterRoomsByPrice(minPrice, maxPrice);
    });

    // Événement pour le bouton de réinitialisation
    resetButton.addEventListener('click', resetRoomFilters);
});
