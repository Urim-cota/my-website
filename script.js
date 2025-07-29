// Main JavaScript functionality for TeknoLajme.al
document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation functionality
    initNavigation();
    
    // Search functionality
    initSearch();
    
    // Card hover effects
    initCardEffects();
    
    // Breaking news ticker
    initBreakingNewsTicker();
    
    // Smooth scrolling
    initSmoothScrolling();
    
    // Mobile menu functionality
    initMobileMenu();
});

// Navigation active state management
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Update page content based on selection (placeholder)
            const category = this.textContent.trim();
            console.log(`Loading ${category} content...`);
        });
    });
}

// Search functionality
function initSearch() {
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', performSearch);
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Search suggestions (placeholder)
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length > 2) {
                // Here you could implement live search suggestions
                console.log(`Searching for: ${query}`);
            }
        });
    }
}

function performSearch() {
    const searchInput = document.querySelector('.search-box input');
    const query = searchInput.value.trim();
    
    if (query) {
        // Placeholder search functionality
        alert(`Po kërkon për: "${query}"`);
        
        // In a real application, you would:
        // - Send AJAX request to search endpoint
        // - Display search results
        // - Update URL with search parameters
        
        console.log(`Performing search for: ${query}`);
    }
}

// Card hover effects and animations
function initCardEffects() {
    const cards = document.querySelectorAll('.news-card, .featured-story');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Click effects for news cards
        card.addEventListener('click', function() {
            console.log('Opening article:', this.querySelector('h3, h4').textContent);
            // Here you would navigate to the full article
        });
    });
}

// Breaking news ticker effect
function initBreakingNewsTicker() {
    const breakingNewsItems = document.querySelectorAll('.breaking-news li');
    let currentIndex = 0;
    
    if (breakingNewsItems.length > 0) {
        setInterval(() => {
            // Fade out current item
            breakingNewsItems[currentIndex].style.opacity = '0.7';
            breakingNewsItems[currentIndex].style.transform = 'translateX(-10px)';
            
            // Move to next item
            currentIndex = (currentIndex + 1) % breakingNewsItems.length;
            
            setTimeout(() => {
                // Reset all items
                breakingNewsItems.forEach(item => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                    item.style.transition = 'all 0.3s ease';
                });
                
                // Highlight current item
                breakingNewsItems[currentIndex].style.opacity = '1';
                breakingNewsItems[currentIndex].style.transform = 'translateX(5px)';
            }, 300);
        }, 4000);
    }
}

// Smooth scrolling for internal links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    
    // Add mobile menu toggle (you'd need to add the button in HTML)
    if (window.innerWidth <= 768) {
        console.log('Mobile view detected');
        // Mobile-specific functionality would go here
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            // Mobile layout adjustments
            console.log('Switched to mobile view');
        } else {
            // Desktop layout adjustments
            console.log('Switched to desktop view');
        }
    });
}

// Utility functions
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

// Lazy loading for images (when you add real images)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Social sharing functionality
function shareArticle(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        });
    } else {
        // Fallback for browsers without Web Share API
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank');
    }
}

// Dark mode toggle (future feature)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Load saved preferences
function loadUserPreferences() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
}

// Initialize user preferences on load
// loadUserPreferences();