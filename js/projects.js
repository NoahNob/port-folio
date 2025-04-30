document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.project-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentIndex = 0;
    let autoRotateInterval;
    const rotationDelay = 5000; // 5 seconds
    document.querySelector('.floating').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    // Initialize slider
    function initSlider() {
        if (slides.length === 0) return;
        
        updateSlides();
        startAutoRotation();
        setupEventListeners();
    }

    // Update slide positions
    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');
            
            if (index === currentIndex) {
                slide.classList.add('active');
            } else if (index === (currentIndex + 1) % slides.length) {
                slide.classList.add('next');
            } else if (index === (currentIndex - 1 + slides.length) % slides.length) {
                slide.classList.add('prev');
            }
        });
    }

    // Navigation functions
    function goToNext() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlides();
    }

    function goToPrev() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlides();
    }

    // Auto-rotation control
    function startAutoRotation() {
        stopAutoRotation();
        autoRotateInterval = setInterval(goToNext, rotationDelay);
    }

    function stopAutoRotation() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    }

    // Amélioration des animations
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.project-container',
            start: 'top center'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2
    });

    // Ajouter un effet de parallaxe
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.project-card');
        const x = (e.clientX - window.innerWidth/2) * 0.02;
        const y = (e.clientY - window.innerHeight/2) * 0.02;
        
        cards.forEach(card => {
            card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${-x}deg)`;
        });
    });

    // Event listeners
    function setupEventListeners() {
        nextBtn.addEventListener('click', () => {
            goToNext();
            stopAutoRotation();
        });

        prevBtn.addEventListener('click', () => {
            goToPrev();
            stopAutoRotation();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'ArrowLeft') goToPrev();
        });

        const container = document.querySelector('.project-container');
        if (container) {
            container.addEventListener('mouseenter', stopAutoRotation);
            container.addEventListener('mouseleave', startAutoRotation);
        }
    }

    // Initialize
    initSlider();
});