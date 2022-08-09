# websocket

> `websocket` 是双全工通信协议,当客户端和服务端建立连接之后,双方可以互相发送数据,这样就不需要客户端轮询这种低效的方式发送数据.

* 参考:<https://juejin.cn/post/7038491693997359117>
* 文档:<https://github.com/websockets/ws/blob/master/doc/ws.md#event-upgrade>

## Server & Client

> Server 的监听事件

* `listening`: 监听成功
* `connection`: 建立连接
  * 回调函数会传入第一个参数为**客户端**的连接对象(为一个 `Socket` 对象).连接成功后,需要对 `Socket` 进行一系列的监听
  * 此 `Socket` 监听的事件和客户端监听的事件完全一样

   ```js
   webSocketServer.on('connection', (socket: ws, req) => {
     ...
   })
   ```
  
  * `message`: 接收 client 发送的消息
  * `close`: 监听 client 关闭
  * `error`: 监听 client 发生错误
  * `upgrade`: 当来自服务器作为握手的一部分接收到响应标头时发出.这允许您从服务器读取标头,例如 `set-cookie` 标头
* `close`: 监听 `server` 关闭,当你调用 `Server.close()` 方法时也可以触发此事件
* `error`: 监听 `server` 发生错误时

>Client 的监听事件

* `open`: 建立连接成功
* `message`: 接收 server 发送的消息
* `close`: 监听 server 关闭,如果 server 关闭,client 也会关闭
* `error`: 监听 server 发生错误
* `ping|pong`: 监听 server 发送的 ping 或 pong 消息
* `unexpected-response`: 当服务器响应不是预期的响应时,例如 401 响应
