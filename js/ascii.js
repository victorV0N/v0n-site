// Fundo ASCII de algumas seções da página /servicos (as que levam data-ascii): caracteres
// de código espalhados em repouso e, onde o mouse passa, uma trilha de caracteres que
// acende em ouro e vai sumindo (a "esteira" do cursor). Cada seção tem o seu canvas, que só
// anima enquanto aparece na tela. É enfeite: com movimento reduzido fica só o espalhado, parado.
(function () {
  'use strict'
  var parado = matchMedia('(prefers-reduced-motion: reduce)').matches
  var AMBIENTE = '.:·+*-=/\\|<>01'
  var RAMPA = ' .:-=+*#%@'
  var LARG = 15, ALT = 19, FPS = 30, DENSIDADE = 0.04, DECAI = 0.93

  function liga(secao) {
    var canvas = document.createElement('canvas')
    canvas.className = 'ascii'
    canvas.setAttribute('aria-hidden', 'true')
    secao.prepend(canvas)
    var ctx = canvas.getContext('2d')
    if (!ctx) return canvas.remove()
    var cols = 0, linhas = 0, w = 0, h = 0, dpr = 1
    var energia, glifo, fase
    var ativa = false, ultimo = 0, anterior = null

    function mede() {
      w = secao.clientWidth; h = secao.clientHeight
      dpr = Math.min(devicePixelRatio || 1, 2)
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(w / LARG); linhas = Math.ceil(h / ALT)
      energia = new Float32Array(cols * linhas)
      glifo = new Uint8Array(cols * linhas)
      fase = new Float32Array(cols * linhas)
      for (var i = 0; i < glifo.length; i++) {
        if (Math.random() < DENSIDADE) { glifo[i] = 1 + Math.floor(Math.random() * AMBIENTE.length); fase[i] = Math.random() * 6.28 }
      }
      desenha(0)
    }

    function desenha(t) {
      ctx.clearRect(0, 0, w, h)
      ctx.font = '13px "IBM Plex Mono", ui-monospace, monospace'
      ctx.textBaseline = 'top'
      for (var i = 0; i < glifo.length; i++) {
        var x = (i % cols) * LARG, y = Math.floor(i / cols) * ALT, e = energia[i]
        if (e > 0.03) {
          // Esteira: o caractere engrossa com a energia, pisca de leve e esfria de branco-ouro pra ouro.
          var c = Math.random() < 0.12 ? RAMPA[1 + Math.floor(Math.random() * (RAMPA.length - 1))] : RAMPA[Math.floor(e * (RAMPA.length - 1))]
          ctx.fillStyle = e > 0.75 ? 'rgb(255 243 199 / ' + e + ')' : 'rgb(255 197 49 / ' + Math.min(1, e * 1.3) + ')'
          ctx.fillText(c, x, y)
        } else if (glifo[i]) {
          ctx.fillStyle = 'rgb(140 150 163 / ' + (0.3 + 0.2 * Math.sin(t / 1400 + fase[i])) + ')'
          ctx.fillText(AMBIENTE[glifo[i] - 1], x, y)
        }
      }
    }

    function passo(t) {
      if (!ativa) return
      requestAnimationFrame(passo)
      if (t - ultimo < 1000 / FPS) return
      ultimo = t
      for (var i = 0; i < energia.length; i++) if (energia[i]) energia[i] = energia[i] * DECAI < 0.03 ? 0 : energia[i] * DECAI
      // Alguns caracteres do espalhado trocam de lugar e de símbolo, devagar.
      for (var k = 0, n = Math.ceil(glifo.length * DENSIDADE * 0.02); k < n; k++) {
        var a = Math.floor(Math.random() * glifo.length), b = Math.floor(Math.random() * glifo.length)
        if (glifo[a] && !glifo[b]) { glifo[b] = 1 + Math.floor(Math.random() * AMBIENTE.length); fase[b] = fase[a]; glifo[a] = 0 }
      }
      desenha(t)
    }

    function acende(cx, cy, forca) {
      if (cx < 0 || cy < 0 || cx >= cols || cy >= linhas) return
      var i = cy * cols + cx
      if (energia[i] < forca) energia[i] = forca
    }
    function risca(de, ate) {
      // Passa por todas as células entre os dois pontos, senão o mouse rápido deixa falhas.
      var n = Math.max(Math.abs(ate.x - de.x), Math.abs(ate.y - de.y), 1)
      for (var s = 0; s <= n; s++) {
        var x = Math.round(de.x + (ate.x - de.x) * s / n), y = Math.round(de.y + (ate.y - de.y) * s / n)
        acende(x, y, 1)
        acende(x + 1, y, 0.55); acende(x - 1, y, 0.55); acende(x, y + 1, 0.4); acende(x, y - 1, 0.4)
      }
    }
    if (!parado) {
      secao.addEventListener('pointermove', function (e) {
        var r = secao.getBoundingClientRect()
        var p = { x: Math.floor((e.clientX - r.left) / LARG), y: Math.floor((e.clientY - r.top) / ALT) }
        risca(anterior || p, p)
        anterior = p
      }, { passive: true })
      secao.addEventListener('pointerleave', function () { anterior = null })
      new IntersectionObserver(function (es) {
        var viu = es[0].isIntersecting
        if (viu && !ativa) { ativa = true; requestAnimationFrame(passo) } else if (!viu) ativa = false
      }).observe(secao)
    }
    new ResizeObserver(mede).observe(secao)
    mede()
  }

  var pronto = document.fonts && document.fonts.load ? document.fonts.load('13px "IBM Plex Mono"') : Promise.resolve()
  pronto.catch(function () {}).then(function () { document.querySelectorAll('[data-ascii]').forEach(liga) })
})()
