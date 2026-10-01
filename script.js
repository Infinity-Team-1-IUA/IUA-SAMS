document.addEventListener('DOMContentLoaded', () => {
    /* ========================================= 1. SET CURRENT YEAR IN FOOTER ========================================= */
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    /* ========================================= 2. MOBILE MENU TOGGLE ========================================= */
    const hamburger = document.getElementById('hamburger');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    if (hamburger && navbar) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navbar.classList.toggle('active');
        });
        // Close menu when link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navbar.classList.remove('active');
            });
        });
    }
    /* ========================================= 3. DARK MODE TOGGLE ========================================= */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn?.querySelector('i');
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            let targetTheme = 'light';
            if (currentTheme !== 'dark') {
                targetTheme = 'dark';
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
            document.documentElement.setAttribute('data-theme', targetTheme);
            localStorage.setItem('theme', targetTheme);
        });
    }
    /* ========================================= 4. SCROLL ANIMATIONS (Intersection Observer) ========================================= */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve if you want it to trigger every time, 
                // but usually once is better for performance.
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    const fadeUpElements = document.querySelectorAll('.fade-up');
    fadeUpElements.forEach(el => {
        scrollObserver.observe(el);
    });
    /* ========================================= 5. ANIMATED COUNTERS ========================================= */
    const counterElements = document.querySelectorAll('.counter-box');
    // Check if counter has already run
    let hasCounted = false;
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                hasCounted = true;
                counterElements.forEach(box => {
                    const target = parseInt(box.getAttribute('data-target'));
                    const numElement = box.querySelector('.counter-num');
                    let count = 0;
                    // Adjust increment so all counters finish around the same time
                    const duration = 2000; // ms
                    const refreshRate = 30; // ms
                    const increment = target / (duration / refreshRate);
                    const updateCount = () => {
                        count += increment;
                        if (count < target) {
                            numElement.textContent = Math.ceil(count);
                            setTimeout(updateCount, refreshRate);
                        } else {
                            // Ensure final value is exact (handle year vs number display)
                            numElement.textContent = target + (target > 1000 ? '' : '+');
                        }
                    };
                    updateCount();
                });
            }
        });
    }, { threshold: 0.5 });
    const highlightsSection = document.getElementById('highlights');
    if (highlightsSection) {
        counterObserver.observe(highlightsSection);
    }
    /* ========================================= 6. SMOOTH SCROLL BACK TO TOP ========================================= */
    // handled largely by CSS `scroll-behavior: smooth`, but we handle button visibility here
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        if (scrollTopBtn) {
            if (window.scrollY > 300) {
                scrollTopBtn.style.display = 'flex';
                scrollTopBtn.style.opacity = '1';
            } else {
                scrollTopBtn.style.opacity = '0';
                setTimeout(() => { if (window.scrollY <= 300) scrollTopBtn.style.display = 'none'; }, 300);
            }
        }
    });
    // Set initial state
    if (scrollTopBtn) {
        scrollTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        scrollTopBtn.style.opacity = window.scrollY > 300 ? '1' : '0';
        scrollTopBtn.style.transition = 'opacity 0.3s ease';
    }
    /* ========================================= 7. FORM VALIDATION & HANDLING (Join Us) ========================================= */
    const applyForm = document.getElementById('applyForm');
    const formStatus = document.getElementById('formStatus');
    if (applyForm) {
        applyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Clear previous errors
            document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
            formStatus.className = 'form-status mt-2';
            formStatus.textContent = '';
            let isValid = true;
            // Honeypot check for spam
            const honeypot = document.getElementById('honeypot').value;
            if (honeypot) {
                return; // Silent failure for bots
            }
            // Validate Full Name
            const name = document.getElementById('fullName');
            if (!name.value.trim()) {
                document.getElementById('nameError').textContent = 'Full name is required';
                isValid = false;
            }
            // Validate Academic Year
            const year = document.getElementById('academicYear');
            if (!year.value) {
                document.getElementById('yearError').textContent = 'Please select your academic year';
                isValid = false;
            }
            // Validate Governorate
            const governorate = document.getElementById('governorate');
            if (!governorate.value.trim()) {
                document.getElementById('governorateError').textContent = 'Governorate is required';
                isValid = false;
            }
            // Validate Address
            const address = document.getElementById('address');
            if (!address.value.trim()) {
                document.getElementById('addressError').textContent = 'Address is required';
                isValid = false;
            }
            // Validate Faculty
            const faculty = document.getElementById('faculty');
            if (!faculty.value.trim()) {
                document.getElementById('facultyError').textContent = 'Faculty is required';
                isValid = false;
            }
            // Validate Phone
            const phone = document.getElementById('phoneNumber');
            const phoneRegex = /^[0-9]{10,15}$/;
            if (!phoneRegex.test(phone.value.trim())) {
                document.getElementById('phoneError').textContent = 'Enter a valid phone number (digits only)';
                isValid = false;
            }
            // Validate Email
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                document.getElementById('emailError').textContent = 'Enter a valid email address';
                isValid = false;
            }
            // Validate Committee
            const committee = document.getElementById('preferredCommittee');
            if (!committee.value) {
                document.getElementById('committeeError').textContent = 'Please select a preferred committee';
                isValid = false;
            }
            // Validate Motivation
            const whyJoin = document.getElementById('whyJoin');
            if (whyJoin.value.trim().length < 10) {
                document.getElementById('motivationError').textContent = 'Please provide a sufficient reason for joining (min 10 chars)';
                isValid = false;
            }
            // If valid, use EmailJS to send
            if (isValid) {
                const submitBtn = document.getElementById('submitBtn');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                // EmailJS IDs
                const serviceID = 'default_service';
                const templateID = 'template_l1h46v7';
                // Send using EmailJS (passes the actual form element 'applyForm')
                emailjs.sendForm(serviceID, templateID, applyForm)
                    .then(() => {
                        formStatus.textContent = 'Application submitted successfully! Welcome to Infinity Team. 🎉';
                        formStatus.className = 'form-status mt-2 success';
                        applyForm.reset();
                    })
                    .catch((error) => {
                        formStatus.textContent = 'Sorry, there was an error: ' + (error.text || 'Submission failed');
                        formStatus.className = 'form-status mt-2 error';
                        console.error('EmailJS Error:', error);
                    })
                    .finally(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    });
            }
        });
    }
    /* ========================================= 8. CONTACT FORM HANDLING ========================================= */
    const contactForm = document.getElementById('contactForm');
    const contactStatus = document.getElementById('contactStatus');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value.trim();
            const message = document.getElementById('contactMessage').value.trim();
            if (!name || !email || !message) return;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;
            contactStatus.className = 'form-status mt-3'; // Reset
            contactStatus.textContent = '';
            // Send via FormSubmit AJAX endpoint
            fetch("https://formsubmit.co/ajax/infinity2eam01@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: "New Contact Message: " + subject,
                    name: name,
                    email: email,
                    message: message
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        contactStatus.textContent = 'Message sent successfully! We will get back to you shortly.';
                        contactStatus.classList.add('success');
                        contactForm.reset();
                    } else {
                        contactStatus.textContent = 'Oops! Something went wrong. Please try again.';
                        contactStatus.classList.add('error');
                    }
                })
                .catch(error => {
                    contactStatus.textContent = 'Network error. Please try again later.';
                    contactStatus.classList.add('error');
                })
                .finally(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    // Clear message after a few seconds
                    setTimeout(() => {
                        contactStatus.textContent = '';
                        contactStatus.className = 'form-status mt-3';
                    }, 5000);
                });
        });
    }
    /* ========================================= 9. SIGN UP FORM HANDLING (AJAX) ========================================= */
    const signupForm = document.getElementById('signupForm');
    const signupStatus = document.getElementById('signupStatus');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('signupBtn');
            const originalText = btn.innerHTML;
            // Basic validation
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            if (!name || !email) return;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;
            signupStatus.className = 'form-status mt-3'; // Reset
            signupStatus.textContent = '';
            // Send via FormSubmit AJAX endpoint
            fetch("https://formsubmit.co/ajax/infinity2eam01@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: "New Infinity Team Sign Up!",
                    name: name,
                    email: email
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        signupStatus.textContent = 'Successfully signed up! Welcome to the Infinity Team community.';
                        signupStatus.classList.add('success');
                        signupForm.reset();
                    } else {
                        signupStatus.textContent = 'Oops! Something went wrong. Please try again.';
                        signupStatus.classList.add('error');
                    }
                })
                .catch(error => {
                    signupStatus.textContent = 'Network error. Please try again later.';
                    signupStatus.classList.add('error');
                })
                .finally(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    // Clear success message after a few seconds
                    if (signupStatus.classList.contains('success')) {
                        setTimeout(() => {
                            signupStatus.textContent = '';
                            signupStatus.classList.remove('success');
                        }, 5000);
                    }
                });
        });
    }
    /* ========================================= 10. ACTIVE LINK HIGHLIGHTING ========================================= */
    const sections = document.querySelectorAll('section[id]');
    function highlightNavLink() {
        let scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-menu a[href*=' + sectionId + ']')?.classList.add('active');
            } else {
                document.querySelector('.nav-menu a[href*=' + sectionId + ']')?.classList.remove('active');
            }
        });
    }
    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink(); // Initial call
    /* ========================================= 11. ACHIEVEMENTS GALLERY TOGGLE ========================================= */
    const achievementsGrid = document.getElementById('achievementsGrid');
    const toggleBtn = document.getElementById('toggleAchievements');
    if (achievementsGrid && toggleBtn) {
        const cards = achievementsGrid.querySelectorAll('.achievement-card');
        let isExpanded = false;
        function updateAchievementsView() {
            cards.forEach((card, index) => {
                if (!isExpanded && index >= 6) {
                    card.style.display = 'none';
                } else {
                    card.style.display = 'block';
                }
            });
        }
        updateAchievementsView();
        toggleBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            toggleBtn.innerHTML = isExpanded ? 'Show Less' : 'View All Achievements';
            updateAchievementsView();
            // Scroll back to gallery top if hiding
            if (!isExpanded) {
                document.getElementById('achievements-gallery').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
/*filter*/
const filterButtons = document.querySelectorAll(".filter-btn");
const achievementCards = document.querySelectorAll(".achievement-card");
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        filterButtons.forEach(btn => {
            btn.classList.remove("active", "btn-primary");
            btn.classList.add("btn-outline-primary");
        });
        button.classList.add("active", "btn-primary");
        button.classList.remove("btn-outline-primary");
        achievementCards.forEach(card => {
            const cardYear = card.dataset.year;
            if (filter === "all" || cardYear === filter) {
                card.classList.remove("hide-card");
            } else {
                card.classList.add("hide-card");
            }
        });
    });
});