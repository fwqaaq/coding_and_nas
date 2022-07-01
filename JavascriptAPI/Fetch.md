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