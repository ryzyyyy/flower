onload = () =>{
        document.body.classList.remove("container");

        // Stars Animation
        const starsContainer = document.getElementById('stars-container');
        if (starsContainer) {
                for (let i = 0; i < 120; i++) {
                        const star = document.createElement('div');
                        star.className = 'star';
                        star.style.left = Math.random() * window.innerWidth + 'px';
                        star.style.top = Math.random() * window.innerHeight + 'px';
                        star.style.animationDelay = (Math.random() * 2) + 's';
                        starsContainer.appendChild(star);
                }
        }

        // Hearts Animation
        const heartsContainer = document.getElementById('hearts-container');
        function createHeart() {
                if (!heartsContainer) return;
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.style.left = Math.random() * (window.innerWidth - 40) + 'px';
                heart.style.top = (window.innerHeight + 40) + 'px';
                heart.style.animationDuration = (4 + Math.random() * 3) + 's';
                // Heart shape
                const shape = document.createElement('div');
                shape.className = 'heart-shape';
                heart.appendChild(shape);
                heartsContainer.appendChild(heart);
                setTimeout(() => heart.remove(), 7000);
        }
        setInterval(createHeart, 700);

        // Fireworks Animation
        const canvas = document.getElementById('fireworks-canvas');
        if (!canvas) return;
        canvas.className = 'fireworks-canvas';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');

        const colors = [
                '#ffb6c1', // light pink
                '#ff69b4', // hot pink
                '#fffacd', // lemon chiffon
                '#ffe4e1', // misty rose
                '#e6e6fa', // lavender
                '#ffd700', // gold
                '#ffec8b', // light goldenrod
        ];

        function randomBetween(a, b) {
                return a + Math.random() * (b - a);
        }

        class Firework {
                constructor() {
                        this.x = randomBetween(canvas.width * 0.2, canvas.width * 0.8);
                        this.y = canvas.height;
                        this.targetY = randomBetween(canvas.height * 0.2, canvas.height * 0.5);
                        this.color = colors[Math.floor(Math.random() * colors.length)];
                        this.particles = [];
                        this.exploded = false;
                }
                update() {
                        if (!this.exploded) {
                                this.y -= 6;
                                if (this.y <= this.targetY) {
                                        this.explode();
                                }
                        } else {
                                this.particles.forEach(p => p.update());
                        }
                }
                draw(ctx) {
                        if (!this.exploded) {
                                ctx.save();
                                ctx.beginPath();
                                ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
                                ctx.fillStyle = this.color;
                                ctx.shadowColor = this.color;
                                ctx.shadowBlur = 12;
                                ctx.fill();
                                ctx.restore();
                        } else {
                                this.particles.forEach(p => p.draw(ctx));
                        }
                }
                explode() {
                        this.exploded = true;
                        const count = 32 + Math.floor(Math.random() * 16);
                        for (let i = 0; i < count; i++) {
                                const angle = (2 * Math.PI * i) / count;
                                const speed = randomBetween(2, 5);
                                this.particles.push(new Particle(this.x, this.y, angle, speed, this.color));
                        }
                }
                isDone() {
                        return this.exploded && this.particles.every(p => p.alpha <= 0);
                }
        }

        class Particle {
                constructor(x, y, angle, speed, color) {
                        this.x = x;
                        this.y = y;
                        this.vx = Math.cos(angle) * speed;
                        this.vy = Math.sin(angle) * speed;
                        this.alpha = 1;
                        this.color = color;
                }
                update() {
                        this.x += this.vx;
                        this.y += this.vy;
                        this.vy += 0.05; // gravity
                        this.vx *= 0.98;
                        this.vy *= 0.98;
                        this.alpha -= 0.012;
                }
                draw(ctx) {
                        if (this.alpha <= 0) return;
                        ctx.save();
                        ctx.globalAlpha = Math.max(this.alpha, 0);
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, 2.5, 0, 2 * Math.PI);
                        ctx.fillStyle = this.color;
                        ctx.shadowColor = this.color;
                        ctx.shadowBlur = 16;
                        ctx.fill();
                        ctx.restore();
                }
        }

        let fireworks = [];
        let lastFirework = 0;

        function animate(ts) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Kurangi frekuensi dan jumlah kembang api agar tidak ngelag
                if (ts - lastFirework > 900) {
                        const count = Math.floor(randomBetween(1, 2));
                        for (let i = 0; i < count; i++) {
                                fireworks.push(new Firework());
                        }
                        lastFirework = ts;
                }
                fireworks.forEach(fw => {
                        fw.update();
                        fw.draw(ctx);
                });
                fireworks = fireworks.filter(fw => !fw.isDone());
                requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
        });

        animate(0);
};
