const PORT = 8000
const USERNAME = 'admin'
const PASSWORD = '123456'

const checkBasicAuth = (authHeader: string | null) => {
  if (authHeader && authHeader.startsWith('Basic ')) {
    const encoded = authHeader.slice(6)
    const decoded = atob(encoded)
    const [username, password] = decoded.split(':')
    return username === USERNAME && password === PASSWORD
  }
  return false
}

const handler: Deno.ServeHandler = async (req) => {
  const url = new URL(req.url)
  const pathname = url.pathname

  if (pathname === '/login') {
    const authHeader = req.headers.get('authorization')
    if (checkBasicAuth(authHeader)) {
      return new Response(null, {
        status: 302,
        headers: new Headers({
          'Set-Cookie': 'authenticated=true; Path=/',
          Location: '/welcome',
        }),
      })
    }
    return new Response('Invalid authorization', {
      status: 401,
      headers: new Headers({
        'WWW-Authenticate':
          'Basic realm="Please enter your username and password"',
      }),
    })
  } else if (pathname === '/welcome') {
    const isAuthorized = req.headers
      .get('cookie')
      ?.includes('authenticated=true')

    if (!isAuthorized) {
      return new Response(null, {
        status: 302,
        headers: new Headers({
          Location: '/login',
        }),
      })
    }
    const welcomePath = new URL(import.meta.resolve('./welcome.html'))
    return new Response((await Deno.open(welcomePath)).readable, {
      status: 200,
      headers: new Headers({
        'Content-Type': 'text/html',
      }),
    })
  } else {
    return new Response('Not Found', {
      status: 404,
    })
  }
}

Deno.serve({
  onListen({ port = PORT, hostname = 'localhost' }) {
    console.log(`HTTP server listening on http://${hostname}:${port}/`)
  },
  handler,
})
