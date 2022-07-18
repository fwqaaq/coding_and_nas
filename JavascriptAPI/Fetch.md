# Fetch

>能够执行XHR的所有任务,并且能够在Web工作者线程等现代Web工具中使用,提供拦截,重定向和修改通过fetch()生成的请求接口
>>**fetch() 方法的参数与 Request():(RequestInit) 构造器是一样的**

```ts
declare function fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
```

* `fetch`一定是异步的,天生支持promise,接收两个参数
  1. 第一个参数:`RequestInfo(request对象)|URL`.URL是必须的(例如`https://www.baidu.com`),只传第一个参数,默认是get请求
  2. 第二个参数是<span style="color:red">**RequestInit**可选的</span>,是一个对象
     * `method?: string`:请求方法.默认值`GET`
     * `body?:BodyInit | null`:请求的`body`信息.可能是一个 Blob、BufferSource、FormData、URLSearchParams 或者 USVString 对象(<span style="color:red">GET或者HEAD方法的请求不能包含</span>)
     * `mode?: RequestMode`:请求的模式(是否使用`CORS`).`cors`**允许遵守CORS的跨域请求.(非简单跨域,需要预检)**,`navigate`,`no-cors`**允许不需要发送预检请求的跨域请求.(同源请求或者简单跨域)**,`same-origin`**任何跨域请求都不允许发送**
     * `cache?: RequestCache`:请求的 cache 模式：`default`,`no-store`、`reload` 、`no-cache`、`force-cache`或者 `only-if-cached`
     * `credentials?: RequestCredentials`: 请求的 credentials，如`omit`(不发送cookie)、`same-origin`(同源时发送cookie) 或者 `include`(无论同源还是跨域都发送)
     * `redirect?: RequestRedirect`.可用的 redirect 模式.`error`(如果产生重定向将自动终止并且抛出一个错误),`follow`(自动重定向),`manual`(手动重定向).默认是follow
     * `referrer?: string`:一个`USVString`可以是`no-referrer`、`client`或一个URL.**默认是 client**
     * `referrerPolicy?: ReferrerPolicy`:指定了 HTTP 头部 **referer** 字段的值.可能为以下值之一：`no-referrer`、 `no-referrer-when-downgrade`、`origin`、`origin-when-cross-origin`、`unsafe-url`
     * `integrity?: string`:包括请求的[`subresource integrity`](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)值
     * `keepalive?: boolean`:浏览器是否允许请求存在超出页面生命周期
     * `signal?: AbortSignal | null`:用于支持通过`AbortController`中断进行中的fetch()请求
     * `headers?: HeadersInit`
* 参考:<https://developer.mozilla.org/zh-CN/docs/Web/API/fetch>

## 基本用法

>请求完成时,promise会兑现为一个`Response`对象

```js
//返回一个response对象
fetch("./README.md").then(response => console.log(response))
```

>读取响应:最简单的方式`text()`

```js
fetch("./README.md").then(response => response.text()).then(
  text =>console.log(text)
)
```

>处理状态码和请求失败

* `status`:状态码,例如`200`,`404`等等
* `statusText`:状态文本.例如`OK`,`Not Found`等等

## 常见的请求模式

>* 其中`body`支持的类型是`BodyInit`,`BodyInit`为`ReadableStream`或者`XMLHttpRequestBodyInit`
>* XMLHttpRequestBodyInit支持的类型`Blob`,`BufferSource`,`FormData`,`URLSearchParams`,`string`

1. 发送`json`数据

   ```js
   const paylod = JSON.stringify({foo:"bar"})
   const headers = {"Content-type":"application/json"}
   fetch("/login",{
     method:"POST",
     body:paylod,
     headers
   })
   ```

2. 在请求体中支持任意字符串值,只需要将上述请求头改成如下所示

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

4. 加载`blob`文件

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

