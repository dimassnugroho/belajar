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
// Livespace slider — dynamic pagination (desktop:6, tablet:4, mobile:2)
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.livespace-track');
    const prevBtn = document.querySelector('.livespace-prev');
    const nextBtn = document.querySelector('.livespace-next');
    const dotsContainer = document.querySelector('.livespace-dots');
    if (!track) return;

    let allCards = Array.from(track.querySelectorAll('.property-card'));
    let pages = [];
    let current = 0;

    function getPageSize() {
        const w = window.innerWidth;
        if (w >= 1024) return 6; // 3 cols x 2 rows
        if (w >= 640) return 4;  // 2 cols x 2 rows
        return 6;                // mobile - 6 cards per slide in 1 column
    }

    function buildSlides() {
        // reset
        pages = [];
        const pageSize = getPageSize();
        // ensure we have the latest set of cards (in case cards moved)
        allCards = Array.from(document.querySelectorAll('.livespace .property-card'));

        for (let i = 0; i < allCards.length; i += pageSize) {
            pages.push(allCards.slice(i, i + pageSize));
        }

        // clear track and dots
        track.innerHTML = '';
        dotsContainer && (dotsContainer.innerHTML = '');

        // create slides
        pages.forEach((items, idx) => {
            const slide = document.createElement('div');
            slide.className = 'livespace-slide';

            const grid = document.createElement('div');
            grid.className = 'property-grid';

            items.forEach(node => grid.appendChild(node)); // moves node
            slide.appendChild(grid);
            track.appendChild(slide);

            if (dotsContainer) {
                const dot = document.createElement('button');
                dot.className = 'dot' + (idx === 0 ? ' active' : '');
                dot.dataset.index = idx;
                dot.setAttribute('aria-label', `Slide ${idx + 1}`);
                dot.addEventListener('click', () => {
                    current = idx;
                    update();
                });
                dotsContainer.appendChild(dot);
            }
        });

        // set widths
        const slideCount = pages.length || 1;
        track.style.width = `${slideCount * 100}%`;
        track.querySelectorAll('.livespace-slide').forEach(s => s.style.width = `${100 / slideCount}%`);
        // reset current if out of bounds
        current = Math.min(current, slideCount - 1);
        update();
    }

    function update() {
        const slideCount = track.querySelectorAll('.livespace-slide').length || 1;
        const percent = -(current * (100 / slideCount));
        track.style.transform = `translateX(${percent}%)`;
        // update dots
        const dots = Array.from(document.querySelectorAll('.livespace-dots .dot'));
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === slideCount - 1;
    }

    prevBtn.addEventListener('click', () => {
        current = Math.max(0, current - 1);
        update();
    });

    nextBtn.addEventListener('click', () => {
        const max = track.querySelectorAll('.livespace-slide').length - 1;
        current = Math.min(max, current + 1);
        update();
    });

    // keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const trackWrapper = document.querySelector('.livespace-track-wrapper');
    
    if (trackWrapper) {
        trackWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        trackWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50; // minimum distance for swipe
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - next
                nextBtn.click();
            } else {
                // Swiped right - prev
                prevBtn.click();
            }
        }
    }

    // rebuild on resize (debounced)
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(buildSlides, 150);
    });

    // initial build
    buildSlides();
});

// Scroll Spy - Active navbar menu based on scroll position
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-menu a[href^="#"], .mobile-menu a[href^="#"]');
    
    function setActiveLink() {
        let current = '';
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Adjust offset to trigger earlier (100px before reaching section)
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        // If at the very top of the page, set home as active
        if (scrollY < 100) {
            current = 'home';
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Run on scroll
    window.addEventListener('scroll', setActiveLink);
    
    // Run on page load
    setActiveLink();
    
    // Smooth scroll for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // 80px offset for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Surrounding Auto-Slide (Mobile Only)
document.addEventListener('DOMContentLoaded', () => {
    const surroundingGrid = document.querySelector('.surrounding-grid');
    const surroundingDots = document.querySelectorAll('.surrounding-dot');
    
    if (!surroundingGrid || surroundingDots.length === 0) return;

    let currentSlide = 0;
    let autoSlideInterval = null;
    
    function isMobile() {
        return window.innerWidth < 640;
    }

    function updateGrid() {
        if (!isMobile()) return;
        
        const cards = Array.from(surroundingGrid.querySelectorAll('.surrounding-card'));
        const cardsPerSlide = 4;
        
        cards.forEach((card, idx) => {
            const slideIndex = Math.floor(idx / cardsPerSlide);
            if (slideIndex === currentSlide) {
                card.style.display = 'grid';
                card.style.gridColumn = 'span 1';
            } else {
                card.style.display = 'none';
            }
        });

        // Update dots
        surroundingDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlide);
        });
    }

    function nextSlide() {
        const totalCards = surroundingGrid.querySelectorAll('.surrounding-card').length;
        const maxSlides = Math.ceil(totalCards / 4);
        currentSlide = (currentSlide + 1) % maxSlides;
        updateGrid();
    }

    function startAutoSlide() {
        if (!isMobile()) return;
        
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds
    }

    // Dot click handlers
    surroundingDots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            currentSlide = idx;
            updateGrid();
            startAutoSlide(); // Restart timer when user clicks
        });
    });

    // Resize handler
    window.addEventListener('resize', () => {
        if (isMobile()) {
            currentSlide = 0; // Reset to first slide on resize
            updateGrid();
            startAutoSlide();
        } else {
            clearInterval(autoSlideInterval);
            surroundingGrid.querySelectorAll('.surrounding-card').forEach(card => {
                card.style.display = '';
                card.style.gridColumn = '';
            });
        }
    });

    // Initial setup
    if (isMobile()) {
        updateGrid();
        startAutoSlide();
    }
});
// Property Card Slider Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize slider state for each slider
    const sliders = document.querySelectorAll('.property-slider');
    const sliderState = new WeakMap();
    
    sliders.forEach(slider => {
        const images = slider.querySelectorAll('.slider-image');
        if (images.length > 0) {
            // Initialize state
            sliderState.set(slider, {
                currentIndex: 0,
                totalImages: images.length
            });
            
            // Hide all images except first
            images.forEach((img, index) => {
                img.style.display = index === 0 ? 'block' : 'none';
            });
        }
    });
    
    // Add click handlers to slider buttons
    const sliderBtns = document.querySelectorAll('.slider-btn');
    
    sliderBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const slider = btn.closest('.property-slider');
            const images = slider.querySelectorAll('.slider-image');
            
            if (images.length <= 1) return; // Skip if only one image
            
            const state = sliderState.get(slider);
            let newIndex = state.currentIndex;
            
            if (btn.classList.contains('slider-next')) {
                newIndex = (newIndex + 1) % images.length; // Loop to first image if at end
            } else if (btn.classList.contains('slider-prev')) {
                newIndex = (newIndex - 1 + images.length) % images.length; // Loop to last if at start
            }
            
            // Update state
            state.currentIndex = newIndex;
            
            // Hide all images
            images.forEach(img => img.style.display = 'none');
            
            // Show current image with fade animation
            images[newIndex].style.display = 'block';
            slider.style.animation = btn.classList.contains('slider-next') ? 'slideRight 0.3s ease' : 'slideLeft 0.3s ease';
            
            // Reset animation
            setTimeout(() => {
                slider.style.animation = '';
            }, 300);
        });
    });
});