/* -------------------------------------------------------------
 * SCRIPT.JS - Interactivity & Premium Aesthetics Controller
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. Navigation & Scroll Progress Bar
    // ---------------------------------------------------------
    const scrollProgressBar = document.getElementById('scroll-progress');
    const mainHeader = document.getElementById('main-header');
    const backToTopBtn = document.getElementById('back-to-top');

    const updateScrollState = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        // Progress bar width
        if (docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgressBar.style.width = `${scrollPercent}%`;
        }

        // Sticky Header shrink
        if (scrollTop > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }

        // Back to top visibility
        if (scrollTop > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };

    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState(); // Initialize on load

    // Back to top click handler
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ---------------------------------------------------------
    // 2. Mobile Menu Toggle
    // ---------------------------------------------------------
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMobileMenu = () => {
        const isOpen = mobileMenu.classList.contains('open');
        mobileNavToggle.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        mobileNavToggle.setAttribute('aria-expanded', !isOpen);
    };

    mobileNavToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // ---------------------------------------------------------
    // 3. Theme Cycling System (Dark -> Light -> Cyber -> Dark)
    // ---------------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themes = ['theme-dark', 'theme-light', 'theme-cyber'];
    
    // Get current theme or default
    let currentThemeIndex = 0;
    const savedTheme = localStorage.getItem('portfolio-theme');
    
    if (savedTheme && themes.includes(savedTheme)) {
        currentThemeIndex = themes.indexOf(savedTheme);
    } else {
        // System preference default
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            currentThemeIndex = 1; // Light theme
        }
    }
    
    // Set initial theme
    document.body.className = themes[currentThemeIndex];
    updateThemeIcon(themes[currentThemeIndex]);

    themeToggle.addEventListener('click', () => {
        // Cycle to next theme
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const newTheme = themes[currentThemeIndex];
        
        document.body.className = newTheme;
        localStorage.setItem('portfolio-theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(themeName) {
        // Clear all icon classes
        themeIcon.className = 'fa-solid';
        
        if (themeName === 'theme-dark') {
            themeIcon.classList.add('fa-moon');
            themeToggle.title = 'Switch to Light Mode';
        } else if (themeName === 'theme-light') {
            themeIcon.classList.add('fa-sun');
            themeToggle.title = 'Switch to Cyberpunk Mode';
        } else if (themeName === 'theme-cyber') {
            themeIcon.classList.add('fa-bolt');
            themeToggle.title = 'Switch to Dark Mode';
        }
    }

    // ---------------------------------------------------------
    // 4. Hero Subtitle Typing Animation
    // ---------------------------------------------------------
    const typedTextSpan = document.getElementById('typed-text');
    const textArray = [
        "Full-Stack Software Engineer.",
        "Cloud Solutions Architect.",
        "Problem Solver.",
        "Web Application Specialist."
    ];
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const newTextDelay = 2000; // Delay between text cycles
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textArrayIndex = (textArrayIndex + 1) % textArray.length;
            setTimeout(type, typingSpeed + 300);
        }
    }

    // Start typewriter
    if (typedTextSpan) {
        setTimeout(type, 1000);
    }

    // ---------------------------------------------------------
    // 5. Scroll Reveals & Skill Fills
    // ---------------------------------------------------------
    // Set up skills fills to start at 0 and transition on reveal
    const progressFills = document.querySelectorAll('.progress-fill');
    const skillTargets = [];
    
    progressFills.forEach((fill, index) => {
        // Store target width and reset styling
        const targetPercent = fill.style.width || '100%';
        skillTargets.push(targetPercent);
        fill.style.width = '0%';
    });

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If it's the skills section, animate progress bars
                if (entry.target.id === 'skills') {
                    progressFills.forEach((fill, idx) => {
                        setTimeout(() => {
                            fill.style.width = skillTargets[idx];
                        }, idx * 100); // Cascade animations
                    });
                }
                
                // If it's timeline items, let them fade up individually
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.add('visible');
                }
                
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe sections
    document.querySelectorAll('.reveal-on-scroll').forEach(section => {
        revealObserver.observe(section);
    });

    // Observe timeline elements specifically
    document.querySelectorAll('.timeline-item').forEach(item => {
        revealObserver.observe(item);
    });

    // ---------------------------------------------------------
    // 6. Active Nav Link Highlighter on Scroll
    // ---------------------------------------------------------
    const navSections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobLinks = document.querySelectorAll('.mobile-nav-link');

    const highlightActiveNav = () => {
        let currentSectionId = '';
        const scrollPos = window.scrollY + 200; // Offset

        navSections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Set active status on desktop and mobile menus
        const updateLinkClasses = (linkArray) => {
            linkArray.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        };

        updateLinkClasses(navLinks);
        updateLinkClasses(mobLinks);
    };

    window.addEventListener('scroll', highlightActiveNav, { passive: true });

    // ---------------------------------------------------------
    // 7. Projects Gallery Filtering System
    // ---------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active classes
            filterButtons.forEach(button => button.classList.remove('active'));
            e.currentTarget.classList.add('active');

            const filterValue = e.currentTarget.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Reset styling classes
                card.classList.remove('fade-in-item');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                    // Force reflow and apply reveal animation
                    void card.offsetWidth; 
                    card.classList.add('fade-in-item');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ---------------------------------------------------------
    // 8. Contact Form Client-side Validation & Mock Sending
    // ---------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('contact-submit');

    // Helper validation functions
    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const validateInput = (input, condition, groupElement) => {
        if (condition) {
            groupElement.classList.remove('invalid');
            return true;
        } else {
            groupElement.classList.add('invalid');
            return false;
        }
    };

    // Form submission interceptor
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Perform validations
        const isNameValid = validateInput(nameInput, nameInput.value.trim() !== '', nameInput.parentElement);
        const isEmailValid = validateInput(emailInput, validateEmail(emailInput.value.trim()), emailInput.parentElement);
        const isMsgValid = validateInput(messageInput, messageInput.value.trim().length >= 10, messageInput.parentElement);

        if (isNameValid && isEmailValid && isMsgValid) {
            // Disable submit button and trigger simulated transmission
            submitBtn.disabled = true;
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            // Simulate server network latency
            setTimeout(() => {
                // Success feedback
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Message sent successfully! Thank you for reaching out.';
                
                // Clear fields
                contactForm.reset();
                
                // Restore button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                
                // Fade success status alert out after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            }, 1800);
        } else {
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Please correct the highlighted errors before submitting.';
        }
    });

    // Dynamic error removal on inputs
    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim() !== '') {
            nameInput.parentElement.classList.remove('invalid');
        }
    });

    emailInput.addEventListener('input', () => {
        if (validateEmail(emailInput.value.trim())) {
            emailInput.parentElement.classList.remove('invalid');
        }
    });

    messageInput.addEventListener('input', () => {
        if (messageInput.value.trim().length >= 10) {
            messageInput.parentElement.classList.remove('invalid');
        }
    });

    // ---------------------------------------------------------
    // 9. Quick Copy Email Functionality
    // ---------------------------------------------------------
    const copyEmailBtn = document.getElementById('btn-copy-email');
    const emailAddressSpan = document.getElementById('email-address');

    if (copyEmailBtn && emailAddressSpan) {
        copyEmailBtn.addEventListener('click', () => {
            const emailText = emailAddressSpan.textContent;
            
            // Clipboard API usage
            navigator.clipboard.writeText(emailText).then(() => {
                // Change icon to tick mark temporarily
                const originalIcon = copyEmailBtn.querySelector('i');
                originalIcon.className = 'fa-solid fa-check';
                copyEmailBtn.title = 'Copied!';
                copyEmailBtn.style.color = 'var(--accent-secondary)';

                setTimeout(() => {
                    originalIcon.className = 'fa-solid fa-copy';
                    copyEmailBtn.title = 'Copy Email';
                    copyEmailBtn.style.color = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }
});
