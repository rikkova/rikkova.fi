(function () {
  // Theme Toggle Functionality
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  function renderIcon(theme) {
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  root.setAttribute('data-theme', current);
  renderIcon(current);

  toggle.addEventListener('click', function () {
    current = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', current);
    renderIcon(current);
  });

  // GSAP ScrollTrigger Animations
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Custom cubic-bezier timing for sophisticated motion
    const customEase = "cubic-bezier(0.16, 1, 0.3, 1)";

    // Hero section - NO entrance animation (static opacity for professional look)
    /* Removed gsap.from(".hero-grid > *", { ... }) to keep hero elements at full opacity */

    // Reveal animations for sections with .reveal class
    const revealElements = document.querySelectorAll('.reveal');
    
        // Performance note: All animations respect prefers-reduced-motion media query
    /* Consider adding a 'no-animation' class to disable GSAP on low-power devices */

if (revealElements.length > 0) {
      revealElements.forEach((el, index) => {
              // Cleanup GSAP properties to free GPU resources
      gsap.set(revealElements, { clearProps: 'all' });

gsap.fromTo(el, 
          { 
            y: 30, 
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 0.5,
            ease: customEase,
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              end: "top 60%",
              toggleActions: "play none none reverse",
              markers: false
            }
          }
        );

        // Staggered animation for cards within the same section - faster reveal
        const cards = el.querySelectorAll('.card');
        if (cards.length > 1) {
          gsap.to(cards, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: {
              each: 0.12,
              from: "start",
              grid: "autoRows",
              rowHeight: 140,
              clamp: cards.length
            },
            ease: customEase,
            scrollTrigger: {
              trigger: el.parentElement?.parentElement || el,
              start: "top 82%",
              toggleActions: "play none none reverse"
            }
          });
        }
      });

      // Parallax effect for hero background elements
      if (document.querySelector('.hero')) {
        gsap.to(".hero h1", {
          yPercent: -30,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });

        gsap.to(".hero p", {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });

        gsap.to(".hero-actions", {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      }

      // Section heading animations - faster reveal
      const sectionHeadings = document.querySelectorAll('.section-head h2');
      sectionHeadings.forEach((heading, index) => {
        gsap.fromTo(heading,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: customEase,
            scrollTrigger: {
              trigger: heading.parentElement,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Removed problematic floating animation - can cause micro-stutters on lower-end devices
      /* Alternative: Use a cleaner GSAP-based floating effect if needed */

      // Add subtle entrance animation to navigation links on scroll
      const navLinks = document.querySelectorAll('.nav-links a');
      gsap.fromTo(navLinks,
        { y: -10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".header",
            start: "top -100"
          }
        }
      );

      // Smooth reveal for project cards with scale effect - faster
      const projectCards = document.querySelectorAll('.project-card');
      projectCards.forEach((card, index) => {
        gsap.fromTo(card,
          { 
            y: 30, 
            opacity: 0,
            scale: 0.98
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: customEase,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Philosophy section special animation (text reveal) - faster
      const philosophyText = document.querySelector('#how-i-work .card p');
      if (philosophyText) {
        gsap.fromTo(philosophyText,
          { 
            clipPath: "inset(0 100% 0 0)",
            opacity: 0
          },
          {
            clipPath: "inset(0 0 0 0)",
            opacity: 1,
            duration: 0.6,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: philosophyText.parentElement,
              start: "top 80%",
              end: "top 60%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

    } else {
      console.warn('No .reveal elements found for ScrollTrigger animations');
    }
  } else {
    console.warn('GSAP not loaded - scroll animations disabled');
    
    // Fallback to basic Intersection Observer if GSAP fails to load
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.18 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  // Metrics Counter Animations using GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
      counters.forEach((counter, index) => {
        const targetValue = parseFloat(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        
        // Animate from current textContent to target value
        gsap.to(counter, {
          innerHTML: function() { return String(targetValue) + suffix; },
          duration: 2.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: counter.parentElement.parentElement, // metric-card
            start: "top 80%",
            end: "top 60%",
            toggleActions: "play none none reverse",
            onEnter: () => {
              // Reset to 0 before animating up
              gsap.set(counter, { innerHTML: '0' + suffix });
            }
          }
        });

        // Stagger effect for counters in the same section (first counter only)
        if (index === 0 && document.querySelectorAll('.counter').length > 1) {
          const allCounters = document.querySelectorAll('.metric-card .counter');
          gsap.to(allCounters, {
            scale: 1.05,
            color: "#fff",
            duration: 0.3,
            stagger: {
              each: 0.2,
              from: "start"
            },
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".metrics",
              start: "top 75%",
              onEnterBack: "animate",
              onEnter: "animate"
            }
          });
        }
      });

  /* Counter label pulsing removed - metrics section is gone */

    } else {
      console.warn('No .counter elements found for metrics animation');
    }
  }

  // Mobile Navigation Toggle Functionality
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  
  if (mobileMenuToggle && mobileNavOverlay) {
    let isMenuOpen = false;
    
    mobileMenuToggle.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      
      // Update ARIA attributes and visual state
      mobileMenuToggle.setAttribute('aria-expanded', String(isMenuOpen));
      mobileNavOverlay.classList.toggle('active');
      mobileNavOverlay.setAttribute('aria-hidden', String(!isMenuOpen));
    });
    
    // Close menu when a nav link is clicked
    const mobileNavLink = document.querySelectorAll('.mobile-nav-link');
    mobileNavLink.forEach(link => {
      link.addEventListener('click', () => {
        if (isMenuOpen) {
          isMenuOpen = false;
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
          mobileNavOverlay.classList.remove('active');
          mobileNavOverlay.setAttribute('aria-hidden', 'true');
        }
      });
    });
    
    // Close menu when clicking outside the overlay
    document.addEventListener('click', (event) => {
      if (isMenuOpen && !mobileNavOverlay.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
        isMenuOpen = false;
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileNavOverlay.classList.remove('active');
        mobileNavOverlay.setAttribute('aria-hidden', 'true');
      }
    });
    
    // Close menu on Escape key press for accessibility
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        isMenuOpen = false;
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileNavOverlay.classList.remove('active');
        mobileNavOverlay.setAttribute('aria-hidden', 'true');
        // Focus back on the toggle button
        mobileMenuToggle.focus();
      }
    });

  } else {
    console.warn('Mobile menu elements not found - navigation toggle disabled');
  }

})();
