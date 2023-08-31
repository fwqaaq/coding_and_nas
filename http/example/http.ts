/** @format */
const cert = Deno.readTextFileSync('./cert.pem')
const key = Deno.readTextFileSync('./private.pem')

const listener = Deno.listenTls({
  cert,
  key,
  hostname: 'localhost',
  port: 8080,
})

console.log('Server running on https://localhost:8080/')

for await (const conn of listener) {
  handleConn(conn)
}

async function handleConn(conn: Deno.TlsConn) {
  const httpConn = Deno.serveHttp(conn)

  for await (const req of httpConn) {
    const url = new URL(req.request.url)
    if (url.pathname === '/favicon.ico') continue
    const path = url.pathname === '/' ? '/welcome.html' : url.pathname
    const ext = path.split('.').pop()

    const file = (await Deno.open(`./http/example${path}`)).readable
    let res: Response | null = null
    switch (ext) {
      case 'html' || 'css':
        res = resBuilder(file, `text/${ext}`)
        break
      case 'js':
        res = resBuilder(file, 'text/javascript')
        break
      case 'png' || 'jpg' || 'ico':
        res = resBuilder(file, `image/${ext}`)
        break
      default:
        res = resBuilder(file, '*/*')
    }
    req.respondWith(res!)
  }
}

function resBuilder(data: ReadableStream<Uint8Array>, contentType: string) {
  return new Response(data, {
    headers: new Headers({ 'content-type': contentType }),
  })
}
