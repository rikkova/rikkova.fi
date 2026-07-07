(function () {
  // Progressive enhancement flag — CSS targets .js-enabled .reveal to avoid
  // content hidden when JS is blocked or slow
  document.documentElement.classList.add('js-enabled');

  // Theme toggle
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let current = localStorage.getItem('theme') || (systemPrefersDark ? 'dark' : 'light');

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
      localStorage.setItem('theme', current);
      renderIcon(current);
    });
  }

  // Mobile navigation
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (mobileToggle && mobileNav) {
    const focusableSelector = 'a[href], button:not([disabled])';

    function setMobileNav(open) {
      mobileNav.classList.toggle('active', open);
      mobileNav.setAttribute('aria-hidden', String(!open));
      mobileToggle.setAttribute('aria-expanded', String(open));
      mobileToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      document.body.style.overflow = open ? 'hidden' : '';

      if (open) {
        const firstLink = mobileNav.querySelector('.mobile-nav-link');
        if (firstLink) firstLink.focus();
      } else {
        mobileToggle.focus();
      }
    }

    mobileToggle.addEventListener('click', () => {
      setMobileNav(!mobileNav.classList.contains('active'));
    });

    mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        setMobileNav(false);
      });
    });

    document.addEventListener('keydown', event => {
      if (!mobileNav.classList.contains('active')) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        setMobileNav(false);
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = [mobileToggle, ...mobileNav.querySelectorAll(focusableSelector)];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  // Native scroll reveals. If IntersectionObserver is unavailable, show content.
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    document.documentElement.classList.remove('js-enabled');
  }

  // Section-level scroll presence: keeps large desktop sections feeling paced.
  const pageSections = Array.from(document.querySelectorAll('main > .section'));
  if (pageSections.length > 0) {
    let sectionTicking = false;

    function setCurrentSection(section) {
      pageSections.forEach(item => {
        item.classList.toggle('is-section-current', item === section);
      });
    }

    function updateCurrentSection() {
      const viewportAnchor = window.scrollY + window.innerHeight * 0.52;
      const currentSection = pageSections.find(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        return viewportAnchor >= top && viewportAnchor < bottom;
      }) || pageSections[pageSections.length - 1];

      setCurrentSection(currentSection);
      sectionTicking = false;
    }

    function requestSectionUpdate() {
      if (sectionTicking) return;
      sectionTicking = true;
      requestAnimationFrame(updateCurrentSection);
    }

    window.addEventListener('scroll', requestSectionUpdate, { passive: true });
    window.addEventListener('resize', requestSectionUpdate);
    updateCurrentSection();
  }

  const sectionNavLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const navTargets = sectionNavLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sectionNavLinks.length > 0 && navTargets.length > 0) {
    const setActiveNav = id => {
      sectionNavLinks.forEach(link => {
        if (link.getAttribute('href') === '#' + id) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    const activeObserver = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) setActiveNav(visible.target.id);
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0.08, 0.2, 0.4] });

    navTargets.forEach(section => activeObserver.observe(section));
  }

  // Back-to-top: visible only after ~80% of a viewport of scroll
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    let ticking = false;
    function updateBackToTop() {
      backToTop.classList.toggle('visible', window.scrollY > window.innerHeight * 0.8);
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updateBackToTop); ticking = true; }
    }, { passive: true });
    updateBackToTop();
  }

  // Copy-to-clipboard: contact section email
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
