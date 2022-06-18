# Fetch

>能够执行XHR的所有任务,并且能够在Web工作者线程等现代Web工具中使用,提供拦截,重定向和修改通过fetch()生成的请求接口
>>**fetch() 方法的参数与 Request() 构造器是一样的**

* `fetch`一定是异步的,天生支持promise,接收两个参数
  1. 第一个参数:源.是必须的(例如`https://www.baidu.com`),只传第一个参数,默认是get请求
  2. 第二个参数是<span style="color:red">可选的</span>,是一个对象

```js
fetch("https://www.zhihu.com/roundtable/2021year",{method:'GET',mode:'no-cors'}).then(
  response =>console.log(response)
)
```

* mode:用于指定请求模式.以及客户端读取多少响应
  1. cors:允许遵守CORS的跨域请求.(非简单跨域,需要预检)
  2. no-cors:允许不需要发送预检请求的跨域请求.(同源请求或者简单跨域)
  3. same-origin:任何跨域请求都不允许发送

>以上就不一一介绍
>>参考:<https://developer.mozilla.org/zh-CN/docs/Web/API/fetch>

## Headers对象

> Headers对象是发送请求和入站响应头部的容器.并且都可以通过`Request.prototype.headers`修改属性

* Headers和Map极其相似.都有`set()`,`has()`,`delete()`方法

```js
let h = new Headers()

h.set("foo","bar")
console.log(h.has("foo"))//true
```

## Request对象

```js
let r= new Request(url,init)
```

> 与之前的fetch是一模一样的.如果init中没有设置的值,会使用默认值

| 键             | 值                                       |
| -------------- | ---------------------------------------- |
| bodyUesd       | false                                    |
| cache          | "default"                                |
| credentials    | "same-origin"                            |
| destination    | ""                                       |
| headers        | Headers {}                               |
| integrity      | ""                                       |
| keepalive      | false                                    |
| method         | "GET"                                    |
| mode           | "cors"                                   |
| redirect       | "follow"                                 |
| referrer       | "about:client"                           |
| referrerPolicy | ""                                       |
| signal         | AbortSignal {aborted:false,onabort:null} |
| url            | "\<current URL>"                         |

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

* 并且fetch()的`init`同样可以覆盖Request的对象

```js
let r = new Request("http://www.baidu.com",{method:"POST"})
fetch(r.clone())
fetch(r,{method:"POST",body:"body"})
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

> Response类有两个静态方法`Response.error()`和`Response.redirect()`

* **Response.redirect()**:接收一个url和重定向状态码,返回重定向Response对象
* 提供的状态码必须对应重定向,反则抛出错误

```js
Response.redirect("https://foo.com",301)
```

### fetch跨域问题

>从不同源请求资源,响应要包含CORS头部才能保证浏览器收到响应.<span style="color:red">如果我们测试用的别人的接口,使用`mode:cors`是不会成功的</span>

* 如果代码不需要服务器响应,可以设置`mode:'no-cors'`