5. 跨域,需要包含`CORS`头保证浏览器收到响应
   1. 服务端设置的响应头
      * `Access-Control-Allow-Origin:<origin> | *` 表示允许的来源
      * `Access-Control-Allow-Methods:<method>[, <method>]*` 表示允许的请求方法
      * `Access-Control-Allow-Headers:<header-name>[, <header-name>]*` 表示允许的请求头
      * `Access-Control-Allow-Credentials: true`表示是否允许发送Cookie.如果不包含应该去除,而不是写false
        * 如果是`XMLHttpRequest`,需要将其`withCredentials`标志设置为true;如果是`fetch`,需要设置`credentials:include`,表明无论是同源或者跨域都会发送cookie
        * <span style="color:red">此时`Access-Control-Allow-Origin`不能使用`*`,而应该是当前请求的源</span>
6. 中断请求:`fetch API`可以通过`AbortController/AbortSignal`对请求中断
   * `AbortController.abort()`会中断所有网络请求,适合希望停止传输大型负载的情况

   ```js
   const abortController = new AbortController()
   fetch("ajax.zip",{signal:abortController.signal})
   //10ms后中止
   setTimeout(()=> abortController.abort(),10)
   ```

## Headers对象

> Headers对象是发送请求和入站响应头部的容器.并且都可以通过`Request.prototype.headers`修改属性

* Headers的类型`HeadersInit`(string[][] | Record\<string, string> | Headers),可以是几乎所有的键值对

* Headers和Map极其相似.都有`set()`,`has()`,`delete()`,`get()`,`append()`,`entries()`,`keys()`,`values()`方法

```js
let h = new Headers()

h.set("foo","bar")
console.log(h.has("foo"))//true
```

## Request对象

```js
let r= new Request(url,init)
```

> 与之前的fetch是一模一样的,其中init和`fetch`中的`RequestInit`是一样的.如果init中没有设置的值,会使用默认值
>
> 克隆Request对象:构造函数或者`clone()`

* 使用构造函数第一个请求体会被标记为已使用

```js
let r = new Request("http://www.baidu.com")

//第一种:如果传入init对象值会覆盖源对象中同名的值
let r1 = new Request(r,{method:"POST"})

console.log(r.bodyUsed)//true
console.log(r1.bodyUsed)//fasle
```

* 使用`clone()`不会将任何请求体标记为已使用

```js
let r = new Request("http://www.baidu.com",{method:"POST"})

let r2 = r.clone()

console.log(r.bodyUsed)//false
console.log(r2.bodyUsed)//fasle
```

> 在fetch中使用request对象:与clone()方法一样,fetch()不能用使用过的Request对象来发送请求

```js
let r = new Request("http://www.baidu.com",{method:"POST"})

//第一种情况
r.text()
fetch(r)//TypeError

//第二种情况
fetch(r)
fetch(r)//TypeError
```

* 并且fetch()的`RequestInit`同样可以覆盖Request的对象

```js
let r = new Request("http://www.baidu.com",{method:"POST"})
fetch(r.clone())
fetch(r,{method:"POST",body:"body"})
```

### Request自身的属性和方法

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

### Body

>Request和Response对象都继承了Body对象的属性和方法

* 两个只读属性
   1. `body`: 添加到请求体的内容(实现为`ReadableStream`)
   2. `bodyUsed`: 布尔值.请求体中的内容是否已经被读取
* 读取流的方法,返回的都是`promise`
   1. arrayBuffer(): Promise\<ArrayBuffer>
   2. blob(): Promise\<Blob>;
   3. formData(): Promise\<FormData>;
   4. json(): Promise\<any>;
   5. text(): Promise\<string>;

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

* 使用 streams API 的主要原因是有效载荷的大小可能会导致网络延迟,另一方面是 StreamsAPI本身处理有效载荷方面是有优势的.
* 除了以上的五个方法之外还有一些注意点

1. 一次性流,Body混入是构建在`ReadableStream`之上的,所以主体流只能使用一次

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

