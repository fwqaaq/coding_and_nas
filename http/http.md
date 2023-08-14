# Http

1. **http/0.9**: 求由单⾏指令构成，以唯⼀可⽤⽅法[GET](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET)，其后跟⽬标资源的路径 （⼀旦连接到服务器，协议、服务器、端⼝号这些都不是必须的）
   - 请求： `GET /mypage.html`
   - 响应也是⼗分简单：

   ```http
   <HTML>
   这是⼀个⾮常简单的 HTML ⻚⾯
   </HTML>
   ```

2. **http/1.0**:
   - 协议版本信息现在会随着每个请求发送（ HTTP/1.0 被追加到了 GET⾏）
   - 状态码会在响应开始时发送，使浏览器能了解请求执⾏成功或失败，并相应调整⾏ 为（如更新或使⽤本地缓存）。
   - 引⼊了 HTTP 标头的概念，⽆论是对于请求还是响应，允许传输元数据，使协议 变得⾮常灵活，更具扩展性。

   // 请求

   ```http
   GET /mypage.html HTTP/1.0
   User-Agent: NCSA\_Mosaic/2.0 (Windows 3.1)
   ```

   // 响应

   ```http
   200 OK
   Date: Tue, 15 Nov 1994 08:12:31 GMT Server: CERN/3.0 libwww/2.17 Content-Type: text/html
   <HTML>
   ⼀个包含图⽚的⻚⾯
   <IMG SRC="/myimage.gif">
   </HTML>
   ```

3. **http/1.1**: 消除了⼤量歧义内容并引⼊了多项改进

   - 连接可以多路复⽤，节省了多次打开 TCP 连接加载⽹⻚⽂档资源的时间。
   - 增加管线化技术，允许在第⼀个应答被完全发送之前就发送第⼆个请求，以降低通 信延迟。
   - ⽀持响应分块。
   - 引⼊额外的缓存控制机制。
   - 引⼊内容协商机制，包括语⾔、编码、类型等，并允许客户端和服务器之间约定以 最合适的内容进⾏交换。
   - 凭借 [Host](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Host) 标头，能够使不同域名配置在同⼀个 IP 地址的服务器上。

   // 请求

   ```http
   GET /en-US/docs/Glossary/Simple\_header HTTP/1.1
   Host: developer.mozilla.org
   User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 
   Firefox/50.0
   Accept: text/html,application/xhtml+xml,application/xml;q=0.9,\*/\*;q=0.8 Accept-Language: en-US,en;q=0.5
   Accept-Encoding: gzip, deflate, br
   Referer: https://developer.mozilla.org/en-US/docs/Glossary/Simple\_header
   ```

   //响应

   ```http
   200 OK
   Connection: Keep-Alive
   Content-Encoding: gzip
   Content-Type: text/html; charset=utf-8
   Date: Wed, 20 Jul 2016 10:55:30 GMT
   Etag: "547fa7e369ef56031dd3bff2ace9fc0832eb251a" Keep-Alive: timeout=5, max=1000
   Last-Modified: Tue, 19 Jul 2016 00:59:33 GMT
   Server: Apache
   Transfer-Encoding: chunked
   Vary: Cookie, Accept-Encoding
   
   (content)
   ```

4. **http2.0**： HTTP/1.1 链接需要请求以正确的顺序发送，理论上可以⽤⼀些并⾏的链接（尤其是 5 到 8 个），带来的成本和复杂性堪忧。⽐如，HTTP 管线化（pipelining）就成为了 Web 开发的负担。
   - HTTP/2 是 **⼆进制协议** ⽽不是⽂本协议。不再可读，也不可⽆障碍的⼿动创建，改 善的优化技术现在可被实施。
   - 这是⼀个多路复⽤协议。并⾏的请求能在同⼀个链接中处理，移除了 HTTP/1.x 中 顺序和阻塞的约束。
   - 压缩了标头。因为标头在⼀系列请求中常常是相似的，其移除了重复和传输重复数 据的成本。
   - 其允许服务器在客户端缓存中填充数据，通过⼀个叫服务器推送的机制来提前请求。

## HTTP **消息**

起始⾏和 HTTP 消息中的 HTTP 标头统称为请求标头，⽽其有效负载（payload）被称为消息主体（body）。

![ ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages/httpmsgstructure2.png)

1. 标头分类：
   1. [通⽤标头](https://developer.mozilla.org/zh-CN/docs/Glossary/General_header)：它可以⽤于请求标头或者响应标头
   2. [请求标头](https://developer.mozilla.org/zh-CN/docs/Glossary/Request_header)：它可在 HTTP 请求中使⽤，并且和请求主体⽆关（如 `Accept-*`、`Authorization` 等）
   3. [响应标头](https://developer.mozilla.org/zh-CN/docs/Glossary/Response_header)：它可以⽤于 HTTP 响应，且与响应消息主体⽆关（如 Age、 Location、 Server 等都是响应标头）
   4. [表示标头](https://developer.mozilla.org/zh-CN/docs/Glossary/Representation_header)：⽤于描述 HTTP 消息主体中发送资源的特定的表示形式，例如其 MIME类型或应⽤的编码/压缩。（如 [Content-Type](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Type)、[Content-Encoding](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Encoding)、[Content-Language](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Language) 和 [Content-Location](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Location)
   5. [内容负荷标头](https://developer.mozilla.org/zh-CN/docs/Glossary/Payload_header)：包含有关有效载荷数据的与表示⽆关的信息，包括内容⻓度和⽤于 传输的编码。（例如：[Content-Length](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Length)、[Content-Range](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Range)、[Trailer](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Trailer)、[Transfer-Encoding](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Transfer-Encoding)
2. 请求标头：⼀般只有 POST 请求才会携带数据

![ ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages/http_request_headers3.png)

1. 响应标头

![ ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages/http_response_headers3.png)

⼀般使⽤ `/r/n` 来分割每⼀⾏，尤其注意标头和主体之间有⼀个空⾏（需要使⽤ `/r/n/r/n`）

## 使用 Deno 写一个 HTTP 服务器

> 使用 Deno 写一个简单的 HTTP 静态服务器

```ts
const conn = Deno.listen({ hostname: '0.0.0.0', port: 80 })
const decoder = new TextDecoder('utf-8')
const httpConn = Deno.serveHttp(await conn.accept())
```

1. 首先监听一个端口，`Deno.listen` 接受一个 `listenOptions` 对象，同时返回一个 `Listener` 对象，该对象继承 `AsyncIterator`
2. `conn.accept` 等待并返回 `Conn`(远程服务器连接对象)
3. `serverHttp` 会等待客户端请求，如果有请求它会返回一个 `HttpConn` 对象，该对象是使用异步生成器包装的 `Request` 请求（`AsyncIterator<Request>`），所以它也继承 `AsyncIterator`

- 注意: `headers: new Headers().set('content-type', contentType)!` 添加请求头时不能这样添加，不会更改 `content-type` 的内容

详细代码请移步到[这里](./example/http.ts)
