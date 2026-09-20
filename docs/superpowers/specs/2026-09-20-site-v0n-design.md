# Site da v0n — design aprovado

> Decidido com o Kauã em 20/09/2026. Este arquivo é a lei do projeto: o que
> entra, o que fica de fora e por quê. Mudou de ideia? Muda aqui primeiro.

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

## Decisões

| Decisão | Escolha | Por quê |
|---|---|---|
| Estrutura | Home única + uma página por case | Mais barata que atende os três públicos, e cresce sem refazer |
| Stack | HTML e CSS na mão, sem framework | Sem build, sem dependência pra atualizar, nada entre salvar e ver |
| Hospedagem | Netlify, direto do git | Push publica. HTTPS de graça, domínio próprio quando existir |
| Conversão | WhatsApp com mensagem pronta | Ordem da `preferencias.md`: ajuda, prova, preço por último |
| Preço | Não aparece | Mesma razão. Valor entra depois da prévia, na conversa |
| Região | Brasil, remoto | Decisão do Kauã |
| Produção visual | Skill `impeccable` | Executa dentro do `design-guide.md`, nunca por cima dele |

## Arquivos

```
v0n-site/
  index.html              a home inteira
  cases/<negocio>.html    uma por trabalho anterior
  css/site.css            tokens da identidade + layout
  img/                    logo.svg, logo-mono.svg, selo.svg, prints, og.png
  robots.txt
  sitemap.xml
```

Sem `node_modules`, sem bundler, sem gerador de site. JavaScript só onde não
tem jeito — menu no celular —, escrito na mão dentro do HTML.

Os SVGs são **copiados** de `MazyOS/identidade/`, não linkados: o site precisa
subir sozinho, sem depender da pasta do MazyOS existir.

**Case novo** = copiar um arquivo de `cases/`, trocar o texto, acrescentar uma
linha na grade da home e uma no `sitemap.xml`. Sem índice, sem registro, sem
passo de build.

## A home, seção por seção

| # | Seção | O que diz | Serve |
|---|---|---|---|
| 1 | Topo | Logo, menu curto, botão ouro no WhatsApp | todos |
| 2 | Hero | "Sites que vendem enquanto você atende" + uma linha do que é + CTA | público 1 |
| 3 | O que trava hoje | Não tem site, ou tem um que ninguém acha e ninguém usa | 1 e 2 |
| 4 | Como eu trabalho | Acho o gargalo → faço e te mostro funcionando → só então falo de valor | todos |
| 5 | Trabalhos | Grade de cases, cada um abre a página própria | 1 e 3 |
| 6 | Serviços | Sites e landing pages, Google Meu Negócio, automação com IA. Sem preço | 2 |
| 7 | Quem faz | Uma pessoa, do design ao código, remoto pro Brasil | todos |
| 8 | Fecho | CTA no WhatsApp + assinatura `— v0n · sites e landing pages` | todos |

A seção 4 é o coração da página: o método é o diferencial registrado na
`empresa.md` e é o que nenhuma agência genérica consegue copiar num parágrafo.

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

## Identidade aplicada

Fonte da verdade: `MazyOS/identidade/design-guide.md`. O que o site herda:

- **Cores:** carbono `#121317`, grafite `#1B1D23`, linha `#2A2D35`, aço
  `#8C96A3`, osso `#ECEDE8`, ouro `#FFC531`, verde-ok `#3FBF7F`
- **Proporção 70/20/10** — quando o ouro passa de um décimo da tela, vira ruído
- **Azul é proibido**
- **Tipografia:** Space Grotesk em título e corpo, IBM Plex Mono em etiqueta,
  número e menu
- **Neon por `text-shadow`** em título e número. Texto corrido fica limpo
- **Traço grosso, cortes de 45°, nenhuma curva onde cabe um chanfro**

**Um botão ouro por tela:** o do topo e o do fecho nunca aparecem juntos na
mesma rolagem. CTA intermediária é de traço, não preenchida.

## Direção visual: estilo do Hermes, cor da v0n

> Acrescentado em 20/09/2026, durante a execução, a pedido do Kauã:
> referência https://hermes-agent.nousresearch.com — *"eu quero o estilo, a
> cor podemos colocar da minha marca mesmo"*.

O que o Hermes é, medido no CSS dele: fundo claro (`#fdfdfd`, `#f5f5f5`),
azul elétrico `#0000f2` como assinatura, amarelo `#ffcd42`, e tipografia
mono/comprimida licenciada (`Aeonik Fono Pro`, `Rules Gothic Compressed`,
`Hermes Legacy Mono`).