2. 使用`ReadableStream`主体,js编程逻辑很多时候都会将访问网络作为原子操作,比如响应式同时创建和发送的,响应数据是以统一的格式一次性暴露出来的.
   * 从TCP/IP的角度,传输的数据是以分块的形式抵达端点的.而且速度受到网速的限制.接收端点会为此分配内存,并将收到的块写入内存.Fetch API通过 ReadableStream 支持这些块到达时就实时读取和操作这些数据
   * `ReadableStream` 接口暴露了 `getReader()` 方法,用于产生`ReadableStreamDefaultReader`,这个 reader 可以在数据到达时异步获取数据块

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

### Response对象

>产生`Response`对象主要方式是调用`fetch()`,他会返回一个promise,这个`Response`对象代表实际HTTP的响应

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
  * url:"https://foo.com"

>如果想象克隆Response对象,可以使用`Request`对象的clone()方法

```js
const res = new Response(...)
res.clone()
```

* 同时`Response`对象也继承`Body`对象,拥有`Body`属性所有的对象和方法

> Response类有两个静态方法`Response.error()`和`Response.redirect()`

* **Response.redirect()**:接收一个url和重定向状态码,返回重定向Response对象
* 提供的状态码必须对应重定向,反则抛出错误

```js
Response.redirect("https://foo.com",301)
```

## 中断请求以及下载进度

>实现下载进度,递归的读取`reader`

* 这里需要使用`ReadableStream.tee()`来拷贝流,这样可以同时使用流获取下载进度和使用流读取数据

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

### 中断 Fetch

>`AbortController`,表示一个控制器对象,允许你根据需要中止一个或者多个对象

* 构造函数,创建一个新的`AbortController`实例

  ```js
  const controller = new AbortController()
  ```

* `abort()`方法:它可以在`DOM`请求完成之前中断它(例如 Fetch).

   ```js
    controller.abort()
    ```

* `signal`:只读属性.返回一个 `AbortSignal` 实例对象,根据需要联系或者中断 DOM 请求

   ```js
   controller.signal
   ```

> `AbortSignal`:接口表示一个信号对象(signal object),它允许您通过 AbortController 对象与 DOM 请求（如 Fetch）进行通信并在需要时将其中止。

* `AbortSignal.aborted`:只读属性,返回一个布尔值,表示与 `DOM` 通讯的信号是(`true`)否(`false`)已被放弃

    ```js
    controller.signal.aborted
    ```

* `AbortSignal.reason`: 一旦信号中断,返回提供中断原因的 `JavaScript` 的值

   ```js
   let res = signal.aborted ? `Request aborted with reason: ${signal.reason}` : 'Request not aborted'
   ```

* **方法**:`AbortSignal.throwIfAborted()`:如果信号已中止,则抛出信号的中止原因;否则它什么也不做.

   ```js
   async function waitForCondition(func, targetValue, { signal } = {}) {
     while (true) {
       signal?.throwIfAborted();
   
       const result = await func();
       if (result === targetValue) {
         return;
       }
     }
   }
   ```

* **静态方法**:`AbortSignal.timeout(time)`:方法返回一个 AbortSignal,它将在指定时间后自动中止

   ```js
   const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
   ```

* 事件:`abort`:当信号被中止时触发

   ```js
   addEventListener('abort', event => { })
   onabort = event => { }
   ```

> 使用以上两个 API 中断请求

```js
const controller = new AbortController()
const { signal } = controller
fetch('/foo', { signal }).then(...)
signal.onabort = () => { ... }
controller.abort()
```

* 使用`ReadableStream.cancel()`中断请求,并且丢弃所有数据

1. 直接使用`ReadableStream.cancel()`取消源流
   * 这时候`cancel`报一个错误.由于`res.text()`读取流时,reader已经锁定到该流,不能取消已经锁定的流
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

2. 使用`ReadableStreamDefaultReader.cancel()`取消源流
   * 这时候`cancel`报一个错误:由于已经使用`res.text()`锁定读取流,同一个流不能继续再加锁
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

3. 只有重新构造一个`ReadableStream`

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
