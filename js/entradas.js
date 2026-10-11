// Entrada por rolagem das páginas que não usam as cenas do site.js (a landing
// /servicos). Mesma regra do site: o alvo acende ao entrar e, se a pessoa
// voltar, apaga ao sair por baixo; quem sai por cima fica aceso. É enfeite:
// sem IntersectionObserver a página aparece montada.
(function () {
  'use strict'
  var alvos = document.querySelectorAll('.entra, .entra-fade, .entra-regua')
  if (!('IntersectionObserver' in window)) {
    alvos.forEach(function (a) { a.classList.add('visivel') })
    return
  }
  var observer = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add('visivel')
      else if (e.boundingClientRect.top > 0) e.target.classList.remove('visivel')
    })
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 })
  alvos.forEach(function (a) { observer.observe(a) })
})()
