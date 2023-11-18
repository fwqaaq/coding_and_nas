# 文件下载

设置文件下载的响应标头（[Content-Disposition](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Disposition)）就可以实现文件下载。

```ts
import { Server } from 'https://deno.land/std@0.198.0/http/server.ts'
const port = 3000
const handler = (req: Request) => {
  const body = `Your user-agent is:\n\n${req.headers.get('user-agent')}`

  const headers = new Headers({
    'Content-Disposition': 'attachment; filename=text',
  })
  if (req.url.endsWith('/file'))
    return new Response(body, { headers, status: 200 })
  else return new Response('Not Found', { status: 404 })
}

const server = new Server({ handler })
const listener = Deno.listen({ port })

console.log(`Listening on http://localhost:${port}/`)

await server.serve(listener)
```

## 分片下载

使用 [Range](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Range) 标头可以告知服务器返回文件的哪一部分，这样就可以对文件进行分片下载。

这是更改之后的 handler 函数：

```ts
const handler = (req: Request) => {
  const body = `Your user-agent is:\n\n${req.headers.get('user-agent')}`

  const headers = new Headers({
    'Content-Disposition': 'attachment; filename=text',
    'Access-Control-Allow-Origin': '*',
    'Accept-Ranges': 'bytes',
  })

  const range = req.headers.get('range')

  if (req.url.endsWith('/file') && range) {
    console.log(range)
    let [start, end] = range
      .replace(/bytes=/, '')
      .split('-')
      .map(Number)

    end = end || bodyLength

    if (start >= 0 && start < end && end <= bodyLength) {
      headers.set('Content-Range', `bytes ${start}-${end}/${bodyLength}`)
      const part = body.slice(Number(start), Number(end))
      return new Response(part, { headers, status: 206 })
    } else {
      return new Response('Range Not Satisfiable', { status: 416 })
    }
  }

  return new Response('Not Found', { status: 404 })
}
```

* [`Range`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Range)：该标头是客户端请求指定的范围
* [`Content-Range`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Range)：该标头用于响应 Range 标头，该片段在整个文件中的位置以及文件的总大小
* [`Accept-Range`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Ranges)：该标头用于表示范围的单位，这里是 `bytes`，如果有该标头，可用于恢复中断下载。

> 注意：Range 也可以实现多段下载，但是这里就不去实现了，如果是多段下载，MIME 类型应该是 `multipart/byteranges`。
>
> ```http
> Range: <unit>=<range-start>-<range-end>, <range-start>-<range-end>, <range-start>-<range-end>
> ```

## 流式读取

如果文件很大，一次性读取可能会导致内存溢出，这时候可以使用流式读取。在 Fetch 中，我们以及使用过 [ReadableStream 默认的流式读取](../JavascriptAPI/Fetch.md#中断请求以及下载进度)，这里的读取的字节是默认的数量。

这里的是修改后的 handler 函数：

```ts
const handler = async (req: Request) => {
  const fileStream = (await Deno.open(url)).readable

  const headers = new Headers({ 'Access-Control-Allow-Origin': '*' })
  if (req.url.endsWith('/file')) {
    return new Response(fileStream, { headers, status: 200 })
  }

  return new Response('Not Found', { status: 404 })
}
```

在前端，主要是如何指定字节的读取数量，这里再次使用了一个异步迭代器，以每 2048 字节开始读取：

```js
async function* IteratorStreams(reader) {
  let { done, value } = await reader.read()
  while (!done) {
    if (done) return
    let count = 0, total = value.length
    while (count < total) {
      yield value.slice(count, count + 2048)
      count += 2048
    }
    ({ done, value } = await reader.read())
  }
}
```

具体实现请看：[server](./example/split_downloaded.ts)、[client](./example/welcome.html)
