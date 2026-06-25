(function () {
  // Progressive enhancement flag — CSS targets .js-enabled .reveal to avoid
  // content hidden when JS is blocked or slow
  document.documentElement.classList.add('js-enabled');

  // Theme toggle
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  function renderIcon(theme) {
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  root.setAttribute('data-theme', current);
  renderIcon(current);

  if (toggle) {
    toggle.addEventListener('click', () => {
      current = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', current);
      renderIcon(current);
    });
  }

  // Mobile navigation
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('active');
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Open navigation');
        document.body.style.overflow = '';
      });
    });
  }

  // GSAP animations
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    const customEase = 'cubic-bezier(0.16,1,0.3,1)';

    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
      revealElements.forEach(el => {
        gsap.fromTo(
          el,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: customEase,
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
              end: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        const cards = el.querySelectorAll('.card');
        if (cards.length > 1) {
          gsap.to(cards, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: { each: 0.12, from: 'start', grid: 'autoRows', rowHeight: 140, clamp: cards.length },
            ease: customEase,
            scrollTrigger: {
              trigger: el.parentElement?.parentElement || el,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      });

      if (document.querySelector('.hero')) {
        gsap.to('.hero h1', {
          yPercent: -30,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('.hero p', {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('.hero-actions', {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        });
      }

      const sectionHeadings = document.querySelectorAll('.section-head h2');
      sectionHeadings.forEach(heading => {
        gsap.fromTo(
          heading,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: customEase,
            scrollTrigger: { trigger: heading.parentElement, start: 'top 80%', toggleActions: 'play none none reverse' },
          }
        );
      });

      const navLinks = document.querySelectorAll('.nav-links a');
      gsap.set(navLinks, { opacity: 1, y: 0 });
    }

    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
      counters.forEach(counter => {
        const targetValue = parseFloat(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        gsap.to(counter, {
          innerHTML: () => String(targetValue) + suffix,
          duration: 2.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: counter.parentElement.parentElement,
            start: 'top 80%',
            end: 'top 60%',
            toggleActions: 'play none none reverse',
            onEnter: () => gsap.set(counter, { innerHTML: '0' + suffix }),
          },
        });
      });
    }
  }

  // Copy-to-clipboard — contact section email
  document.querySelectorAll('#contact .ctc-copy').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var text = btn.dataset.copy;
      var label = btn.querySelector('.ctc-copy-text');
      function confirm() {
        label.textContent = 'copied';
        btn.classList.add('is-copied');
        setTimeout(function() {
          label.textContent = 'copy';
          btn.classList.remove('is-copied');
        }, 2000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(confirm).catch(function() {
          fallbackCopy(text); confirm();
        });
      } else {
        fallbackCopy(text); confirm();
      }
    });
  });

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* silent */ }
    document.body.removeChild(ta);
  }
})();
