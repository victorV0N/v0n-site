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
  // Um observer pra página inteira. Cada alvo entra uma vez e para de ser
  // observado: nada anima duas vezes, e o observer se esvazia sozinho.
  // Só começa depois da abertura: seção que entra atrás do overlay entrega
  // uma página que já terminou de animar antes de alguém olhar.
  function ligaEntradas () {
    var alvos = document.querySelectorAll('.entra, .entra-fade, .entra-regua')

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) return
          entrada.target.classList.add('visivel')
          observer.unobserve(entrada.target)
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

  var jaViu = false
  try {
    // Só nesta aba: quem volta na mesma visita não assiste de novo. Aba
    // anônima com armazenamento bloqueado cai no catch e vê a abertura,
    // que é o pior caso aceitável.
    jaViu = sessionStorage.getItem('v0n-abertura') === 'visto'
  } catch (e) { /* armazenamento indisponível */ }

  function tiraOverlay () {
    if (intro && intro.parentNode) intro.remove()
    document.documentElement.classList.remove('intro-rodando')
  }

  if (intro && !menosMovimento && !jaViu) {
    document.documentElement.classList.add('intro-rodando')
    // A batida vem do CSS: mudar --batida lá muda a abertura e estes tempos
    // junto, sem números pra manter em sincronia na mão.
    var batida = parseFloat(getComputedStyle(intro).getPropertyValue('--batida')) || 0.9
    try { sessionStorage.setItem('v0n-abertura', 'visto') } catch (e) {}
    // A hero sobe quando o overlay COMEÇA a sumir (4,5 batidas, o mesmo
    // atraso do intro-sai no CSS), não quando ele sai: assim a logo dissolve
    // sobre uma hero já em movimento, em vez de piscar carbono vazio entre
    // as duas. O overlay some aos 4,9 e é removido aos 5.
    setTimeout(ligaEntradas, batida * 4.5 * 1000)
    setTimeout(tiraOverlay, batida * 5 * 1000)
  } else {
    tiraOverlay()
    ligaEntradas()
  }

  // ---- 01 / Diagnóstico -------------------------------------------------
  // Estado só na memória: sem localStorage, sem cookie, sem servidor. O laudo
  // vive enquanto a aba vive. É diagnóstico, não cadastro — cadastro pediria
  // aviso de privacidade que o spec não tem.
  var LAUDO = [
    { nao: 'Quem procura o que você faz acha o concorrente, não você.',
      sim: 'Você já aparece no Google.',
      queixa: 'não apareço no Google' },
    { nao: 'Você não tem um lugar seu na internet — só o perfil que a rede te empresta.',
      sim: 'Você tem site.',
      queixa: 'não tenho site' },
    { nao: 'Quem te acha desiste antes de conseguir te chamar.',
      sim: 'Quem te acha te chama em um toque.',
      queixa: 'quem me acha não consegue me chamar no WhatsApp' }
  ]

  var WPP = '#contato-pendente' // trocar por https://wa.me/NUMERO?text=
  var respostas = [null, null, null]
  var opcoes = document.querySelectorAll('.diag__opcao')
  var laudo = document.getElementById('diag-laudo')
  var cta = document.getElementById('diag-cta')

  function mensagem () {
    var queixas = []
    for (var i = 0; i < 3; i++) {
      if (respostas[i] === 'nao') queixas.push(LAUDO[i].queixa)
    }
    if (!queixas.length) {
      return 'Oi! Vim pelo site. Tenho site, apareço no Google e recebo no ' +
             'WhatsApp — quero achar o que ainda está travando.'
    }
    return 'Oi! Vim pelo site. Meu caso: ' + queixas.join('; ') + '.'
  }

  function desenhaLaudo () {
    laudo.textContent = ''
    for (var i = 0; i < 3; i++) {
      if (respostas[i] === null) continue
      var p = document.createElement('p')
      p.textContent = LAUDO[i][respostas[i]]
      laudo.appendChild(p)
    }

    if (respostas.indexOf(null) !== -1) return

    var tudoOk = respostas.every(function (r) { return r === 'sim' })
    var fecho = document.createElement('p')
    fecho.textContent = tudoOk
      ? 'O básico está de pé. Nesse caso o gargalo é outro — e achar isso é o que eu faço.'
      : 'É isso que trava. Me chama que eu te mostro funcionando antes de falar de valor.'
    laudo.appendChild(fecho)

    // O ouro do Diagnóstico só existe depois das três respostas: é o ouro que
    // paga a interação, e antes disso a CTA é de traço.
    cta.classList.add('btn--ouro')
    cta.textContent = tudoOk ? 'Me chama que eu olho' : 'Chamar no WhatsApp'
    cta.href = WPP === '#contato-pendente'
      ? '#contato-pendente'
      : WPP + encodeURIComponent(mensagem())
  }

  if (laudo && cta) {
    for (var o = 0; o < opcoes.length; o++) {
      opcoes[o].addEventListener('click', function () {
        respostas[Number(this.dataset.p)] = this.dataset.r
        var irmas = this.parentNode.querySelectorAll('.diag__opcao')
        for (var k = 0; k < irmas.length; k++) {
          irmas[k].setAttribute('aria-pressed', String(irmas[k] === this))
        }
        desenhaLaudo()
      })
    }
  }
})()
