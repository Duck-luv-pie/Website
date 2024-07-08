document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.navigation_item');
    const home = document.getElementById('hero');
    const contact = document.getElementById('contact');

    // Highlighting navigation items on scroll
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

    // Moving the dot with the cursor
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

    document.addEventListener('mousemove', function(event) {
        if (isFirstMove) {
            cursorCircle.style.display = 'block';
            isFirstMove = false;
        }
        mouseX = event.clientX - 5;
        mouseY = event.clientY - 5;
    });

    function animateCircle() {
        circleX += (mouseX - circleX) * 0.9;
        circleY += (mouseY - circleY) * 0.9;

        cursorCircle.style.transform = `translate(${circleX}px, ${circleY}px)`;

        requestAnimationFrame(animateCircle);
    }

    animateCircle();
});
