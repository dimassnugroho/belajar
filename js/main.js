// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const mobileLinks = mobileMenu.querySelectorAll('a, button');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    // Hero Content Animations
    gsap.from('.hero-badge', {
        duration: 0.8,
        opacity: 0,
        y: 30,
        ease: 'power2.out'
    });

    gsap.from('.hero-title', {
        duration: 0.8,
        opacity: 0,
        y: 30,
        delay: 0.2,
        ease: 'power2.out'
    });

    gsap.from('.hero-bottom', {
        duration: 0.8,
        opacity: 0,
        y: 30,
        delay: 0.4,
        ease: 'power2.out'
    });

    // Hero Image Animation
    gsap.from('.hero-image', {
        duration: 0.8,
        opacity: 0,
        scale: 0.95,
        delay: 0.4,
        ease: 'power2.out'
    });
});

console.log('Bintaro Jaya Landing Page Loaded');
