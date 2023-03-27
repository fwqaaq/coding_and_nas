# [HTTP 身份验证](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Authentication)

* 如果你要查看 [Basic 身份验证的示例](./example/authorized.ts)，你可以点击它。

![ ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication/http-auth-sequence-diagram.png)

1. 服务器端向客户端返回 `401（Unauthorized）` 响应状态码，并在 `WWW-Authenticate` 响应标头提供如何进行验证的信息，其中至少包含有一种质询方式。
2. 之后，想要使用服务器对自己身份进行验证的客户端，可以通过包含凭据的 `Authorization` 请求标头进行验证。
3. 通常，客户端会向用户显示密码提示，然后发送包含正确的 `Authorization` 标头的请求

## [WWW-Authenticate](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/WWW-Authenticate)

>该响应标头提供如何进行验证的信息，其中至少包含有一种质询方式。

### 授权的持久性

由于 HTTP 是无状态的，为了一次登录，长时间共享，我们需要使用 Cookie 来保持它的状态。

## [Cookie](./origin_and_site.md#cookie)&Session

![cookie](./example/cookie.png)

1. 浏览器发送http请求后，服务器会进行 cookie 设置。（设置 `Set-Cookie` 表头）
2. `Cookie` 中有 `value` 和 `name` 两个重要属性。还有一些对于跨源问题的重要标头
3. 浏览器会将 Cookie 保存起来，并且在以后的每一个请求自动附上这个 Cookie（关于是否主动带标头要看浏览器设置）

* 并且打开浏览器就可以看到cookie，并且如果将用户密码等重要信息放在浏览器就很不安全

>Session：浏览器和服务器是在进行会话，然而比较模糊的就是会话时间。因为关闭浏览器的行为可能是不小心的

![session](./example/session.png)

* 所以很多网站会给每个用户的会话设定会话时间（结束会话的时间）和唯一的 ID，并且这些 session 一般都是存储在数据库中的。

1. 当使用用户名密码发送到服务器，认证成功后，会创建一个 SessionID 和会话结束时间，还有其它参数
2. 服务器会将 `SessionID` 和会话结束时间包含在 cookie 中发送给浏览器
   * 服务器在发送 cookie 之前会对这个含有 Session ID 的 cookie 进行）名
3. 浏览器会将包含 SessionID 的 Cookie 进行保存（并没有保存账号密码）

* 浏览器会利用 cookie 的特点，每次访问都会带有 sessionid，直到有效期失效后会自行删除 cookie

>如果有大量用户访问服务器的时候，服务器依旧使用基于 cookie 的 session，就需要存储大量 `SessionID` 在服务器中。
>
> 如果有多台服务器的情况，服务器中的SessionID还要分配给其它服务器才能保证用户避免再次输入用户名和密码

## JWT（Json Web Token）

![Token](./token.png)

1. 用户第一次登录网页，服务器会生成一个 JWT，服务器不需要保存JWT，只需要保存**JWT 签名的密文**
2. 接着把JWT发送给服务器，浏览器可以以 `Cookie` 或者 `Storage` 的形式进行存储

* token验证登录
  >三段式加密字符串:header（算法）、payload（数据）、signature（签名信息）
  >>
  >> * 第一段：头，签证:安全信息验证，你的口令，进行不可逆加密
  >> * 第二段：你要保存的信息，将 `header` 和 `payload` base64 编码后进行算法运算得到签名信息
  >> * 第三段：额外信息，不可逆加密
  >>
  >>>  这一段字符串由后端发给前端。在登陆过以后，生成一个token给前端，前端保存这个token如果前端需要登录后查看页面，或者登陆后发送的请求，只要你把 token 带回来，解密一下

## 总结

1. Session 是由服务器诞生并且保存在服务器中的，由服务器主导
2. Cookie 是一种数据载体，把 session 保存在 cookie 中，送到客户端中，就可以跟随每个 http 发送
3. Token 诞生在服务器，但保存在浏览器中，可以放在 Cookie 或者 Storage 中.持有 Token 就像持有令牌可以访问服务器