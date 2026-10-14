(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ZAP = '5511911618013';
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ano */
  const ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* masthead ocupa a largura toda, como na capa impressa */
  const mast = $('#masthead');
  function ajustarMast() {
    if (!mast) return;
    const largo = innerWidth > 900;
    const alvo = mast.parentElement.clientWidth - parseFloat(getComputedStyle(mast.parentElement).paddingLeft) * 2;
    mast.style.fontSize = '';
    const base = parseFloat(getComputedStyle(mast).fontSize);
    let medida;
    if (largo) {
      medida = mast.scrollWidth;
    } else {
      medida = Math.max(...$$('span', mast).map(s => {
        const r = document.createRange(); r.selectNodeContents(s); return r.getBoundingClientRect().width;
      }));
    }
    if (medida > 0) mast.style.fontSize = (base * alvo / medida * 0.995) + 'px';
  }
  if (mast) {
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(ajustarMast);
    addEventListener('resize', ajustarMast);
  }

  /* código de barras da capa */
  const barras = $('#barras');
  if (barras) {
    let x = 0, svg = '', s = 7;
    while (x < 92) {
      s = (s * 9301 + 49297) % 233280;
      const w = 0.6 + (s / 233280) * 2.6;
      if ((s >> 3) % 3) svg += `<rect x="${x.toFixed(2)}" y="0" width="${w.toFixed(2)}" height="40" fill="#0e0d0c"/>`;
      x += w + 0.7;
    }
    barras.innerHTML = svg;
  }

  /* edições da capa */
  const EDICOES = [
    { num: 'Nº 12', mes: 'Outubro 2026', img: 'capa-leao', alt: 'Fechamento de costas em preto e cinza com Jesus e um leão', l1: 'Arte na pele é eterno', l1s: 'Costas fechadas: Jesus e o leão, cicatrizado e finalizado', l2: 'Tatuador premiado', l2s: '3º lugar na Coliseu Expo Tattoo', r1: 'Traços que contam histórias', r1s: 'Realismo, blackwork, fineline e muito mais', r2: 'Mais de 10 anos', r2s: 'de agulha, sombra lisa e leitura de pele' },
    { num: 'Nº 11', mes: 'Setembro 2026', img: 'capa-hannya', alt: 'Máscara Hannya tatuada em costas inteiras', l1: 'Costas não é só uma tattoo', l1s: 'Máscara Hannya pensada para funcionar de longe e de perto', l2: 'Projeto exclusivo', l2s: 'Desenhado em cima da sua anatomia', r1: 'Preto e cinza', r1s: 'Contraste pesado e textura que envelhece com respeito', r2: 'Coberturas', r2s: 'Os fantasmas da tattoo antiga somem' },
    { num: 'Nº 10', mes: 'Agosto 2026', img: 'capa-onca', alt: 'Onça em realismo preto e cinza no braço', l1: 'O braço em uma sessão', l1s: 'Fechamento do pulso ao ombro, projeto exclusivo', l2: 'Agenda aberta', l2s: 'Orçamento pelo direct ou WhatsApp', r1: 'Fera na pele', r1s: 'Onça em realismo, pelagem e olhar', r2: 'Bom Retiro', r2s: 'Atendimento com hora marcada' },
  ];
  const capaImg = $('#capa-img');
  let edAtual = 0, trocando = false;
  function mostrarEdicao(i) {
    if (!capaImg || trocando) return;
    i = (i + EDICOES.length) % EDICOES.length;
    if (i === edAtual) return;
    const ed = EDICOES[i];
    trocando = true;
    $$('.edicoes [data-ed]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.ed === i)));
    $$('.capa-texto').forEach(t => t.classList.add('troca'));
    const nova = new Image();
    nova.src = `assets/img/${ed.img}-720.webp`;
    nova.srcset = `assets/img/${ed.img}-720.webp 720w, assets/img/${ed.img}-1400.webp 1400w`;
    nova.sizes = capaImg.sizes;
    nova.alt = ed.alt;
    nova.className = 'entra';
    const pronto = () => {
      capaImg.parentElement.appendChild(nova);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        nova.classList.remove('entra');
        setTimeout(() => {
          const velha = $('.capa-foto img:not(:last-child)');
          if (velha) velha.remove();
          nova.id = 'capa-img';
          trocando = false;
        }, reduz ? 0 : 900);
      }));
      setTimeout(() => {
        for (const k of ['l1', 'l1s', 'l2', 'l2s', 'r1', 'r1s', 'r2', 'r2s']) {
          const el = $(`[data-c="${k}"]`); if (el) el.textContent = ed[k];
        }
        $('#ed-num').textContent = ed.num;
        $('#ed-mes').textContent = ed.mes;
        $$('.capa-texto').forEach(t => t.classList.remove('troca'));
      }, reduz ? 0 : 380);
    };
    nova.decode ? nova.decode().then(pronto, pronto) : (nova.onload = pronto);
    edAtual = i;
  }
  $$('.edicoes [data-ed]').forEach(b => b.addEventListener('click', () => mostrarEdicao(+b.dataset.ed)));
  $$('.edicoes [data-passo]').forEach(b => b.addEventListener('click', () => mostrarEdicao(edAtual + +b.dataset.passo)));
  // pré-carrega as outras capas depois do load
  addEventListener('load', () => EDICOES.slice(1).forEach(e => { const i = new Image(); i.src = `assets/img/${e.img}-720.webp`; }));

  /* topo sólido + botões flutuantes */
  const topo = $('#topo'), folio = $('.folio'), zap = $('.zap');
  const capa = $('#capa');
  function rolar() {
    const y = scrollY;
    topo && topo.classList.toggle('solido', y > 40 || !capa);
    const passou = capa ? y > capa.offsetHeight * .7 : y > 200;
    folio && folio.classList.toggle('visivel', passou);
    zap && zap.classList.toggle('visivel', passou);
  }
  addEventListener('scroll', rolar, { passive: true });
  rolar();

  /* fólio corrente */
  const fNome = $('#folio-nome'), fNum = $('#folio-num');
  const secoes = $$('[data-pg]');
  if (fNome && secoes.length) {
    const io = new IntersectionObserver(ents => {
      ents.forEach(e => {
        if (e.isIntersecting) {
          fNome.textContent = e.target.dataset.nome;
          fNum.textContent = e.target.dataset.pg;
          $$('.topo nav a').forEach(a => a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secoes.forEach(s => io.observe(s));
  }

  /* gaveta (menu) */
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

  /* portfólio */
  const CATS = { todos: 'Todos', fech: 'Fechamentos', real: 'Realismo', black: 'Blackwork', fine: 'Fineline e escrita', cob: 'Coberturas' };
  const galeria = $('#galeria');
  const obras = window.OBRAS || [];
  let visiveis = [];
  if (galeria && obras.length) {
    const limite = +galeria.dataset.limite || Infinity;
    galeria.innerHTML = obras.map((o, i) => {
      const h = Math.round(640 / o.r);
      return `<button class="obra" type="button" data-c="${o.c}" data-i="${i}" aria-label="Ampliar: ${o.t}">
        <img src="assets/obras/${o.f}-640.webp" alt="${o.t}" loading="lazy" decoding="async" width="640" height="${h}">
        <span class="fig"><b>Fig. ${String(i + 1).padStart(2, '0')}</b>${o.t}</span></button>`;
    }).join('');
    const filtros = $('.filtros');
    const contagem = c => c === 'todos' ? obras.length : obras.filter(o => o.c === c).length;
    filtros.innerHTML = Object.entries(CATS).map(([k, v], i) =>
      `<button type="button" data-f="${k}" aria-pressed="${i === 0}">${v}<sup>${contagem(k)}</sup></button>`).join('');
    function filtrar(cat) {
      let n = 0;
      $$('.obra', galeria).forEach(b => {
        const ok = cat === 'todos' || b.dataset.c === cat;
        const dentro = ok && n < limite;
        if (ok) n++;
        b.classList.toggle('oculta', !dentro);
      });
      visiveis = $$('.obra:not(.oculta)', galeria);
      $$('button', filtros).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.f === cat)));
    }
    filtros.addEventListener('click', e => { const b = e.target.closest('button'); if (b) filtrar(b.dataset.f); });
    filtrar('todos');
    galeria.addEventListener('click', e => {
      const b = e.target.closest('.obra'); if (!b) return;
      abrirLuz(visiveis.indexOf(b));
    });
  }

  /* lightbox */
  const luz = $('#luz'), luzImg = $('#luz-img'), luzLeg = $('#luz-leg'), luzCont = $('#luz-cont');
  let li = 0, ultimoFoco = null;
  function pintarLuz() {
    const b = visiveis[li]; if (!b) return;
    const o = obras[+b.dataset.i];
    luzImg.style.opacity = 0;
    const src = `assets/obras/${o.f}-1280.webp`;
    const tmp = new Image(); tmp.src = src;
    const mostrar = () => { luzImg.src = src; luzImg.alt = o.t; luzImg.style.opacity = 1; };
    tmp.decode ? tmp.decode().then(mostrar, mostrar) : mostrar();
    luzLeg.innerHTML = `<b>Fig. ${String(+b.dataset.i + 1).padStart(2, '0')}</b>${o.t}`;
    luzCont.textContent = `${li + 1} / ${visiveis.length}`;
  }
  function abrirLuz(i) {
    if (!luz) return;
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

  /* cupom -> WhatsApp */
  const form = $('#form-cupom');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const d = new FormData(form);
      const nome = (d.get('nome') || '').trim();
      const ideia = (d.get('ideia') || '').trim();
      if (!nome) { $('#c-nome').focus(); return; }
      if (!ideia) { $('#c-ideia').focus(); return; }
      const msg = [
        `Olá, Fernando! Sou ${nome} e vim pelo site.`,
        '',
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
