document.addEventListener("DOMContentLoaded", function() {
    const bookingForm = document.getElementById("bookingForm");

    bookingForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const checkin = document.getElementById("checkin").value;
        const checkout = document.getElementById("checkout").value;
        const roomType = document.getElementById("room-type").value;
        const guests = document.getElementById("guests").value;
        
        if (!name || !email || !checkin || !checkout || !guests) {
            alert("Veuillez remplir tous les champs !");
            return;
        }
        
        if (new Date(checkin) >= new Date(checkout)) {
            alert("La date de départ doit être après la date d'arrivée.");
            return;
        }
        
        alert(`Réservation confirmée !\nNom: ${name}\nEmail: ${email}\nArrivée: ${checkin}\nDépart: ${checkout}\nType: ${roomType}\nPersonnes: ${guests}`);
        
        bookingForm.reset();
    });
});
