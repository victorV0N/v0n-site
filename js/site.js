// JS do site da v0n. Sem dependência, sem build.
// A linha que põe a classe `js` no <html> fica inline no <head>: ela precisa
// rodar antes do CSS pintar, senão a hero aparece e some antes de entrar.
(function () {
  'use strict'

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
})()
