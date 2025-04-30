import * as THREE from 'three';
import { SimplexNoise } from 'simplex-noise';

// Configuration Three.js pour l'arrière-plan cosmique
export class CosmicEngine {
    constructor() {
        this.initThreeJS();
        this.initEventListeners();
        this.animate();
    }

    initThreeJS() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '-1';
        document.body.prepend(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        this.createStarField();
    }

    createStarField() {
        const starsGeometry = new THREE.BufferGeometry();
        const starCount = 5000;
        const positions = new Float32Array(starCount * 3);

        for(let i = 0; i < starCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 2000;
            positions[i+1] = (Math.random() - 0.5) * 2000;
            positions[i+2] = (Math.random() - 0.5) * 2000;
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.7,
            transparent: true,
            opacity: 0.8
        });

        this.starField = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(this.starField);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.starField.rotation.x += 0.0001;
        this.starField.rotation.y += 0.0001;
        
        this.renderer.render(this.scene, this.camera);
    }

    resizeHandler() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    initEventListeners() {
        this.resizeHandler();
    }
}

// Classe pour l'effet serpent
export class CosmicSnake {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.className = 'cosmic-trail canvas-glows'; // Ajout de la classe pour le style
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '9998';
        this.canvas.style.pointerEvents = 'none';
        document.body.prepend(this.canvas);

        this.points = Array(30).fill().map(() => ({
            x: 0,
            y: 0,
            vx: 0,
            vy: 0
        }));
        this.mousePos = { x: 0, y: 0 };
        this.speed = 0.2;
        this.spring = 0.1;
        this.friction = 0.85;
        this.simplex = new SimplexNoise();
        this.time = 0;

        this.resize();
        this.init();
        this.animate();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    update() {
        this.time += 0.005;
        
        // Mise à jour du point leader avec bruit Simplex
        const noiseX = this.simplex.noise2D(this.time, 0) * 15;
        const noiseY = this.simplex.noise2D(0, this.time) * 15;
        
        this.points[0].vx += (this.mousePos.x + noiseX - this.points[0].x) * this.spring;
        this.points[0].vy += (this.mousePos.y + noiseY - this.points[0].y) * this.spring;
        this.points[0].vx *= this.friction;
        this.points[0].vy *= this.friction;
        this.points[0].x += this.points[0].vx;
        this.points[0].y += this.points[0].vy;

        // Mise à jour des points suivants avec dynamique de ressort
        for(let i = 1; i < this.points.length; i++) {
            const prev = this.points[i-1];
            const current = this.points[i];
            
            current.vx += (prev.x - current.x) * this.spring;
            current.vy += (prev.y - current.y) * this.spring;
            current.vx *= this.friction;
            current.vy *= this.friction;
            current.x += current.vx;
            current.y += current.vy;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Configuration du style
        this.ctx.lineCap = 'round';
        this.ctx.shadowColor = 'rgba(139, 92, 246, 0.8)';
        this.ctx.shadowBlur = 20;

        // Dessin de la ligne avec dégradé et épaisseur variable
        for(let i = 1; i < this.points.length; i++) {
            const progress = i / this.points.length;
            const gradient = this.ctx.createLinearGradient(
                this.points[i-1].x, this.points[i-1].y,
                this.points[i].x, this.points[i].y
            );
            
            gradient.addColorStop(0, `hsla(${280 + progress * 40}, 80%, 70%, ${1 - progress})`);
            gradient.addColorStop(1, `hsla(${280 + progress * 40}, 80%, 70%, ${0.8 - progress})`);

            this.ctx.beginPath();
            this.ctx.moveTo(this.points[i-1].x, this.points[i-1].y);
            this.ctx.lineTo(this.points[i].x, this.points[i].y);
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 8 * (1 - progress) + 2;
            this.ctx.stroke();
        }

        // Dessin des particules de queue
        const lastPoint = this.points[this.points.length - 1];
        this.ctx.beginPath();
        this.ctx.arc(lastPoint.x, lastPoint.y, 3, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(139, 92, 246, 0.5)`;
        this.ctx.fill();
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}