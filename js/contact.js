const contactForm = document.querySelector('.contact__form');
const contactMessage = document.querySelector('#contact-message');

if (contactForm && contactMessage) {
    contactForm.addEventListener('submit', (event) => {
        // Limpiar cualquier error previo
        contactMessage.setCustomValidity('');

        const message = contactMessage.value.trim();

        if (message.length < 10) {
            event.preventDefault();

            contactMessage.setCustomValidity(
                'Cuéntame un poco más sobre tu proyecto.'
            );

            contactMessage.reportValidity();
        }
    });

    contactMessage.addEventListener('input', () => {
        contactMessage.setCustomValidity('');
    });
}