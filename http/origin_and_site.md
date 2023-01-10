# [origin、site and scheme](https://web.dev/i18n/en/same-site-same-origin/)

## Scheme

> Scheme: 协议或者方案，如 https、http 等。“有方案同站”则是更严格的定义。在这种情况下，<http://www.example.com> 和 <https://www.example.com> 被视为跨站，因为方案不匹配。

| 源 A                          | 源 B                            | 源 A 和源 B 是否是“有方案同站”的解释 |
| ----------------------------- | ------------------------------- | ------------------------------------ |
| <https://www.example.com:443> | <https://www.evil.com:443>      | 跨站：域不同                         |
| <https://www.example.com:443> | <https://login.example.com:443> | 有方案同站：子域不同无关紧要         |
| <https://www.example.com:443> | <http://www.example.com:443>    | 跨站：方案不同                       |
| <https://www.example.com:443> | <https://www.example.com:80>    | 有方案同站：端口不同无关紧要         |
| <https://www.example.com:443> | <https://www.example.com:443>   | 有方案同站：完全匹配                 |
| <https://www.example.com:443> | <https://www.example.com>       | 有方案同站：端口无关紧要             |

## site

> 站点是 Top-level domains (TLDs)与它之前的域部分的组合

* 假设 URL 是 <https://www.example.com:443/foo> ，则“站点”为 example.com
* 但是，对于 .co.jp 或 .github.io 等域，仅使用 .jp 或 .io 的 TLD 不足以识别“站点”。同时，无法通过算法确定特定 TLD 的可注册域的级别。这就是创建“有效 TLD”(eTLD) 列表的原因。
* 完整站点名称为 eTLD+1。例如，假设 URL 为 <https://my-project.github.io>，则 eTLD 为 .github.io，而 eTLD+1 则为 my-project.github.io，这就是一个“站点”。换句话说，eTLD+1 是有效的 TLD 加上它前面的域部分。

| 源 A                          | 源 B                            | 源 A 和源 B 是否“同站”/“跨站”的解释 |
| ----------------------------- | ------------------------------- | ----------------------------------- |
| <https://www.example.com:443> | <https://www.evil.com:443>      | 跨站：域不同                        |
| <https://www.example.com:443> | <https://login.example.com:443> | 同站：子域不同无关紧要              |
| <https://www.example.com:443> | <http://www.example.com:443>    | 同站：方案不同无关紧要              |
| <https://www.example.com:443> | <https://www.example.com:80>    | 同站：端口不同无关紧要              |
| <https://www.example.com:443> | <https://www.example.com:443>   | 同站：完全匹配                      |
| <https://www.example.com:443> | <https://www.example.com>       | 同站：端口无关紧要                  |

## origin

> origin: 指 scheme、主机名（或者也可以称是域名）以及端口的组合。

当方案、主机名和端口均相同的组合的网站视为“同源”，否则视为“跨源”。

### [CORS（Cross-Origin Resource Sharing）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)

>准确的说，它应该叫做跨源资源共享。浏览器本身会限制源加载除自己资源以外的源的资源（只要端口、协议、域名不同都不是同一个源）

* 例如 XMLHttpRequest 或者 Fetch 都要遵循CORS。但是有些简单请求并不会触发 CROS 预检请求。使用 GET、HEAD、POST 方法之一，并且只能修改下列标头（Accept、Accept- Language、Content-Language、Content-Type、Range），并且 `Content-Type` 只能是 `text/plain`、`multipart/form-data`、`application/x-www-form-urlencoded` 三者之一，并且请求中不能使用 **`ReadableStream`** 对象。并且使用 **Access-Control-Allow-Origin: ***、**Origin** 标头来控制。
* 但是当预检请求中需要包含凭据（览器发起跨源请求的时候，是不会主动带上 cookie 的，如果一个请求需要 cookie，需要开发者设置以下选项）那么请求时必须指定 withCredentials 标志为 true，并且响应中必须指定 Access-Control-Allow-Credentials: true 来表明可以携带 cookie （即 Set-Cookie 标头）

>在响应附带身份凭证的请求时：

* 服务器不能将 Access-Control-Allow-Origin 的值设为通配符“*”，而应将其设置为特定的域，如：Access-Control-Allow-Origin: <https://example.com>。
* 服务器不能将 Access-Control-Allow-Headers 的值设为通配符“*”，而应将其设置为首部名称的列表，如：Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
* 服务器不能将 Access-Control-Allow-Methods 的值设为通配符“*”，而应将其设置为特定请求方法名称的列表，如：Access-Control-Allow-Methods: POST, GET

## [Cookie](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)

>服务器收到 HTTP 请求后，服务器可以在响应标头里面添加一个或多个 Set-Cookie 选项。浏览器收到响应后通常会保存下 Cookie，并将其放在 HTTP Cookie 标头内，向同一服务器发出请求时一起发送。你可以指定一个过期日期或者时间段之后，不能发送 cookie。你也可以对指定的域和路径设置额外的限制，以限制 cookie 发送的位置。关于下面提到的标头属性的详细信息，请参考 Set-Cookie 文章。

* 用于敏感信息（例如指示身份验证）的 Cookie 的生存期应较短，并且 SameSite 属性设置为 **Strict** 或 **Lax**。
* 如果该 cookie 域和方案匹配当前的页面，则认为该 cookie 和该页面来自同一站点，则称为第一方 cookie（first-party cookie）。
* 如果域名和方案不同，则它不认为来自同一个站点，被称为第三方 cookie（third-party cookie）。虽然托管网页的服务器设置第一方 Cookie 时，但该页面可能包含存储在其他域中的服务器上的图像或其他组件（例如，广告横幅），这些图像或其他组件可能会设置第三方 Cookie。

### cookie 和跨源

* CORS 响应中设置的 cookie 适用一般性第三方 cookie 策略。在携带 Cookie 标头时不受同源策略的影响，如果是不同的源，响应时会产生跨源的错误，这并不是 cookie 本身的问题。<span style="color:red">LCookie 并不会知道请求标头是否要跨源</sapn>
* 限制访问 cookie，表示的是同站下是否能访问 cookie，将 cookie 携带在请求标头中发送

1. Domain 属性，设置哪些主机可以接受 cookie，如果不设置，只有源站可以访问，如果设置了，那么一定包含子域名
2. Path 属性，指定了一个 URL 的相对路径，如 （/docs）,那么 cookie 也会在子域名中共享（如 /docs、/docs/site ….）
3. SameSite：请参考
   * <https://github.com/mdn/translated-content/pull/3096#issuecomment-1123104136>
   * <https://github.com/mdn/translated-content/pull/11030#discussion_r1065450825>
