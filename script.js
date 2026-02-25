document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve once animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target all sections with reveal class
    const revealElements = document.querySelectorAll('.section-reveal');
    revealElements.forEach(el => observer.observe(el));

    // Smooth hover effect for CTA button (handled in CSS mostly, but JS can add extra flair if needed)
    const buyBtn = document.querySelector('.btn-buy');
    if (buyBtn) {
        buyBtn.addEventListener('click', () => {
            alert('Ajouté au panier. Redirection vers le paiement sécurisé...');
        });
    }
});
