document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.project-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentIndex = 0;
    let autoRotateInterval;
    const rotationDelay = 8000;

    // Configuration initiale
    function initSlider() {
        if (!slides.length) return;

        // Initialisation des positions avec GSAP
        gsap.set(slides, {
            x: (i) => (i - currentIndex) * 120 + '%',
            opacity: 0,
            scale: 0.9
        });

        updateSlides(true);
        startAutoRotation();
        setupEventListeners();
    }

    // Mise à jour des slides
    function updateSlides(instant = false) {
        gsap.to(slides, {
            duration: instant ? 0 : 0.8,
            x: (i) => (i - currentIndex) * 120 + '%',
            opacity: (i) => (i === currentIndex ? 1 : 0.3),
            scale: (i) => (i === currentIndex ? 1 : 0.85),
            ease: 'power3.out'
        });
    }

    // Navigation
    function goToNext() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlides();
        resetAutoRotation();
    }

    function goToPrev() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlides();
        resetAutoRotation();
    }

    // Gestion de l'auto-rotation
    function startAutoRotation() {
        stopAutoRotation();
        autoRotateInterval = setInterval(goToNext, rotationDelay);
    }

    function stopAutoRotation() {
        clearInterval(autoRotateInterval);
    }

    function resetAutoRotation() {
        stopAutoRotation();
        startAutoRotation();
    }

    // Gestion des événements
    function setupEventListeners() {
        const handleNavigation = (direction) => {
            direction === 'next' ? goToNext() : goToPrev();
            gsap.to(slides, { overwrite: 'auto' });
        };

        nextBtn.addEventListener('click', () => handleNavigation('next'));
        prevBtn.addEventListener('click', () => handleNavigation('prev'));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') handleNavigation('next');
            if (e.key === 'ArrowLeft') handleNavigation('prev');
        });

        // Gestion du hover
        const container = document.querySelector('.project-container');
        if (container) {
            container.addEventListener('mouseenter', () => {
                gsap.to(slides, { timeScale: 0.3 });
                stopAutoRotation();
            });
            
            container.addEventListener('mouseleave', () => {
                gsap.to(slides, { timeScale: 1 });
                resetAutoRotation();
            });
        }
    }

    // Animation d'entrée
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.project-container', {
        scrollTrigger: {
            trigger: '.project-container',
            start: 'top bottom',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 80,
        duration: 1.4,
        ease: 'power4.out'
    });

    // Désactivation des transitions CSS conflictuelles
    document.querySelectorAll('.project-slide').forEach(slide => {
        slide.style.transition = 'none';
    });

    // Initialisation
    initSlider();
});