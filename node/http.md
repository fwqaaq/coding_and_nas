# Http

> 使用 Deno 写一个简单的 HTTP 静态服务器

```ts
const conn = Deno.listen({ hostname: '0.0.0.0', port: 80 })
const decoder = new TextDecoder('utf-8')
const httpConn = Deno.serveHttp(await conn.accept())
```

1. 首先监听一个端口, `Deno.listen` 接受一个 `listenOptions` 对象,同时返回一个 `Listener` 对象,该对象继承 `AsyncIterator`
2. `conn.accept` 等待并返回 `Conn`(远程服务器连接对象)
3. `serverHttp` 会等待客户端请求,如果有请求它会返回一个 `HttpConn` 对象,该对象是使用异步生成器包装的 `Request` 请求(`AsyncIterator<Request>`),所以它也继承 `AsyncIterator`

```ts
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
```

* 注意: `headers: new Headers().set('content-type', contentType)!` 添加请求头时不能这样添加,不会更改 `content-type` 的内容
