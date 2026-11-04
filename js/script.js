
/* ===================================== */
/* 1. ANIMATION DES PARTICULES           */
/* ===================================== */

const canvas = document.getElementById("particles");

if (canvas) {
    const ctx = canvas.getContext("2d");

    let particles = [];
    let width;
    let height;

    const particleCount = 75;
    const connectionDistance = 130;

    function resizeCanvas() {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * ratio;
        canvas.height = height * ratio;

        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;

            this.size = Math.random() * 2 + 1;

            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
        }

        move() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > width) {
                this.speedX *= -1;
            }

            if (this.y < 0 || this.y > height) {
                this.speedY *= -1;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

            ctx.fillStyle = "rgba(214, 173, 96, 0.8)";
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;

                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    const opacity = 1 - distance / connectionDistance;

                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);

                    ctx.strokeStyle =
                        `rgba(214, 173, 96, ${opacity * 0.25})`;

                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(particle => {
            particle.move();
            particle.draw();
        });

        connectParticles();

        requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    createParticles();
    animateParticles();

    window.addEventListener("resize", () => {
        resizeCanvas();
    });
}


/* ===================================== */
/* 2. DEFILEMENT FLUID                   */
/* ===================================== */

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);

        if (target) {
            event.preventDefault();

            const header = document.querySelector(".header");
            const headerHeight = header
                ? header.offsetHeight
                : 0;

            const position =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            window.scrollTo({
                top: position,
                behavior: "smooth"
            });
        }
    });
});


/* ===================================== */
/* 3. APPARITION DES ELEMENTS            */
/* ===================================== */

const elementsToReveal = document.querySelectorAll(
    ".section-titre, .information-carte, " +
    ".competence-categorie, .projet-carte, " +
    ".experience-carte, .document-carte, " +
    ".contact-carte, .contact-texte"
);

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion) {
    elementsToReveal.forEach(element => {
        element.classList.add("visible");
    });
} else {
    elementsToReveal.forEach(element => {
        element.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    elementsToReveal.forEach(element => {
        revealObserver.observe(element);
    });
}
