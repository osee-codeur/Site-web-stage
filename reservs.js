// Initialisation de Stripe
const stripe = Stripe('your_publishable_key'); // Remplacez par votre clé publique Stripe
const elements = stripe.elements();
const card = elements.create('card');

document.addEventListener("DOMContentLoaded", function() {
    // Configuration de Stripe
    card.mount('#card-element');
    card.addEventListener('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });

    // Récupérer les informations stockées
    const roomNumber = localStorage.getItem('selectedRoomNumber');
    const roomPrice = localStorage.getItem('selectedRoomPrice');
    const roomDetails = localStorage.getItem('selectedRoomDetails');
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    const containerId = urlParams.get('container');
    const isEditMode = urlParams.get('edit') === 'true';

    // Afficher les informations dans la section room-info
    if (roomNumber && roomPrice && roomDetails) {
        document.getElementById('roomNumber').textContent = roomNumber;
        document.getElementById('roomPrice').textContent = roomPrice;
        document.getElementById('roomDetails').textContent = roomDetails;
    }

    // Gestion des animations des champs de formulaire
    document.querySelectorAll('.form-group').forEach((group, index) => {
        setTimeout(() => {
            group.style.opacity = '1';
        }, index * 100);
    });

    // Gestion de la durée de séjour
    const durationType = document.getElementById("durationType");
    const durationHoursGroup = document.getElementById("durationHoursGroup");
    const durationDaysGroup = document.getElementById("durationDaysGroup");
    const checkin = document.getElementById("checkin");
    const checkout = document.getElementById("checkout");

    durationType.addEventListener("change", function() {
        durationHoursGroup.classList.add("hidden");
        durationDaysGroup.classList.add("hidden");
        
        if (this.value === "hours") {
            durationHoursGroup.classList.remove("hidden");
        } else if (this.value === "days") {
            durationDaysGroup.classList.remove("hidden");
        }
        
        calculateCheckout();
    });

    // Calcul automatique de la date de départ
    function calculateCheckout() {
        if (!checkin.value) return;
        
        const checkinDate = new Date(checkin.value);
        let checkoutDate = new Date(checkinDate);
        
        if (durationType.value === "hours" && document.getElementById("durationHours").value) {
            checkoutDate.setHours(checkoutDate.getHours() + parseInt(document.getElementById("durationHours").value));
        } else if (durationType.value === "days" && document.getElementById("durationDays").value) {
            checkoutDate.setDate(checkoutDate.getDate() + parseInt(document.getElementById("durationDays").value));
        }
        
        checkout.value = checkoutDate.toISOString().slice(0, 16);
    }

    checkin.addEventListener("change", calculateCheckout);
    document.getElementById("durationHours").addEventListener("input", calculateCheckout);
    document.getElementById("durationDays").addEventListener("input", calculateCheckout);

    // Gestion des méthodes de paiement
    const paymentMethod = document.getElementById("paymentMethod");
    const cardElement = document.getElementById("card-element");
    const mobileMoneyForm = document.getElementById("mobile-money-form");
    
    paymentMethod.addEventListener("change", function() {
        // Cacher tous les formulaires de paiement
        cardElement.classList.add("hidden");
        mobileMoneyForm.classList.add("hidden");
        
        // Afficher le formulaire approprié
        if (this.value === "card") {
            cardElement.classList.remove("hidden");
        } else if (this.value === "mobile") {
            mobileMoneyForm.classList.remove("hidden");
        }

        // Mettre à jour les icônes de paiement
        document.querySelectorAll('.payment-icon').forEach(icon => {
            if (icon.dataset.method === this.value) {
                icon.classList.add('active');
            } else {
                icon.classList.remove('active');
            }
        });
    });

    // Validation du formulaire
    const form = document.getElementById("booking-form");
    const emailInput = document.getElementById("email");
    let verificationCode = null;

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        const errorElement = formGroup.querySelector('.error-message');
        errorElement.textContent = message;
    }

    function clearError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
    }

    function generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async function sendVerificationEmail(email, code) {
        // Simulation d'envoi d'email (à remplacer par votre service d'email)
        console.log(`Code de vérification envoyé à ${email}: ${code}`);
        // Afficher le message de vérification
        document.getElementById('verification-status').classList.remove('hidden');
        return true;
    }

    // Gestion du paiement
    async function processPayment(paymentMethod, formData) {
        const loadingSpinner = document.getElementById('loading-spinner');
        loadingSpinner.style.display = 'block';

        try {
            if (paymentMethod === 'card') {
                const {paymentMethod: stripePaymentMethod} = await stripe.createPaymentMethod({
                    type: 'card',
                    card: card,
                });

                // Simuler un appel à votre serveur pour traiter le paiement
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                return {
                    success: true,
                    transactionId: stripePaymentMethod.id
                };
            } else if (paymentMethod === 'mobile') {
                // Simuler un paiement mobile money
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                return {
                    success: true,
                    transactionId: 'MM-' + Date.now()
                };
            } else if (paymentMethod === 'paypal') {
                // Intégration PayPal à implémenter
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                return {
                    success: true,
                    transactionId: 'PP-' + Date.now()
                };
            }
        } catch (error) {
            console.error('Erreur de paiement:', error);
            return {
                success: false,
                error: error.message
            };
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    // Gestion de la soumission du formulaire
    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        // Vérification de l'utilisateur
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert("Veuillez vous connecter pour effectuer une réservation");
            window.location.href = 'login.html';
            return;
        }

        // Validation des champs
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                showError(field, 'Ce champ est requis');
            } else {
                clearError(field);
            }
        });

        if (!isValid) return;

        // Validation de l'email
        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Adresse email invalide');
            return;
        }

        // Génération et envoi du code de vérification
        if (!verificationCode) {
            verificationCode = generateVerificationCode();
            const emailSent = await sendVerificationEmail(emailInput.value, verificationCode);
            if (!emailSent) {
                alert("Erreur lors de l'envoi de l'email de vérification");
                return;
            }

            // Demander le code de vérification
            const userCode = prompt("Veuillez entrer le code de vérification reçu par email:");
            if (userCode !== verificationCode) {
                alert("Code de vérification incorrect");
                return;
            }
        }

        // Traitement du paiement
        const paymentResult = await processPayment(paymentMethod.value, {
            amount: parseInt(roomPrice),
            currency: 'XOF',
            email: emailInput.value
        });

        if (!paymentResult.success) {
            alert(`Erreur de paiement: ${paymentResult.error}`);
            return;
        }

        // Création de la réservation
        const reservation = {
            roomId: roomId,
            containerId: containerId,
            guestName: document.getElementById("full-name").value,
            email: emailInput.value,
            activity: document.getElementById("activity").value,
            checkIn: checkin.value,
            checkOut: checkout.value,
            durationType: durationType.value,
            durationValue: durationType.value === "hours" 
                ? document.getElementById("durationHours").value 
                : document.getElementById("durationDays").value,
            paymentMethod: paymentMethod.value,
            paymentTransactionId: paymentResult.transactionId,
            roomNumber: roomNumber,
            roomPrice: roomPrice,
            roomDetails: roomDetails,
            bookedAt: new Date().toISOString()
        };

        // Mise à jour des réservations
        if (!currentUser.reservations) {
            currentUser.reservations = [];
        }

        if (isEditMode) {
            const resIndex = currentUser.reservations.findIndex(res => res.roomId === roomId);
            if (resIndex !== -1) {
                currentUser.reservations[resIndex] = reservation;
            }
        } else {
            currentUser.reservations.push(reservation);
        }

        // Mise à jour du localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Mise à jour de la liste des utilisateurs
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Sauvegarder la réservation pour les chambres
        const permanentReservations = JSON.parse(localStorage.getItem('permanentReservations') || '{}');
        permanentReservations[roomId] = reservation;
        localStorage.setItem('permanentReservations', JSON.stringify(permanentReservations));
        localStorage.setItem('tempReservation', JSON.stringify(reservation));

        // Nettoyage et redirection
        if (isEditMode) {
            localStorage.removeItem('reservationToEdit');
        }

        alert('Réservation effectuée avec succès !');
        window.location.href = 'mesreservation.html';
    });

    // Gestion de la fermeture
    document.querySelector(".close-btn").addEventListener("click", function() {
        if (confirm("Êtes-vous sûr de vouloir annuler la réservation ?")) {
            window.location.href = 'chambres.html';
        }
    });
});