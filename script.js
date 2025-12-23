// ===================================
// VASKAR CHAKMA - PORTFOLIO SCRIPT
// Enhanced with Global Visitor Counter, Custom Cursor & Dark Mode
// ===================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    updateLastModified();
    initScrollToTop();
    initSmoothScroll();
    initActiveNavHighlight();
    initScrollAnimation();
    initMobileMenu();
    initCustomCursor();
    initThemeToggle();
    initVisitorCounter();
});

// ========== GLOBAL VISITOR COUNTER (CountAPI) ==========
function initVisitorCounter() {
    const counterElement = document.getElementById('visitorCount');
    
    if (!counterElement) return;
    
    // Show loading state
    counterElement.textContent = 'Loading...';
    
    // Your unique namespace - IMPORTANT: Change this to something unique!
    const namespace = 'vaskar-chakma-site';
    const key = 'visitor-count';
    
    // ALWAYS INCREMENT - count every page load as a visit
    fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const count = data.value;
            counterElement.textContent = `Visitors: ${count.toLocaleString()}`;
            
            // Add pulse animation
            counterElement.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                counterElement.style.animation = '';
            }, 500);
            
            console.log(`✓ Visitor counted! Total visits: ${count}`);
        })
        .catch(error => {
            console.error('Error fetching visitor count:', error);
            
            // Fallback: Try to get count without incrementing
            fetch(`https://api.countapi.xyz/get/${namespace}/${key}`)
                .then(response => response.json())
                .then(data => {
                    if (data.value !== undefined) {
                        counterElement.textContent = `Visitors: ${data.value.toLocaleString()}`;
                    } else {
                        counterElement.textContent = 'Visitors: 1';
                    }
                })
                .catch(() => {
                    counterElement.textContent = 'Visitors: --';
                });
        });
}

// ========== CUSTOM CURSOR ==========
function initCustomCursor() {
    // Only initialize on desktop devices
    if (window.innerWidth <= 768) return;
    
    const cursor = document.querySelector('.cursor-highlight');
    if (!cursor) return;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Add hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .nav-link, .pub-title');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
    
    // Hide cursor when leaving viewport
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
}

// ========== THEME TOGGLE (DARK/LIGHT MODE) ==========
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    if (!themeToggle) return;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        const isDark = document.body.classList.contains('dark-mode');
        
        // Update icon
        themeIcon.textContent = isDark ? '☀️' : '🌙';
        
        // Save preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Show notification
        showNotification(isDark ? 'Dark mode enabled' : 'Light mode enabled');
    });
}

// ========== UPDATE LAST MODIFIED DATE ==========
function updateLastModified() {
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        lastUpdatedElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

// ========== SCROLL TO TOP BUTTON ==========
function initScrollToTop() {
    const scrollButton = document.getElementById('scrollToTop');
    
    if (!scrollButton) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    });
    
    // Scroll to top when button is clicked
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========== SMOOTH SCROLLING FOR NAVIGATION ==========
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbar = document.querySelector('nav');
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileNav = document.getElementById('navbar');
                const menuToggle = document.getElementById('mobileMenuToggle');
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    if (menuToggle) {
                        menuToggle.classList.remove('active');
                    }
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

// ========== ACTIVE NAVIGATION HIGHLIGHT ==========
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.pageYOffset + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ========== SCROLL ANIMATION ==========
function initScrollAnimation() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: show all elements immediately
        const elements = document.querySelectorAll('.publication-item, .education-item, .experience-item');
        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe publication items
    const publicationItems = document.querySelectorAll('.publication-item');
    publicationItems.forEach(el => {
        observer.observe(el);
    });
}

// ========== MOBILE MENU ==========
function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navbar = document.getElementById('navbar');
    
    if (!menuToggle || !navbar) return;
    
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        navbar.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navbar.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && !menuToggle.contains(e.target)) {
            navbar.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on window resize if screen becomes larger
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navbar.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ========== COPY EMAIL TO CLIPBOARD ==========
function copyEmail(email) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
            showNotification('Email copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy email:', err);
        });
    }
}

// ========== NOTIFICATION HELPER ==========
function showNotification(message) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background-color: #1a73e8;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-size: 0.9em;
        animation: slideIn 0.3s ease;
    `;
    
    // Adjust notification style for dark mode
    if (document.body.classList.contains('dark-mode')) {
        notification.style.backgroundColor = '#424242';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2500);
}

// ========== ADD CSS ANIMATIONS ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(style);

// ========== PERFORMANCE MONITORING ==========
window.addEventListener('load', function() {
    if ('performance' in window && performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`✓ Page loaded in ${loadTime}ms`);
    }
    
    // Log publication count
    const publications = document.querySelectorAll('.publication-item');
    console.log(`✓ ${publications.length} publications loaded`);
    
    // Log feature status
    console.log('✓ Features enabled: Real-time Global Visitor Counter, Custom Cursor, Dark Mode');
});
