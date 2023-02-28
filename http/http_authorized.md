# [HTTP 身份验证](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Authentication)

* 如果你要查看 [Basic 身份验证的示例](./example/authorized.ts)，你可以点击它。

![ ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication/http-auth-sequence-diagram.png)

1. 服务器端向客户端返回 `401（Unauthorized）` 响应状态码，并在 `WWW-Authenticate` 响应标头提供如何进行验证的信息，其中至少包含有一种质询方式。
2. 之后，想要使用服务器对自己身份进行验证的客户端，可以通过包含凭据的 `Authorization` 请求标头进行验证。
3. 通常，客户端会向用户显示密码提示，然后发送包含正确的 `Authorization` 标头的请求

## [WWW-Authenticate](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/WWW-Authenticate)

>该响应标头提供如何进行验证的信息，其中至少包含有一种质询方式。