**Nada disso entra em cor.** A paleta segue sendo a da v0n — carbono e ouro,
azul proibido. O amarelo deles (`#ffcd42`) é quase o ouro da marca
(`#FFC531`), e essa coincidência é o único ponto onde as duas já se tocavam.

**O que entra é o vocabulário estrutural:**

- **Mono em toda etiqueta**, caixa alta, tracking +9%: nome de seção, número,
  prazo, categoria, estado. IBM Plex Mono faz o papel do mono do Hermes.
- **Seção numerada e nomeada** — `01 / O QUE TRAVA`, `02 / MÉTODO` — como
  ficha técnica, não como menu de marketing.
- **Régua fina de 1px** (`--linha`) separando blocos, com o rótulo encostado
  nela. A régua é o ornamento; não existe outro.
- **Painel de moldura dura**, canto chanfrado a 45°, sem sombra e sem
  gradiente.
- **Bloco denso tipo ficha**: pares rótulo → valor em mono, alinhados em
  grade, no lugar de parágrafo quando a informação for enumerável.
- **Título grande com tracking negativo**, caixa alta seletiva, muito respiro
  em volta. O contraste de escala é o que impressiona, não o efeito.
- **Zero ilustração genérica, zero ícone decorativo, zero gradiente.**

**Tipografia permanece em duas famílias** — Space Grotesk e IBM Plex Mono. O
Hermes usa display comprimido licenciado; imitar isso exigiria uma terceira
família, e a revisão de 20/09 do design-guide cortou a terceira de propósito.
O papel do display comprimido é feito por Space Grotesk 700 em escala grande
com tracking negativo.

## Card do link no WhatsApp

O primeiro contato do público 1 com o site não é o site — é a miniatura dentro
da conversa. Link sem `og:image`, `og:title` e `og:description` aparece como
texto pelado e parece spam. A imagem de compartilhamento (`img/og.png`,
1200×630, identidade da marca) entra junto com a home, não depois.

## SEO técnico

O que dá pra fazer sem publicar conteúdo toda semana:

- `title` e `description` próprios por página
- HTML semântico de verdade: `header`, `main`, `article`, `footer`
- `sitemap.xml` e `robots.txt`
- JSON-LD de `ProfessionalService` com nome, logo, área de atendimento e
  WhatsApp — dez linhas que dizem ao Google quem é a v0n

Mais que isso depende de conteúdo recorrente, e isso é decisão de outro dia.

## Acessibilidade, responsivo e performance

- **Contraste AA conferido**, não presumido. O par a medir é aço `#8C96A3`
  sobre carbono — se reprovar em texto pequeno, o aço sobe de tom no site
  (o guia continua valendo para peça gráfica)
- Foco visível no teclado; `alt` em imagem que informa, vazio em decoração
- Desenhado **a partir de 360px** — a maioria dos leads abre no celular,
  dentro do WhatsApp
- Imagem em WebP com largura e altura fixas, pra página não pular ao carregar
- Fonte com `display=swap`; zero biblioteca
- Meta: abrir em menos de 1s no 4G

## Como verifica

Site estático não tem teste unitário que valha a pena. A verificação é uma
lista curta, rodada antes de publicar:

1. Abre em 360px, 768px e 1440px sem rolagem horizontal
2. Contraste medido nos pares de texto reais
3. Navegação inteira pelo teclado, com foco visível
4. Todo link de WhatsApp abre com a mensagem pronta
5. Card de compartilhamento renderiza (testado no próprio WhatsApp)
6. Lighthouse: verde em performance e acessibilidade
7. Nenhum link quebrado entre home, cases e sitemap

## Fora de escopo, de propósito

Blog, formulário de contato, analytics, banner de cookie, CMS, tema claro,
página de serviço separada, animação de entrada pesada, i18n.

Nada disso tem uso previsto hoje. Qualquer um entra depois sem refazer o
resto — a página de serviço, inclusive, é o primeiro candidato quando houver o
que dizer além do óbvio.

## Pendências assumidas

- **O material dos trabalhos anteriores.** Nome, print ou link de cada um. A
  home e o molde de case são construídos sem ele; a grade de trabalhos fica com
  o lugar reservado até o material chegar. É a única coisa que trava, e trava
  só essa seção.
- **Número do WhatsApp e email** da v0n, para os links e o JSON-LD.
- **Domínio.** Até existir, a Netlify serve num endereço `*.netlify.app`.
