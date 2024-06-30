/** @format */
const cert = Deno.readTextFileSync('./cert.pem')
const key = Deno.readTextFileSync('./private.pem')

// HTTPS server
Deno.serve(
  {
    cert,
    key,
    onListen: ({ port = 8080, hostname = 'localhost' }) => {
      console.log(`Server running on https://${hostname}:${port}/`)
    },
  },
  async (_req) => {
    const welcomePath = new URL(import.meta.resolve('./welcome.html'))
    return new Response((await Deno.open(welcomePath)).readable, {
      headers: { 'Content-Type': 'text/html' },
    })
  }
)
