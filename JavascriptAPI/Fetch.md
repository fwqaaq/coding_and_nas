# Fetch

>能够执行 XHR 的所有任务，并且能够在 Web 工作者线程等现代 Web 工具中使用，提供拦截，重定向和修改通过 fetch() 生成的请求接口
>>**fetch() 方法的参数与 Request():(RequestInit) 构造器是一样的**

```ts
declare function fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
```

* `fetch`一定是异步的，天生支持 promise，接收两个参数
  1. 第一个参数：`RequestInfo(request对象)|URL`。URL 是必须的（例如`https://www.baidu.com`），只传第一个参数，默认是 get 请求
  2. 第二个参数是 <span style="color:red">**RequestInit** 可选的</span>,是一个对象
     * `method?: string`：请求方法。默认值 `GET`
     * `body?:BodyInit | null`：请求的`body`信息。可能是一个 Blob、BufferSource、FormData、URLSearchParams 或者 USVString 对象（<span style="color:red">GET 或者 HEAD 方法的请求不能包含</span>）
     * `mode?: RequestMode`:请求的模式（是否使用 `CORS`）。`cors` **允许遵守 CORS 的跨源请求**（非简单跨源，需要预检）。`navigate`、`no-cors`（允许不需要发送预检请求的跨源请求，同源请求或者简单跨源）、`same-origin`（**任何跨源请求都不允许发送**）
     * `cache?: RequestCache`:请求的 cache 模式：`default`,`no-store`、`reload`、`no-cache`、`force-cache` 或者 `only-if-cached`
     * `credentials?: RequestCredentials`：请求的 credentials，如 `omit`（不发送 cookie）、`same-origin`（同源时发送 cookie）或者 `include`（无论同源还是跨源都发送）
     * `redirect?: RequestRedirect`。可用的 redirect 模式。`error`（如果产生重定向将自动终止并且抛出一个错误）,`follow`（自动重定向，**默认值**）,`manual`（手动重定向：fetch 不会跟随跳转，但是 `resposne.url` 会指向新的 url，`resposne.redirected` 属性会变为 `true`）
     * `referrer?: string`：一个`USVString`可以是 `no-referrer`、`client`（默认值）或一个URL。
     * `referrerPolicy?: ReferrerPolicy`:指定了 HTTP 标头 **referer** 字段值的规则。
     * `integrity?: string`：请求的哈希值，用于检查 HTTP 响应传回的数据是否为这个预先设定的哈希值，[`subresource integrity`](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)。
     * `keepalive?: boolean`：浏览器是否允许请求存在超出页面生命周期
     * `signal?: AbortSignal | null`：用于支持通过 `AbortController` 中断进行中的 fetch() 请求
     * `headers?: HeadersInit`
* 参考：<https://developer.mozilla.org/zh-CN/docs/Web/API/fetch>

* 注意：<span>如果，在浏览器网页中向其他源发起请求，那么必定不是同源，需要使用  `mode: "no-cors"`</span>。`cors` 参数是表示后台必须**支持跨源**，而 no-cors 一般用于**简单请求**（图片等静态资源），但是响应会表明你的数据是 `opaque`，没有访问权限。
* `cache`：
  * `default` 表示hi现在缓存中寻找匹配；
  * `no-store` 直接请求远程服务器，并且不更新缓存；
  * `reload` 直接请求远程服务器，并且更新缓存；
  * `no-cache` 将服务器资源和本地缓存进行比较，有新的版本才会使用服务器资源；
  * `force-cache` 缓存优先，在不存在缓存的情况下才会请求远程服务器；
  * `only-if-cached` 只检查缓存，如果缓存中没有，则返回 504。
* `referrerPolicy`
  * `no-referrer-when-downgrade`：默认值，总是发送 `Referer` 标头，除非从 HTTPS 页面请求 HTTP 资源时不发送。
  * `no-referrer`：不发送 Referer 标头。
  * `origin`：Referer标头只包含域名，不包含完整的路径。
  * `origin-when-cross-origin`：同源请求 Referer 标头包含完整的路径，跨源请求只包含域名。
  * `same-origin`：跨源请求不发送 Referer，同源请求发送。
  * `strict-origin`：Referer 标头只包含域名，HTTPS 页面请求 HTTP 资源时不发送Referer标头。
  * `strict-origin-when-cross-origin`：同源请求时Referer标头包含完整路径，跨源请求时只包含域名，HTTPS 页面请求 HTTP 资源时不发送该标头。
  * `unsafe-url`：不管什么情况，总是发送 Referer 标头

