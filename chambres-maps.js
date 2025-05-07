document.addEventListener('DOMContentLoaded', function() {
    // Coordonnées par défaut (Parakou, Bénin)
    const defaultLat = 9.3372;
    const defaultLng = 2.6303;
    
    // Objet pour stocker les instances de carte
    const maps = {};

    // Fonction pour initialiser une carte
    function initMap(roomId, lat, lng) {
        const mapId = `map-${roomId}`;
        const mapElement = document.getElementById(mapId);
        
        if (!mapElement) return;

        // Créer la carte
        const map = L.map(mapId).setView([lat, lng], 13); // Zoom level ajusté pour Parakou
        
        // Ajouter le fond de carte OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Ajouter un marqueur pour la chambre
        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`Chambre ${roomId.split('-')[1]}`)
            .openPopup();

        // Stocker l'instance de la carte
        maps[roomId] = map;
    }

    // Ajouter les boutons et conteneurs de carte à chaque room-card
    document.querySelectorAll('.room-card').forEach(card => {
        const roomId = card.dataset.id;
        
        // Créer le bouton pour afficher la carte
        const mapButton = document.createElement('button');
        mapButton.className = 'show-map-btn';
        mapButton.textContent = 'Voir sur la carte';
        
        // Créer le conteneur pour la carte
        const mapContainer = document.createElement('div');
        mapContainer.id = `map-${roomId}`;
        mapContainer.className = 'room-map';
        
        // Ajouter les éléments à la carte
        card.appendChild(mapButton);
        card.appendChild(mapContainer);
        
        // Ajouter les coordonnées par défaut à la carte
        card.dataset.lat = defaultLat;
        card.dataset.lng = defaultLng;
    });

    // Gérer les boutons "Voir sur la carte"
    document.querySelectorAll('.show-map-btn').forEach(button => {
        button.addEventListener('click', function() {
            const roomCard = this.closest('.room-card');
            const roomId = roomCard.dataset.id;
            const mapElement = document.getElementById(`map-${roomId}`);
            
            // Récupérer les coordonnées de la chambre
            const lat = parseFloat(roomCard.dataset.lat) || defaultLat;
            const lng = parseFloat(roomCard.dataset.lng) || defaultLng;

            // Basculer l'affichage de la carte
            if (mapElement.style.display === 'none') {
                mapElement.style.display = 'block';
                
                // Initialiser la carte si elle n'existe pas déjà
                if (!maps[roomId]) {
                    initMap(roomId, lat, lng);
                } else {
                    // Réinitialiser la vue si la carte existe déjà
                    maps[roomId].setView([lat, lng], 15);
                }
                
                this.textContent = 'Masquer la carte';
            } else {
                mapElement.style.display = 'none';
                this.textContent = 'Voir sur la carte';
            }
        });
    });

    // Mettre à jour la taille des cartes lors du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        Object.values(maps).forEach(map => {
            map.invalidateSize();
        });
    });
}); 