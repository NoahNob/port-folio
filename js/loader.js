// loader.js
class CosmicLoader {
    constructor() {
        this.loader = document.querySelector('.cosmic-loader');
        this.mainContent = document.querySelector('.main-content');
        this.minLoadTime = 1500;
        this.startTime = Date.now();
        this.init();
    }

    init() {
        if (document.readyState === 'complete') {
            this.hideLoader();
        } else {
            window.addEventListener('load', () => this.hideLoader());
        }

        this.initParticleTrail();
    }

    hideLoader() {
        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(this.minLoadTime - elapsed, 0);
        
        setTimeout(() => {
            this.loader.style.opacity = '0';
            setTimeout(() => {
                this.loader.style.display = 'none';
                this.mainContent.classList.remove('hidden');
            }, 800);
        }, remaining);
    }

    initParticleTrail() {
        const trailContainer = document.querySelector('.particle-trail');
        const particleCount = 20;
        const particles = [];
        const mousePos = { x: 0, y: 0 };
        const posHistory = [];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'trail-particle';
            particle.style.width = `${20 - (i * 0.8)}px`;
            particle.style.height = particle.style.width;
            particle.style.opacity = 1 - (i * 0.04);
            trailContainer.appendChild(particle);
            particles.push({
                element: particle,
                x: 0,
                y: 0
            });
        }

        document.addEventListener('mousemove', (e) => {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
        });

        const animate = () => {
            posHistory.unshift({ x: mousePos.x, y: mousePos.y });
            if (posHistory.length > particleCount) posHistory.pop();

            particles.forEach((particle, index) => {
                const targetIndex = Math.floor(index * 0.8);
                const targetPos = posHistory[targetIndex] || { x: mousePos.x, y: mousePos.y };
                
                particle.x += (targetPos.x - particle.x) * 0.3;
                particle.y += (targetPos.y - particle.y) * 0.3;

                particle.element.style.transform = `translate(
                    ${particle.x - (particle.element.offsetWidth / 2)}px, 
                    ${particle.y - (particle.element.offsetHeight / 2)}px
                )`;
            });

            requestAnimationFrame(animate);
        };

        animate();
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new CosmicLoader();
});