## 基本用法

>请求完成时，promise 会兑现为一个 `Response` 对象

```js
//返回一个response对象
fetch("./README.md").then(response => console.log(response))
```

>读取响应：最简单的方式 `text()`

```js
fetch("./README.md").then(response => response.text()).then(
  text =>console.log(text)
)
```

>处理状态码和请求失败

* `status`：状态码，例如 `200`、`404` 等等
* `statusText`：状态文本。例如 `OK`、`Not Found` 等等

## 常见的请求模式

>* 其中 `body`支 持的类型是 `BodyInit`、`BodyInit` 为 `ReadableStream` 或者 `XMLHttpRequestBodyInit`
>* XMLHttpRequestBodyInit 支持的类型`Blob`、`BufferSource`、`FormData`、`URLSearchParams`、`string`

1. 发送 `json` 数据

   ```js
   const paylod = JSON.stringify({foo:"bar"})
   const headers = {"Content-type":"application/json"}
   fetch("/login",{
     method:"POST",
     body:paylod,
     headers
   })
   ```

2. 在请求体中支持任意字符串值，只需要将上述请求头改成如下所示

   ```js
   const headers = {
     "Content-type":"application/x-www-form-urlencoded;charset=UTF-8"
   }
   ```

3. 发送文件

   ```js
   const imageFormData = new FormData()
   const imageInput = document.querySelector("input[type='file']")
   imageFormDate.append("image",imageInput.files[0])
   fetch("/imgFile",{
     method: "POST",
     body: imageFormData
   })
   ```

4. 加载 `blob` 文件

   ```js
   fetch("./0.jpg").then(response => response.blob()).then(
      blob => {
        const src = URL.createObjectURL(blob)
        const img = new Image()
        img.src = src
        document.body.appendChild(img)
      }
    )
   ```

5. 跨源，需要包含 `CORS` 头保证浏览器收到响应
   1. 服务端设置的响应头
      * `Access-Control-Allow-Origin:<origin> | *` 表示允许的来源
      * `Access-Control-Allow-Methods:<method>[, <method>]*` 表示允许的请求方法
      * `Access-Control-Allow-Headers:<header-name>[, <header-name>]*` 表示允许的请求头
      * `Access-Control-Allow-Credentials: true` 表示是否允许发送 Cookie。如果不包含应该去除，而不是写 false
        * 如果是`XMLHttpRequest`，需要将其 `withCredentials` 标志设置为 true；如果是 `fetch`，需要设置 `credentials:include`，表明无论是同源或者跨源都会发送 cookie
        * <span style="color:red">此时`Access-Control-Allow-Origin` 不能使用 `*`，而应该是当前请求的源</span>
6. 中断请求:`fetch API` 可以通过 `AbortController/AbortSignal` 对请求中断
   * `AbortController.abort()` 会中断所有网络请求，适合希望停止传输大型负载的情况

   ```js
   const abortController = new AbortController()
   fetch("ajax.zip",{signal:abortController.signal})
   //10ms后中止
   setTimeout(()=> abortController.abort(),10)
   ```

## [Headers 对象](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)

> Headers 对象是发送请求和入站响应头部的容器。并且都可以通过 `Request.prototype.headers` 修改属性

* Headers 的类型 `HeadersInit`(string[][] | Record\<string, string> | Headers)，可以是几乎所有的键值对

* Headers 和 Map 极其相似。都有 `set()`、`has()`、`delete()`、`get()`、`append()`、`entries()`、`keys()`、`values()` 方法

```js
let h = new Headers()

h.set("foo","bar")
console.log(h.has("foo"))//true
```

## Request 对象

```js
let r= new Request(url,init)
```

