/**
 * Professional Single-Page Portfolio Script
 * Features: Smooth Scroll, Active Link Highlighting, Typewriter, Intersection Observer Reveal
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Precise Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navLinksList = document.querySelector('.nav-links');
                if (navLinksList.classList.contains('mobile-active')) {
                    navLinksList.classList.remove('mobile-active');
                    const icon = document.querySelector('#mobile-toggle i');
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            }
        });
    });

    // 2. Active Link Highlighting on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function highlightNav() {
        let scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // 3. Navbar Sticky & Scroll Effects
    const navbar = document.getElementById('navbar');
    
    function handleNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', () => {
        handleNavbar();
        highlightNav();
    });

    // 4. Typewriter Animation
    const TxtType = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

    TxtType.prototype.tick = function() {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

        let that = this;
        let delta = 200 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(function() {
            that.tick();
        }, delta);
    };

    const typeElements = document.getElementsByClassName('typewrite');
    for (let i = 0; i < typeElements.length; i++) {
        const toRotate = typeElements[i].getAttribute('data-type');
        const period = typeElements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtType(typeElements[i], JSON.parse(toRotate), period);
        }
    }

    // 5. Intersection Observer for Reveals
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-reveal');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section, .glass-container, .project-card, .skill-category, .stat-card').forEach(el => {
        el.classList.add('reveal-hidden');
        revealObserver.observe(el);
    });

    // 6. Progress Bar Animation
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const percent = fill.getAttribute('data-percent');
                fill.style.width = percent;
                progressObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.progress-fill').forEach(fill => {
        progressObserver.observe(fill);
    });

    // 7. Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinksList = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinksList) {
        mobileToggle.addEventListener('click', () => {
            navLinksList.classList.toggle('mobile-active');
            const icon = mobileToggle.querySelector('i');
            if (navLinksList.classList.contains('mobile-active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
    }

    // 8. Contact Form
    const contactForm = document.getElementById('portfolio-contact');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            btn.disabled = true;
            btn.innerHTML = 'Sending...';
            setTimeout(() => {
                const status = document.getElementById('form-status');
                status.textContent = 'Message sent successfully!';
                status.style.color = '#FFB800';
                contactForm.reset();
                btn.disabled = false;
                btn.innerHTML = 'Send Message <i data-lucide="send"></i>';
                lucide.createIcons();
            }, 1000);
        });
    }
});

// Animation Classes Injection
const styleScroll = document.createElement('style');
styleScroll.textContent = `
    .reveal-hidden {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .animate-reveal {
        opacity: 1;
        transform: translateY(0);
    }
    .nav-links a.active {
        color: var(--primary) !important;
    }
    .nav-links a.active::after {
        content: '';
        display: block;
        width: 100%;
        height: 2px;
        background: var(--primary);
        margin-top: 4px;
        border-radius: 2px;
    }
`;
document.head.appendChild(styleScroll);

// Initialize Icons Globally
lucide.createIcons();
