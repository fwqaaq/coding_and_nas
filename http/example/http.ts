/** @format */

const conn = Deno.listen({ hostname: '0.0.0.0', port: 80 })
const decoder = new TextDecoder('utf-8')
const httpConn = Deno.serveHttp(await conn.accept())
for await (const req of httpConn) {
  const url = new URL(req.request.url)
  if (url.pathname === '/favicon.ico') continue
  const path = url.pathname === '/' ? '/index.html' : url.pathname
  const ext = path.split('.').pop()
  console.log(ext)
  const file = await Deno.readFile(`.${path}`)
  let res: Response | null = null
  switch (ext) {
    case 'html':
      res = resBuilder(file, 'text/html')
      break
    case 'css':
      res = resBuilder(file, 'text/css')
      break
    case 'js':
      res = resBuilder(file, 'text/javascript')
      break
    case 'png':
      res = resBuilder(file, 'image/png')
      break
    case 'jpg':
      res = resBuilder(file, 'image/jpg')
      break
    case 'ico':
      res = resBuilder(file, 'image/ico')
      break
  }
  req.respondWith(res!)
}

function resBuilder(data: Uint8Array, contentType: string) {
  return new Response(decoder.decode(data), {
    headers: new Headers({ 'content-type': contentType }),
    // headers: new Headers().set('content-type', contentType)!,
  })
}
