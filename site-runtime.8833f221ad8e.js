/* 17. Public product configuration. No accounts, checkout or storage.
       The request number and social account are from the supplied TGN source. */
    (() => {
      'use strict';
      const WHATSAPP_NUMBER = '97333928495';
      const products = Object.freeze([
        Object.freeze({
          id: 'tgn-107',
          title: 'تقن 107',
          subtitle: 'مذكرة مراجعة الامتحان النهائي',
          available: true,
          priceBHD: 1.000,
          deliveryBHD: 0.500,
          includes: Object.freeze([
            'مذكرة مراجعة الامتحان النهائي',
            'الوصول إلى المراجعة الإلكترونية والشروح'
          ]),
          packageLabel: 'المذكرة + المراجعة الإلكترونية',
          orderMethod: 'whatsapp',
          orderContact: WHATSAPP_NUMBER
        })
      ]);
      const product = products[0];
      const priceFormatter = new Intl.NumberFormat('en-BH', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
        useGrouping: false
      });
      const formatPrice = value => priceFormatter.format(value);
      function createWhatsAppUrl(message, number = WHATSAPP_NUMBER) {
        return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
      }
      const purchaseMessage = [
        'السلام عليكم ورحمة الله وبركاته،',
        '',
        `أرغب في طلب باقة ${product.title} لمراجعة الامتحان النهائي، بسعر ${formatPrice(product.priceBHD)} دينار بحريني.`,
        '',
        'تشمل الباقة:',
        ...product.includes.map(item => `- ${item}.`),
        '',
        'أرجو تزويدي بطريقة الدفع وخطوات إتمام الطلب، وآلية استلام المذكرة والوصول إلى المراجعة بعد التحقق من الدفع.',
        '',
        'شكرًا لكم.'
      ].join('\n');
      const canOrder = product.available === true && product.orderMethod === 'whatsapp';
      const actionUrls = { order: canOrder ? createWhatsAppUrl(purchaseMessage, product.orderContact) : null };
      const generalInquiryMessage = [
        'السلام عليكم ورحمة الله وبركاته،',
        '',
        'أتواصل معكم عبر موقع مراجعات إبراهيم علي.',
        '',
        'أرغب في الاستفسار عن المذكرات أو المراجعات الإلكترونية أو خدمات الطلب والدعم، ويسعدني الحصول على المساعدة والمعلومات المناسبة.',
        '',
        'شكرًا لكم.'
      ].join('\n');
      document.querySelectorAll('[data-contact-action="inquiry"]').forEach(link => {
        link.href = createWhatsAppUrl(generalInquiryMessage);
      });
      document.querySelectorAll('[data-product-title]').forEach(element => {
        const title = document.createDocumentFragment();
        product.title.split(/(\d+)/).forEach(part => {
          if (/^\d+$/.test(part)) {
            const number = document.createElement('bdi');
            number.textContent = part;
            title.append(number);
          } else title.append(document.createTextNode(part));
        });
        element.replaceChildren(title);
      });
      document.querySelectorAll('[data-product-subtitle]').forEach(element => { element.textContent = product.subtitle; });
      document.querySelectorAll('[data-product-price]').forEach(element => { element.textContent = formatPrice(product.priceBHD); });
      document.querySelectorAll('[data-delivery-price]').forEach(element => { element.textContent = formatPrice(product.deliveryBHD); });
      document.querySelectorAll('[data-product-package]').forEach(element => { element.textContent = product.packageLabel; });
      document.querySelectorAll('[data-product-include]').forEach(element => { element.textContent = product.includes[Number(element.dataset.productInclude)] || ''; });
      document.querySelectorAll('[data-product-availability]').forEach(element => {
        element.classList.toggle('unavailable', product.available !== true);
        element.querySelector('[data-availability-label]').textContent = product.available === true ? 'متوفر للطلب' : 'غير متوفر حاليًا';
        element.querySelector('use').setAttribute('href', product.available === true ? '#i-check' : '#i-clock');
      });
      document.querySelectorAll('[data-product-action]').forEach(link => {
        const destination = actionUrls[link.dataset.productAction];
        if (destination) {
          link.href = destination;
          link.removeAttribute('aria-disabled');
        } else {
          link.removeAttribute('href');
          link.setAttribute('aria-disabled', 'true');
          link.tabIndex = -1;
        }
      });
      document.querySelector('meta[name="description"]').content = `مراجعات إبراهيم علي — باقة ${product.title} بسعر ${formatPrice(product.priceBHD)} د.ب، تشمل المذكرة والمراجعة الإلكترونية والشروح. الطلب عبر واتساب والتسليم بعد تأكيد الدفع.`;

      /* 17b. Original TGN pointer/keyboard pressed feedback. */
      const releasePress = () => document.querySelectorAll('.ds-pressed').forEach(element => element.classList.remove('ds-pressed'));
      function showPress(event) {
        const control = event.target.closest?.('.action,.social-control');
        if (control && !control.disabled && control.getAttribute('aria-disabled') !== 'true') control.classList.add('ds-pressed');
      }
      document.addEventListener('pointerdown', event => { if (event.button === 0) showPress(event); });
      document.addEventListener('keydown', event => { if (['Enter', ' '].includes(event.key)) showPress(event); });
      for (const event of ['pointerup', 'pointercancel', 'keyup']) document.addEventListener(event, releasePress);
      addEventListener('blur', releasePress);

      /* 18. Mobile menu: native links, focus management, no scroll trap. */
      const navigation = document.getElementById('navigation');
      const menu = document.getElementById('menu');
      const toggle = document.getElementById('menu-toggle');
      const mobile = matchMedia('(max-width:1000px)');
      const menuLinks = Array.from(menu.querySelectorAll('a'));
      function setMenu(open, returnFocus = false) {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'إغلاق قائمة الأقسام' : 'فتح قائمة الأقسام');
        menu.classList.toggle('open', open);
        if (returnFocus) toggle.focus({ preventScroll: true });
      }
      toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
      toggle.addEventListener('keydown', event => {
        if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
        event.preventDefault();
        setMenu(true);
        (event.key === 'ArrowUp' ? menuLinks.at(-1) : menuLinks[0]).focus();
      });
      menu.addEventListener('keydown', event => {
        if (!mobile.matches || toggle.getAttribute('aria-expanded') !== 'true') return;
        const index = menuLinks.indexOf(document.activeElement);
        if (index < 0 || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? menuLinks.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + menuLinks.length) % menuLinks.length;
        menuLinks[next].focus();
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
      });
      document.addEventListener('click', event => {
        if (!navigation.contains(event.target)) setMenu(false);
      });
      navigation.addEventListener('focusout', () => requestAnimationFrame(() => {
        if (mobile.matches && !navigation.contains(document.activeElement)) setMenu(false);
      }));
      mobile.addEventListener('change', () => setMenu(false));

      /* 19. Section navigation: one measured offset, smooth movement,
         keyboard focus, scroll tracking and real browser history. */
      const sectionTargets = menuLinks.map(link => document.querySelector(link.hash)).filter(Boolean);
      const reducedMotion = matchMedia('(prefers-reduced-motion:reduce)');
      let activeSectionId = '';
      let anchorOffset = 120;
      function activate(id) {
        if (activeSectionId === id) return;
        activeSectionId = id;
        menuLinks.forEach(link => {
          if (link.hash === '#' + id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
        sectionTargets.forEach(section => section.toggleAttribute('data-section-active', section.id === id));
      }
      function measureNavigation() {
        anchorOffset = Math.ceil(navigation.getBoundingClientRect().bottom + 20);
        document.documentElement.style.setProperty('--anchor-offset', `${anchorOffset}px`);
      }
      function focusSection(target) {
        const previouslyFocusable = target.hasAttribute('tabindex');
        if (!previouslyFocusable) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        if (!previouslyFocusable) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      }
      function scrollToSection(target, smooth = true) {
        measureNavigation();
        const marker = target.matches('section:not(#home)') ? target.querySelector('.section-label') || target : target;
        const top = target.id === 'home' ? 0 : Math.max(0, Math.round(marker.getBoundingClientRect().top + scrollY - anchorOffset));
        window.scrollTo({ top, behavior: smooth && !reducedMotion.matches ? 'smooth' : 'instant' });
      }
      document.addEventListener('click', event => {
        const link = event.target.closest('a[href^="#"]');
        if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
        const target = document.getElementById(link.hash.slice(1));
        if (!target) return;
        event.preventDefault();
        setMenu(false);
        focusSection(target);
        if (location.hash !== link.hash) history.pushState(null, '', link.hash);
        scrollToSection(target);
        const section = sectionTargets.find(item => item === target || item.contains(target));
        if (section) activate(section.id);
      });
      let scrollFrame = 0;
      function updateActiveSection() {
        scrollFrame = 0;
        navigation.classList.toggle('is-scrolled', scrollY > 24);
        const marker = anchorOffset + 28;
        let current = sectionTargets[0];
        for (const target of sectionTargets) {
          const heading = target.querySelector('.section-label') || target;
          if (heading.getBoundingClientRect().top <= marker) current = target;
        }
        if (Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight - 2) current = sectionTargets.at(-1);
        if (current) activate(current.id);
      }
      addEventListener('scroll', () => {
        if (!scrollFrame) scrollFrame = requestAnimationFrame(updateActiveSection);
      }, { passive: true });
      addEventListener('resize', () => { measureNavigation(); updateActiveSection(); });
      addEventListener('hashchange', updateActiveSection);
      addEventListener('popstate', () => {
        const target = document.getElementById(location.hash.slice(1) || 'home');
        if (target) { focusSection(target); scrollToSection(target, false); }
        updateActiveSection();
      });
      if ('ResizeObserver' in window) new ResizeObserver(measureNavigation).observe(navigation);
      measureNavigation();
      updateActiveSection();
      if (location.hash) {
        const initialHash = location.hash;
        let initialAnchorCancelled = false;
        const inputEvents = ['pointerdown', 'wheel', 'touchstart', 'keydown'];
        const cancelInitialAnchor = () => { initialAnchorCancelled = true; };
        inputEvents.forEach(name => addEventListener(name, cancelInitialAnchor, { once: true, passive: true }));
        const alignInitialAnchor = () => {
          if (initialAnchorCancelled || location.hash !== initialHash) return;
          const target = document.getElementById(initialHash.slice(1));
          if (target) scrollToSection(target, false);
          updateActiveSection();
        };
        requestAnimationFrame(alignInitialAnchor);
        Promise.resolve(document.fonts?.ready).then(() => requestAnimationFrame(() => {
          alignInitialAnchor();
          inputEvents.forEach(name => removeEventListener(name, cancelInitialAnchor));
        }));
      }

      /* 20. Actual dependency readiness. There is deliberately no minimum
         display time, timeout loop, fake progress or blocking overlay. */
      const root = document.documentElement;
      const status = document.getElementById('loading-status');
      const artwork = new Image();
      artwork.src = getComputedStyle(root).getPropertyValue('--artwork').trim().slice(5, -2);
      const logo = new Image();
      logo.src = document.getElementById('logo-image').getAttribute('href');
      function decoded(image) {
        if (typeof image.decode === 'function') return image.decode();
        if (image.complete) return Promise.resolve();
        return new Promise(resolve => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
        });
      }
      const fontReady = document.fonts ? Promise.allSettled([
        document.fonts.load('700 60px "IBM Plex Sans Arabic"', 'مراجعات إبراهيم علي'),
        document.fonts.load('400 16px "IBM Plex Sans Arabic"', 'مذكرات وشروح'),
        document.fonts.load('700 32px "Source Serif 4"', '107')
      ]) : Promise.resolve();
      Promise.allSettled([fontReady, decoded(artwork), decoded(logo)]).then(() => document.fonts?.ready).then(() => {
        root.classList.remove('is-loading');
        status.textContent = '';
      });
      document.getElementById('copyright-year').textContent = new Intl.DateTimeFormat('en', {year:'numeric',timeZone:'Asia/Bahrain'}).format(new Date());
    })();
  