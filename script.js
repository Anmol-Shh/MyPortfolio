// Mobile menu functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Initialize animation delays for cards
const initializeCardAnimations = () => {
    // Set animation delays for skill cards
    document.querySelectorAll('.skill-card').forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });

    // Set animation delays for project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });
};

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Close mobile menu if open
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            
            // Smooth scroll to target
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Reveal animations on scroll
const revealElements = document.querySelectorAll('.skill-card, .project-card');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

// Initialize animations
window.addEventListener('load', () => {
    initializeCardAnimations();
    revealOnScroll();
});

window.addEventListener('scroll', revealOnScroll);

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', data);
        
        // Show success message (you can customize this)
        alert('Thank you for your message! I will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}

// Projects Slider
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.projects-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const sliderDots = document.querySelector('.slider-dots');
    const cards = document.querySelectorAll('.project-card');
    
    let currentIndex = 0;
    let startX;
    let scrollLeft;
    let isDown;
    let slideWidth;

    function initializeSlider() {
        slideWidth = slider.offsetWidth / 2; // Width for 2 cards
        updateActiveStates();
        updateButtonStates();
    }

    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
    });

    function updateActiveStates() {
        const currentPosition = Math.round(slider.scrollLeft / slideWidth);
        
        // Update dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPosition);
        });

        // Update cards
        cards.forEach((card, index) => {
            const isFirstActive = currentPosition === index;
            const isSecondActive = currentPosition + 1 === index;
            card.classList.toggle('active', isFirstActive || isSecondActive);
        });
    }

    function updateButtonStates() {
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
        
        const maxIndex = cards.length - 2; // Show 2 cards at a time
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
    }

    function goToSlide(index) {
        currentIndex = index;
        slider.scrollTo({
            left: slideWidth * index,
            behavior: 'smooth'
        });
        updateActiveStates();
        updateButtonStates();
    }

    function nextSlide() {
        if (currentIndex < cards.length - 2) {
            currentIndex++;
            goToSlide(currentIndex);
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            goToSlide(currentIndex);
        }
    }

    // Mouse events for drag scrolling
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
        // Snap to nearest slide
        currentIndex = Math.round(slider.scrollLeft / slideWidth);
        goToSlide(currentIndex);
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX);
        slider.scrollLeft = scrollLeft - walk;
    });

    // Button click events
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Update active states on scroll
    slider.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            currentIndex = Math.round(slider.scrollLeft / slideWidth);
            updateActiveStates();
            updateButtonStates();
        });
    });

    // Auto-play functionality
    let autoplayInterval;

    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            if (currentIndex < cards.length - 2) {
                nextSlide();
            } else {
                goToSlide(0);
            }
        }, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Initialize slider
    window.addEventListener('load', initializeSlider);
    window.addEventListener('resize', initializeSlider);

    // Start autoplay initially
    startAutoplay();

    // Stop autoplay on user interaction
    slider.addEventListener('mouseenter', stopAutoplay);
    prevBtn.addEventListener('mouseenter', stopAutoplay);
    nextBtn.addEventListener('mouseenter', stopAutoplay);
    sliderDots.addEventListener('mouseenter', stopAutoplay);

    // Resume autoplay when user leaves
    slider.addEventListener('mouseleave', startAutoplay);
    prevBtn.addEventListener('mouseleave', startAutoplay);
    nextBtn.addEventListener('mouseleave', startAutoplay);
    sliderDots.addEventListener('mouseleave', startAutoplay);
}); 