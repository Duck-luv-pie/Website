document.addEventListener('DOMContentLoaded', function() {
    // Navigation highlighting
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.navigation_item');
    const home = document.getElementById('hero');
    const contact = document.getElementById('contact');

    window.addEventListener('scroll', () => {
        let current = 'hero';

        if (pageYOffset < home.offsetHeight - 60) {
            current = 'hero';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - 60 && pageYOffset < sectionTop + sectionHeight - 60) {
                    current = section.getAttribute('id');
                }
            });

            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
                current = 'contact';
            }
        }

        navItems.forEach(item => {
            item.classList.remove('navigation_item--active');
            if (item.querySelector('a').getAttribute('href').substring(1) === current) {
                item.classList.add('navigation_item--active');
            }
        });
    });
    
    // Cursor circle
    const cursorCircle = document.querySelector('.cursor-circle');
    if (!cursorCircle) {
        console.error('Cursor circle element not found');
        return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let circleX = 0;
    let circleY = 0;
    let isFirstMove = true;

    function isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
      }

      
    if (!isMobileDevice()) {
        document.addEventListener('mousemove', function(event) {
            if (isFirstMove) {
                cursorCircle.style.display = 'block';
                isFirstMove = false;
            }
            mouseX = event.clientX - 10; 
            mouseY = event.clientY - 10; 
        });
    }

    function animateCircle() {
        circleX += (mouseX - circleX) * 0.9;
        circleY += (mouseY - circleY) * 0.9;

        cursorCircle.style.transform = `translate(${circleX}px, ${circleY}px)`;

        requestAnimationFrame(animateCircle);
    }

    animateCircle();

    // Background Animation
    const canvas = document.querySelector(".intro_background");
    const ctx = canvas.getContext("2d");
    let width = canvas.width = canvas.clientWidth;
    let height = canvas.height = canvas.clientHeight;
    
    const nodes = [];
    const mouse = { x: width / 2, y: height / 2 };
    const centerX = width / 2;
    const centerY = height / 2;
    const textAreaRadius = Math.min(width, height) * 0.3;

    function calculateNodeCount() {
        const area = width * height;
        const baseCount = 180; 
        const baseDensity = baseCount / (1920 * 1080); 
        return Math.floor(area * baseDensity);
    }

    function createNodes() {
        const nodeCount = calculateNodeCount();
        nodes.length = 0; 
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                state: 'moving',
                stateTimer: Math.random() * 100 + 50,
                targetVx: 0,
                targetVy: 0
            });
        }
    }

    createNodes();

    function calculateCenterRepulsion(x, y) {
        const dx = (x - centerX);
        const dy = (y - centerY);
        const distanceSquared = dx * dx + dy * dy;
        const distance = Math.sqrt(distanceSquared);
        
        if (distance < textAreaRadius) {
            const repulsionStrength = 0.1 * (1 - distance / textAreaRadius);
            return {
                x: (dx / distance) * repulsionStrength,
                y: (dy / distance) * repulsionStrength
            };
        }
        return { x: 0, y: 0 };
    }

    function updateNodes() {
        for (const node of nodes) {
            switch(node.state) {
                case 'moving':
                    node.stateTimer--;
                    if (node.stateTimer <= 0) {
                        node.state = 'decelerating';
                        node.stateTimer = 30;
                    }
                    break;
                case 'decelerating':
                    node.vx *= 0.9;
                    node.vy *= 0.9;
                    node.stateTimer--;
                    if (node.stateTimer <= 0) {
                        node.state = 'changing';
                        node.targetVx = (Math.random() - 0.5) * 0.8;
                        node.targetVy = (Math.random() - 0.5) * 0.8;
                        node.stateTimer = 30;
                    }
                    break;
                case 'changing':
                    node.vx += (node.targetVx - node.vx) * 0.1;
                    node.vy += (node.targetVy - node.vy) * 0.1;
                    node.stateTimer--;
                    if (node.stateTimer <= 0) {
                        node.state = 'moving';
                        node.stateTimer = Math.random() * 100 + 50;
                    }
                    break;
            }

            const repulsion = calculateCenterRepulsion(node.x, node.y);
            node.vx += repulsion.x;
            node.vy += repulsion.y;

            node.x += node.vx;
            node.y += node.vy;

            if (node.x <= 0 || node.x >= width) {
                node.vx *= -1;
                node.targetVx *= -1;
            }
            if (node.y <= 0 || node.y >= height) {
                node.vy *= -1;
                node.targetVy *= -1;
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        for (const node of nodes) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#FEC260";
            ctx.fill();

            for (const otherNode of nodes) {
                const dx = node.x - otherNode.x;
                const dy = node.y - otherNode.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(otherNode.x, otherNode.y);
                    ctx.strokeStyle = `rgba(254, 194, 96, ${1 - distance / 100})`;
                    ctx.stroke();
                }
            }
        }
    }

    document.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        for (const node of nodes) {
            const dx = node.x - mouse.x;
            const dy = node.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;

            if (distance < 100) {
                const force = (100 - distance) / 100 * 2;
                node.vx += forceDirectionX * force;
                node.vy += forceDirectionY * force;
                node.state = 'moving';
                node.stateTimer = Math.random() * 100 + 50;
            }
        }
    });

    window.addEventListener("resize", () => {
        width = canvas.width = canvas.clientWidth;
        height = canvas.height = canvas.clientHeight;
        createNodes();
    });

    function animate() {
        updateNodes();
        draw();
        requestAnimationFrame(animate);
    }

    animate();
});