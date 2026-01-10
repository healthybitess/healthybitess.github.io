// Main functionality for all 5 pages
document.addEventListener('DOMContentLoaded', function() {
    console.log('Healthy Bitess website loaded');
    
    // Initialize all functionality
    initSmoothScroll();
    initStickyHeader();
    initHeroAnimations();
    initIntersectionObserver();
    initImageLazyLoading();
    initLightboxGallery();
    initTestimonialSlider();
    initMenuFilter();
    initFormValidation();
    initWhatsAppIntegration();
    initMobileMenu();
    initBackToTop();
    initAccordion();
    initCounterAnimation();
    initPageLoadAnimation();
});

// 1. Smooth Scroll for all anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or external link
            if (href === '#' || href.startsWith('http')) return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 2. Sticky Header: Hide on scroll down, show on scroll up
let lastScrollTop = 0;
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show/hide header based on scroll direction
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down & past 100px
            header.classList.add('hide');
        } else {
            // Scrolling up
            header.classList.remove('hide');
        }
        
        // Add sticky class when scrolled past hero
        if (scrollTop > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
        
        lastScrollTop = scrollTop;
    });
}

// 3. Hero Animations: Timed sequence for text + image reveals
function initHeroAnimations() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // Text and image blocks are already animated via CSS classes
    // Add bounce animation to CTA buttons with delay
    const heroButtons = heroSection.querySelectorAll('.hero-btns .btn');
    heroButtons.forEach((btn, index) => {
        btn.style.animationDelay = `${1.2 + (index * 0.1)}s`;
    });
}

// 4. Intersection Observer: Trigger animations when elements enter viewport
function initIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // For counter animations
                if (entry.target.classList.contains('counter')) {
                    animateCounter(entry.target);
                }
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with fade-up class
    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });
    
    // Observe counter elements
    document.querySelectorAll('.counter').forEach(el => {
        observer.observe(el);
    });
    
    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach(el => {
        observer.observe(el);
    });
}

// 5. Image Lazy Loading
function initImageLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        
        document.querySelectorAll('img.lazy').forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Fallback for older browsers
        document.querySelectorAll('img.lazy').forEach(function(lazyImage) {
            lazyImage.src = lazyImage.dataset.src;
        });
    }
}

// 6. Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 7. Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!mobileMenuBtn || !navMenu) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close mobile menu when clicking on a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// 8. Page Load Animation
function initPageLoadAnimation() {
    document.body.style.opacity = '0';
    window.addEventListener('load', function() {
        document.body.classList.add('fade-in');
        document.body.style.opacity = '1';
    });
}


// 9. Lightbox Gallery (Gallery Page)
function initLightboxGallery() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption-text');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    let galleryImages = [];
    
    // Get all gallery images
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) return;
    
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.overlay p')?.textContent || '';
        
        galleryImages.push({
            src: img.src,
            caption: caption
        });
        
        // Add click event to each gallery item
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });
    
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
    
    function updateLightbox() {
        lightboxImg.src = galleryImages[currentImageIndex].src;
        lightboxCaption.textContent = galleryImages[currentImageIndex].caption;
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightbox();
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightbox();
    }
    
    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });
}

// 10. Testimonial Slider (Home Page & Gallery Page)
function initTestimonialSlider() {
    const sliders = document.querySelectorAll('.slider, .customer-slider');
    if (sliders.length === 0) return;
    
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide, .customer-slide');
        const dotsContainer = slider.parentElement.querySelector('.slider-dots');
        
        if (slides.length === 0) return;
        
        let currentSlide = 0;
        let slideInterval;
        
        // Create dots if they don't exist
        if (dotsContainer && dotsContainer.children.length === 0) {
            slides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }
        
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
        
        function goToSlide(n) {
            slides[currentSlide].classList.remove('active');
            if (dots.length > 0) dots[currentSlide].classList.remove('active');
            
            currentSlide = (n + slides.length) % slides.length;
            
            slides[currentSlide].classList.add('active');
            if (dots.length > 0) dots[currentSlide].classList.add('active');
        }
        
        function nextSlide() {
            goToSlide(currentSlide + 1);
        }
        
        // Auto-slide functionality
        function startAutoSlide() {
            slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        }
        
        function stopAutoSlide() {
            clearInterval(slideInterval);
        }
        
        // Start auto-slide
        startAutoSlide();
        
        // Pause on hover
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
        
        // Touch swipe for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        slider.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        slider.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left - next slide
                nextSlide();
            }
            
            if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right - previous slide
                goToSlide(currentSlide - 1);
            }
        }
    });
}

