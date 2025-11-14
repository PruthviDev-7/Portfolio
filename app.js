/**
 * MODERN PORTFOLIO - VANILLA JAVASCRIPT
 * Advanced interactivity, animations, and performance optimization
 * =================================================================
 */

// =====================================================
// 1. UTILITY FUNCTIONS
// =====================================================

/**
 * Debounce function to limit function execution
 */
const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function to rate-limit function execution
 */
const throttle = (func, delay) => {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

/**
 * Smooth scroll to element
 */
const scrollToElement = (element) => {
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

/**
 * Check if element is in viewport
 */
const isElementInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0
  );
};

// =====================================================
// 2. THEME SWITCHER
// =====================================================

class ThemeSwitcher {
  constructor() {
    this.themeToggleBtn = document.getElementById("themeToggle");
    this.htmlElement = document.documentElement;
    this.storageKey = "portfolio-theme";
    this.init();
  }

  init() {
    // Set initial theme
    this.loadTheme();
    
    // Add event listener
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener("click", () => this.toggleTheme());
    }

    // Listen for system theme changes
    if (window.matchMedia) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          if (!localStorage.getItem(this.storageKey)) {
            this.applyTheme(e.matches ? "dark" : "light");
          }
        });
    }
  }

  loadTheme() {
    const savedTheme = localStorage.getItem(this.storageKey);
    
    if (savedTheme) {
      this.applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      this.applyTheme("dark");
    } else {
      this.applyTheme("light");
    }
  }

  toggleTheme() {
    const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    this.applyTheme(newTheme);
    localStorage.setItem(this.storageKey, newTheme);
  }

  applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
      if (this.themeToggleBtn) {
        this.themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        this.themeToggleBtn.setAttribute("aria-label", "Toggle light mode");
      }
    } else {
      document.body.classList.remove("dark-mode");
      if (this.themeToggleBtn) {
        this.themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        this.themeToggleBtn.setAttribute("aria-label", "Toggle dark mode");
      }
    }
  }
}

// =====================================================
// 3. MOBILE NAVIGATION
// =====================================================

class MobileNavigation {
  constructor() {
    this.navToggle = document.getElementById("navToggle");
    this.navMenu = document.getElementById("navMenu");
    this.navLinks = document.querySelectorAll(".navbar__link");
    this.init();
  }

  init() {
    if (this.navToggle) {
      this.navToggle.addEventListener("click", () => this.toggleMenu());
    }

    this.navLinks.forEach((link) => {
      link.addEventListener("click", () => this.closeMenu());
    });

    // Close menu on resize
    window.addEventListener(
      "resize",
      debounce(() => {
        if (window.innerWidth > 768) {
          this.closeMenu();
        }
      }, 200)
    );
  }

  toggleMenu() {
    this.navMenu.classList.toggle("active");
    this.navToggle.classList.toggle("active");
    this.navToggle.setAttribute(
      "aria-expanded",
      this.navMenu.classList.contains("active")
    );
  }

  closeMenu() {
    this.navMenu.classList.remove("active");
    this.navToggle.classList.remove("active");
    this.navToggle.setAttribute("aria-expanded", false);
  }
}

// =====================================================
// 4. CUSTOM CURSOR
// =====================================================

class CustomCursor {
  constructor() {
    this.cursor = document.getElementById("cursor");
    this.cursorFollower = document.getElementById("cursorFollower");
    this.mouseX = 0;
    this.mouseY = 0;
    this.init();
  }

  init() {
    // Only initialize on devices that support hover
    if (!this.cursor || !this.cursorFollower) return;

    document.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      this.cursor.style.left = this.mouseX + "px";
      this.cursor.style.top = this.mouseY + "px";

      setTimeout(() => {
        this.cursorFollower.style.left = this.mouseX + "px";
        this.cursorFollower.style.top = this.mouseY + "px";
      }, 80);
    });

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll(
      "a, button, input, textarea, [role='button']"
    );
    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", () => this.expandCursor());
      element.addEventListener("mouseleave", () => this.shrinkCursor());
    });
  }

  expandCursor() {
    if (this.cursorFollower) {
      this.cursorFollower.style.width = "50px";
      this.cursorFollower.style.height = "50px";
      this.cursor.style.opacity = "0";
    }
  }

  shrinkCursor() {
    if (this.cursorFollower) {
      this.cursorFollower.style.width = "30px";
      this.cursorFollower.style.height = "30px";
      this.cursor.style.opacity = "1";
    }
  }
}

