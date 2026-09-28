// JS do site da v0n. Sem build. GSAP + ScrollTrigger (parallax e cenas presas à
// rolagem) e Lenis (rolagem suave) vêm por CDN e são enfeite: sem eles, ou com
// movimento reduzido, a página fica estática e legível.
// A linha que põe a classe `js` no <html> fica inline no <head>: ela precisa
// rodar antes do CSS pintar, senão o menu pisca aberto no carregamento.
(function () {
  'use strict'

  var gs = window.gsap && window.ScrollTrigger
  if (gs) gsap.registerPlugin(ScrollTrigger)

  // ---- Menu do celular -------------------------------------------------
  var alterna = document.querySelector('.topo__alterna')
  var topo = document.querySelector('.topo')

  if (alterna && topo) {
    alterna.addEventListener('click', function () {
      var aberto = topo.classList.toggle('menu-aberto')
      alterna.setAttribute('aria-expanded', aberto)
      alterna.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu')
    })
  }

  // ---- Entrada por rolagem ---------------------------------------------
  // Um observer pra página inteira. O alvo entra quando a rolagem desce até
  // ele e sai quando ela volta e ele escapa por baixo da tela, a pedido do
  // Kauã em 22/09. Quem sai por cima fica aceso: senão, ao voltar, a página
  // acima estaria apagada e acenderia de novo, pedaço por pedaço.
  // Só começa depois da abertura: seção que entra atrás do overlay entrega
  // uma página que já terminou de animar antes de alguém olhar.
  function ligaEntradas () {
    var alvos = document.querySelectorAll('.entra, .entra-fade, .entra-regua')

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) entrada.target.classList.add('visivel')
          else if (entrada.boundingClientRect.top > 0) entrada.target.classList.remove('visivel')
        })
      }, {
        // -12% no rodapé: o elemento começa a entrar um pouco depois de
        // aparecer, senão a animação termina antes de a pessoa ter olhado.
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.1
      })
      alvos.forEach(function (alvo) { observer.observe(alvo) })
    } else {
      // Navegador antigo vê a página montada, sem entrada. Não é erro: a
      // entrada é enfeite, nunca condição pra ler.
      for (var i = 0; i < alvos.length; i++) alvos[i].classList.add('visivel')
    }
  }

  // ---- Abertura ---------------------------------------------------------
  // A abertura inteira é CSS. O JS só decide se ela roda e tira o overlay
  // no fim — overlay fixo que fica é o site coberto pra sempre.
  var intro = document.getElementById('intro')
  var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function tiraOverlay () {
    if (intro && intro.parentNode) intro.remove()
    document.documentElement.classList.remove('intro-rodando')
    ligaRolagem()
    // A rolagem estava travada na abertura: agora que ela anda, remede as cenas.
    if (gs) ScrollTrigger.refresh()
  }

  // ---- Rolagem suave ----------------------------------------------------
  // Partiu do hermes-agent (lerp .09) e acelerou a pedido do Kauã em 22/09:
  // lerp .13 (cada quadro anda 13% do que falta, então chega antes) e cada
  // giro da roda anda 20% a mais. anchors: link de âncora desliza também.
  // Só liga depois da abertura, que trava a rolagem. Sem o Lenis (CDN fora) ou
  // com movimento reduzido, fica a rolagem nativa: é enfeite, não condição.
  // O ScrollTrigger lê a posição a cada scroll do Lenis, senão as cenas ficam
  // um quadro atrás da página.
  function ligaRolagem () {
    if (menosMovimento || typeof Lenis === 'undefined') return
    var lenis = new Lenis({ anchors: true, autoRaf: true, lerp: 0.13, wheelMultiplier: 1.2 })
    if (gs) lenis.on('scroll', ScrollTrigger.update)
  }

  // Mede onde a logo da abertura está e onde a do cabeçalho mora, e move uma
  // até a outra. As duas têm a mesma proporção (320×128 e 140×56), então
  // basta uma escala. O -50% é o centramento que o CSS já dava à logo.
  function voaLogo () {
    var de = intro.querySelector('.intro__logo').getBoundingClientRect()
    var para = document.querySelector('.topo__logo img').getBoundingClientRect()
    var dx = para.left + para.width / 2 - (de.left + de.width / 2)
    var dy = para.top + para.height / 2 - (de.top + de.height / 2)
    intro.classList.add('intro--saindo')
    intro.querySelector('.intro__logo').style.transform =
      'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px)) scale(' + para.width / de.width + ')'
    ligaEntradas()
  }

  // Roda em toda recarga, a pedido do Kauã — não tem marca de "já viu".
  if (intro && !menosMovimento) {
    document.documentElement.classList.add('intro-rodando')
    // A batida vem do CSS: mudar --batida lá muda a abertura e estes tempos
    // junto, sem números pra manter em sincronia na mão.
    var batida = parseFloat(getComputedStyle(intro).getPropertyValue('--batida')) || 1.25
    // A logo termina de montar em 4,3 batidas e voa aos 4,6. A hero sobe no
    // mesmo instante, então a logo pousa sobre uma página já em movimento.
    // O voo dura 0,9 batida (a transition do CSS); o overlay sai aos 5,5.
    setTimeout(voaLogo, batida * 4.6 * 1000)
    setTimeout(tiraOverlay, batida * 5.5 * 1000)
  } else {
    tiraOverlay()
    ligaEntradas()
  }

  // ---- Simulação de busca (o comparador, "Procuraram no Google") ----
  // A mesma lista aparece nas duas metades do comparador, então ela é desenhada
  // aqui, de uma tabela só. É uma ilustração: nomes, notas e distâncias são
  // fictícios e a página avisa.
  var RIVAIS = [
    ['Clínica Vida & Saúde', '4,8', '312', '1,2 km'],
    ['Centro Clínico Aurora', '4,6', '187', '2,0 km'],
    ['Clínica Bem-Estar', '4,7', '94', '2,4 km']
  ]
  var LUPA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'
  var BTN = function (texto, ouro) { return '<span class="res__btn' + (ouro ? ' res__btn--ouro' : '') + '">' + texto + '</span>' }

  function rival (r) {
    return '<li class="res"><span class="res__av">' + r[0].charAt(0) + '</span>' +
      '<div class="res__info"><p class="res__nome">' + r[0] + '</p>' +
      '<p class="res__meta"><span class="res__nota">★ ' + r[1] + '</span> (' + r[2] + ') · Clínica · ' + r[3] + '</p>' +
      '<p class="res__hora"><b>Aberto</b> · fecha 18h</p></div>' +
      '<div class="res__acoes">' + BTN('Site') + BTN('Ligar') + '</div></li>'
  }

  var SEU_SEM = '<li class="res res--sumido"><span class="res__av">?</span>' +
    '<div class="res__info"><p class="res__nome">Seu negócio</p><p class="res__meta">Sem nota · perfil incompleto</p>' +
    '<p class="res__erro">Site: não foi possível acessar</p></div></li>'
  var SEU_COM = '<li class="res res--seu"><span class="res__av">S</span>' +
    '<div class="res__info"><p class="res__nome">Seu negócio</p>' +
    '<p class="res__meta"><span class="res__nota">★★★★★</span> · Clínica · 300 m</p>' +
    '<p class="res__hora"><b>Aberto</b> · fecha 18h</p></div>' +
    '<div class="res__acoes">' + BTN('Site') + BTN('WhatsApp', true) + '</div></li>'

  function lista (modo) {
    var rivais = RIVAIS.map(rival).join('')
    return '<ul class="lista">' + (modo === 'com' ? SEU_COM + rivais : rivais + SEU_SEM) + '</ul>'
  }

  var mocks = document.querySelectorAll('[data-janela]')
  for (var m = 0; m < mocks.length; m++) {
    mocks[m].innerHTML = '<div class="campo">' + LUPA + '<span>clínica perto de mim</span></div>' + lista(mocks[m].getAttribute('data-janela'))
  }

  // ---- Comparador (arrastar entre "sem" e "com a v0n") ---------------------
  // O input range cobre a janela inteira e é invisível: arrastar em qualquer
  // ponto, ou usar as setas com foco, move a linha. Funciona sem GSAP.
  var janela = document.querySelector('.comparar__janela')
  var faixa = janela && janela.querySelector('.comparar__range')
  var poe = function (v) { janela.style.setProperty('--x', v + '%') }
  if (faixa) faixa.addEventListener('input', function () { poe(faixa.value) })

  // ---- Vitrine: o site do cliente ao vivo ---------------------------------
  // A janela mostra o site de verdade num iframe de 1280 px, encolhido pra caber:
  // --k é a largura da moldura dividida por 1280. Sem clique o iframe não recebe
  // o mouse (a roda rola esta página); clicou, ele vira do cliente até o mouse
  // sair da janela. Não depende do GSAP.
  document.querySelectorAll('.vt__janela').forEach(function (janela) {
    var tela = janela.querySelector('.vt__tela')
    var ajusta = function () { tela.style.setProperty('--k', tela.clientWidth / 1280) }
    ajusta()
    if ('ResizeObserver' in window) new ResizeObserver(ajusta).observe(tela)
    janela.querySelector('.vt__toque').addEventListener('click', function () { janela.classList.add('vt__janela--ativa') })
    janela.addEventListener('mouseleave', function () { janela.classList.remove('vt__janela--ativa') })
  })

  // ---- Portal: a entrada das redes sociais ---------------------------------
  // Trazido do Glyph Portal (© 2026 Christian Katzmann, MIT, ktzm.dk). A palavra
  // é um clipPath de texto por cima de um mural de cópias dos slides do
  // carrossel. A câmera sai da palavra inteira (84% da largura) e entra no miolo
  // da letra mais grossa até ele cobrir a tela. portal() devolve a função que
  // pinta um progresso de 0 a 1: o GSAP chama com a rolagem; sem ele fica o 0,
  // o cartaz parado.

  // O maior quadrado cheio de tinta de uma letra, numa passada só (cada pixel
  // guarda o lado do maior quadrado que termina nele). Medido a 300px e
  // devolvido na escala de 100px, a do <text>, como um círculo (centro e raio).
  function miolo (ctx, ch, fonte) {
    var c = ctx.canvas, pad = 8
    ctx.font = fonte
    var m = ctx.measureText(ch)
    var esq = Math.ceil(m.actualBoundingBoxLeft), sobe = Math.ceil(m.actualBoundingBoxAscent)
    c.width = Math.ceil(m.actualBoundingBoxLeft + m.actualBoundingBoxRight) + pad * 2
    c.height = Math.ceil(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) + pad * 2
    ctx.font = fonte // mudar o tamanho do canvas zera a fonte
    ctx.fillText(ch, pad + esq, pad + sobe)
    var w = c.width, px = ctx.getImageData(0, 0, w, c.height).data
    var linha = new Uint16Array(w + 1), lado = 0, bx = 0, by = 0
    for (var y = 0; y < c.height; y++) {
      var diag = 0
      for (var x = 0; x < w; x++) {
        var cima = linha[x + 1]
        linha[x + 1] = px[(y * w + x) * 4 + 3] > 245 ? Math.min(cima, linha[x], diag) + 1 : 0
        diag = cima
        if (linha[x + 1] > lado) { lado = linha[x + 1]; bx = x; by = y }
      }
    }
    return { x: (bx + 1 - lado / 2 - pad - esq) / 3, y: (by + 1 - lado / 2 - pad - sobe) / 3, r: (lado / 2 - 1) / 3 }
  }

  function portal (sec) {
    var campo = sec.querySelector('.portal__campo')
    var mural = sec.querySelector('.portal__mural')
    var clip = sec.querySelector('clipPath')
    var glifo = sec.querySelector('.portal__glifo')
    var palavra = glifo.textContent
    var slides = document.querySelectorAll('.posts__trilho .post')
    // Cópias que bastam pra cobrir a tela inteira (slide de 180 + 16), mesmo com a
    // janela depois maximizada.
    var n = Math.ceil(Math.max(screen.width, innerWidth) / 196 + 1) * Math.ceil(Math.max(screen.height, innerHeight) / 241 + 1)
    for (var k = 0; k < n; k++) mural.appendChild(slides[k % slides.length].cloneNode(true))

    var W, H, s0, s1, caixa, centro, alvo = null, agora = 0
    var suave = function (a, b, x) { var t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }

    // A caixa da tinta da palavra e o miolo de cada letra, na fonte já carregada.
    function mede () {
      var ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
      var f = getComputedStyle(glifo)
      ctx.font = f.fontWeight + ' 100px ' + f.fontFamily
      ctx.fontKerning = 'none'
      var m = ctx.measureText(palavra)
      caixa = { x: -m.actualBoundingBoxLeft, y: -m.actualBoundingBoxAscent,
        w: m.actualBoundingBoxLeft + m.actualBoundingBoxRight, h: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent }
      centro = { x: caixa.x + caixa.w / 2, y: caixa.y + caixa.h / 2 }
      var avanco = palavra.split('').map(function (_, i) { return ctx.measureText(palavra.slice(0, i)).width })
      palavra.split('').forEach(function (ch, i) {
        var d = miolo(ctx, ch, f.fontWeight + ' 300px ' + f.fontFamily)
        d.x += avanco[i]
        if (!alvo || d.r > alvo.r || (d.r === alvo.r && Math.abs(d.x - centro.x) < Math.abs(alvo.x - centro.x))) alvo = d
      })
    }

    // Começo: a palavra em 84% da largura (ou 38% da altura). Fim: o miolo com
    // raio maior que meia diagonal da tela, então ela fica toda dentro da tinta.
    function ajusta () {
      W = campo.clientWidth; H = campo.clientHeight
      s0 = Math.min(W * 0.84 / caixa.w, H * 0.38 / caixa.h)
      s1 = Math.max(s0, Math.hypot(W, H) / (alvo.r * 1.35))
      pinta(agora)
    }

    // A câmera anda até 78% do progresso: a escala cresce em proporção (log), e o
    // ponto no centro da tela vai do meio da palavra ao miolo na mesma medida em
    // que a escala fecha o zoom. A escala fica no clipPath e só o deslocamento
    // no texto: texto com escala enorme estoura o limite de pintura de alguns
    // navegadores. Com a tela coberta o recorte sai; de 88% a 100% o mural apaga.
    function pinta (p) {
      agora = p
      if (!alvo) return
      var t = Math.min(1, p / 0.78)
      var e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      var s = Math.exp(Math.log(s0) + Math.log(s1 / s0) * e)
      var mix = s1 === s0 ? 0 : (1 / s - 1 / s0) / (1 / s1 - 1 / s0)
      var cx = centro.x + (alvo.x - centro.x) * mix, cy = centro.y + (alvo.y - centro.y) * mix
      clip.setAttribute('transform', 'scale(' + s + ')')
      glifo.setAttribute('transform', 'translate(' + (W / 2 / s - cx) + ' ' + ((H * 0.46 + H * 0.04 * e) / s - cy) + ')')
      campo.style.clipPath = t >= 1 ? 'none' : ''
      campo.style.opacity = 1 - suave(0.88, 1, p)
      mural.style.transform = 'scale(' + (1 + 0.16 * suave(0, 0.82, p)) + ')'
    }

    var fontes = document.fonts ? document.fonts.load('700 100px "Barlow Condensed"', palavra).catch(function () {}) : Promise.resolve()
    fontes.then(function () { mede(); ajusta() })
    window.addEventListener('resize', function () { if (alvo) ajusta() })
    return pinta
  }

  var secPortal = document.querySelector('.portal')
  var pintaPortal = secPortal ? portal(secPortal) : null

  // ---- GSAP: parallax e cenas presas -------------------------------------
  // Tudo dentro do matchMedia: com movimento reduzido nada disso roda e a
  // página fica estática. O que o matchMedia cria é desfeito sozinho quando a
  // preferência muda. As cenas são criadas na ordem da página (de cima pra
  // baixo), porque cada pin empurra tudo que vem depois.
  if (gs) {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', function () {
      // Parallax da foto da hero: ela desce 30% do que a hero rola, então
      // fica pra trás do texto.
      var hero = document.querySelector('.hero')
      if (hero) {
        gsap.to('.hero__olhos', {
          y: function () { return hero.offsetHeight * 0.3 },
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true }
        })
      }

      // Trabalhamos com. O palco fica preso por 200% da tela: o rótulo
      // "Trabalhamos com:" não sai do lugar, e a rolagem troca a palavra debaixo
      // dele, um nicho de cada vez, até virar "você" no fim. Cada nicho aparece
      // vindo de baixo enquanto o anterior sai por cima.
      var nichos = document.querySelector('.nichos')
      var restauraNichos = null
      if (nichos) {
        var palcoNichos = nichos.querySelector('.nichos__palco')
        var itensNichos = nichos.querySelectorAll('.nichos__n')
        nichos.classList.add('nichos--anima')
        var tlNichos = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: palcoNichos, start: 'top top', end: '+=200%', pin: true, scrub: 0.5, invalidateOnRefresh: true }
        })
        for (var n = 1; n < itensNichos.length; n++) {
          var vez = n * (9 / (itensNichos.length - 1))
          tlNichos.to(itensNichos[n - 1], { opacity: 0, yPercent: -30, duration: 0.5 }, vez)
            .fromTo(itensNichos[n], { opacity: 0, yPercent: 30 }, { opacity: 1, yPercent: 0, duration: 0.5 }, vez)
        }
        tlNichos.to({}, { duration: 0.01 }, 10)
        gsap.fromTo(nichos.querySelector('.nichos__fundo'), { yPercent: 12 }, { yPercent: -18, ease: 'none', scrollTrigger: { trigger: palcoNichos, start: 'top top', end: '+=200%', scrub: true, invalidateOnRefresh: true } })
        restauraNichos = function () { nichos.classList.remove('nichos--anima') }
      }

      // Celular em várias poses (o CSS explica, em Celular (poses)). O HTML traz só a
      // pose de frente; aqui ela é copiada pras outras. "ordem" lista as poses de
      // baixo pra cima, com 'f' (a que já existe) no lugar dela.
      //
      // A troca de pose é um morph, não um corte: a cada quadro o "u" (0 = primeira
      // pose da ordem, 1 = segunda...) diz entre quais duas poses o celular está, e
      // o quadrilátero da tela vai de uma pra outra. Cada moldura é deformada
      // (homografia) pra encaixar a tela nesse quadrilátero, então as duas poses
      // andam juntas e a moldura de cima só aparece por cima (dissolve) sem pular.
      // q = os 4 cantos da tela na imagem da pose; s e o alinham a pose ao centro e
      // à altura da tela de frente (números do PSD do mockup).
      var IMG_POSE = { '5': 'img/iphone-5.webp', '3': 'img/iphone-3.webp', '3m': 'img/iphone-3.webp' }
      var POSE = {
        '5': { q: [[42.7122, 111.1049], [592.5212, 17.0781], [817.9445, 1375.4083], [269.3221, 1477.9088]], s: 1.002038, o: [-74.00262, -17.89409] },
        '3': { q: [[70, 150], [652, 32], [647, 1503], [76, 1642]], s: 0.9341818, o: [20.02681, -48.00575] },
        '3m': { q: [[21, 32], [603, 150], [597, 1642], [26, 1503]], s: 0.9341818, o: [66.26881, -48.00575] },
        f: { q: [[35, 37], [680, 37], [680, 1421], [35, 1421]], s: 1, o: [0, 0] }
      }
      var alinhada = function (p) { return p.q.map(function (pt) { return [pt[0] * p.s + p.o[0], pt[1] * p.s + p.o[1]] }) }

      // Leva os 4 pontos de "de" nos 4 de "para" (eliminação de Gauss em 8
      // incógnitas) e devolve a matrix3d do CSS.
      function homografia (de, para) {
        var A = [], b = [], h = [], i, k, c, t
        for (i = 0; i < 4; i++) {
          var x = de[i][0], y = de[i][1], u = para[i][0], v = para[i][1]
          A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u)
          A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v)
        }
        for (i = 0; i < 8; i++) {
          var p = i
          for (k = i + 1; k < 8; k++) if (Math.abs(A[k][i]) > Math.abs(A[p][i])) p = k
          t = A[i]; A[i] = A[p]; A[p] = t
          t = b[i]; b[i] = b[p]; b[p] = t
          for (k = i + 1; k < 8; k++) {
            var f = A[k][i] / A[i][i]
            for (c = i; c < 8; c++) A[k][c] -= f * A[i][c]
            b[k] -= f * b[i]
          }
        }
        for (i = 7; i >= 0; i--) {
          var s = b[i]
          for (c = i + 1; c < 8; c++) s -= A[i][c] * h[c]
          h[i] = s / A[i][i]
        }
        return 'matrix3d(' + [h[0], h[3], 0, h[6], h[1], h[4], 0, h[7], 0, 0, 1, 0, h[2], h[5], 0, 1].join(',') + ')'
      }

      // Põe o celular na posição u. A tela (o site, num quadro de 390 x 837) vai
      // pro quadrilátero do momento; cada moldura é deformada pra encaixar nele.
      // Quem está por baixo fica opaco até a de cima estar inteira (aos 70% da
      // troca) e só então some: nunca as duas meio transparentes, e sem fresta de
      // fundo.
      var QUADRO = [[0, 0], [390, 0], [390, 837], [0, 837]]
      function gira (fone, ordem, els, u) {
        var k = Math.min(Math.floor(u), ordem.length - 2), t = u - k
        var a = alinhada(POSE[ordem[k]]), b = alinhada(POSE[ordem[k + 1]])
        var alvo = a.map(function (p, i) { return [p[0] + (b[i][0] - p[0]) * t, p[1] + (b[i][1] - p[1]) * t] })
        fone.querySelector('.pose__tela').style.transform = homografia(QUADRO, alvo)
        els.forEach(function (el, i) {
          el.style.transform = homografia(POSE[ordem[i]].q, alvo)
          el.style.opacity = i === k + 1 ? Math.min(1, t / 0.7) : i === k ? Math.min(1, (1 - t) / 0.3) : 0
        })
      }

      var desfazPoses = []
      function poses (fone, ordem) {
        var frente = fone.querySelector('.pose--f')
        var tela = fone.querySelector('.pose__tela')
        var depois = false
        desfazPoses.push(function () { tela.style.transform = ''; frente.style.transform = ''; frente.style.opacity = '' })
        return ordem.map(function (nome) {
          if (nome === 'f') { depois = true; return frente }
          var c = frente.cloneNode(true)
          c.className = 'pose pose--' + nome
          c.querySelector('.pose__img').src = IMG_POSE[nome]
          if (depois) fone.appendChild(c); else fone.insertBefore(c, frente)
          desfazPoses.push(function () { c.remove() })
          return c
        })
      }

      // Portal: o palco fica preso por 240% da tela e a rolagem leva o progresso
      // de 0 a 1 (o desenho de cada quadro está em portal(), acima).
      if (pintaPortal) {
        var estPortal = { p: 0 }
        gsap.to(estPortal, {
          p: 1, ease: 'none', onUpdate: function () { pintaPortal(estPortal.p) },
          scrollTrigger: { trigger: '.portal__palco', start: 'top top', end: '+=240%', pin: true, scrub: 0.6 }
        })
      }

      // Design pra redes sociais. O palco fica preso por 250% da tela e a rolagem
      // passa o carrossel pro lado, do primeiro slide até o último encostar na
      // margem direita. O ponto aceso é o do slide mais perto da vez.
      var posts = document.querySelector('.posts')
      var restauraPosts = null
      if (posts) {
        var janelaPosts = posts.querySelector('.posts__janela')
        var trilho = posts.querySelector('.posts__trilho')
        var pontos = posts.querySelectorAll('.posts__pontos i')
        posts.classList.add('posts--anima')
        gsap.to(trilho, {
          x: function () { return -(trilho.offsetWidth - janelaPosts.clientWidth) },
          ease: 'none',
          scrollTrigger: {
            trigger: posts.querySelector('.posts__palco'), start: 'top top', end: '+=250%', pin: true, scrub: 0.8, invalidateOnRefresh: true,
            onUpdate: function (self) {
              var k = Math.round(self.progress * (pontos.length - 1))
              pontos.forEach(function (p, i) { p.classList.toggle('aceso', i === k) })
            }
          }
        })
        restauraPosts = function () { posts.classList.remove('posts--anima') }
      }

      // Você vê antes de decidir. O palco fica preso por 300% da tela. O passo
      // (1 esqueleto, 2 marca, 3 pronto) sai direto do progresso da rolagem e o
      // CSS faz a troca; o GSAP cuida do movimento contínuo: o celular chega
      // inclinado, sobe e vai virando pra frente (inclinado, quase de lado, de
      // frente) num giro só, o brilho anda mais devagar e, no fim, o site rola
      // por dentro.
      var ve = document.querySelector('.ve')
      var restauraVe = null
      if (ve) {
        var dentro = ve.querySelector('.ve__dentro')
        var tela = ve.querySelector('.ve__tela')
        var ordemVe = ['5', '3', 'f']
        var foneVe = ve.querySelector('.ve__fone')
        var pv = poses(foneVe, ordemVe)
        var giroVe = { u: 0 }
        gira(foneVe, ordemVe, pv, 0)
        var passo = function (p) { ve.setAttribute('data-passo', p < 0.34 ? 1 : p < 0.67 ? 2 : 3) }
        ve.classList.add('ve--anima')
        passo(0)
        gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: '.ve__palco', start: 'top top', end: '+=300%', pin: true, scrub: 0.8, invalidateOnRefresh: true,
            onUpdate: function (self) { passo(self.progress) }
          }
        })
          .fromTo('.ve__fone', { y: 70 }, { y: 0, duration: 3.4, ease: 'power2.out' }, 0)
          .to(giroVe, { u: 2, duration: 3.4, ease: 'power2.inOut', onUpdate: function () { gira(foneVe, ordemVe, pv, giroVe.u) } }, 0)
          .fromTo('.ve__brilho', { yPercent: 25, scale: 0.8 }, { yPercent: -25, scale: 1.1, duration: 10 }, 0)
          .to(ve.querySelectorAll('.ve__dentro'), { yPercent: function () { return -Math.max(0, 1 - tela.clientHeight / dentro.offsetHeight) * 100 }, duration: 3 }, 7)
          .to({}, { duration: 0.01 }, 10)
        restauraVe = function () { ve.classList.remove('ve--anima'); ve.setAttribute('data-passo', 3) }
      }

      // As mãos. O palco fica preso por 440% da tela e a rolagem toca a timeline
      // (15,4 unidades), de trás pra frente se a pessoa voltar:
      //   0–3,4  a luz nasce na fresta entre os dedos, fraca (papel a 35%):
      //          as mãos aparecem como sombras escuras saindo do escuro;
      //   3,4–6,2 a luz cresce e firma (papel a 100%), contraste sobe;
      //   até 8,2 a luz toma a tela inteira e o grão do papel entra;
      //   6,8–8,8 a frase entra, uma linha de cada vez, onde o papel já abriu;
      //   8,6–9,8 a nota da automação entra embaixo das mãos;
      //   9,8–12 a cena fica parada, pronta pra ler;
      //   12–15,1 a saída, o espelho da entrada: o texto some, a luz se recolhe
      //          até a fresta e apaga; 15,1–15,4 preto puro, que emenda no preto
      //          da seção seguinte, sem corte de branco pra preto.
      // As mãos andam até o centro, rápidas no começo e assentando no fim
      // (power2.out), e o par sobe um tiquinho (parallax). A luz abre rápido
      // no começo (sine.out), segura, e acelera de novo pra virar página
      // (power2.in); na saída, o contrário.
      var maos = document.querySelector('.maos')
      if (maos) {
        var papel = maos.querySelector('.maos__papel')
        gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: maos.querySelector('.maos__palco'), start: 'top top', end: '+=440%', pin: true, scrub: 1, invalidateOnRefresh: true }
        })
          .fromTo(papel, { '--r': '-25%' }, { '--r': '15%', duration: 3.4, ease: 'sine.out' }, 0)
          .to(papel, { '--r': '140%', duration: 4.8, ease: 'power2.in' }, 3.4)
          .fromTo(papel, { opacity: 0 }, { opacity: 0.35, duration: 3.4, ease: 'sine.out' }, 0)
          .to(papel, { opacity: 1, duration: 2.8, ease: 'sine.inOut' }, 3.4)
          .fromTo('.maos__grao', { opacity: 0 }, { opacity: 1, duration: 2.7 }, 5.5)
          .fromTo('.maos__mao--robo', { xPercent: -14 }, { xPercent: 0, duration: 8.2, ease: 'power2.out' }, 0)
          .fromTo('.maos__mao--humana', { xPercent: 14 }, { xPercent: 0, duration: 8.2, ease: 'power2.out' }, 0)
          .fromTo('.maos__par', { y: 24 }, { y: -8, duration: 10 }, 0)
          .fromTo('.maos__l--1', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 6.8)
          .fromTo('.maos__l--2', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 7.6)
          .fromTo('.maos__nota', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 8.6)
          .to('.maos__titulo, .maos__nota', { opacity: 0, y: -12, duration: 0.9, ease: 'sine.in' }, 12)
          .to(papel, { '--r': '15%', duration: 1.8, ease: 'power2.out' }, 12.3)
          .to(papel, { '--r': '-25%', duration: 1, ease: 'sine.in' }, 14.1)
          .to(papel, { opacity: 0, duration: 1.2, ease: 'sine.inOut' }, 13.9)
          .to({}, { duration: 0.01 }, 15.4)
      }

      // Trabalhos: o celular gira com a rolagem. Chega quase de lado, fica de frente
      // quando a vitrine está no meio da tela e sai virando pro outro lado.
      gsap.utils.toArray('.vt').forEach(function (vt) {
        var fone = vt.querySelector('.vt__fone')
        if (fone) {
          var ordemVt = ['3', 'f', '3m']
          var pt = poses(fone, ordemVt)
          var giroVt = { u: 0 }
          var giraVt = function () { gira(fone, ordemVt, pt, giroVt.u) }
          giraVt()
          // Vira pra frente na primeira metade, segura de frente enquanto a vitrine
          // está no meio da tela e vira pro outro lado na segunda.
          gsap.timeline({
            scrollTrigger: { trigger: vt, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
          })
            .to(giroVt, { u: 1, duration: 4, ease: 'power2.inOut', onUpdate: giraVt }, 0)
            .to(giroVt, { u: 2, duration: 4, ease: 'power2.inOut', onUpdate: giraVt }, 6)
            .to({}, { duration: 0.01 }, 10)
        }
      })

      // Parallax genérico: data-parallax="v" faz o elemento andar de -v a +v
      // da altura da tela enquanto cruza a tela. v positivo = mais devagar que
      // a página (fundo); negativo = mais rápido (frente).
      gsap.utils.toArray('[data-parallax]').forEach(function (el) {
        var v = parseFloat(el.getAttribute('data-parallax'))
        gsap.fromTo(el,
          { y: function () { return -v * window.innerHeight } },
          { y: function () { return v * window.innerHeight }, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } })
      })

      // O comparador se apresenta sozinho uma vez: a linha vai à direita, à
      // esquerda e volta ao meio. Quem mexe primeiro cancela a demonstração.
      if (faixa) {
        var pos = { v: 50 }
        var atualiza = function () { poe(pos.v); faixa.value = pos.v }
        var demo = gsap.timeline({ scrollTrigger: { trigger: janela, start: 'top 70%', once: true } })
          .to(pos, { v: 82, duration: 0.9, ease: 'power2.inOut', onUpdate: atualiza })
          .to(pos, { v: 16, duration: 1.5, ease: 'power2.inOut', onUpdate: atualiza })
          .to(pos, { v: 50, duration: 0.9, ease: 'power2.inOut', onUpdate: atualiza })
        faixa.addEventListener('input', function () { demo.kill() })
      }

      // Contato: a conversa acontece em tempo real, uma vez, quando entra na
      // tela (não segue a rolagem: conversa arrastada pelo scroll parece
      // mecânica). Na ordem do HTML: a mensagem do cliente entra; a da v0n vem
      // depois de um "digitando" (avatar e três pontos no lugar da resposta),
      // mais longo quanto maior a resposta, e toma o lugar dos pontos. Cada
      // balão entra em pop, do canto de onde "sai". ~5 s do começo ao fim.
      var zap = document.querySelector('.zap')
      if (zap) {
        var tlZap = gsap.timeline({ scrollTrigger: { trigger: zap, start: 'top 75%', once: true } })
        var pop = function (el, origem, t) {
          tlZap.fromTo(el, { autoAlpha: 0, scale: 0.85, y: 16, transformOrigin: origem },
            { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(1.7)' }, t)
        }
        var t = 0.2
        zap.querySelectorAll('.zap__item').forEach(function (item) {
          var msg = item.querySelector('.zap__msg')
          if (item.classList.contains('zap__item--eu')) {
            pop(msg, '100% 100%', t)
            t += 0.8
            return
          }
          var dots = item.querySelector('.zap__dots')
          var espera = 0.7 + msg.textContent.length * 0.008
          pop(item.querySelector('.zap__av'), '50% 100%', t)
          pop(dots, '0% 100%', t)
          tlZap.to(dots, { autoAlpha: 0, scale: 0.8, duration: 0.2 }, t + espera)
          pop(msg, '0% 100%', t + espera + 0.05)
          t += espera + 0.7
        })
      }

      return function () {
        if (restauraNichos) restauraNichos()
        if (restauraVe) restauraVe()
        if (restauraPosts) restauraPosts()
        if (pintaPortal) pintaPortal(0)
        desfazPoses.forEach(function (f) { f() })
      }
    })

    // A fonte e as imagens mudam a altura do que está acima: remede.
    window.addEventListener('load', function () { ScrollTrigger.refresh() })
    if (document.fonts) document.fonts.ready.then(function () { ScrollTrigger.refresh() })
  }
})()
