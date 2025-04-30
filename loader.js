// loader.js révisé
import { CosmicEngine, CosmicSnake } from './cosmic-engine.js';

// Attendre que le DOM soit prêt
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les éléments DOM
    const loader = document.querySelector('.cosmic-loader');
    const mainContent = document.querySelector('.main-content');
    
    // Vérifier l'existence des éléments
    if (!loader || !mainContent) {
        console.error('Éléments DOM manquants !');
        return;
    }

    // Initialiser les effets cosmiques
    const cosmicBackground = new CosmicEngine();
    const cosmicTrail = new CosmicSnake();

    // Gestionnaire de chargement
    window.addEventListener('load', () => {
        // Transition de disparition
        loader.style.opacity = '0';
        
        // Afficher le contenu principal après la transition
        setTimeout(() => {
            loader.style.display = 'none';
            mainContent.style.display = 'block';
        }, 500);

        // Nettoyage final
        setTimeout(() => {
            loader.remove();
        }, 1000);
    });

    // Animation de poussière d'étoiles
    document.addEventListener('mousemove', (e) => {
        const stardust = document.createElement('div');
        stardust.className = 'stardust';
        Object.assign(stardust.style, {
            left: `${e.pageX}px`,
            top: `${e.pageY}px`,
            width: `${Math.random() * 10}px`,
            height: `${Math.random() * 10}px`
        });
        
        document.body.appendChild(stardust);
        
        setTimeout(() => stardust.remove(), 1000);
    });
});