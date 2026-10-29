/**
 * Arsany Ramy Portfolio - Enhanced Interactions & Fluid Motion System
 */

document.addEventListener('DOMContentLoaded', () => {
  // ================= 1. BIDIRECTIONAL SCROLL REVEALS (UP & DOWN) =================
  const revealElements = document.querySelectorAll(
    '.reveal-left, .reveal-right, .reveal-up, .reveal-scale'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          // Re-triggers smooth entry when scrolling back up and down
          // Only remove if the element is not the hero section or currently above view if desired
          const rect = entry.target.getBoundingClientRect();
          // If scrolled above or below viewport, remove is-visible so it slides back in on return
          if (rect.top > window.innerHeight || rect.bottom < 0) {
            entry.target.classList.remove('is-visible');
          }
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ================= 2. FLUID LIQUID TAB GLIDER (PROJECT CATEGORIES) =================
  const filterTabsContainer = document.querySelector('.project-filter-tabs');
  const liquidPill = document.getElementById('tabLiquidPill');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('#projects-grid .project-card');

  let activeTab = document.querySelector('.filter-tab.active') || filterTabs[0];

  function positionLiquidPill(targetTab, morph = false) {
    if (!targetTab || !liquidPill || !filterTabsContainer) return;

    // Use native offsetLeft & offsetWidth for exact pixel alignment within container
    const left = targetTab.offsetLeft;
    const width = targetTab.offsetWidth;

    if (morph) {
      liquidPill.classList.add('is-morphing');
      setTimeout(() => liquidPill.classList.remove('is-morphing'), 300);
    }

    liquidPill.style.transform = `translate3d(${left}px, 0, 0)`;
    liquidPill.style.width = `${width}px`;
  }

  // Initialize pill position after layout
  setTimeout(() => {
    positionLiquidPill(activeTab, false);
  }, 40);

  // Reposition on window resize, orientation change, or font loading
  window.addEventListener('resize', () => {
    positionLiquidPill(activeTab, false);
  });
  window.addEventListener('orientationchange', () => {
    setTimeout(() => positionLiquidPill(activeTab, false), 100);
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      positionLiquidPill(activeTab, false);
    });
  }

  // Check if device supports true hover (mouse) to prevent sticky hover on touch
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Handle Tab Click & Smooth Filter
  filterTabs.forEach((tab) => {
    // Hover effect: fluidly glide pill on hover for desktop only
    if (canHover) {
      tab.addEventListener('mouseenter', () => {
        positionLiquidPill(tab, true);
      });
    }

    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      activeTab = tab;
      positionLiquidPill(tab, true);

      const filterValue = tab.getAttribute('data-filter');

      // Animate project cards in/out with alternating side glides
      projectCards.forEach((card, idx) => {
        const cardCategory = card.getAttribute('data-category');
        const matches = filterValue === 'all' || cardCategory === filterValue;

        if (matches) {
          card.classList.remove('is-filtered-out');
          // Smooth fluid entry from respective sides
          card.classList.remove('is-visible');
          setTimeout(() => {
            card.classList.add('is-visible');
          }, idx * 70);
        } else {
          card.classList.add('is-filtered-out');
          card.classList.remove('is-visible');
        }
      });
    });
  });

  // Reset pill to active tab on mouseleave container (desktop only)
  if (filterTabsContainer && canHover) {
    filterTabsContainer.addEventListener('mouseleave', () => {
      positionLiquidPill(activeTab, true);
    });
  }

  // ================= 3. SCROLL PROGRESS BAR & PARALLAX =================
  const scrollProgressBar = document.getElementById('scroll-progress');
  const siteHeader = document.getElementById('site-header');
  const backToTopBtn = document.getElementById('back-to-top');
  const backToTopText = document.getElementById('backToTopText');
  const ambientOrbs = document.querySelectorAll('.ambient-glow');

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        // Progress bar
        if (scrollProgressBar) {
          scrollProgressBar.style.width = `${scrollPercent}%`;
        }

        // Header scrolled class
        if (siteHeader) {
          if (scrollTop > 25) {
            siteHeader.classList.add('scrolled');
          } else {
            siteHeader.classList.remove('scrolled');
          }
        }

        // Back to top button
        if (backToTopBtn) {
          if (scrollTop > 380) {
            backToTopBtn.classList.add('is-active');
          } else {
            backToTopBtn.classList.remove('is-active');
          }
        }

        // Ambient glow parallax
        ambientOrbs.forEach((orb) => {
          const speed = parseFloat(orb.dataset.parallaxSpeed || '0.1');
          const yPos = scrollTop * speed;
          orb.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });

        ticking = false;
      });
      ticking = true;
    }
  });

  // Back to top clicks
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (backToTopText) {
    backToTopText.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ================= 4. HERO 3D TILT WITH MOUSE PARALLAX =================
  const heroTiltCard = document.getElementById('hero-tilt-card');
  if (heroTiltCard && window.matchMedia('(hover: hover)').matches) {
    const portraitFrame = heroTiltCard.querySelector('.portrait-frame');
    const floatingBadges = heroTiltCard.querySelectorAll('.floating-badge');

    heroTiltCard.addEventListener('mousemove', (e) => {
      const rect = heroTiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      if (portraitFrame) {
        portraitFrame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      }

      floatingBadges.forEach((badge) => {
        const speed = parseFloat(badge.dataset.tiltSpeed || '1');
        const badgeX = ((x - centerX) / centerX) * (14 * speed);
        const badgeY = ((y - centerY) / centerY) * (14 * speed);
        badge.style.transform = `translate3d(${badgeX}px, ${badgeY}px, 0) scale(1.02)`;
      });
    });

    heroTiltCard.addEventListener('mouseleave', () => {
      if (portraitFrame) {
        portraitFrame.style.transform =
          'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
      floatingBadges.forEach((badge) => {
        badge.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
      });
    });
  }

  // ================= 5. SPOTLIGHT GLOW ON CARDS =================
  const spotCards = document.querySelectorAll('.spot-card');
  if (window.matchMedia('(hover: hover)').matches) {
    spotCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // ================= 6. MOBILE NAVIGATION =================
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (menuToggle && mainNav) {
    const closeMenu = () => {
      mainNav.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
      const clickedInsideNav = mainNav.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (
        !clickedInsideNav &&
        !clickedToggle &&
        mainNav.classList.contains('is-open')
      ) {
        closeMenu();
      }
    });
  }

  // ================= 7. FOOTER YEAR =================
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ================= 8. ACTIVE NAV LINK ON SCROLL =================
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach((sec) => navObserver.observe(sec));
});
