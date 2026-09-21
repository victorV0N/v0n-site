// Servidor de desenvolvimento: serve esta pasta e recarrega o navegador
// sozinho quando um arquivo muda. NÃO faz parte do site — o que vai pro ar
// continua sendo só HTML, CSS e imagem. Rodar com: node dev.js
//
// O <script> de recarga é injetado na resposta, nunca no arquivo em disco.
const { createServer } = require('node:http')
const { readFile } = require('node:fs/promises')
const { watch } = require('node:fs')
const { extname, join, normalize } = require('node:path')

const PORTA = 4173
const TIPOS = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.json': 'application/json',
  '.txt': 'text/plain', '.xml': 'application/xml'
}
const RECARGA = "<script>new EventSource('/__recarga').onmessage=()=>location.reload()</script>"

const abas = new Set()

createServer(async (req, res) => {
  const rota = decodeURIComponent(req.url.split('?')[0])

  if (rota === '/__recarga') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' })
    res.write(': ligado\n\n')
    abas.add(res)
    req.on('close', () => abas.delete(res))
    return
  }

  // normalize + corte de ".." impede pedir arquivo de fora da pasta.
  const seguro = normalize(rota).replace(/^([/\\]|\.\.[/\\])+/, '')
  const arquivo = join(__dirname, rota.endsWith('/') ? join(seguro, 'index.html') : seguro)

  try {
    const tipo = TIPOS[extname(arquivo)] || 'application/octet-stream'
    let corpo = await readFile(arquivo)
    if (tipo === 'text/html') corpo = corpo.toString().replace('</body>', RECARGA + '</body>')
    res.writeHead(200, { 'Content-Type': tipo, 'Cache-Control': 'no-store' })
    res.end(corpo)
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('não achei: ' + rota)
  }
}).listen(PORTA, () => console.log('http://localhost:' + PORTA))

let atraso = null
watch(__dirname, { recursive: true }, (_evento, nome) => {
  // fs.watch dispara várias vezes pro mesmo save; o atraso junta tudo.
  if (!nome || nome.startsWith('.git') || nome.startsWith('.superpowers')) return
  clearTimeout(atraso)
  atraso = setTimeout(() => { for (const aba of abas) aba.write('data: recarrega\n\n') }, 120)
})
