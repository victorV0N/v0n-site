# Site da v0n — design aprovado

> **v2**, decidida com o Kauã em 20/09/2026 à tarde, depois de ele reprovar a
> primeira direção ("não é o que eu queria"). Este arquivo é a lei do projeto:
> o que entra, o que fica de fora e por quê. Mudou de ideia? Muda aqui
> primeiro. A v1 está no histórico do git, não neste arquivo — spec com duas
> versões vivas é spec sem lei.

## O que mudou da v1 pra v2

Três referências de uso, dadas pelo Kauã: `hermes-agent.nousresearch.com`,
`mazyos.com.br` (o produto dele) e `skills.sh`. Foram medidas no CSS, não
olhadas em print. O que elas têm em comum virou o briefing; o que elas
contradiziam no design-guide virou decisão dele.

| O que | v1 | v2 | Por quê |
|---|---|---|---|
| Canto | chanfro de 45°, nenhuma curva | **raio**: 14px painel, 24px bloco, pílula no botão, círculo no selo | Nenhuma das três referências tem chanfro. O chanfro duro é suspeito nº 1 do "não é o que eu queria" |
| Título | Space Grotesk 700 | **Barlow Condensed 200** (300 no celular), caixa alta | O Hermes usa condensada peso 200; é dela que vem a cara. Espremer uma sans normal não chega perto |
| Famílias | duas | **três** | Revoga o ruling "duas famílias, não três" de 20/09 de manhã |
| Superfície | painel grafite sólido | **translúcida** sobre carbono: osso a 3%, borda a 8%, borda forte a 16% | É a gramática medida no MazyOS (branco a 3/8/16%), escrita na cor da v0n |
| Movimento | nenhum | **entrada por rolagem em toda seção** | Era a queixa explícita do Kauã |
| Seção "O que trava hoje" | texto em dois cartões | **substituída pelo Diagnóstico** | A página descobre o gargalo em vez de contar. O diferencial vira comportamento |
| Seção nova | — | **FAQ** | As três referências têm FAQ. É o padrão que ele escolheu três vezes |
| Neon | em título e número | **só em número e ouro** | `text-shadow` em traço de peso 200 borra a letra em vez de iluminar |
| Biblioteca | proibida | **continua proibida** | O MazyOS entrega 51 keyframes com zero dependência: CSS, `IntersectionObserver` e `matchMedia`. Não há o que negociar |

## Por que esse site existe

A `estrategia.md` do MazyOS diz, com todas as letras: colocar o site da v0n no
ar é a prioridade número um, porque para quem vende site o próprio site é o
primeiro case. Enquanto ele não existe, toda prospecção corre sem lastro.

## Quem chega, e o que precisa acontecer

Três públicos, peso igual — decisão do Kauã.

**1. O lead que acabou de ser abordado.** Recebeu a mensagem no WhatsApp e foi
conferir se a v0n existe de verdade. Chega pelo celular, dentro do WhatsApp,
com dois minutos de paciência. Precisa ver acabamento e prova, rápido.

**2. Quem achou pelo Google.** Busca ativa por criação de site. Precisa
entender o serviço sozinho e ter como chamar sem falar com ninguém antes.

**3. Indicação e Instagram.** Já ouviu falar, quer ver trabalho pronto.

**Ressalva registrada:** sem cidade definida (atendimento remoto para o Brasil
inteiro, decisão do Kauã), o público 2 é o mais difícil dos três. Busca local é
onde um solo ganha de agência grande; disputa nacional por "criação de sites" é
com quem paga anúncio. A estrutura serve os três, mas o resultado do público 2
vai depender de conteúdo ao longo do tempo, não de arquitetura.

**Quem manda no orçamento de peso:** o público 1. Celular, 4G, dentro do
WhatsApp. Toda decisão de movimento se mede nele, não no desktop.

## Decisões

