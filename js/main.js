(function () {
  // Theme toggle
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  function renderIcon(theme) {
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 21 12.79z"></path></svg>';
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

  // GSAP animations
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    const customEase = 'cubic-bezier(0.16,1,0.3,1)';

    // Reveal elements
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
      revealElements.forEach(el => {
        gsap.set(el, { clearProps: 'all' });
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

      // Hero parallax
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

      // Section headings
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

      // Nav links
      const navLinks = document.querySelectorAll('.nav-links a');
      gsap.set(navLinks, { opacity: 1, y: 0 });
    }

    // Counters (Fixed logic: checks if elements exist before running)
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
      counters.forEach(counter => {
        const targetValue = parseFloat(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        gsap.to(
          counter,
          { innerHTML: () => String(targetValue) + suffix },
          {
            duration: 2.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: counter.parentElement.parentElement,
              start: 'top 80%',
              end: 'top 60%',
              toggleActions: 'play none none reverse',
              onEnter: () => gsap.set(counter, { innerHTML: '0' + suffix }),
            },
          }
        );
      });
    }
  }

  // System Manifest topology visualization
  (function () {
    function buildTopology() {
      var wrapper = document.getElementById('topoWrapper');
      var svg    = document.getElementById('topoSvg');
      var linesG = document.getElementById('topoLines');
      if (!wrapper || !svg || !linesG) return;

      var wRect = wrapper.getBoundingClientRect();
      if (wRect.width < 10) return;

      var cards = [
        document.getElementById('topoCardA'),
        document.getElementById('topoCardB'),
        document.getElementById('topoCardC'),
        document.getElementById('topoCardD'),
      ];

      var positions = [
        { x: 0.49, y: 0.18 },   /* Top-left quadrant */
        { x: 0.51, y: 0.18 },   /* Top-right quadrant */
        { x: 0.49, y: 0.62 },   /* Bottom-left quadrant */  
        { x: 0.51, y: 0.62 }    /* Bottom-right quadrant */
      ];

      var w = wRect.width;
      var h = wrapper.offsetHeight;

      var cx = (200 / 400) * w;
      var cy = (170 / 340) * h;

      linesG.innerHTML = '';

      cards.forEach(function (card, i) {
        if (!card) return;
        var pos  = positions[i];
        var left = pos.x * w;
        var top  = pos.y * h;

        card.style.left = left + 'px';
        card.style.top  = top  + 'px';

        var cw     = card.offsetWidth  || 148;
        var ch     = card.offsetHeight || 60;
        var cardCx = left + cw / 2;
        var cardCy = top  + ch / 2;

        var ns   = 'http://www.w3.org/2000/svg';
        var line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', ((cx / w) * 400).toFixed(1));
        line.setAttribute('y1', ((cy / h) * 340).toFixed(1));
        line.setAttribute('x2', ((cardCx / w) * 400).toFixed(1));
        line.setAttribute('y2', ((cardCy / h) * 340).toFixed(1));
        line.setAttribute('stroke', 'rgba(114,224,160,0.28)');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('stroke-dasharray', '4 6');
        line.style.animation = 'topo-dash-flow 2.4s linear ' + (i * 0.6).toFixed(1) + 's infinite';
        linesG.appendChild(line);

        var dot = document.createElementNS(ns, 'circle');
        dot.setAttribute('cx', ((cardCx / w) * 400).toFixed(1));
        dot.setAttribute('cy', ((cardCy / h) * 340).toFixed(1));
        dot.setAttribute('r', '3');
        dot.setAttribute('fill', 'rgba(114,224,160,0.5)');
        linesG.appendChild(dot);
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { setTimeout(buildTopology, 100); });
    } else {
      setTimeout(buildTopology, 100);
    }
    window.addEventListener('resize', buildTopology);
  })();

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