// 11. Menu Filter (Menu Page)
function initMenuFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (filterButtons.length === 0 || menuItems.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Show/hide menu items based on filter
            menuItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// 12. Form Validation & WhatsApp Integration
function initFormValidation() {
    const customOrderForm = document.getElementById('customOrderForm');
    const quickOrderForm = document.getElementById('quickOrderForm');
    
    // Custom Order Form (Menu Page)
    if (customOrderForm) {
        customOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                const name = document.getElementById('name').value;
                const phone = document.getElementById('phone').value;
                const requirements = document.getElementById('requirements').value;
                
                const message = `Hi Healthy Bitess, I would like to place a custom order.%0A%0AName: ${name}%0APhone: ${phone}%0ARequirements: ${requirements}%0A%0APlease let me know the price and delivery time.`;
                
                redirectToWhatsApp(message);
            }
        });
    }
    
    // Quick Order Form (Contact Page)
    if (quickOrderForm) {
        quickOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                const name = document.getElementById('orderName').value;
                const phone = document.getElementById('orderPhone').value;
                const details = document.getElementById('orderDetails').value;
                const address = document.getElementById('deliveryAddress').value;
                
                const message = `Hi Healthy Bitess, I would like to place an order.%0A%0AName: ${name}%0APhone: ${phone}%0AOrder Details: ${details}%0ADelivery Address: ${address}%0A%0APlease confirm availability and total amount.`;
                
                redirectToWhatsApp(message);
            }
        });
    }
}

// 13. WhatsApp Integration
function initWhatsAppIntegration() {
    // All WhatsApp buttons with pre-filled messages are handled via HTML links
    // This function handles dynamic message generation for forms
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        input.classList.remove('error');
        
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
            showToast('Please fill in all required fields.');
        }
        
        // Phone number validation
        if (input.type === 'tel' && input.value.trim()) {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(input.value.trim())) {
                input.classList.add('error');
                isValid = false;
                showToast('Please enter a valid 10-digit phone number.');
            }
        }
    });
    
    return isValid;
}

function redirectToWhatsApp(message) {
    const phoneNumber = '919764488590'; // Indian format
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    showToast('Redirecting to WhatsApp...', 'success');
}

// 14. Toast Notifications
function showToast(message, type = 'error') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide and remove toast after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// 15. Counter Animation (About Page)
function initCounterAnimation() {
    // Counters are triggered by Intersection Observer
}

function animateCounter(counterElement) {
    const target = parseInt(counterElement.getAttribute('data-target') || counterElement.textContent);
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number with commas if needed
        counterElement.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// 16. FAQ Accordion (Contact Page)
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (accordionItems.length === 0) return;
    
    accordionItems.forEach(item => {
        const btn = item.querySelector('.accordion-btn');
        const content = item.querySelector('.accordion-content');
        
        // Set initial height
        content.style.maxHeight = '0px';
        
        btn.addEventListener('click', function() {
            // Close all other items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherBtn = otherItem.querySelector('.accordion-btn');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    
                    otherBtn.classList.remove('active');
                    otherContent.style.maxHeight = '0px';
                }
            });
            
            // Toggle current item
            const isActive = btn.classList.contains('active');
            
            if (isActive) {
                btn.classList.remove('active');
                content.style.maxHeight = '0px';
            } else {
                btn.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

// 17. Image Hover Effects
function initImageHoverEffects() {
    // Add tilt effect to cards on hover
    document.querySelectorAll('.card, .menu-item, .gallery-item').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const cardRect = this.getBoundingClientRect();
            const x = e.clientX - cardRect.left;
            const y = e.clientY - cardRect.top;
            
            const centerX = cardRect.width / 2;
            const centerY = cardRect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// Initialize image hover effects after page load
window.addEventListener('load', initImageHoverEffects);

// 18. Debounce Function for Scroll Events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-intensive functions
window.addEventListener('scroll', debounce(function() {
    // Any scroll-dependent functions can go here
}, 100));

// ============ PERFORMANCE OPTIMIZATION ============

// 19. Service Worker for offline access (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// 20. Preload critical resources
function preloadCriticalResources() {
    // Preload hero images
    const heroImages = document.querySelectorAll('.hero-img[src]');
    heroImages.forEach(img => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.src;
        document.head.appendChild(link);
    });
}

// Initialize preload on DOMContentLoaded
document.addEventListener('DOMContentLoaded', preloadCriticalResources);

// ============ ACCESSIBILITY ENHANCEMENTS ============

// 21. Add keyboard navigation for custom components
document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        const mobileMenu = document.querySelector('.nav-menu.active');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            document.querySelector('.mobile-menu-btn').innerHTML = '<i class="fas fa-bars"></i>';
        }
        
        // Close lightbox on Escape
        const lightbox = document.querySelector('.lightbox.active');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// 22. Add focus styles for keyboard users
document.addEventListener('keyup', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-user');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-user');
});

// ============ ERROR HANDLING ============

// Global error handler for better debugging
window.addEventListener('error', function(e) {
    console.error('Website error:', e.error);
    // You could send this to an error tracking service
});

// ============ POLYFILLS FOR OLDER BROWSERS ============

// Intersection Observer polyfill if needed
if (!('IntersectionObserver' in window)) {
    console.log('IntersectionObserver not supported, loading polyfill...');
    // You would load the polyfill here
}

// ============ INITIALIZATION COMPLETE ============

console.log('Healthy Bitess website scripts initialized successfully');