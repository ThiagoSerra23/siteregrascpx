document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const menuButton = document.getElementById('hamburger-btn');
  const overlay = document.getElementById('overlay') || document.getElementById('mobile-overlay');

  // Menu responsivo: mantém botão, overlay e estado de acessibilidade sincronizados.
  const closeMenu = () => {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('show', 'active');
    menuButton?.setAttribute('aria-expanded', 'false');
  };
  const toggleMenu = () => {
    const opened = sidebar?.classList.toggle('open') ?? false;
    overlay?.classList.toggle('show', opened);
    overlay?.classList.toggle('active', opened);
    menuButton?.setAttribute('aria-expanded', String(opened));
  };
  menuButton?.addEventListener('click', toggleMenu);
  overlay?.addEventListener('click', closeMenu);
  document.querySelectorAll('.sidebar-nav a').forEach(link => link.addEventListener('click', closeMenu));

  // Catálogo de seções compartilhado pela busca da home e da página de regras.
  const catalog = [
    { id: 'sec-1', title: 'Regras Gerais', keywords: 'respeito hierarquia conduta membros intrigas liderança postura' },
    { id: 'sec-2', title: 'Regras de Ação', keywords: 'ação uniforme rádio autorização superior abatido RK roleplay' },
    { id: 'sec-3', title: 'Regras de Veículos', keywords: 'carro veículo abastecer organização transporte passeio' },
    { id: 'sec-4', title: 'Regras Internas', keywords: 'arrecadação equipamento armas munições roubo lealdade' },
    { id: 'sec-5', title: 'Comunicação', keywords: 'rádio informações flood comunicação clara' },
    { id: 'sec-6', title: 'Regras da HQ', keywords: 'base sede organização áreas restritas bagunça' },
    { id: 'sec-7', title: 'Proibições', keywords: 'anti-rp metagaming meta gaming powergaming cheats mod menu combat logging vazamento' },
    { id: 'sec-8', title: 'Sistema de Punição', keywords: 'advertência aviso verbal suspensão expulsão disciplina' }
  ];
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const sections = [...document.querySelectorAll('.rules-section[id]')];
  const rulesPage = location.pathname.includes('/pages/');
  const hideResults = () => { if (results) results.style.display = 'none'; };

  if (input && results) {
    input.addEventListener('input', () => {
      const query = normalize(input.value.trim());
      results.replaceChildren();
      if (query.length < 2) { hideResults(); return; }

      const matches = catalog.map(item => {
        const section = sections.find(node => node.id === item.id);
        const content = section ? section.textContent : '';
        const haystack = normalize(item.title + ' ' + item.keywords + ' ' + content);
        return { ...item, section, haystack };
      }).filter(item => item.haystack.includes(query));

      matches.forEach(item => {
        const link = document.createElement('a');
        link.href = rulesPage ? '#' + item.id : 'pages/gerais.html#' + item.id;
        link.setAttribute('role', 'option');
        link.textContent = item.title;
        const detail = document.createElement('small');
        detail.textContent = item.section ? 'Encontrado no conteúdo das regras' : 'Abrir seção da documentação';
        link.append(detail);
        link.addEventListener('click', () => { hideResults(); closeMenu(); });
        results.append(link);
      });

      if (!matches.length) {
        const empty = document.createElement('div');
        empty.className = 'search-empty';
        empty.textContent = 'Nenhuma regra encontrada. Tente outro termo.';
        results.append(empty);
      }
      results.style.display = 'block';
    });

    input.addEventListener('keydown', event => {
      if (event.key === 'Escape') { hideResults(); input.blur(); }
      if (event.key === 'Enter') results.querySelector('a')?.click();
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('.sidebar-search')) hideResults();
    });
  }

  // Atalho de pesquisa Ctrl+K / Cmd+K.
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      input?.focus();
    }
  });

  // Botão voltar ao topo.
  const backTop = document.getElementById('back-top');
  if (backTop) {
    const updateBackTop = () => backTop.classList.toggle('visible', window.scrollY > 320);
    window.addEventListener('scroll', updateBackTop, { passive: true });
    updateBackTop();
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Scroll spy: destaca a seção atualmente visível no menu lateral.
  if (sections.length) {
    const links = [...document.querySelectorAll('.nav-link[href^="#"], .nav-item[href*="#"]')];
    const updateActive = () => {
      let activeId = '';
      sections.forEach(section => {
        if (section.getBoundingClientRect().top < 180) activeId = section.id;
      });
      links.forEach(link => {
        const active = link.getAttribute('href').split('#').pop() === activeId;
        link.classList.toggle('spy-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };
    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }
});
