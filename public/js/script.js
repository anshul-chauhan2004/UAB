document.addEventListener('DOMContentLoaded', function() {
    // Sticky Header
    const header = document.querySelector('.main-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Dropdown Functionality
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Search Toggle
    const searchToggle = document.querySelector('.search-toggle');
    if (searchToggle) {
        searchToggle.addEventListener('click', () => {
            // Add your search functionality here
            console.log('Search clicked');
        });
    }

    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href !== '#') {
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation classes when elements come into view
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hero-content, .hero-title, .hero-text, .hero-buttons').forEach(el => {
        observer.observe(el);
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('mobile-menu-open');
        });
    }

    // Animation observers for cards and info boxes
    const cards = document.querySelectorAll('.card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.animationPlayState = 'paused';
        cardObserver.observe(card);
    });

    const infoBoxes = document.querySelectorAll('.info-box');
    const infoBoxObserver2 = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                infoBoxObserver2.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    infoBoxes.forEach(box => {
        box.style.animationPlayState = 'paused';
        infoBoxObserver2.observe(box);
    });

    // News and events animations
    const newsItems = document.querySelectorAll('.news-item');
    const eventItems = document.querySelectorAll('.event-item');

    const animateItems2 = (items) => {
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('show');
            }, index * 200);
        });
    };

    const newsEventsObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const newsObserver2 = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateItems2(newsItems);
            newsObserver2.unobserve(entries[0].target);
        }
    }, newsEventsObserverOptions);

    const eventsObserver2 = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateItems2(eventItems);
            eventsObserver2.unobserve(entries[0].target);
        }
    }, newsEventsObserverOptions);

    if (document.querySelector('.news-section')) {
        newsObserver2.observe(document.querySelector('.news-section'));
    }
    if (document.querySelector('.events-section')) {
        eventsObserver2.observe(document.querySelector('.events-section'));
    }
});