> 与之前的 fetch 是一模一样的，其中 init 和 `fetch` 中的 `RequestInit` 是一样的。如果 init 中没有设置的值，会使用默认值
>
> 克隆 Request 对象：构造函数或者 `clone()`

* 使用构造函数第一个请求体会被标记为已使用

```js
let r = new Request("http://www.baidu.com")

//第一种:如果传入init对象值会覆盖源对象中同名的值
let r1 = new Request(r,{method:"POST"})

console.log(r.bodyUsed)//true
console.log(r1.bodyUsed)//fasle
```

* 使用 `clone()` 不会将任何请求体标记为已使用

```js
let r = new Request("http://www.baidu.com",{method:"POST"})

let r2 = r.clone()

console.log(r.bodyUsed)//false
console.log(r2.bodyUsed)//fasle
```

> 在 fetch 中使用 request 对象：与 clone() 方法一样，fetch() 不能用使用过的 Request 对象来发送请求

```js
let r = new Request("http://www.baidu.com",{method:"POST"})

//第一种情况
r.text()
fetch(r)//TypeError

//第二种情况
fetch(r)
fetch(r)//TypeError
```

* 并且 fetch() 的 `RequestInit` 同样可以覆盖 Request 的对象

```js
let r = new Request("http://www.baidu.com",{method:"POST"})
fetch(r.clone())
fetch(r,{method:"POST",body:"body"})
```

### Request 自身的属性和方法

>Request原型上的属性和方法(Request.prototype)

| (只读属性)或者方法               | 描述                               |
| -------------------------------- | ---------------------------------- |
| cache: RequestCache              | RequestInit                        |
| credentials: RequestCredentials; | RequestInit                        |
| headers: Headers;                | RequestInit                        |
| integrity: string;               | RequestInit                        |
| keepalive: boolean;              | RequestInit                        |
| method: string;                  | RequestInit                        |
| mode: RequestMode;               | RequestInit                        |
| redirect: RequestRedirect;       | RequestInit                        |
| referrer: string;                | RequestInit                        |
| referrerPolicy: ReferrerPolicy;  | RequestInit                        |
| signal: AbortSignal;             | RequestInit                        |
| url: string;                     | 路径                               |
| destination: RequestDestination; | 返回一个描述被请求内容类型的字符串 |
| clone(): Request;                | 深拷贝request                      |

## Body

>Request 和 Response 对象都继承了 Body对象的属性和方法

* 两个只读属性
   1. `body`：添加到请求体的内容（实现为 `ReadableStream`）
   2. `bodyUsed`：布尔值。请求体中的内容是否已经被读取
* 读取流的方法，返回的都是 `promise`
   1. arrayBuffer()：Promise\<ArrayBuffer>
   2. blob()：Promise\<Blob>;
   3. formData()：Promise\<FormData>;
   4. json()：Promise\<any>;
   5. text()：Promise\<string>;

```js
const obj = {hello: 'world'};
const request = new Request('/myEndpoint', {
  method: 'POST',
  body: JSON.stringify(obj)
});
request.json().then(function(data) {
  // do something with the data sent in the request
});
```

* 使用 streams API 的主要原因是有效载荷的大小可能会导致网络延迟，另一方面是 StreamsAPI 本身处理有效载荷方面是有优势的。
* 除了以上的五个方法之外还有一些注意点

1. 一次性流，Body 混入是构建在 `ReadableStream` 之上的，所以主体流只能使用一次

   ```js
   fetch("https://foo.com").then(
     response=>{
       response.blob()//第一次调用会加锁
       response.blob()//第二次再调用会出错
       //可以使用bodyUsed测试是否加锁
       console.log(response.bodyUsed)//true
     }
   )
   ```

2. 使用 `ReadableStream` 主体，js 编程逻辑很多时候都会将访问网络作为原子操作，比如响应式同时创建和发送的，响应数据是以统一的格式一次性暴露出来的。
   * 从TCP/IP的角度，传输的数据是以分块的形式抵达端点的。而且速度受到网速的限制。接收端点会为此分配内存，并将收到的块写入内存。Fetch API 通过 ReadableStream 支持这些块到达时就实时读取和操作这些数据
   * `ReadableStream` 接口暴露了 `getReader()` 方法，用于产生 `ReadableStreamDefaultReader`，这个 reader 可以在数据到达时异步获取数据块

   ```js
   fetch("https://fetch.spec.whatwg.org").then(
     res=>res.body
   ).then(
     async function(body){
       let reader = body.getReader()
       while (true) {
         let {value,done} = await reader.read()
         if (done) break
         console.log(value)
       }
     }
   )
   ```