| Decisão | Escolha | Por quê |
|---|---|---|
| Estrutura | Home única + uma página por case | Mais barata que atende os três públicos, e cresce sem refazer |
| Stack | HTML e CSS na mão, sem framework | Sem build, sem dependência pra atualizar, nada entre salvar e ver |
| Animação | CSS + `IntersectionObserver`, zero biblioteca | Provado no MazyOS: 51 keyframes, 167 transições, nenhuma dependência |
| Hospedagem | Netlify, direto do git | Push publica. HTTPS de graça, domínio próprio quando existir |
| Conversão | WhatsApp com mensagem pronta, montada pelo Diagnóstico | Ordem da `preferencias.md`: ajuda, prova, preço por último |
| Preço | Não aparece | Mesma razão. Valor entra depois da prévia, na conversa |
| Região | Brasil, remoto | Decisão do Kauã |
| Produção visual | Skill `impeccable` | Executa dentro do `design-guide.md`, nunca por cima dele |

## Arquivos

```
v0n-site/
  index.html              a home inteira
  cases/<negocio>.html    uma por trabalho anterior
  css/site.css            tokens da identidade + layout + movimento
  js/site.js              menu, entrada por rolagem e diagnóstico
  img/                    logo.svg, logo-mono.svg, selo.svg, prints, og.png
  robots.txt
  sitemap.xml
  dev.js                  servidor de desenvolvimento, NÃO vai pro ar
```

Sem `node_modules`, sem bundler, sem gerador de site.

**Onde o JavaScript mora:** uma linha inline no `<head>` — a que põe a classe
`js` no `<html>` antes do CSS pintar, que é o que faz a melhoria progressiva
funcionar sem piscar — e todo o resto em `js/site.js` com `defer`. Na v1 o JS
era inline no fim do `<body>` porque eram três linhas de menu; com o
Diagnóstico e o observer não são mais, e JS de sessenta linhas dentro do HTML
é HTML que ninguém acha.

Os SVGs são **copiados** de `MazyOS/identidade/`, não linkados: o site precisa
subir sozinho, sem depender da pasta do MazyOS existir.

**Case novo** = copiar um arquivo de `cases/`, trocar o texto, acrescentar uma
linha na grade da home e uma no `sitemap.xml`. Sem índice, sem registro, sem
passo de build.

## A home, seção por seção

| # | Seção | O que diz | Serve |
|---|---|---|---|
| — | Topo | Logo, menu curto, botão ouro no WhatsApp | todos |
| — | Hero | "Sites que vendem enquanto você atende" em outdoor condensado + uma linha do que é + CTA (de traço no desktop, ouro abaixo de 720px — ver "Identidade aplicada") | 1 |
| 01 | **Diagnóstico** | Três perguntas de sim/não que montam o laudo do gargalo na tela | 1 e 2 |
| 02 | Método | Acho o gargalo → faço e te mostro funcionando → só então falo de valor | todos |
| 03 | Trabalhos | Grade de cases, cada um abre a página própria. **Oculta até o material chegar** | 1 e 3 |
| 04 | Serviços | Sites e landing pages, Google Meu Negócio, automação com IA. Sem preço | 2 |
| 05 | Quem faz | Uma pessoa, do design ao código, remoto pro Brasil | todos |
| 06 | **Perguntas** | Seis perguntas reais de quem vai contratar | 2 |
| — | Fecho | CTA no WhatsApp + assinatura `— v0n · sites e landing pages` | todos |
| — | Rodapé | Logo mono, ano, contato | todos |

A seção 02 é o coração da página: o método é o diferencial registrado na
`empresa.md` e é o que nenhuma agência genérica consegue copiar num parágrafo.
A 01 existe pra fazer esse método acontecer antes de ser explicado.

**A numeração da tabela é a ordem canônica, não o que aparece na tela.** O
número visível é atribuído em sequência entre as seções visíveis, sem buraco.
Hoje, com a 03 oculta, a tela mostra:

`01 / DIAGNÓSTICO` · `02 / MÉTODO` · `03 / SERVIÇOS` · `04 / QUEM FAZ` ·
`05 / PERGUNTAS`

