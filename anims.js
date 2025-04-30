document.addEventListener('DOMContentLoaded', () => {
    // Gestion du loader
    const hideLoader = () => {
        document.querySelector('.cosmic-loader').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.main-content').classList.remove('hidden');
        }, 500);
    };

    window.addEventListener('load', hideLoader);

    // Animation des cartes
    const animateCards = () => {
        const cards = document.querySelectorAll('.cosmic-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
                card.style.opacity = '1';
            }, index * 150);
        });
    };

    // Traînée de particules
    class ParticleTrail {
        constructor() {
            this.particles = [];
            this.init();
        }
        
        init() {
            // Implémentation de la traînée fluide
        }
    }

    new ParticleTrail();
});