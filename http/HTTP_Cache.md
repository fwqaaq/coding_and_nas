# [HTTP 缓存](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching)

>首先，由于不需要将请求传递到源服务器，因此客户端和缓存越近，响应速度就越快。最典型的例子是浏览器本身为浏览器请求存储缓存。

## 缓存的种类

1. [**私有缓存**](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching#%E7%A7%81%E6%9C%89%E7%BC%93%E5%AD%98)：私有缓存通常是浏览器的缓存，它存储用户的个性化响应（你有必要使用 `private` 指令）。
   * 私有缓存一般是由 cookie 控制，但是你同时还需要设置 `private` 指令
   * 如果具有 Authorization，则不会存至**私有缓存/共享缓存**中，这时应该使用 `public` 指令

   ```http
   Cache-Control: private
   ```

2. [**共享缓存**](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching#%E5%85%B1%E4%BA%AB%E7%BC%93%E5%AD%98)：分为以下两种缓存
   1. **代理缓存**：HTTPS 变得越来越普遍，客户端/服务器通信变得加密，在许多情况下，路径中的代理缓存只能传输响应而不能充当缓存。代理缓存已经过时了。
   2. **托管缓存**：托管缓存由服务开发人员明确部署，以降低源服务器负载并有效地交付内容。示例包括反向代理、CDN 和 service worker 与缓存 API 的组合。
      * 使用托管缓存可以自定义显示删除缓存的方式（即使 HTTP 并没有规范显示定义如何删除缓存）
      * 使用以下方式退出标准 HTTP 缓存规范协议以支持显式操作（在托管缓存中进行，退出私有缓存、代理缓存）

      ```http
      Cache-Control: no-store
      ```

3. [**启发式缓存**](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching#%E5%90%AF%E5%8F%91%E5%BC%8F%E7%BC%93%E5%AD%98)：HTTP 旨在尽可能多地缓存，因此即使没有给出 Cache-Control，如果满足某些条件，响应也会被存储和重用。

## 缓存策略

> HTTP 的缓存策略通常有两种：**fresh**（表示缓存仍然有效） 和 **stale**（表示缓存已过期）。`age` 用于指定缓存的过期时间。

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1024
Date: Tue, 22 Feb 2022 22:22:22 GMT
Cache-Control: max-age=604800

<!doctype html>
…
```

以上示例表明，如果响应的时间小于一周，则可以复用；如果时间大于一周，则过期不能使用。

* 如果将响应存在共享缓存中，那么有必要通知客户端 `age`。以下示例是一天之后，从共享缓存中发出的响应，从中浏览器可以知道响应还剩多少天。

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1024
Date: Tue, 22 Feb 2022 22:22:22 GMT
Cache-Control: max-age=604800
Age: 86400

<!doctype html>
…
```

## [Vary 响应](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching#vary_%E5%93%8D%E5%BA%94)

> Vary 会基于响应的 URL 和其中设置的请求标头组合进行缓存。

* 以下示例：响应 URL 和 Accept-Language 请求标头的组合进行键控

```http
Vary: Accept-Language
```

## [验证响应](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching#%E9%AA%8C%E8%AF%81%E5%93%8D%E5%BA%94)

> 过时的响应不会立即被丢弃。HTTP 有一种机制，可以通过询问源服务器将陈旧的响应转换为新的响应。这称为验证，有时也称为重新验证。

* `If-Modified-Since`: 验证是通过使用包含 `If-Modified-Since` 或 `If-None-Match` 请求标头的条件请求完成的。

1. 响应在 22:22:22 生成，`max-age` 为 1 小时，因此你知道它在 23:22:22 之前是新鲜的

   ```http
   HTTP/1.1 200 OK
   Content-Type: text/html
   Content-Length: 1024
   Date: Tue, 22 Feb 2022 22:22:22 GMT
   Last-Modified: Tue, 22 Feb 2022 22:00:00 GMT
   Cache-Control: max-age=3600
   
   <!doctype html>
   …
   ```

2. 到 23:22:22 时，响应会过时并且不能重用缓存。因此，下面的请求显示客户端发送带有 `If-Modified-Since` 请求标头的请求，以询问服务器自指定时间以来是否有任何的改变。

   ```http
   GET /index.html HTTP/1.1
   Host: example.com
   Accept: text/html
   If-Modified-Since: Tue, 22 Feb 2022 22:00:00 GMT
   ```

3. 响应此时没有任何变化。收到该响应后，客户端将存储的陈旧响应恢复为新鲜的，并可以在剩余的 1 小时内重复使用它。

   ```http
   HTTP/1.1 304 Not Modified
   Content-Type: text/html
   Date: Tue, 22 Feb 2022 23:22:22 GMT
   Last-Modified: Tue, 22 Feb 2022 22:00:00 GMT
   Cache-Control: max-age=3600
   ```

* 这里只介绍 `ETag` 标头，它可以是服务器端生成的任意值。

如果 `ETag` 标头使用了 hash 值，index.html 资源的 hash 值是 `deadbeef`。

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1024
Date: Tue, 22 Feb 2022 22:22:22 GMT
ETag: "deadbeef"
Cache-Control: max-age=3600

<!doctype html>
…
```

如果该响应是陈旧的，则客户端获取缓存响应的 ETag 响应标头的值，并将其放入 `If-None-Match` 请求标头中，以询问服务器资源是否已被修改：

```http
GET /index.html HTTP/1.1
Host: example.com
Accept: text/html
If-None-Match: "deadbeef"
```

如果服务器为请求的资源确定的 `ETag` 标头的值与请求中的 `If-None-Match` 值相同，则服务器将返回 `304 Not Modified`。

## 其它注意点

1. 不使用缓存：不会将响应存储在任何缓存中（如果特定的 URL 已经存储在响应中，会使用旧缓存）

   ```http
   Cache-Control: no-store
   ```

2. 不与其他用户共享缓存（即使设置了 `no-store`，我们也要设置 `private`）

   ```http
   Cache-Control: private
   ```

3. 每次提供最新的内容：在使用旧缓存时，会强制客户端对旧缓存进行新的验证

   ```http
   Cache-Control: no-cache
   ```

注意：要获得 Web 平台的全部功能集的优势，最好将 `no-cache` 与 `private` 结合使用。

## 重新加载和强制重新加载

> 为了从页面错误中恢复或更新到最新版本的资源，浏览器为用户提供了重新加载功能。

```http
GET / HTTP/1.1
Host: example.com
Cache-Control: max-age=0
If-None-Match: "deadbeef"
If-Modified-Since: Tue, 22 Feb 2022 20:20:20 GMT
```

* Fetch 中可以通过在缓存模式设置为 `no-cache` 的情况下，在 JavaScript 中调用 `fetch()` 来重现

```js
// 注意：“reload”不是正常重新加载的正确模式；“no-cache”才是
fetch("/", { cache: "no-cache" });
```

### 强制重新加载

```http
GET / HTTP/1.1
Host: example.com
Pragma: no-cache
Cache-Control: no-cache
```

* Fetch 中可以通过在缓存模式设置为 `reload` 的情况下，在 JavaScript 中调用 `fetch()` 来重现

```js
// 注意：“reload”——而不是“no-cache”——是“强制重新加载”的正确模式
fetch("/", { cache: "reload" });
```