Quando os cases entrarem, Trabalhos assume o `03` e Serviços, Quem faz e
Perguntas andam um pra frente — e o bloco comentado carrega essa instrução
dentro dele. Número faltando, num site que se apresenta como ficha técnica, lê
como defeito; por isso a regra é renumerar, não deixar vago.

## Direção visual v2: as três referências

**O que as três compartilham, medido no CSS — isso é o briefing:**

- **Micro-etiqueta mono em caixa alta** organizando toda seção. As três fazem.
- **Display apertado com tracking −0.02em e line-height 1.** Hermes em
  condensada peso 200 caixa alta; MazyOS e skills.sh em sans apertada.
- **Fio de 1px como único ornamento** — régua no Hermes, borda de osso a 8% no
  MazyOS, `ds-gray-200` no skills.sh.
- **Movimento curto com easing de saída.** MazyOS: `cubic-bezier(.22,1,.36,1)`,
  0.2–0.3s em interação, 0.5–1.1s em entrada.
- **Zero ilustração genérica, zero ícone decorativo, zero gradiente colorido.**

**O que não entra, e por quê:**

- **Cor nenhuma das três.** O Hermes é claro com azul `#0000f2` — azul é
  proibido na v0n. O MazyOS é preto puro `#000`. A paleta segue a da marca:
  carbono e ouro. As três não concordam entre si sobre fundo, então a marca
  decide, e o amarelo do Hermes (`#ffcd42`) ser quase o ouro da v0n
  (`#FFC531`) é o único ponto onde elas já se tocavam.
- **Stack nenhuma das três.** Hermes e skills.sh são Next.js com `motion` e
  GSAP. O MazyOS, que é o do Kauã, é HTML e CSS na mão — e é o que a v0n
  copia. Referência de aparência não é referência de arquitetura.
- **Motivo de terminal ao vivo.** É o traço que as três compartilham
  (`terminal-boot`, `cursor-blink`, `terminal-sweep`) e o Kauã escolheu não
  ter. Fica fora, registrado, disponível pro dia em que ele quiser.

## Forma e superfície

```css
--sup:         rgb(236 237 232 / .03)   /* superfície translúcida */
--borda:       rgb(236 237 232 / .08)   /* borda padrão */
--borda-forte: rgb(236 237 232 / .16)   /* borda em foco, hover, destaque */
--raio:   14px    /* cartão, painel, campo */
--raio-g: 24px    /* bloco grande */
--raio-p: 999px   /* botão em pílula */
```

O grafite `#1B1D23` sobra pro painel que precisa ser opaco (sobreposto a
imagem, por exemplo). A régua de 1px `--linha` continua existindo como
separador de bloco, com o rótulo mono encostado nela.

**Nenhum `clip-path` de chanfro sobrevive no site.** A assinatura geométrica
da marca passa a ser o raio, não o corte.

## Tipografia

| Papel | Família | Peso | Tratamento |
|---|---|---|---|
| Título grande (`.t1`, `.t2`) | **Barlow Condensed** | 200 desktop, 300 em telas < 600px | Caixa alta, tracking −0.02em, line-height 1 |
| Nome de cartão (`.t3`) | Space Grotesk | 700 | Caixa normal, tracking −0.02em |
| Corpo | Space Grotesk | 400 / 500 | 17px, line-height 1.6, máximo 65ch |
| Etiqueta, número, menu | IBM Plex Mono | 500 | Caixa alta, 12–13px, tracking +0.09em |

Barlow Condensed é a escolha porque é a única condensada limpa do Google Fonts
com **peso 200**, o mesmo do `<h1>` do Hermes. Oswald só desce a 200 com
desenho mais pesado; Anton só tem 400, grossa. A Rules Gothic Cnd do Hermes é
licenciada e não entra.

**Peso 300 abaixo de 600px** porque traço de 200 em tela pequena fica frágil e
some no brilho do sol — e o público nº 1 está na rua.

