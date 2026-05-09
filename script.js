document.addEventListener('DOMContentLoaded', () => {
    // ── SIDEBAR MOBILE TOGGLE ──
    const sidebar = document.getElementById('sidebar');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const overlay = document.getElementById('overlay');

    function toggleSidebar() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleSidebar);
    }
    if (overlay) {
        overlay.addEventListener('click', toggleSidebar);
    }

    // ── SCROLL TO TOP BUTTON ──
    const backTopBtn = document.getElementById('back-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backTopBtn.classList.add('visible');
        } else {
            backTopBtn.classList.remove('visible');
        }
    });

    if (backTopBtn) {
        backTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ── COPY TO CLIPBOARD ──
    const copyBtns = document.querySelectorAll('.copy-btn');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const targetId = btn.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            
            if (targetEl) {
                try {
                    await navigator.clipboard.writeText(targetEl.textContent.trim());
                    
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado';
                    btn.classList.add('copied');
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    console.error('Falha ao copiar texto: ', err);
                }
            }
        });
    });

    // ── BASIC SEARCH ──
    // Um search rudimentar apenas para fins de UI
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase().trim();
            if (val.length > 2) {
                searchResults.style.display = 'block';
                searchResults.innerHTML = `
                    <a href="gerais.html">Regras Gerais (Resultados para: ${val})</a>
                `;
            } else {
                searchResults.style.display = 'none';
            }
        });

        // Hide search when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-wrap') && !e.target.closest('#search-results')) {
                if (searchResults) searchResults.style.display = 'none';
            }
        });
    }
});
