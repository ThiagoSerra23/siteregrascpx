document.addEventListener('DOMContentLoaded', () => {

    // ── SIDEBAR MOBILE TOGGLE ──
    const sidebar = document.getElementById('sidebar');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const overlay = document.getElementById('overlay') || document.getElementById('mobile-overlay');

    function toggleSidebar() {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('show');
        if (overlay) overlay.classList.toggle('active');
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);

    // ── SCROLL TO TOP BUTTON ──
    const backTopBtn = document.getElementById('back-top');

    if (backTopBtn) {
        window.addEventListener('scroll', () => {
            backTopBtn.classList.toggle('visible', window.scrollY > 300);
        });
        backTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ── COPY TO CLIPBOARD ──
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const targetEl = document.getElementById(btn.getAttribute('data-target'));
            if (!targetEl) return;
            try {
                await navigator.clipboard.writeText(targetEl.textContent.trim());
                const orig = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado';
                btn.classList.add('copied');
                setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 2000);
            } catch (err) {
                console.error('Erro ao copiar:', err);
            }
        });
    });

    // ── BUSCA BÁSICA ──
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (searchInput && searchResults) {
        searchInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase().trim();
            if (val.length > 2) {
                searchResults.style.display = 'block';
                searchResults.innerHTML = `<a href="gerais.html">Regras Gerais (busca: ${val})</a>`;
            } else {
                searchResults.style.display = 'none';
            }
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-wrap') && !e.target.closest('#search-results')) {
                searchResults.style.display = 'none';
            }
        });
    }

    // ══════════════════════════════════════════════════════
    //  #3 — ANIMAÇÕES DE ENTRADA (IntersectionObserver)
    // ══════════════════════════════════════════════════════
    const sections = document.querySelectorAll('.rules-section, .final-banner');

    if (sections.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Não remove — anima só uma vez
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,   // Dispara quando 12% da seção está visível
            rootMargin: '0px 0px -40px 0px'
        });

        sections.forEach(sec => sectionObserver.observe(sec));
    }

    // ══════════════════════════════════════════════════════
    //  #1 — SCROLL SPY (destaca o link do menu atual)
    // ══════════════════════════════════════════════════════
    const spySections = document.querySelectorAll('.rules-section[id]');
    const navLinks    = document.querySelectorAll('.nav-link[href^="#"], .nav-item[href^="#"]');

    if (spySections.length > 0 && navLinks.length > 0) {

        function updateSpy() {
            let currentId = '';
            const scrollY = window.scrollY + 120; // offset da topbar

            spySections.forEach(sec => {
                if (sec.offsetTop <= scrollY) {
                    currentId = sec.id;
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('spy-active');
                // Pega só o hash (#sec-1) mesmo que o href seja ../index.html#sec-1
                const href = link.getAttribute('href');
                const hash = href.includes('#') ? href.split('#')[1] : null;
                if (hash && hash === currentId) {
                    link.classList.add('spy-active');
                }
            });
        }

        // Throttle para não travar em rolagem rápida
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateSpy();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Roda uma vez ao carregar para já marcar a seção certa
        updateSpy();
    }

});