**Neon (`text-shadow`) sai do título.** Halo em traço de peso 200 engorda a
letra em vez de iluminá-la. O neon fica no número mono e no ouro.

## Sistema de movimento

Números medidos no `styles.css` do MazyOS, que é a referência do próprio Kauã:

```css
--saida:  cubic-bezier(.22, 1, .36, 1)   /* o easing de tudo */
--rapido: .2s    /* hover, foco, estado de botão */
--medio:  .3s    /* abrir e fechar */
--entra:  .6s    /* entrada de seção por rolagem */
```

**Três variantes de entrada, e só três:** sobe-e-aparece (padrão), aparece
(para texto longo, que subindo cansa) e abre-por-corte (`clip-path` animado,
para régua e número). Cascata por `--i` no CSS, nunca por `setTimeout`.

**Um `IntersectionObserver` para a página inteira**, que acrescenta a classe
`.visivel` e para de observar o elemento. Não é um observer por seção.

**Orçamento de movimento, e é lei:**

- Só `transform` e `opacity` animam. Nada de `blur`, `filter`, `width`,
  `height`, `top` ou `box-shadow` em animação. (O `clip-path` da variante
  abre-por-corte é a exceção medida: é composto na GPU nas engines atuais.)
- Nenhum `@keyframes` em laço infinito, com exceção do pulso do estado ativo
  do Diagnóstico.
- Sem campo de partícula, sem meteoro, sem orbe, sem 3D. O MazyOS tem porque é
  um produto de assinatura com tempo de tela longo; o site da v0n tem dois
  minutos de paciência no 4G.
- Nada anima antes de estar na tela. Nada anima duas vezes.
- Sem JS, tudo aparece pronto e visível — a entrada é enfeite, nunca condição
  pra ler.
- `@media (prefers-reduced-motion: reduce)` zera animação e transição, e a
  regra já existe no CSS desde a v1.

## O Diagnóstico (seção 01)

Três perguntas de sim/não, em botão e não em campo de texto: fricção zero,
nada pra digitar no celular.

1. Seu negócio aparece no Google quando alguém busca o que você faz?
2. Você tem site?
3. Quem te acha consegue chamar no WhatsApp em um toque?

**As três perguntas são independentes: não há ramificação.** Quem responde
"não tenho site" continua vendo a pergunta 3, porque ela é sobre *quem te
acha* — no Google, no Instagram, na indicação —, não sobre o site. Árvore de
decisão aqui custaria o triplo do código pra economizar um toque do visitante.

**Comportamento:** cada resposta acende uma linha do laudo abaixo, com o número
em mono e o texto na língua do dono do negócio. No fim, o botão ouro leva pro
WhatsApp **com o laudo escrito na mensagem** — por exemplo: *"Oi! Vim pelo
site. Meu caso: não apareço no Google, tenho site mas sem WhatsApp."*

