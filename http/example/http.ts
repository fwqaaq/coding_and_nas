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
    if (ext === 'html' || ext === 'css') res = resBuilder(file, `text/${ext}`)
    else if (ext === 'js') res = resBuilder(file, 'text/javascript')
    else if (ext === 'png' || ext === 'jpg' || ext === 'ico')
      res = resBuilder(file, `image/${ext}`)
    else res = resBuilder(file, '*/*')
    req.respondWith(res!)
  }
}

function resBuilder(data: ReadableStream<Uint8Array>, contentType: string) {
  return new Response(data, {
    headers: new Headers({ 'content-type': contentType }),
  })
}