// =====================================================
// 5. PARTICLE BACKGROUND
// =====================================================

class ParticleBackground {
  constructor() {
    this.container = document.getElementById("particleContainer");
    this.particleCount = window.innerWidth > 768 ? 50 : 20;
    this.particles = [];
    this.init();
  }

  init() {
    if (!this.container) return;

    this.createParticles();
    this.animateParticles();

    window.addEventListener("resize", debounce(() => this.handleResize(), 300));
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      const size = Math.random() * 4 + 2;
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const duration = Math.random() * 20 + 20;
      const delay = Math.random() * 5;

      particle.style.width = size + "px";
      particle.style.height = size + "px";
      particle.style.left = x + "px";
      particle.style.top = y + "px";
      particle.style.opacity = Math.random() * 0.5 + 0.2;
      particle.style.animation = `float ${duration}s linear infinite`;
      particle.style.animationDelay = delay + "s";

      this.container.appendChild(particle);
      this.particles.push({
        element: particle,
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      });
    }

    // Add floating animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        25% { transform: translateY(-20px) translateX(10px); }
        50% { transform: translateY(-40px) translateX(0px); }
        75% { transform: translateY(-20px) translateX(-10px); }
      }
    `;
    document.head.appendChild(style);
  }

  animateParticles() {
    setInterval(() => {
      this.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x > window.innerWidth) p.x = 0;
        if (p.x < 0) p.x = window.innerWidth;
        if (p.y > window.innerHeight) p.y = 0;
        if (p.y < 0) p.y = window.innerHeight;

        p.element.style.left = p.x + "px";
        p.element.style.top = p.y + "px";
      });
    }, 50);
  }

  handleResize() {
    const newCount = window.innerWidth > 768 ? 50 : 20;
    if (newCount !== this.particleCount) {
      this.container.innerHTML = "";
      this.particles = [];
      this.particleCount = newCount;
      this.createParticles();
    }
  }
}

// =====================================================
// 6. TYPED TEXT ANIMATION
// =====================================================

class TypedText {
  constructor() {
    this.typedElement = document.getElementById("typedText");
    this.texts = [
      "Hello, I'm Pruthviraj",
      "Full Stack Developer",
      "Problem Solver",
      "Computer Science Engineer",
      "React & Node.js Specialist",
      "Building Tomorrow's Web"
    ];
    this.currentTextIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.typingSpeed = 100;
    this.deletingSpeed = 50;
    this.pauseTime = 2000;
    this.init();
  }

  init() {
    if (this.typedElement) {
      this.type();
    }
  }

  type() {
    const currentText = this.texts[this.currentTextIndex];
    const displayText = currentText.substring(0, this.charIndex);
    this.typedElement.textContent = displayText;

    if (!this.isDeleting) {
      if (this.charIndex < currentText.length) {
        this.charIndex++;
        setTimeout(() => this.type(), this.typingSpeed);
      } else {
        this.isDeleting = true;
        setTimeout(() => this.type(), this.pauseTime);
      }
    } else {
      if (this.charIndex > 0) {
        this.charIndex--;
        setTimeout(() => this.type(), this.deletingSpeed);
      } else {
        this.isDeleting = false;
        this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
        setTimeout(() => this.type(), 500);
      }
    }
  }
}

// =====================================================
// 7. INTERSECTION OBSERVER FOR ANIMATIONS
// =====================================================

class ScrollAnimationObserver {
  constructor() {
    this.options = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      this.options
    );
    this.init();
  }

  init() {
    const fadeElements = document.querySelectorAll(".fade-in");
    fadeElements.forEach((element) => {
      this.observer.observe(element);
    });
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        this.observer.unobserve(entry.target);
      }
    });
  }
}

// =====================================================
// 8. PROJECT FILTERING
// =====================================================

class ProjectFilter {
  constructor() {
    this.filterBtns = document.querySelectorAll(".filter-btn");
    this.projectCards = document.querySelectorAll(".project-card");
    this.init();
  }

  init() {
    this.filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => this.filterProjects(btn));
    });
  }

  filterProjects(btn) {
    const filter = btn.getAttribute("data-filter");

    // Update active button
    this.filterBtns.forEach((b) => b.classList.remove("filter-btn--active"));
    btn.classList.add("filter-btn--active");

    // Update button states for accessibility
    this.filterBtns.forEach((b) => {
      b.setAttribute("aria-selected", b === btn);
    });

    // Filter cards with animation
    this.projectCards.forEach((card) => {
      const category = card.getAttribute("data-category");

      if (filter === "all" || category === filter) {
        card.classList.remove("hidden");
        // Trigger animation
        void card.offsetWidth;
        card.style.animation = "fadeInUp 0.6s ease-out";
      } else {
        card.classList.add("hidden");
      }
    });
  }
}

// =====================================================
// 9. PROJECT MODAL
// =====================================================

class ProjectModal {
  constructor() {
    this.modal = document.getElementById("projectModal");
    this.modalOverlay = document.getElementById("modalOverlay");
    this.modalClose = document.getElementById("modalClose");
    this.projectViewBtns = document.querySelectorAll('[data-project]');
    
    // Project data
    this.projects = {
      pizzahub: {
        title: "PizzaHub",
        image:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FF6B6B;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23FF8E72;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='250' fill='url(%23grad1)'/%3E%3Ctext x='200' y='125' font-size='48' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3E🍕 PizzaHub%3C/text%3E%3C/svg%3E",
        description:
          "An interactive pizza ordering web app featuring user authentication, dynamic menu display, and cart management. Implements RESTful APIs for order handling, data storage, and user details, demonstrating frontend-backend integration and CRUD operations on the MongoDB database.",
        tech: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "JavaScript"],
        liveLink: "https://github.com/PruthviDev-7",
        githubLink: "https://github.com/PruthviDev-7",
      },
      tempconverter: {
        title: "Temperature Converter",
        image:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'%3E%3Cdefs%3E%3ClinearGradient id='grad2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%234ECDC4;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2344A08D;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='250' fill='url(%23grad2)'/%3E%3Ctext x='200' y='125' font-size='48' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3E🌡️ Temp Converter%3C/text%3E%3C/svg%3E",
        description:
          "A responsive and interactive web app to convert temperatures between Celsius, Fahrenheit, and Kelvin with animated UI, real-time conversions, and modern design elements. Built with vanilla JavaScript for optimal performance and user experience.",
        tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Animations"],
        liveLink: "https://github.com/PruthviDev-7",
        githubLink: "https://github.com/PruthviDev-7",
      },
      spotifyclone: {
        title: "Spotify Clone",
        image:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'%3E%3Cdefs%3E%3ClinearGradient id='grad3' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%231DB954;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%231ed760;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='250' fill='url(%23grad3)'/%3E%3Ctext x='200' y='125' font-size='48' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3E🎵 Spotify Clone%3C/text%3E%3C/svg%3E",
        description:
          "A responsive frontend clone of Spotify's web player featuring sidebar navigation, playlist sections, album cards, and a functional music player UI with play/pause controls, progress bar, and volume slider built entirely with HTML, CSS, and modern design patterns.",
        tech: ["HTML5", "CSS3", "Font Awesome", "Responsive Design", "Flexbox Grid"],
        liveLink: "https://github.com/PruthviDev-7",
        githubLink: "https://github.com/PruthviDev-7",
      },
      bankapp: {
        title: "Bank Application",
        image:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'%3E%3Cdefs%3E%3ClinearGradient id='grad4' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='250' fill='url(%23grad4)'/%3E%3Ctext x='200' y='125' font-size='48' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3E🏦 Bank App%3C/text%3E%3C/svg%3E",
        description:
          "A console-based banking system for managing customers, employees, and accounts, supporting deposits, withdrawals, and data persistence while demonstrating core OOP concepts like inheritance, encapsulation, polymorphism, and method overriding with Pickle serialization.",
        tech: ["Python", "OOP", "Pickle", "Data Persistence", "Console Application"],
        liveLink: "https://github.com/PruthviDev-7",
        githubLink: "https://github.com/PruthviDev-7",
      },
    };

    this.init();
  }

  init() {
    // Add event listeners to project view buttons
    this.projectViewBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const projectKey = btn.getAttribute("data-project");
        this.openModal(projectKey);
      });
    });

    // Close button
    if (this.modalClose) {
      this.modalClose.addEventListener("click", () => this.closeModal());
    }

    // Overlay click to close
    if (this.modalOverlay) {
      this.modalOverlay.addEventListener("click", () => this.closeModal());
    }

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("active")) {
        this.closeModal();
      }
    });
  }

  openModal(projectKey) {
    const project = this.projects[projectKey];
    if (!project) return;

    const modalTitle = document.getElementById("modalTitle");
    const modalImage = document.getElementById("modalImage");
    const modalDescription = document.getElementById("modalDescription");
    const modalTech = document.getElementById("modalTech");
    const modalLiveLink = document.getElementById("modalLiveLink");
    const modalGithubLink = document.getElementById("modalGithubLink");

    modalTitle.textContent = project.title;
    modalImage.src = project.image;
    modalImage.alt = project.title;
    modalDescription.textContent = project.description;
    modalLiveLink.href = project.liveLink;
    modalGithubLink.href = project.githubLink;

    // Add tech tags
    modalTech.innerHTML = project.tech
      .map((tech) => `<span class="tech-tag">${tech}</span>`)
      .join("");

    this.modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeModal() {
    this.modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// =====================================================
// 10. CONTACT FORM VALIDATION
// =====================================================

class ContactForm {
  constructor() {
    this.form = document.getElementById("contactForm");
    this.nameInput = document.getElementById("formName");
    this.emailInput = document.getElementById("formEmail");
    this.subjectInput = document.getElementById("formSubject");
    this.messageInput = document.getElementById("formMessage");
    this.formStatus = document.getElementById("formStatus");
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleSubmit(e));

      // Real-time validation
      this.nameInput.addEventListener("blur", () => this.validateName());
      this.emailInput.addEventListener("blur", () => this.validateEmail());
      this.subjectInput.addEventListener("blur", () => this.validateSubject());
      this.messageInput.addEventListener("blur", () => this.validateMessage());
    }
  }

  validateName() {
    const value = this.nameInput.value.trim();
    const nameError = document.getElementById("formNameError");
    
    if (value.length < 2) {
      this.showError(this.nameInput, nameError, "Name must be at least 2 characters");
      return false;
    }
    
    this.clearError(this.nameInput, nameError);
    return true;
  }

  validateEmail() {
    const value = this.emailInput.value.trim();
    const emailError = document.getElementById("formEmailError");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      this.showError(this.emailInput, emailError, "Please enter a valid email");
      return false;
    }

    this.clearError(this.emailInput, emailError);
    return true;
  }

  validateSubject() {
    const value = this.subjectInput.value.trim();
    const subjectError = document.getElementById("formSubjectError");

    if (value.length < 3) {
      this.showError(this.subjectInput, subjectError, "Subject must be at least 3 characters");
      return false;
    }

    this.clearError(this.subjectInput, subjectError);
    return true;
  }

  validateMessage() {
    const value = this.messageInput.value.trim();
    const messageError = document.getElementById("formMessageError");

    if (value.length < 10) {
      this.showError(this.messageInput, messageError, "Message must be at least 10 characters");
      return false;
    }

    this.clearError(this.messageInput, messageError);
    return true;
  }

  showError(input, errorElement, message) {
    input.classList.add("error");
    errorElement.textContent = message;
    errorElement.classList.add("show");
  }

  clearError(input, errorElement) {
    input.classList.remove("error");
    errorElement.classList.remove("show");
    errorElement.textContent = "";
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Validate all fields
    const isNameValid = this.validateName();
    const isEmailValid = this.validateEmail();
    const isSubjectValid = this.validateSubject();
    const isMessageValid = this.validateMessage();

    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
      return;
    }

    // Prepare form data
    const formData = new FormData(this.form);
    const data = {
      name: this.nameInput.value.trim(),
      email: this.emailInput.value.trim(),
      subject: this.subjectInput.value.trim(),
      message: this.messageInput.value.trim(),
    };

    try {
      // Show loading state
      const submitBtn = this.form.querySelector(".btn--submit");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      // Simulate form submission (replace with actual backend endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success message
      this.showStatus(
        "Thank you for your message! I'll get back to you soon.",
        "success"
      );

      // Reset form
      this.form.reset();

      // Restore button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      // Hide status after 5 seconds
      setTimeout(() => this.hideStatus(), 5000);
    } catch (error) {
      this.showStatus(
        "An error occurred. Please try again later.",
        "error"
      );
    }
  }

  showStatus(message, type) {
    this.formStatus.textContent = message;
    this.formStatus.className = `form-status show ${type}`;
  }

  hideStatus() {
    this.formStatus.classList.remove("show");
  }
}

// =====================================================
// 11. BACK TO TOP BUTTON
// =====================================================

class BackToTop {
  constructor() {
    this.backToTopBtn = document.getElementById("backToTop");
    this.init();
  }

  init() {
    window.addEventListener("scroll", throttle(() => this.toggleButton(), 200));

    if (this.backToTopBtn) {
      this.backToTopBtn.addEventListener("click", () => this.scrollToTop());
    }
  }

  toggleButton() {
    if (window.scrollY > 300) {
      this.backToTopBtn.classList.add("show");
    } else {
      this.backToTopBtn.classList.remove("show");
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// =====================================================
// 12. LOADING OVERLAY
// =====================================================

class LoadingOverlay {
  constructor() {
    this.overlay = document.getElementById("loadingOverlay");
    this.init();
  }

  init() {
    // Hide loading overlay when page is fully loaded
    window.addEventListener("load", () => {
      this.hideOverlay();
    });

    // Also hide it after a timeout (in case resources are slow)
    setTimeout(() => {
      this.hideOverlay();
    }, 3000);
  }

  hideOverlay() {
    if (this.overlay) {
      this.overlay.classList.add("hidden");
      setTimeout(() => {
        this.overlay.style.display = "none";
      }, 500);
    }
  }
}

// =====================================================
// 13. PARALLAX SCROLL EFFECT
// =====================================================

class ParallaxScroll {
  constructor() {
    this.heroSection = document.querySelector(".hero");
    this.init();
  }

  init() {
    if (this.heroSection) {
      window.addEventListener("scroll", throttle(() => this.applyParallax(), 10));
    }
  }

  applyParallax() {
    const scrolled = window.scrollY;
    const parallaxElements = document.querySelectorAll(".particle");

    parallaxElements.forEach((element, index) => {
      const speed = 0.5 + (index % 3) * 0.1;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }
}

// =====================================================
// 14. IMAGE LAZY LOADING
// =====================================================

class LazyLoadImages {
  constructor() {
    this.init();
  }

  init() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add("loaded");
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
      });
    }
  }
}

// =====================================================
// 15. PERFORMANCE MONITORING
// =====================================================

class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    if (window.performance && window.performance.timing) {
      window.addEventListener("load", () => {
        this.logMetrics();
      });
    }
  }

  logMetrics() {
    const timing = window.performance.timing;
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    const connectTime = timing.responseEnd - timing.requestStart;
    const renderTime = timing.domComplete - timing.domLoading;

    console.log(
      "%c⚡ Performance Metrics",
      "color: #007bff; font-weight: bold; font-size: 14px;"
    );
    console.log(`%cPage Load Time: ${pageLoadTime}ms`, "color: #00b894;");
    console.log(`%cConnect Time: ${connectTime}ms`, "color: #00b894;");
    console.log(`%cRender Time: ${renderTime}ms`, "color: #00b894;");
  }
}

// =====================================================
// 16. SMOOTH SCROLL FOR NAVIGATION
// =====================================================

class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute("href");
        
        if (targetId === "#") return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          scrollToElement(targetElement);
        }
      });
    });
  }
}

// =====================================================
// 17. INITIALIZATION ON DOM READY
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  new ThemeSwitcher();
  new MobileNavigation();
  new CustomCursor();
  new ParticleBackground();
  new TypedText();
  new ScrollAnimationObserver();
  new ProjectFilter();
  new ProjectModal();
  new ContactForm();
  new BackToTop();
  new LoadingOverlay();
  new ParallaxScroll();
  new LazyLoadImages();
  new SmoothScroll();

  // Log to console
  console.log(
    "%c✨ Portfolio loaded successfully!",
    "color: #007bff; font-weight: bold; font-size: 16px;"
  );
});

// =====================================================
// 18. PERFORMANCE OPTIMIZATION
// =====================================================

// Defer non-critical tasks
window.addEventListener("load", () => {
  new PerformanceMonitor();
});

// Request idle callback for non-critical operations
if ("requestIdleCallback" in window) {
  requestIdleCallback(() => {
    // Preload next section images
    document.querySelectorAll("img[loading='lazy']").forEach((img) => {
      img.loading = "lazy";
    });
  });
}

// =====================================================
// 19. SERVICE WORKER SUPPORT
// =====================================================

if ("serviceWorker" in navigator && "caches" in window) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((registration) => {
        console.log("✓ Service Worker registered:", registration);
      })
      .catch((error) => {
        console.log("✗ Service Worker registration failed:", error);
      });
  });
}