**Quem responde "sim" nas três** não fica sem saída nem ouve que está tudo
bem: o laudo diz que o básico está de pé e que o gargalo, nesse caso, é outro
— e a CTA muda pro que faz sentido ("me chama que eu olho o que está
travando"). Público que já tem tudo funcionando é o que mais paga; mandar ele
embora seria o pior resultado possível dessa seção.

**Sem JS:** as três perguntas aparecem como os três travamentos mais comuns em
lista, e a CTA é a mensagem genérica. Mesma melhoria progressiva do menu.

**Estado só na memória.** Sem `localStorage`, sem cookie, sem servidor, sem
analytics. O laudo existe enquanto a aba está aberta e vai embora com ela —
é diagnóstico, não cadastro, e cadastro pediria aviso de privacidade que o
spec não tem.

**Honestidade do laudo:** nenhuma resposta gera número, percentual ou promessa.
O laudo descreve o que está travando, não quanto vai melhorar.

## O FAQ (seção 06)

Seis perguntas, em `<details>`/`<summary>` nativo: zero JS, teclado e leitor de
tela de graça, e continua funcionando sem CSS. A seta é `::after` em CSS.

Perguntas: prazo · o que você precisa me mandar · quem cuida depois de pronto ·
preciso ter domínio · o que a v0n não faz · como começa.

Sem preço, seguindo a decisão do spec. "O que a v0n não faz" entra de propósito:
dizer não a tempo é o que separa fornecedor de vendedor.

## Identidade aplicada

Fonte da verdade: `MazyOS/identidade/design-guide.md`, **atualizado em
20/09/2026** com as duas leis que mudaram nesta v2 (raio no lugar do chanfro,
terceira família no título).

- **Cores:** carbono `#121317`, grafite `#1B1D23`, linha `#2A2D35`, aço
  `#8C96A3`, osso `#ECEDE8`, ouro `#FFC531`, verde-ok `#3FBF7F`
- **Proporção 70/20/10** — quando o ouro passa de um décimo da tela, vira ruído
- **Azul é proibido**, inclusive o azul de link padrão do navegador
- **Um botão ouro por tela.** A regra é por tela, não por página: a home tem
  **três** botões ouro no total, e eles nunca dividem a mesma dobra.
  1. **Topo** — visível só no desktop; abaixo de 720px ele fica dentro do menu
     fechado, e por isso o ouro dessa faixa passa a ser o do hero
  2. **Diagnóstico** — só existe **depois** que as três respostas entram; antes
     disso é o botão de traço. É o ouro que paga a interação
  3. **Fecho** — o de baixo, separado do Diagnóstico pelo Método, Serviços,
     Quem faz e Perguntas, que é distância mais que suficiente

  CTA intermediária, em qualquer outro lugar, é de traço. Na dúvida, a medição
  manda: print da dobra em 360, 768 e 1440 e conta quantos preenchidos aparecem
- **Traço grosso e raio**, no lugar de "nenhuma curva onde cabe um chanfro"
- **Neon por `text-shadow`** em número e ouro. Título e texto corrido ficam limpos

## Página de case

Molde único, que é o método virado em página:

1. Nome do negócio e o que ele faz, em uma linha
2. **O que travava** — o gargalo na língua do dono, não em jargão
3. **O que eu fiz** — a decisão, não a lista de tecnologia
4. **O resultado** — número quando existir, frase honesta quando não existir
5. Print ou link do site no ar
6. CTA: "seu negócio trava parecido? me chama"

**Sem número inventado.** Case sem métrica diz em palavras o que mudou. Texto
honesto convence mais que "+300%" que ninguém acredita — e é o tom que a
`preferencias.md` manda seguir.

## Card do link no WhatsApp

O primeiro contato do público 1 com o site não é o site — é a miniatura dentro
da conversa. Link sem `og:image`, `og:title` e `og:description` aparece como
texto pelado e parece spam. A imagem de compartilhamento (`img/og.png`,
1200×630, identidade da marca) entra junto com a home, não depois.

## SEO técnico

- `title` e `description` próprios por página
- HTML semântico de verdade: `header`, `main`, `article`, `footer`
- `sitemap.xml` e `robots.txt`
- JSON-LD de `ProfessionalService` com nome, logo, área de atendimento e
  WhatsApp

Mais que isso depende de conteúdo recorrente, e isso é decisão de outro dia.

## Acessibilidade, responsivo e performance

- **Contraste AA conferido**, não presumido. O aço `#8C96A3` sobre carbono já
  foi medido em 6.19:1 na v1 e passou; **o par novo a medir é o osso em Barlow
  Condensed 200**, porque traço fino muda a leitura mesmo com a razão igual
- Foco visível no teclado; `alt` em imagem que informa, vazio em decoração
- O Diagnóstico é operável só por teclado, e o laudo é uma região ao vivo
  (`aria-live="polite"`), senão quem usa leitor de tela responde no escuro
- Desenhado **a partir de 360px**
- Imagem em WebP com largura e altura fixas. A regra vale pra imagem
  rasterizada; SVG da marca fica SVG
- Fonte com `display=swap`; zero biblioteca. **Três famílias é o teto** — o
  link do Google Fonts carrega só os pesos usados, e cada peso novo precisa de
  justificativa no commit
- Meta: abrir em menos de 1s no 4G

## Como verifica

Site estático não tem teste unitário que valha a pena. A verificação é uma
lista curta, rodada antes de publicar:

1. Abre em 360px, 768px e 1440px sem rolagem horizontal
2. Contraste medido nos pares de texto reais, incluindo o título condensado
3. Navegação inteira pelo teclado, com foco visível, incluindo o Diagnóstico
4. Com JS desligado: tudo visível, menu funcionando, Diagnóstico em lista
5. Com `prefers-reduced-motion: reduce`: nada se move, tudo legível
6. Todo link de WhatsApp abre com a mensagem pronta, e a do Diagnóstico
   carrega o laudo
7. Card de compartilhamento renderiza (testado no próprio WhatsApp)
8. Lighthouse: verde em performance e acessibilidade
9. Nenhum link quebrado entre home, cases e sitemap
10. Nenhuma seção anima antes de entrar na tela, e nenhuma anima duas vezes
11. `grep -rn "contato-pendente\|resposta-pendente\|SEU-SITE\|lorem\|em breve" .`
    devolve nada. Enquanto devolver, o site não publica

## Fora de escopo, de propósito

Blog, formulário de contato, analytics, banner de cookie, CMS, tema claro,
página de serviço separada, i18n.

Fora de escopo **por decisão do Kauã nesta v2**, cada um com o motivo:

- **Terminal ao vivo** (bloco que digita sozinho). É o motivo comum às três
  referências e ele escolheu não ter. Entra depois sem refazer nada.
- **Prova com número e depoimento.** Não existe case documentado hoje: a seção
  nasceria mentindo ou vazia. Volta com o material.
- **Conteúdo que muda conforme a origem** (`?de=wpp` mostrando topo diferente).
  Dá pra fazer sem servidor, mas dobra o que precisa ser conferido em cada
  publicação.
- **Esconder enfeite no celular.** Não é necessário: o orçamento de movimento
  acima já é leve o bastante pra rodar em toda tela, o que é melhor que ter
  duas versões pra manter.

"Animação de entrada pesada", que a v1 listava aqui, **saiu do fora-de-escopo**
— é justamente o que a v2 faz, dentro do orçamento acima.

## Pendências assumidas

- **O material dos trabalhos anteriores.** Nome, print ou link de cada um.
  Trava só a seção 03.
- **Número do WhatsApp e email** da v0n, para os links e o JSON-LD. Trava a
  publicação, não a construção. A marca no código é `contato-pendente`.
- **Domínio.** Até existir, a Netlify serve num `*.netlify.app`, e a marca no
  código é `SEU-SITE`.
- **As respostas do FAQ.** Prazo de entrega, como funciona o pagamento e quem
  cuida do site depois de pronto são fatos do negócio do Kauã, não do design —
  ninguém pode inventar. O FAQ é construído com a pergunta escrita e a resposta
  marcada `resposta-pendente`, que entra no mesmo grep de bloqueio da
  publicação que o `contato-pendente`. FAQ com prazo chutado é promessa que a
  v0n não fez.

## O que morre do código da v1

Registrado pra quem executa não ficar em dúvida se deve preservar:

- Todo `clip-path` de chanfro, em qualquer seletor
- A seção `.travas` e o CSS dela — o Diagnóstico ocupa o lugar
- A família do `.t1`/`.t2` (vira Barlow Condensed) e o `text-shadow` deles

**Sobrevive:** o casco, os tokens de cor, o topo com menu de melhoria
progressiva, `.passos`, `.cards`/`.card` (ganham raio), `.rodape`, o bloco
comentado da seção Trabalhos com a instrução dentro, e o `dev.js`.
