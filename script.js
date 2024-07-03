document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.navigation__item');
    const home = document.getElementById('hero');
    const contact = document.getElementById('contact');

    window.addEventListener('scroll', () => {
        let current = 'hero'; // Default to 'hero' to ensure something is always highlighted

        // Check if the pageYOffset (scroll position) is less than the height of the home section minus 60 pixels
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

            // Check if the scroll position plus the window height is greater than or equal to the total height of the document minus 2 pixels
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
    
    const cursorCircle = document.querySelector('.cursor-circle');

    let mouseX = 0;
    let mouseY = 0;
    let circleX = 0;
    let circleY = 0;

    document.addEventListener('mousemove', function(event) {
        mouseX = event.clientX-6;
        mouseY = event.clientY-5;
    });

    function animateCircle() {
        circleX += (mouseX - circleX) * 0.9;
        circleY += (mouseY - circleY) * 0.9;

        cursorCircle.style.transform = `translate(${circleX}px, ${circleY}px)`;

        requestAnimationFrame(animateCircle);
    }

    animateCircle();
});