## Response 对象

>产生 `Response` 对象主要方式是调用 `fetch()`，他会返回一个 promise，这个 `Response` 对象代表实际 HTTP 的响应

```js
fetch('https://foo.com').then(
  response=>{
    console.log(response)
  }
)
```

* 初始化`Response`对象
  * body:(...)
  * bodyUsed:false
  * headers:Headers {}
  * ok:true
  * redirected:false
  * status:200
  * statusText:"OK"
  * type:"basic"
  * url:"`https://foo.com`"

> `type` 是一种响应的类型。它可能是以下某种值：

* `basic`: 标准值，同源响应，暴露出了“Set-Cookie”之外的所有标头。
* `cors`：从有效的跨源请求接收到响应。[某些标头和主体](https://fetch.spec.whatwg.org/#concept-filtered-response-cors)可以被访问。
* `error`：网络错误。响应的状态为 0，标头为空且不可变。这是从 `Response.error()` 中获得的响应的类型。
  * error 不会暴露给脚本，它会直接被 Promise 给拒绝
* `opaque`：对跨源资源的“no-cors”请求的响应。[严格限制](https://fetch.spec.whatwg.org/#concept-filtered-response-opaque)。
* `opaqueredirect`：fetch 请求是通过 `redirect: "manual"` 发出的。响应的状态是 0，标头是空的，主体是 null，trailer 是空的。

### 构造函数

```js
new Response()
new Response(body)
new Response(body, options)
```

* 其中 body 为响应体，它可以是 `string`、`URLSearchParams`、`Blob`、`ArrayBuffer`、`TypedArray`、`DataView`、`FormData`、`ReadableStream` 其中任意一个
* options 是一个对象：它包含 `status`（状态，例如 200）、`statusText`（状态文本，例如 ok）、`headers`（头部信息）

>如果想要克隆 Response 对象，可以使用 `Request` 对象的 clone() 方法

```js
const res = new Response(...)
res.clone()
```

* 同时 `Response` 对象也继承 `Body` 对象，拥有 `Body` 属性所有的对象和方法

> Response 类有两个静态方法 `Response.error()` 和 `Response.redirect()`

* **Response.redirect()**：接收一个 url 和重定向状态码，返回重定向 Response 对象
* 提供的状态码必须对应重定向，反则抛出错误

```js
Response.redirect("https://foo.com",301)
```

## 中断请求以及下载进度

>实现下载进度，递归的读取 `reader`

* 这里需要使用 `ReadableStream.tee()` 来拷贝流，这样可以同时使用流获取下载进度和使用流读取数据

```js
const progress = (res) => {
  const total = res.headers.get("content-length")
  let count = 0
  const [progressStream, dataStream] = res.body.tee()
  const reader = progressStream.getReader()
  const log = (reader) => {
    reader.read().then(({ value, done }) => {
      if (done) return console.log("done")
      count += value.length
      console.log(`Downloaded ${count} of ${total} (${(count / total * 100).toFixed(2)}%)`)
      return log(reader)
    })
  }
  log(reader)
  return new Response(dataStream, { headers: res.headers })
}
fetch("README.md").then(
  progress
).then(
  res => res.text()
).then(
  data => console.log(data)
)
```

* 同时我们也可以自己构造一个 readableStream 去读取流

```js
fetch('test.md')
  .then((res) => {
    const total = res.headers.get("content-length")
    let count = 0
    const reader = res.body.getReader();
    return new ReadableStream({
      start(controller) {
        return pump();
        function pump() {
          return reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            console.log(queue.size(value))
            controller.enqueue(value);
            console.log(`Download ${count += value.length} of ${total} ${(count / total * 100).toFixed(2)}%`)
            return pump();
          }, queue);
        }
      }
    })
  });
const queue = new ByteLengthQueuingStrategy({
  highWaterMark: 1
})
```

### 中断 Fetch

* 使用 `ReadableStream.cancel()` 中断请求，并且丢弃所有数据

1. 直接使用 `ReadableStream.cancel()` 取消源流
   * 这时候 `cancel` 报一个错误。由于 `res.text()` 读取流时，reader 已经锁定到该流，不能取消已经锁定的流
   * <span style="color:red">Failed to execute 'cancel' on 'ReadableStream': Cannot cancel a locked stream</span>

   ```js
   let aborter = null;
   const abortHandler = (res) => {
    // `res.body`不能再次获取流
     aborter = () => res.body.cancel();
     return res;
   };
   fetch("README.txt").then(abortHandler).then(res => {
     res.text()
     aborter()
   }).then(data => console.log(data)).catch(err => console.log(err))
   ```

2. 使用 `ReadableStreamDefaultReader.cancel()` 取消源流
   * 这时候 `cancel` 报一个错误：由于已经使用 `res.text()` 锁定读取流，同一个流不能继续再加锁
   * <span style="color:red">Failed to execute 'getReader' on 'ReadableStream': ReadableStreamDefaultReader constructor can only accept readable streams that are not yet locked to a reader</span>
  
   ```js
   let aborter = null;
   const abortHandler = (res) => {
    // `res.body.getReader()`不能再次获取 reader 读取器
     aborter = () => res.body.getReader().cancel();
     return res;
   };
   fetch("README.txt").then(abortHandler).then(res => {
     res.text()
     aborter()
   }).then(data => console.log(data)).catch(err => console.log(err))
   ```

3. 只有重新构造一个 `ReadableStream`

   ```js
   let aborter = null;
   const abortHandler = (res) => {
     const reader = res.body.getReader()
     const stream = new ReadableStream({
       start(controller) {
         let aborted = false
         const push = () => {
           reader.read().then(({ value, done }) => {
             if (done) {
               if (!aborted) controller.close()
               return
             }
             controller.enqueue(value)
             push()
           })
         }
         aborter = () => {
           aborted = true
           reader.cancel()
           controller.error(new Error("中止 aborted"))
         }
         push()
       }
     })
     return new Response(stream, { headers: res.headers })
   };
   fetch("README.txt").then(abortHandler).then(res => {
     res.text()
     aborter()
   }).then(data => console.log(data)).catch(err => console.log(err))
   ```

## [FetchEvent](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent)

>此事件类型为 `fetch`,并且只在 [service worker 全局作用域](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope)中。构造函数的形式一般不常用。

### FetchEvent Properties

* 比较重要的属性是 `request`,此属性是一个 `Request` 对象,并且该属性不能为空,如果是构造函数,需要初始化它的参数对象。

### FetchEvent Methods

>respondWith(Response|Promise(Response))：此方法会阻止浏览器的默认响应，而由自己提供

参考:<https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith>

>waitUntil(promise)：该方法会通知浏览器传入的 promise 任务一直在进行中，仍然没有完成

参考:<https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil>

### Http

> 使用 Deno 写一个简单的 HTTP 静态服务器（浏览器原生提供的，依附于 FetchEvent）

```ts
const conn = Deno.listen({ hostname: '0.0.0.0', port: 80 })
const decoder = new TextDecoder('utf-8')
const httpConn = Deno.serveHttp(await conn.accept())
```

1. 首先监听一个端口，`Deno.listen` 接受一个 `listenOptions` 对象，同时返回一个 `Listener` 对象，该对象继承 `AsyncIterator`
2. `conn.accept` 等待并返回 `Conn`（远程服务器连接对象）
3. `serverHttp` 会等待客户端请求，如果有请求它会返回一个 `HttpConn` 对象，该对象是使用异步生成器包装的 `Request` 请求（`AsyncIterator<Request>`），所以它也继承 `AsyncIterator`

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

* 注意：`headers: new Headers().set('content-type', contentType)!` 添加请求头时不能这样添加，不会更改 `content-type` 的内容
