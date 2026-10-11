// Paralaxe da página /servicos (GSAP + ScrollTrigger). É enfeite: sem o GSAP ou com
// movimento reduzido a página fica parada e inteira. O deslocamento usa a variável
// --py (lida pela propriedade CSS "translate"), pra não brigar com o transform das
// entradas (.entra) nem com as animações de flutuar.
(function () {
  'use strict'
  if (!window.gsap || !window.ScrollTrigger) return
  gsap.registerPlugin(ScrollTrigger)
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', function () {
    function anda(alvo, de, ate, gatilho, inicio) {
      gsap.fromTo(alvo, { '--py': de + 'px' }, { '--py': ate + 'px', ease: 'none',
        scrollTrigger: { trigger: gatilho || alvo, start: inicio || 'top bottom', end: 'bottom top', scrub: true } })
    }
    // Boas-vindas: as nuvens sobem mais rápido que a página e o texto fica pra trás.
    anda('.nuvens', 30, -90, '.hero', 'top top')
    anda('.hero__conteudo', 0, 50, '.hero', 'top top')
    // Fecho: o celular anda em outra velocidade que o texto.
    anda('.fone', 40, -40, '.cta')
    // A conversa do celular acontece sozinha quando ele entra na tela: o cliente fala, a v0n
    // "digita" e responde. Os balões já ocupam o lugar deles (escondidos), então nada pula.
    var fone = document.querySelector('.fone')
    if (fone) {
      var linhas = Array.from(fone.querySelectorAll('.fone__linha'))
      var espera = function (ms) { return new Promise(function (ok) { setTimeout(ok, ms) }) }
      fone.classList.add('fone--espera')
      ScrollTrigger.create({ trigger: fone, start: 'top 75%', once: true, onEnter: async function () {
        await espera(500)
        for (var i = 0; i < linhas.length; i++) {
          var l = linhas[i]
          if (l.classList.contains('fone__linha--v0n')) { l.classList.add('digita'); await espera(1300); l.classList.remove('digita') } else await espera(500)
          l.classList.add('fala')
          await espera(900)
        }
      } })
    }
    // Títulos de seção sobem um pouco mais rápido que a página.
    gsap.utils.toArray('.secao h2').forEach(function (t) { anda(t, 16, -16) })
    // Cada pilha de design anda por conta própria, em outra velocidade que o título.
    gsap.utils.toArray('.pilha').forEach(function (p) { anda(p, 28, -28) })
    // O print de cada site anda devagar por dentro da moldura enquanto o cartão cruza a tela.
    gsap.utils.toArray('.site__img img').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -3.5, scale: 1.08 }, { yPercent: 3.5, scale: 1.08, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
    })
  })
  // Com mouse, as notificações fogem do cursor: cada uma é empurrada pra longe dele, mais
  // forte quanto mais perto, e volta devagar quando ele sai. Usa --rx/--ry, lidas no transform.
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', function () {
    var hero = document.querySelector('.hero')
    var nuvens = gsap.utils.toArray('.nuvem').map(function (el) {
      return { el: el, x: gsap.quickTo(el, '--rx', { duration: 0.7, ease: 'power3.out' }), y: gsap.quickTo(el, '--ry', { duration: 0.7, ease: 'power3.out' }) }
    })
    var raio = 240, forca = 90
    function foge(e) {
      nuvens.forEach(function (n) {
        var r = n.el.getBoundingClientRect()
        var dx = r.left + r.width / 2 - e.clientX, dy = r.top + r.height / 2 - e.clientY
        var d = Math.hypot(dx, dy) || 1
        var p = Math.max(0, 1 - Math.max(0, d - Math.min(r.width, r.height) / 2) / raio) * forca
        // a nuvem nunca é empurrada pra fora da tela (r já inclui o deslocamento atual)
        var atual = parseFloat(getComputedStyle(n.el).getPropertyValue('--rx')) || 0
        var px = gsap.utils.clamp(24 - (r.left - atual), innerWidth - 24 - (r.right - atual), dx / d * p)
        n.x(px); n.y(dy / d * p)
      })
    }
    function volta() { nuvens.forEach(function (n) { n.x(0); n.y(0) }) }
    hero.addEventListener('pointermove', foge)
    hero.addEventListener('pointerleave', volta)
    return function () { hero.removeEventListener('pointermove', foge); hero.removeEventListener('pointerleave', volta); volta() }
  })
})()
