import { Server } from 'https://deno.land/std@0.198.0/http/server.ts'
const port = 3000

const url = new URL(import.meta.resolve('./cookie.png'))

// const handler = async (req: Request) => {
//   // const body = `Your user-agent is:\n\n${req.headers.get('user-agent')}`
//   const body = await Deno.readFile(url)

//   const headers = new Headers({
//     'Content-Disposition': 'attachment; filename=text',
//     'Access-Control-Allow-Origin': '*',
//     'Accept-Ranges': 'bytes',
//   })

//   const range = req.headers.get('range')
//   const bodyLength = body.length

//   if (req.url.endsWith('/file') && range) {
//     console.log(range)
//     let [start, end] = range
//       .replace(/bytes=/, '')
//       .split('-')
//       .map(Number)

//     end = end || bodyLength

//     if (start >= 0 && start < end && end <= bodyLength) {
//       headers.set('Content-Range', `bytes ${start}-${end}/${bodyLength}`)
//       const part = body.slice(Number(start), Number(end))
//       return new Response(part, { headers, status: 206 })
//     } else {
//       return new Response('Range Not Satisfiable', { status: 416 })
//     }
//   }

//   return new Response('Not Found', { status: 404 })
// }

const handler = async (req: Request) => {
  const fileStream = (await Deno.open(url)).readable

  const headers = new Headers({ 'Access-Control-Allow-Origin': '*' })
  if (req.url.endsWith('/file')) {
    return new Response(fileStream, { headers, status: 200 })
  }

  return new Response('Not Found', { status: 404 })
}

const server = new Server({ handler })
const listener = Deno.listen({ port })

console.log(`Listening on http://localhost:${port}/`)

await server.serve(listener)
