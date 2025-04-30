// certifications.js
class CertificationAnimator {
    constructor() {
        this.cards = document.querySelectorAll('.certification-card');
        this.init();
    }

    init() {
        this.animateOnScroll();
        this.setupDownloadButtons();
    }

    animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                }
            });
        }, { threshold: 0.1 });

        this.cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(card);
        });
    }

    setupDownloadButtons() {
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.certification-card')) {
        new CertificationAnimator();
    }
});