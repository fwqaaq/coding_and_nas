const PORT = 8000
const USERNAME = 'admin'
const PASSWORD = '123456'

const conn = Deno.listen({ hostname: '0.0.0.0', port: PORT })
console.log(`Server is running on port ${PORT}`)

const server = Deno.serveHttp(await conn.accept())

for await (const req of server) {
  const url = new URL(req.request.url)
  const pathname = url.pathname

  if (pathname === '/login') {
    const authHeader = req.request.headers.get('authorization')
    // console.log(authHeader)
    if (authHeader && authHeader.startsWith('Basic ')) {
      const encoded = authHeader.slice(6)
      const decoded = atob(encoded)
      const [username, password] = decoded.split(':')
      console.log('xxxxx')
      if (username === USERNAME && password === PASSWORD) {
        req.respondWith(
          new Response(null, {
            status: 302,
            headers: new Headers({
              'Set-Cookie': 'authenticated=true; Path=/',
              Location: '/welcome',
            }),
          })
        )
        continue
      }
    }
    req.respondWith(
      new Response('Invalid authorization', {
        status: 401,
        headers: new Headers({
          'WWW-Authenticate':
            'Basic realm="Please enter your username and password"',
        }),
      })
    )
  } else if (pathname === '/welcome') {
    console.log(req.request.headers.get('cookie'))
    const isAuthorized = req.request.headers
      .get('cookie')
      ?.includes('authenticated=true')

    if (!isAuthorized) {
      req.respondWith(
        new Response('Unauthorized', {
          status: 401,
          headers: new Headers({
            'WWW-Authenticate':
              'Basic realm="Please enter your username and password"',
          }),
        })
      )
      continue
    }

    req.respondWith(
      new Response(
        new TextDecoder('utf-8').decode(await Deno.readFile('welcome.html')),
        {
          status: 200,
          headers: new Headers({
            'Content-Type': 'text/html',
          }),
        }
      )
    )
  } else {
    req.respondWith(
      new Response('Not Found', {
        status: 404,
      })
    )
  }
}

fetch
