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
})()
