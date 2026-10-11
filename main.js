/**
 * ==============================================================================
 * ANANDHU P S - PORTFOLIO INTERACTIVITY SCRIPT
 * Features:
 *  - Neural Network Particle Canvas Simulation
 *  - Dynamic Subtitle Typewriter Effect
 *  - Responsive Navigation & Active Scrollspy
 *  - Interactive Skills Category Filter
 *  - 3D Card Hover Tilt Micro-interactions
 *  - Interactive Project Deep Dive Modals
 *  - One-Click Email Copy with Toast Notifications
 *  - Contact Form Validation & State Management
 *  - Scroll-Linked Circular Progress Back-to-Top Button
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
     * 1. NEURAL NETWORK / CONSTELLATION CANVAS ANIMATION
     * -------------------------------------------------------------------------- */
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 35 : 75;
        const maxDistance = isMobile ? 100 : 140;

        const mouse = {
            x: null,
            y: null,
            radius: 120
        };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
                this.radius = Math.random() * 2 + 1.2;
                this.baseAlpha = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction repulsion/attraction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= (dx / dist) * force * 1.5;
                        this.y -= (dy / dist) * force * 1.5;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 240, 255, ${this.baseAlpha})`;
                ctx.shadowColor = '#00f0ff';
                ctx.shadowBlur = 6;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            // Connect particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        const alpha = (1 - dist / maxDistance) * 0.25;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            // Connect to mouse if nearby
            if (mouse.x !== null && mouse.y !== null) {
                for (let i = 0; i < particles.length; i++) {
                    const dx = mouse.x - particles[i].x;
                    const dy = mouse.y - particles[i].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouse.radius) {
                        const alpha = (1 - dist / mouse.radius) * 0.4;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
                        ctx.lineWidth = 1.2;
                        ctx.stroke();
                    }
                }
            }

            // Update & Draw particles
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    }

    /* --------------------------------------------------------------------------
     * 2. DYNAMIC TYPEWRITER EFFECT
     * Cycles through exact requested titles
     * -------------------------------------------------------------------------- */
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const phrases = [
            "Data Scientist",
            "AI & Machine Learning Enthusiast",
            "Junior AI Engineer",
            "Data Scientist | AI & Machine Learning Enthusiast | Junior AI Engineer"
        ];

        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typingSpeed = 90;

        function typeLoop() {
            const currentPhrase = phrases[phraseIdx];

            if (isDeleting) {
                typewriterElement.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
                typingSpeed = 40;
            } else {
                typewriterElement.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
                typingSpeed = 90;
            }

            if (!isDeleting && charIdx === currentPhrase.length) {
                // Pause at completion
                typingSpeed = 2200;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typingSpeed = 500;
            }

            setTimeout(typeLoop, typingSpeed);
        }

        setTimeout(typeLoop, 600);
    }

    /* --------------------------------------------------------------------------
     * 3. HEADER SCROLL & MOBILE MENU TOGGLE
     * -------------------------------------------------------------------------- */
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navLinks.classList.toggle('open');
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navLinks.classList.remove('open');
            });
        });
    }

    /* --------------------------------------------------------------------------
     * 4. ACTIVE SCROLLSPY (Highlight nav on scroll)
     * -------------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');

    function highlightNavigation() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', highlightNavigation);

    /* --------------------------------------------------------------------------
     * 5. SKILLS FILTERING INTERACTION
     * -------------------------------------------------------------------------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillBadges = document.querySelectorAll('.skill-badge');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            skillBadges.forEach(badge => {
                const category = badge.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    badge.style.display = 'flex';
                    setTimeout(() => {
                        badge.style.opacity = '1';
                        badge.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    badge.style.opacity = '0';
                    badge.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        badge.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    /* --------------------------------------------------------------------------
     * 6. PROJECT CARD 3D TILT EFFECT
     * -------------------------------------------------------------------------- */
    const tiltCards = document.querySelectorAll('[data-tilt]');
    if (window.innerWidth > 992) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            });
        });
    }

    /* --------------------------------------------------------------------------
     * 7. PROJECT DETAILS MODAL DEEP DIVES
     * -------------------------------------------------------------------------- */
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');
    const modalTriggers = document.querySelectorAll('.modal-trigger');

    const projectData = {
        sentiment: {
            title: "Text Sentiment Analysis using NLP",
            tag: "Natural Language Processing | Tweet Classification",
            summary: "A machine learning pipeline designed to categorize tweet sentiments into positive, negative, or neutral with high precision.",
            highlights: [
                "Full text preprocessing: regex tokenization, custom Twitter slang normalization, stopword filtering, and WordNet lemmatization.",
                "TF-IDF n-gram vectorization (unigrams and bigrams) capturing contextual sentiment phrases.",
                "Logistic Regression classifier with L2 regularization achieving >91% accuracy and robust F1-score across validation splits.",
                "Real-time inference script capable of scoring live tweets within milliseconds."
            ],
            tech: ["Python", "Scikit-learn", "NLTK", "TF-IDF", "Logistic Regression", "Pandas"],
            github: "https://github.com/Anandhu114"
        },
        bengaluru: {
            title: "Bengaluru House Price Prediction",
            tag: "Regression Modeling | Real Estate Price Analytics",
            summary: "An end-to-end regression modeling suite predicting property prices across various localities in Bengaluru based on square footage, bedrooms, and location.",
            highlights: [
                "Handled massive raw real estate dataset: cleaned ambiguous sqft ranges, removed outlier dimensional records, and resolved extreme price variations.",
                "Dimensionality reduction with location grouping (converting rare locations to 'other') followed by one-hot encoding.",
                "Employed GridSearchCV across multiple candidate algorithms: Linear Regression, Lasso, and Decision Tree Regressor to find optimal hyperparameters.",
                "Evaluated models via 5-fold cross-validation, achieving an R² score of ~0.84 with Linear Regression."
            ],
            tech: ["Python", "Pandas", "NumPy", "Scikit-learn", "GridSearchCV", "Matplotlib"],
            github: "https://github.com/Anandhu114"
        },
        segmentation: {
            title: "Customer Segmentation using K-Means",
            tag: "Unsupervised Machine Learning | Customer Analytics",
            summary: "Applied unsupervised clustering to segment customer purchasing behavior and provide targeted business intelligence for marketing optimization.",
            highlights: [
                "Exploratory Data Analysis (EDA) on customer income and spending metrics with correlation matrices.",
                "Utilized the Elbow Method by calculating Within-Cluster-Sum-of-Squares (WCSS) across varying K values (1 to 10) to discover the optimal cluster count (K=5).",
                "Profiled clusters into actionable target groups: high-income/high-spenders, careful spenders, budget shoppers, etc.",
                "Interactive visual cluster plots mapping centroid positions for executive decision-making."
            ],
            tech: ["Python", "Scikit-learn", "K-Means", "Elbow Method", "Pandas", "Seaborn"],
            github: "https://github.com/Anandhu114"
        },
        qa: {
            title: "Context-Aware QA System",
            tag: "GenAI | Large Language Models | Retrieval Pipeline",
            summary: "Developed a context-aware question answering pipeline utilizing Large Language Models to extract concise, factual answers strictly grounded in domain documents.",
            highlights: [
                "Document chunking, vector embedding generation, and semantic similarity search to supply accurate context windows.",
                "Prompt engineering designed to eliminate hallucinations and constrain output generation strictly to provided context facts.",
                "High extractive precision with fallbacks for unsupported questions.",
                "Extensible architecture ready for RAG (Retrieval-Augmented Generation) deployment."
            ],
            tech: ["Python", "Transformers", "LLMs", "NLP", "Semantic Search", "PyTorch"],
            github: "https://github.com/Anandhu114"
        }
    };

    modalTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const projKey = btn.getAttribute('data-project');
            const data = projectData[projKey];
            if (!data) return;

            modalContent.innerHTML = `
                <span class="section-tag">${data.tag}</span>
                <h3 class="modal-title">${data.title}</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1.2rem; font-size: 1rem; line-height: 1.6;">${data.summary}</p>
                
                <div class="modal-section">
                    <h4>Key Engineering Highlights:</h4>
                    <ul style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
                        ${data.highlights.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                </div>

                <div class="modal-section">
                    <h4>Technologies Used:</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                        ${data.tech.map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                </div>

                <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                    <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 0.7rem 1.4rem; font-size: 0.9rem;">
                        View on GitHub
                    </a>
                </div>
            `;

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    /* --------------------------------------------------------------------------
     * 8. COPY EMAIL BUTTON & TOAST NOTIFICATION
     * -------------------------------------------------------------------------- */
    const copyBtn = document.getElementById('copy-email-btn');
    const toast = document.getElementById('toast');
    const copyTooltip = document.getElementById('copy-tooltip');

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const email = "anandhups3664@gmail.com";
            navigator.clipboard.writeText(email).then(() => {
                if (copyTooltip) copyTooltip.textContent = "Copied!";
                showToast("✓ Email copied to clipboard: anandhups3664@gmail.com");

                setTimeout(() => {
                    if (copyTooltip) copyTooltip.textContent = "Copy";
                }, 2000);
            }).catch(() => {
                showToast("Email: anandhups3664@gmail.com");
            });
        });
    }

    // Resume button toast
    const resumeBtn = document.getElementById('download-resume-btn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            showToast("📄 Downloading Anandhu P S Resume...");
        });
    }

    /* --------------------------------------------------------------------------
     * 9. CONTACT FORM VALIDATION & HANDLING
     * -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');

        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');
        const subjectError = document.getElementById('subject-error');
        const messageError = document.getElementById('message-error');

        function clearErrors() {
            [nameError, emailError, subjectError, messageError].forEach(el => {
                if (el) el.textContent = '';
            });
            [nameInput, emailInput, subjectInput, messageInput].forEach(inp => {
                if (inp) inp.classList.remove('invalid');
            });
        }

        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();
            let isValid = true;

            if (!nameInput.value.trim()) {
                nameError.textContent = "Please enter your name.";
                nameInput.classList.add('invalid');
                isValid = false;
            }

            if (!emailInput.value.trim()) {
                emailError.textContent = "Please enter your email address.";
                emailInput.classList.add('invalid');
                isValid = false;
            } else if (!validateEmail(emailInput.value.trim())) {
                emailError.textContent = "Please enter a valid email address.";
                emailInput.classList.add('invalid');
                isValid = false;
            }

            if (subjectInput && !subjectInput.value.trim()) {
                subjectError.textContent = "Please enter a subject.";
                subjectInput.classList.add('invalid');
                isValid = false;
            }

            if (!messageInput.value.trim()) {
                messageError.textContent = "Please enter your message.";
                messageInput.classList.add('invalid');
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                messageError.textContent = "Message must be at least 10 characters.";
                messageInput.classList.add('invalid');
                isValid = false;
            }

            if (isValid) {
                const submitBtn = contactForm.querySelector('.btn-submit');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Sending Message...</span>`;

                // Simulate submission delay
                setTimeout(() => {
                    submitBtn.innerHTML = `<span>✓ Message Sent!</span>`;
                    showToast("🎉 Thank you! Your message has been received.");
                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 3500);
                }, 1200);
            }
        });
    }

    /* --------------------------------------------------------------------------
     * 10. BACK TO TOP BUTTON WITH CIRCULAR SCROLL PROGRESS
     * -------------------------------------------------------------------------- */
    const backToTopBtn = document.getElementById('back-to-top');
    const progressCircle = document.getElementById('progress-circle');
    const circumference = 2 * Math.PI * 20; // radius = 20 => ~125.66

    if (progressCircle) {
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;
    }

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        if (scrollTop > 250) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        if (progressCircle && scrollHeight > 0) {
            const scrollFraction = scrollTop / scrollHeight;
            const offset = circumference - (scrollFraction * circumference);
            progressCircle.style.strokeDashoffset = offset;
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* --------------------------------------------------------------------------
     * 11. INTERSECTION OBSERVER FOR FADE-IN REVEAL ANIMATIONS
     * -------------------------------------------------------------------------- */
    const fadeElements = document.querySelectorAll('.fade-in');
    const observerOptions = {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => scrollObserver.observe(el));
});
