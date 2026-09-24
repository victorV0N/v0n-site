// JS do site da v0n. Sem dependência, sem build.
// A linha que põe a classe `js` no <html> fica inline no <head>: ela precisa
// rodar antes do CSS pintar, senão o menu pisca aberto no carregamento.
(function () {
  'use strict'

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
  }

  // ---- Rolagem suave ----------------------------------------------------
  // Partiu do hermes-agent (lerp .09) e acelerou a pedido do Kauã em 22/09:
  // lerp .13 (cada quadro anda 13% do que falta, então chega antes) e cada
  // giro da roda anda 20% a mais. anchors: link de âncora desliza também.
  // Só liga depois da
  // abertura, que trava a rolagem. Sem o Lenis (CDN fora) ou com movimento
  // reduzido, fica a rolagem nativa: é enfeite, não condição.
  function ligaRolagem () {
    if (menosMovimento || typeof Lenis === 'undefined') return
    new Lenis({ anchors: true, autoRaf: true, lerp: 0.13, wheelMultiplier: 1.2 })
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

  // ---- Parallax da foto da hero ----------------------------------------
  // A foto desce 30% do que a página rola, então fica pra trás do texto.
  // Um rAF por quadro, no máximo: scroll dispara mais vezes que a tela pinta.
  var foto = document.querySelector('.hero__olhos')
  if (foto && !menosMovimento) {
    var pedido = 0
    window.addEventListener('scroll', function () {
      if (pedido) return
      pedido = requestAnimationFrame(function () {
        foto.style.transform = 'translate3d(0,' + window.scrollY * 0.3 + 'px,0)'
        pedido = 0
      })
    }, { passive: true })
  }

  // ---- Cubo da virada ---------------------------------------------------
  // Porte do WireframeEngine do "Wireframe Forms" (21st.dev), variante cube
  // na velocidade 3 da demo. Mesmos pontos, projeção e alpha por profundidade;
  // a geometria original é pra 300px, então tudo escala pela largura.
  // Só gira na tela: fora dela o rAF para. Movimento reduzido: um quadro fixo.
  var forma = document.querySelector('.virada__forma')
  if (forma) {
    var ctx = forma.getContext('2d')
    var s = 80
    var pontos = [[s, s, s], [-s, -s, s], [-s, s, -s], [s, -s, -s],
                  [-s, -s, -s], [s, s, -s], [s, -s, s], [-s, s, s]]
    var arestas = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3],
                   [4, 5], [4, 6], [4, 7], [5, 6], [5, 7], [6, 7]]
    var ax = 0.4, ay = 0.6, lado = 0, girando = false

    var medeForma = function () {
      lado = forma.offsetWidth
      var dpr = window.devicePixelRatio || 1
      forma.width = forma.height = lado * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    var projeta = function (p) {
      var x = p[0] * Math.cos(ay) - p[2] * Math.sin(ay)
      var z = p[2] * Math.cos(ay) + p[0] * Math.sin(ay)
      var y = p[1] * Math.cos(ax) - z * Math.sin(ax)
      z = z * Math.cos(ax) + p[1] * Math.sin(ax)
      var k = 400 / (400 + z) * lado / 300
      return { x: x * k + lado / 2, y: y * k + lado / 2, z: z }
    }

    var desenhaForma = function () {
      ctx.clearRect(0, 0, lado, lado)
      ctx.lineWidth = 0.8 * lado / 300
      var pp = pontos.map(projeta)
      arestas.forEach(function (e) {
        var a = pp[e[0]], b = pp[e[1]]
        var alpha = Math.max(0.1, 1 - (a.z + b.z) / 400)
        ctx.strokeStyle = 'rgba(236, 237, 232, ' + alpha * 0.4 + ')'
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
      })
      pp.forEach(function (p) {
        var alpha = Math.max(0.1, 1 - p.z / 200)
        if (alpha <= 0.5) return
        ctx.fillStyle = 'rgba(236, 237, 232, ' + alpha + ')'
        ctx.fillRect(p.x - 1, p.y - 1, 2, 2)
      })
    }

    var gira = function () {
      if (!girando) return
      ay += 0.015; ax += 0.006
      desenhaForma()
      requestAnimationFrame(gira)
    }

    medeForma(); desenhaForma()
    window.addEventListener('resize', function () { medeForma(); desenhaForma() })

    if (!menosMovimento && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        var antes = girando
        girando = e[0].isIntersecting
        if (girando && !antes) gira()
      }).observe(forma)
    }
  }

  // ---- Onda de pixels da virada -----------------------------------------
  // p vai de 0 (cola acabou de prender) a 1 (vai soltar). Cada célula da
  // grade tem um limiar: distância até o centro do título mais um sorteio,
  // senão a frente da onda seria um círculo liso. Passado o limiar, a célula
  // cresce de 0 ao tamanho cheio; enquanto cresce é ouro, cheia vira osso.
  // Em p=1 a tela é osso inteira, o mesmo fundo da seção seguinte.
  var virada = document.querySelector('.virada')
  var cola = virada && virada.querySelector('.virada__cola')
  var pixels = cola && cola.querySelector('.virada__pixels')
  if (pixels && !menosMovimento) {
    var pctx = pixels.getContext('2d')
    var celulas = [], lado2 = 0, larg = 0, alt = 0, topoCola = 0, pedidoOnda = 0

    var montaGrade = function () {
      larg = cola.offsetWidth; alt = cola.offsetHeight
      var dpr = window.devicePixelRatio || 1
      pixels.width = larg * dpr; pixels.height = alt * dpr
      pctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Cola mais alta que a tela prende pelo pé, não pelo topo.
      topoCola = Math.min(0, window.innerHeight - alt)
      cola.style.top = topoCola + 'px'

      lado2 = larg < 720 ? 14 : 22
      var titulo = cola.querySelector('.t1').getBoundingClientRect()
      var base = cola.getBoundingClientRect()
      var ox = titulo.left - base.left + titulo.width / 2
      var oy = titulo.top - base.top + titulo.height / 2
      var maior = Math.hypot(Math.max(ox, larg - ox), Math.max(oy, alt - oy))
      celulas = []
      for (var y = 0; y < alt; y += lado2) {
        for (var x = 0; x < larg; x += lado2) {
          var d = Math.hypot(x + lado2 / 2 - ox, y + lado2 / 2 - oy) / maior
          celulas.push(x, y, d * 0.75 + Math.random() * 0.25)
        }
      }
    }

    var desenhaOnda = function () {
      pedidoOnda = 0
      var r = virada.getBoundingClientRect()
      var p = (topoCola - r.top) / (virada.offsetHeight - alt)
      p = Math.max(0, Math.min(1, p))
      // 10% parado no começo pra copy ser lida; cheia antes do fim.
      var q = (p - 0.1) / 0.78
      pctx.clearRect(0, 0, larg, alt)
      if (q <= 0) return
      if (q >= 1.15) { pctx.fillStyle = '#ECEDE8'; pctx.fillRect(0, 0, larg, alt); return }
      for (var i = 0; i < celulas.length; i += 3) {
        var k = (q - celulas[i + 2]) / 0.15
        if (k <= 0) continue
        if (k >= 1) {
          pctx.fillStyle = '#ECEDE8'
          pctx.fillRect(celulas[i], celulas[i + 1], lado2 + 0.5, lado2 + 0.5)
        } else {
          var t = lado2 * k, m = (lado2 - t) / 2
          pctx.fillStyle = '#FFC531'
          pctx.fillRect(celulas[i] + m, celulas[i + 1] + m, t, t)
        }
      }
    }

    montaGrade(); desenhaOnda()
    window.addEventListener('scroll', function () {
      if (!pedidoOnda) pedidoOnda = requestAnimationFrame(desenhaOnda)
    }, { passive: true })
    window.addEventListener('resize', function () { montaGrade(); desenhaOnda() })
    // A fonte do título chega depois e muda a altura da cola: remede.
    window.addEventListener('load', function () { montaGrade(); desenhaOnda() })
  }

  // ---- V de volta pro blackout ------------------------------------------
  // p vai de 0 (palco prende) a 1 (solta). O V anda de fora da tela, à
  // esquerda, até fora da tela, à direita. A camada de osso é cortada por um
  // polígono cuja borda esquerda é a borda direita do V: do topo direito do V
  // até a ponta de baixo. Tudo à esquerda disso é o preto de Trabalhos.
  var trab = document.querySelector('.trab__trilho')
  var trabV = trab && trab.querySelector('.trab__v')
  var trabOsso = trab && trab.querySelector('.trab__osso')
  if (trabV && !menosMovimento) {
    var pedidoV = 0
    var passaV = function () {
      pedidoV = 0
      var r = trab.getBoundingClientRect()
      var h = window.innerHeight, w = window.innerWidth
      var p = Math.max(0, Math.min(1, -r.top / (trab.offsetHeight - h)))
      var lv = trabV.getBoundingClientRect().width
      var x = -lv + (w + lv) * p
      trabV.style.transform = 'translate3d(' + x + 'px,0,0)'
      trabOsso.style.clipPath = 'polygon(' + (x + lv) + 'px 0, 100% 0, 100% 100%, ' + (x + lv / 2) + 'px 100%)'
    }
    window.addEventListener('scroll', function () {
      if (!pedidoV) pedidoV = requestAnimationFrame(passaV)
    }, { passive: true })
    window.addEventListener('resize', passaV)
    passaV()
  }

  // ---- Método que acende (Quem faz) -------------------------------------
  // A faixa do observer é a fatia de 20% no meio da tela: a frase acende
  // quando entra nela e apaga só quando a rolagem volta e ela sai por baixo,
  // a mesma regra das entradas. Sem observer ou com movimento reduzido, o
  // CSS já deixa todas acesas.
  var frases = document.querySelectorAll('.metodo__frase')
  if (frases.length && 'IntersectionObserver' in window && !menosMovimento) {
    var acende = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('aceso')
        else if (e.boundingClientRect.top > 0) e.target.classList.remove('aceso')
      })
    }, { rootMargin: '-40% 0px -40% 0px' })
    frases.forEach(function (f) { acende.observe(f) })
  }

  // ---- Card de exibição -------------------------------------------------
  // O iframe abre com a largura de uma tela de verdade (1280px desktop, 390px
  // celular) e é reduzido até caber na janela do card. Sem isso o site da
  // cliente se veria no layout de tablet, que não é o que ela aprovou.
  var telas = document.querySelectorAll('.vitrine__tela')
  var encaixaTelas = function () {
    for (var i = 0; i < telas.length; i++) {
      var tela = telas[i], quadro = tela.querySelector('iframe')
      var base = tela.offsetWidth < 500 ? 390 : 1280
      var escala = tela.offsetWidth / base
      quadro.style.width = base + 'px'
      quadro.style.height = tela.offsetHeight / escala + 'px'
      quadro.style.transform = 'scale(' + escala + ')'
    }
  }
  if (telas.length) {
    encaixaTelas()
    window.addEventListener('resize', encaixaTelas)
  }

  // ---- Atendimento com IA -----------------------------------------------
  // Porte do ContainerScroll (Aceternity). p vai de 0 (palco entrando por
  // baixo) a 1 (saindo por cima), o mesmo alcance do useScroll do original.
  // Nele: aparelho de 20° a 0°, escala 1.05→1 (celular .7→.9) e o título
  // subindo 100px. A conversa toca uma vez, quando o aparelho aparece.
  var palco = document.querySelector('.auto__palco')
  if (palco) {
    var aparelho = palco.querySelector('.auto__aparelho')
    var tituloAuto = palco.querySelector('.auto__titulo')
    var msgs = palco.querySelectorAll('.zap__msg')
    var digitando = palco.querySelector('.zap__digitando')
    var statusZap = palco.querySelector('.zap__status')

    if (menosMovimento || !('IntersectionObserver' in window)) {
      for (var m = 0; m < msgs.length; m++) msgs[m].classList.add('visivel')
    } else {
      var pedidoAuto = 0
      var inclina = function () {
        pedidoAuto = 0
        var r = palco.getBoundingClientRect()
        var p = (window.innerHeight - r.top) / (window.innerHeight + r.height)
        p = Math.max(0, Math.min(1, p))
        var escala = window.innerWidth <= 768 ? 0.7 + 0.2 * p : 1.05 - 0.05 * p
        aparelho.style.transform = 'rotateX(' + (20 - 20 * p) + 'deg) scale(' + escala + ')'
        tituloAuto.style.transform = 'translate3d(0,' + -100 * p + 'px,0)'
      }
      window.addEventListener('scroll', function () {
        if (!pedidoAuto) pedidoAuto = requestAnimationFrame(inclina)
      }, { passive: true })
      window.addEventListener('resize', inclina)
      inclina()

      // Mensagem do cliente chega direto; a da IA vem depois de "digitando…",
      // no balão e no cabeçalho, como no app.
      var toca = function () {
        var i = 0
        var proxima = function () {
          if (i >= msgs.length) return
          var msg = msgs[i++]
          if (!msg.classList.contains('zap__msg--ia')) {
            msg.classList.add('visivel')
            setTimeout(proxima, 1100)
            return
          }
          digitando.classList.add('visivel')
          statusZap.textContent = 'digitando…'
          setTimeout(function () {
            digitando.classList.remove('visivel')
            statusZap.textContent = 'online'
            msg.classList.add('visivel')
            setTimeout(proxima, 900)
          }, 1400)
        }
        proxima()
      }
      var vigia = new IntersectionObserver(function (e) {
        if (!e[0].isIntersecting) return
        vigia.disconnect()
        setTimeout(toca, 400)
      }, { threshold: 0.4 })
      vigia.observe(aparelho)
    }
  }
})()
