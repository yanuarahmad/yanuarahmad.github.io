/**
* Template Name: Creativo
* Template URL: https://bootstrapmade.com/creativo-bootstrap-creative-agency-template/
* Updated: Mar 23 2026 with Bootstrap v5.3.8
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

/* ===== SITE CONFIG: edit these two values ===== */
const SITE = {
  whatsapp: "628159990421",             // country code + number, digits only
  whatsappDisplay: "+62 815-9990-421",
  email: "yanua764@gmail.com"
};

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Header navigation: right-side drawer (mobile & tablet)
   */
  const navToggle = document.querySelector('.nav-toggle');
  const navDrawer = document.getElementById('drawer');
  const navBackdrop = document.querySelector('.nav-backdrop');
  const desktopQuery = window.matchMedia('(min-width: 992px)');
  const inertTargets = document.querySelectorAll('main, footer');

  function isNavOpen() {
    return document.body.classList.contains('nav-open');
  }

  function setNav(open, restoreFocus) {
    if (!navToggle || !navDrawer) return;
    if (open && desktopQuery.matches) return;
    document.body.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navDrawer.inert = !open;
    inertTargets.forEach(el => { el.inert = open; });
    if (!open && restoreFocus) navToggle.focus();
  }

  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', () => setNav(!isNavOpen(), false));
    if (navBackdrop) navBackdrop.addEventListener('click', () => setNav(false, false));

    // any anchor in the header or drawer closes it (the browser still scrolls to the target)
    document.querySelectorAll('.header a, .drawer a').forEach(a => {
      a.addEventListener('click', () => { if (isNavOpen()) setNav(false, false); });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isNavOpen()) setNav(false, true);
    });

    desktopQuery.addEventListener('change', e => { if (e.matches) setNav(false, false); });
  }

  /**
   * Scrollspy for desktop links + drawer links
   */
  const spyLinks = [...document.querySelectorAll('[data-spy]')];
  const spySections = ['hero', 'about', 'story', 'services', 'portfolio', 'contact']
    .map(id => document.getElementById(id)).filter(Boolean);
  let spyQueued = false;

  function updateScrollspy() {
    spyQueued = false;
    if (!spySections.length) return;
    const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
    const line = headerH + 80;
    let current = spySections[0];
    spySections.forEach(s => { if (s.getBoundingClientRect().top <= line) current = s; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = spySections[spySections.length - 1];
    }
    spyLinks.forEach(a => {
      const on = a.hash === '#' + current.id;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }

  function queueScrollspy() {
    if (spyQueued) return;
    spyQueued = true;
    requestAnimationFrame(updateScrollspy);
  }
  window.addEventListener('load', updateScrollspy);
  window.addEventListener('scroll', queueScrollspy, { passive: true });
  window.addEventListener('resize', queueScrollspy);

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    // never let a slow font/image keep a full-screen overlay on top of the page
    const hidePreloader = () => preloader.remove();
    window.addEventListener('load', hidePreloader);
    setTimeout(hidePreloader, 2500);
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (typeof AOS === 'undefined') return;
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 70,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate Pure Counter
   */
  if (typeof PureCounter !== 'undefined') new PureCounter();

  /**
   * Portfolio: filters (All / Menu / Development + menu sub-categories)
   * and a small custom lightbox. The lightbox never touches the page scroll
   * position, so closing a zoomed photo can no longer make the page jump.
   */
  const portfolioRoot = document.querySelector('.isotope-layout');
  let iso = null;
  let currentFilter = '*';
  let group = 'all', sub = 'all';
  const subWrap = document.querySelector('.sub-wrap');

  const filterSelector = () => {
    if (group === 'menu') return sub === 'all' ? '.filter-menu' : '.filter-' + sub;
    if (group === 'development') return '.filter-development';
    return '*';
  };
  const applyFilter = () => {
    currentFilter = filterSelector();
    if (subWrap) subWrap.classList.toggle('show', group === 'menu');
    if (iso) iso.arrange({ filter: currentFilter });
  };

  if (portfolioRoot) {
    const container = portfolioRoot.querySelector('.isotope-container');
    if (typeof Isotope !== 'undefined') {
      iso = new Isotope(container, { itemSelector: '.isotope-item', layoutMode: 'fitRows', filter: '*' });
      if (typeof imagesLoaded !== 'undefined') imagesLoaded(container).on('progress', () => iso.layout());
    }
    const bindTabs = (selector, attr, onPick) => {
      portfolioRoot.querySelectorAll(selector + ' li').forEach(li => {
        li.setAttribute('tabindex', '0');
        li.setAttribute('role', 'button');
        li.setAttribute('aria-pressed', String(li.classList.contains('filter-active')));
        const pick = () => {
          li.parentElement.querySelectorAll('li').forEach(x => { x.classList.remove('filter-active'); x.setAttribute('aria-pressed', 'false'); });
          li.classList.add('filter-active');
          li.setAttribute('aria-pressed', 'true');
          onPick(li.getAttribute(attr));
        };
        li.addEventListener('click', pick);
        li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
      });
    };
    bindTabs('.primary-filters', 'data-group', v => {
      group = v; sub = 'all';
      portfolioRoot.querySelectorAll('.sub-filters li').forEach((x, i) => x.classList.toggle('filter-active', i === 0));
      applyFilter();
    });
    bindTabs('.sub-filters', 'data-sub', v => { sub = v; applyFilter(); });
  }

  // ---- Lightbox: free zoom (wheel / pinch / double-tap / drag), click outside to close ----
  const lb = document.createElement('div');
  lb.className = 'lb';
  lb.hidden = true;
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Portfolio photo viewer');
  lb.innerHTML =
    '<div class="lb-backdrop"></div>' +
    '<button type="button" class="lb-btn lb-close" aria-label="Close"><i class="bi bi-x-lg"></i></button>' +
    '<button type="button" class="lb-btn lb-nav lb-prev" aria-label="Previous"><i class="bi bi-chevron-left"></i></button>' +
    '<button type="button" class="lb-btn lb-nav lb-next" aria-label="Next"><i class="bi bi-chevron-right"></i></button>' +
    '<div class="lb-tools" role="group" aria-label="Zoom controls">' +
      '<button type="button" class="lb-btn" data-zoom="out" aria-label="Zoom out"><i class="bi bi-zoom-out"></i></button>' +
      '<button type="button" class="lb-btn" data-zoom="reset" aria-label="Reset zoom"><i class="bi bi-arrow-counterclockwise"></i></button>' +
      '<button type="button" class="lb-btn" data-zoom="in" aria-label="Zoom in"><i class="bi bi-zoom-in"></i></button>' +
    '</div>' +
    '<figure class="lb-stage"><div class="lb-img-wrap"><img class="lb-img" alt="" draggable="false"></div>' +
    '<figcaption class="lb-info"><span class="lb-cat"></span><h3 class="lb-title"></h3><p class="lb-desc"></p><p class="lb-story"></p><span class="lb-count"></span></figcaption></figure>';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('.lb-img');
  const lbWrap = lb.querySelector('.lb-img-wrap');
  let lbItems = [], lbIndex = 0, lbOpener = null;

  const Z_MAX = 6;
  let scale = 1, tx = 0, ty = 0, moved = false, lastTap = 0, wheelTimer = null, panStart = null, pinchStart = null;
  const pointers = new Map();
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const paint = () => {
    lbImg.style.transform = (scale === 1 && !tx && !ty) ? '' : 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
    lb.classList.toggle('zoomed', scale > 1.02);
  };
  const constrain = () => {
    const w = lbImg.offsetWidth, h = lbImg.offsetHeight;
    const mx = (w * scale - w) / 2 + w * 0.4, my = (h * scale - h) / 2 + h * 0.4;
    tx = clamp(tx, -mx, mx); ty = clamp(ty, -my, my);
  };
  const resetZoom = () => { scale = 1; tx = 0; ty = 0; paint(); };
  // zoom keeping the point under (cx, cy) fixed
  const zoomAt = (cx, cy, next) => {
    next = clamp(next, 1, Z_MAX);
    if (next === scale) return;
    const r = lbWrap.getBoundingClientRect();
    const px = cx - (r.left + r.width / 2), py = cy - (r.top + r.height / 2);
    const k = next / scale;
    tx = px - (px - tx) * k; ty = py - (py - ty) * k;
    scale = next;
    if (scale === 1) { tx = 0; ty = 0; } else constrain();
    paint();
  };

  const lbShow = (i) => {
    lbIndex = (i + lbItems.length) % lbItems.length;
    const a = lbItems[lbIndex];
    resetZoom();
    lbImg.classList.remove('in');
    lbImg.src = a.getAttribute('href');
    lbImg.alt = a.querySelector('img') ? a.querySelector('img').alt : (a.dataset.title || '');
    lb.querySelector('.lb-cat').textContent = a.dataset.cat || '';
    lb.querySelector('.lb-title').textContent = a.dataset.title || '';
    lb.querySelector('.lb-desc').textContent = a.dataset.desc || '';
    lb.querySelector('.lb-story').textContent = a.dataset.story || '';
    lb.querySelector('.lb-count').textContent = (lbIndex + 1) + ' / ' + lbItems.length;
    const done = () => lbImg.classList.add('in');
    if (lbImg.complete) done(); else lbImg.onload = done;
    lb.classList.toggle('single', lbItems.length < 2);
  };
  const lbOpen = (a) => {
    lbItems = Array.from(document.querySelectorAll('.isotope-item'))
      .filter(el => el.matches(currentFilter))
      .map(el => el.querySelector('a.lb-trigger'));
    lbOpener = a;
    lb.hidden = false;
    document.documentElement.classList.add('lb-open');
    lbShow(Math.max(0, lbItems.indexOf(a)));
    requestAnimationFrame(() => lb.classList.add('open'));
    lb.querySelector('.lb-close').focus({ preventScroll: true });
  };
  const lbClose = () => {
    if (lb.hidden) return;
    lb.classList.remove('open');
    document.documentElement.classList.remove('lb-open');
    pointers.clear(); panStart = null; pinchStart = null;
    setTimeout(() => {
      lb.hidden = true;
      resetZoom();
      lbImg.removeAttribute('src');
      if (lbOpener) lbOpener.focus({ preventScroll: true });
    }, 250);
  };

  document.addEventListener('click', e => {
    const a = e.target.closest('a.lb-trigger');
    if (a) { e.preventDefault(); lbOpen(a); }
  });
  lb.querySelector('.lb-close').addEventListener('click', lbClose);
  lb.querySelector('.lb-prev').addEventListener('click', () => lbShow(lbIndex - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => lbShow(lbIndex + 1));
  lb.querySelectorAll('[data-zoom]').forEach(b => b.addEventListener('click', () => {
    const cx = innerWidth / 2, cy = innerHeight / 2, m = b.dataset.zoom;
    if (m === 'reset') resetZoom(); else zoomAt(cx, cy, scale * (m === 'in' ? 1.5 : 1 / 1.5));
  }));

  // click anywhere that is not the photo, a button or the caption text closes the viewer
  lb.addEventListener('click', e => {
    if (moved) { moved = false; return; }
    if (e.target.closest('.lb-btn, .lb-tools, .lb-title, .lb-desc, .lb-story')) return;
    const r = lbImg.getBoundingClientRect();
    if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) return;
    lbClose();
  });

  // mouse wheel / trackpad pinch
  lb.addEventListener('wheel', e => {
    if (e.target.closest('.lb-info')) return;
    e.preventDefault();
    lbImg.classList.add('gesture');
    zoomAt(e.clientX, e.clientY, scale * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002)));
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => lbImg.classList.remove('gesture'), 150);
  }, { passive: false });

  // drag to pan, two fingers to pinch, double tap / double click to toggle zoom, swipe to change photo
  lbWrap.addEventListener('pointerdown', e => {
    lbWrap.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved = false;
    lbImg.classList.add('gesture');
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchStart = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, s: scale };
    } else {
      panStart = { x: e.clientX, y: e.clientY, tx, ty };
    }
  });
  lbWrap.addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2 && pinchStart) {
      const [a, b] = [...pointers.values()];
      zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, pinchStart.s * Math.hypot(a.x - b.x, a.y - b.y) / pinchStart.d);
      moved = true;
    } else if (pointers.size === 1 && panStart) {
      const dx = e.clientX - panStart.x, dy = e.clientY - panStart.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      if (scale > 1) { tx = panStart.tx + dx; ty = panStart.ty + dy; constrain(); paint(); }
    }
  });
  const endPointer = e => {
    if (!pointers.has(e.pointerId)) return;
    const wasSingle = pointers.size === 1;
    pointers.delete(e.pointerId);
    if (pointers.size === 1) {
      const p = [...pointers.values()][0];
      panStart = { x: p.x, y: p.y, tx, ty }; pinchStart = null;
      return;
    }
    lbImg.classList.remove('gesture');
    if (wasSingle && panStart && e.type === 'pointerup') {
      const dx = e.clientX - panStart.x, dy = e.clientY - panStart.y;
      if (!moved) {
        const now = Date.now();
        if (now - lastTap < 320) { zoomAt(e.clientX, e.clientY, scale > 1 ? 1 : 2.5); lastTap = 0; moved = true; }
        else lastTap = now;
      } else if (scale === 1 && Math.abs(dx) > 60 && Math.abs(dy) < 80 && lbItems.length > 1) {
        lbShow(lbIndex + (dx < 0 ? 1 : -1));
      }
    }
    panStart = null; pinchStart = null;
  };
  lbWrap.addEventListener('pointerup', endPointer);
  lbWrap.addEventListener('pointercancel', endPointer);

  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') lbClose();
    else if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
    else if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
    else if (e.key === '+' || e.key === '=') zoomAt(innerWidth / 2, innerHeight / 2, scale * 1.5);
    else if (e.key === '-') zoomAt(innerWidth / 2, innerHeight / 2, scale / 1.5);
    else if (e.key === '0') resetZoom();
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Site config: WhatsApp / email links, year
   */
  const waReady = !/X/i.test(SITE.whatsapp);
  document.querySelectorAll('[data-wa-link]').forEach(a => { a.href = 'https://wa.me/' + SITE.whatsapp; });
  document.querySelectorAll('[data-wa-display]').forEach(a => { a.textContent = SITE.whatsappDisplay; });
  // mailto: does nothing on desktops without a mail app, so desktop opens Gmail compose; phones keep mailto:
  const isPhone = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  document.querySelectorAll('[data-mail-link]').forEach(a => {
    if (isPhone) { a.href = 'mailto:' + SITE.email; return; }
    a.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(SITE.email);
    a.target = '_blank'; a.rel = 'noopener noreferrer';
  });
  document.querySelectorAll('[data-mail-display]').forEach(a => { a.textContent = SITE.email; });
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /**
   * Book a call form -> WhatsApp ("Hi Yan", then name and message)
   */
  const waForm = document.getElementById('wa-form');
  if (waForm) {
    const err = waForm.querySelector('.error-message');
    const ok = waForm.querySelector('.sent-message');
    waForm.addEventListener('submit', function(e) {
      e.preventDefault();
      err.classList.remove('show'); ok.classList.remove('show');
      const name = waForm.elements.name.value.trim();
      const message = waForm.elements.message.value.trim();
      if (!name || !message) { err.textContent = 'Please fill in your name and message.'; err.classList.add('show'); return; }
      if (!waReady) { err.textContent = 'WhatsApp number is not set yet (see SITE in assets/js/main.js).'; err.classList.add('show'); return; }
      const text = 'Hi Yan,\n\nI am ' + name + '.\n\n' + message;
      const url = 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(text);
      ok.classList.add('show');
      window.open(url, '_blank', 'noopener');
      waForm.reset();
    });
  }

  /**
   * Extra motion: scroll progress bar + gentle hero parallax
   */
  const progressBar = document.querySelector('.scroll-progress');
  const heroImg = document.querySelector('.hero .media-block img');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ticking = false;
  function onScrollFx() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.transform = 'scaleX(' + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ')';
    if (heroImg && !reduceMotion && window.scrollY < window.innerHeight) {
      heroImg.style.transform = 'translateY(' + (window.scrollY * 0.06) + 'px) scale(1.04)';
    }
    ticking = false;
  }
  document.addEventListener('scroll', function() {
    if (!ticking) { ticking = true; requestAnimationFrame(onScrollFx); }
  }, { passive: true });
  window.addEventListener('load', onScrollFx);

})();