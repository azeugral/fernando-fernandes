(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ZAP = '5511911618013';
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* nome do hero ocupa a largura útil */
  const nome = $('#nome');
  function ajustarNome() {
    if (!nome) return;
    nome.style.fontSize = '';
    const cs = getComputedStyle(nome.parentElement);
    const alvo = nome.parentElement.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const base = parseFloat(getComputedStyle(nome).fontSize);
    const larguras = $$('span', nome).map(s => s.getBoundingClientRect().width);
    const medida = innerWidth > 760 ? larguras.reduce((a, b) => a + b, 0) + base * 0.25 : Math.max(...larguras);
    if (medida > 0) nome.style.fontSize = Math.min(base * alvo / medida * 0.99, innerHeight * 0.26) + 'px';
  }
  if (nome) {
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(ajustarNome);
    addEventListener('resize', ajustarNome);
  }

  /* lente do hero: revela a tattoo nítida onde passa o cursor; no toque ela passeia sozinha */
  const hero = $('.hero'), lente = $('#lente');
  if (hero && lente) {
    let alvoX = .5, alvoY = .4, x = .5, y = .4, ativo = false, t0 = performance.now(), visivel = true;
    const toque = matchMedia('(hover: none)').matches;
    lente.style.setProperty('--r', Math.round(Math.max(170, Math.min(innerWidth, innerHeight) * 0.3)) + 'px');
    hero.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = hero.getBoundingClientRect();
      alvoX = (e.clientX - r.left) / r.width; alvoY = (e.clientY - r.top) / r.height; ativo = true;
    });
    hero.addEventListener('pointerleave', () => { ativo = false; });
    new IntersectionObserver(([e]) => { visivel = e.isIntersecting; }).observe(hero);
    function quadro(t) {
      if (visivel) {
        if (!ativo) {
          const s = (t - t0) / 1000;
          alvoX = .5 + Math.sin(s * .45) * (toque ? .26 : .3);
          alvoY = .4 + Math.sin(s * .31 + 1) * .16;
        }
        const k = reduz ? 1 : .09;
        x += (alvoX - x) * k; y += (alvoY - y) * k;
        lente.style.setProperty('--x', (x * 100).toFixed(2) + '%');
        lente.style.setProperty('--y', (y * 100).toFixed(2) + '%');
      }
      if (!reduz) requestAnimationFrame(quadro);
    }
    requestAnimationFrame(quadro);
  }

  /* topo sólido + WhatsApp flutuante */
  const topo = $('#topo'), zap = $('.zap');
  function rolar() {
    const y = scrollY;
    const limite = hero ? hero.offsetHeight * .75 : 120;
    if (hero) topo && topo.classList.toggle('solido', y > 40);
    zap && zap.classList.toggle('visivel', y > limite);
  }
  addEventListener('scroll', rolar, { passive: true });
  rolar();

  /* link ativo no menu */
  const links = $$('.topo nav a[href^="#"]');
  if (links.length) {
    const io = new IntersectionObserver(ents => ents.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => io.observe(s));
  }

  /* menu de celular */
  const gaveta = $('#gaveta'), menuBtn = $('.menu-btn');
  function gavetaAbrir(abrir) {
    if (!gaveta) return;
    gaveta.classList.toggle('aberta', abrir);
    gaveta.setAttribute('aria-hidden', String(!abrir));
    menuBtn && menuBtn.setAttribute('aria-expanded', String(abrir));
    document.documentElement.style.overflow = abrir ? 'hidden' : '';
    if (abrir) $('.fechar', gaveta).focus();
  }
  menuBtn && menuBtn.addEventListener('click', () => gavetaAbrir(true));
  gaveta && $('.fechar', gaveta).addEventListener('click', () => gavetaAbrir(false));
  gaveta && $$('a', gaveta).forEach(a => a.addEventListener('click', () => gavetaAbrir(false)));

  /* entradas */
  const surge = $$('.surge');
  if ('IntersectionObserver' in window && !reduz) {
    const io = new IntersectionObserver(ents => ents.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    surge.forEach(el => io.observe(el));
  } else surge.forEach(el => el.classList.add('visto'));

  /* portfólio: grade 4:5 */
  const CATS = { todos: 'Todos', fech: 'Fechamentos', real: 'Realismo', black: 'Blackwork', fine: 'Fineline e escrita', cob: 'Coberturas' };
  const galeria = $('#galeria');
  const obras = window.OBRAS || [];
  let visiveis = [];
  const num = i => String(i + 1).padStart(2, '0');
  if (galeria && obras.length) {
    const limite = +galeria.dataset.limite || Infinity;
    galeria.innerHTML = obras.map((o, i) => `<button class="obra" type="button" data-c="${o.c}" data-i="${i}" aria-label="Ampliar: ${o.t}">
      <span class="moldura"><img src="assets/obras/${o.f}-640.webp" alt="${o.t}" loading="lazy" decoding="async" width="640" height="800"></span>
      <span class="leg"><b>${num(i)}</b><span>${o.t}</span></span></button>`).join('');
    const filtros = $('.filtros');
    const conta = c => c === 'todos' ? obras.length : obras.filter(o => o.c === c).length;
    filtros.innerHTML = Object.entries(CATS).map(([k, v], i) =>
      `<button type="button" data-f="${k}" aria-pressed="${i === 0}">${v}<sup>${conta(k)}</sup></button>`).join('');
    function filtrar(cat) {
      let n = 0;
      $$('.obra', galeria).forEach(b => {
        const ok = cat === 'todos' || b.dataset.c === cat;
        b.classList.toggle('oculta', !(ok && n < limite));
        if (ok) n++;
      });
      visiveis = $$('.obra:not(.oculta)', galeria);
      $$('button', filtros).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.f === cat)));
    }
    filtros.addEventListener('click', e => { const b = e.target.closest('button'); if (b) filtrar(b.dataset.f); });
    filtrar('todos');
    galeria.addEventListener('click', e => { const b = e.target.closest('.obra'); if (b) abrirLuz(visiveis.indexOf(b)); });
  }

  /* tela cheia */
  const luz = $('#luz'), luzImg = $('#luz-img'), luzLeg = $('#luz-leg'), luzCont = $('#luz-cont');
  let li = 0, ultimoFoco = null;
  function pintarLuz() {
    const b = visiveis[li]; if (!b) return;
    const i = +b.dataset.i, o = obras[i];
    luzImg.style.opacity = 0;
    const src = `assets/obras/${o.f}-1280.webp`;
    const tmp = new Image(); tmp.src = src;
    const mostrar = () => { luzImg.src = src; luzImg.alt = o.t; luzImg.style.opacity = 1; };
    tmp.decode ? tmp.decode().then(mostrar, mostrar) : mostrar();
    luzLeg.innerHTML = `<b>${num(i)}</b>${o.t}`;
    luzCont.textContent = `${li + 1} / ${visiveis.length}`;
  }
  function abrirLuz(i) {
    if (!luz || i < 0) return;
    ultimoFoco = document.activeElement;
    li = i; pintarLuz();
    luz.classList.add('aberta'); luz.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    $('.fechar-luz', luz).focus();
  }
  function fecharLuz() {
    luz.classList.remove('aberta'); luz.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    ultimoFoco && ultimoFoco.focus();
  }
  function passo(d) { li = (li + d + visiveis.length) % visiveis.length; pintarLuz(); }
  if (luz) {
    $('.fechar-luz', luz).addEventListener('click', fecharLuz);
    $('.ant', luz).addEventListener('click', () => passo(-1));
    $('.prox', luz).addEventListener('click', () => passo(1));
    luz.addEventListener('click', e => { if (e.target === luz || e.target.classList.contains('luz-palco')) fecharLuz(); });
    addEventListener('keydown', e => {
      if (e.key === 'Escape') { if (luz.classList.contains('aberta')) fecharLuz(); else if (gaveta && gaveta.classList.contains('aberta')) gavetaAbrir(false); }
      if (!luz.classList.contains('aberta')) return;
      if (e.key === 'ArrowLeft') passo(-1);
      if (e.key === 'ArrowRight') passo(1);
    });
    let x0 = null;
    luz.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    luz.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) passo(dx < 0 ? 1 : -1);
      x0 = null;
    });
  }

  /* orçamento -> WhatsApp */
  const form = $('#form-cupom');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const d = new FormData(form);
      const n = (d.get('nome') || '').trim(), ideia = (d.get('ideia') || '').trim();
      if (!n) { $('#c-nome').focus(); return; }
      if (!ideia) { $('#c-ideia').focus(); return; }
      const msg = [
        `Olá, Fernando! Sou ${n} e vim pelo site.`, '',
        `*Ideia:* ${ideia}`,
        `*Local:* ${d.get('local')}`,
        `*Estilo:* ${d.get('estilo')}`,
        `*Tamanho:* ${d.get('tamanho')}`,
        `*Quando:* ${d.get('quando')}`,
      ].join('\n');
      form.classList.remove('cortando'); void form.offsetWidth; form.classList.add('cortando');
      window.open(`https://wa.me/${ZAP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
  }
})();
