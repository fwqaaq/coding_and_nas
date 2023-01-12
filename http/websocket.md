# websocket

> `websocket` 是双全工通信协议,当客户端和服务端建立连接之后,双方可以互相发送数据,这样就不需要客户端轮询这种低效的方式发送数据.

* 参考: <https://medium.com/deno-the-complete-reference/native-web-sockets-client-server-in-deno-928678a65cf2>

## Server & Client

监听事件

1. `onopen`: 当连接成功时调用回调函数，`this` 指自身，只接受一个参数

   ```ts
   onopen: ((this: WebSocket, ev: Event) => any) | null
   ```

2. `onclose`: 当连接关闭时，调用回调函数，也只接受一个参数

   ```ts
   onclose: ((this: WebSocket, ev: CloseEvent) => any) | null
   ```

3. `onerror`: 错误回调用于通知错误情况。它会引发 Event 或 ErrorEvent

   ```ts
   onerror: ((this: WebSocket, ev: Event | ErrorEvent) => any) | null
   ```

4. `onmessage`: onmessage 回调用于通知传入的消息。

   ```ts
   onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null
   ```

方法

1. `send()`: 通过 ws 将数据传输至队列，进行发送
   * `data`: 可以是 string、ArrayBuffer、ArrayBufferView、Blob

   ```ts
   send(data)
   ```

2. `close()`: 关闭 ws 连接
   * `code`: 状态码，默认是 1005
   * `reason`: 关闭的原因

   ```ts
   close(code?, reason)
   ```

### client 独有的

> 构造函数 WebSocket, url 指的是 ws 服务器响应的 url，protocols 指的一系列子协议

```ts
new WebSocket(url, protocols?)
```

* 实例属性

1. `binaryType`: 连接所传输的二进制数据类型，默认是 `blob`，可以改成 arraybuffer

   ```ts
   const socket = new WebSocket("ws://localhost:8080");
   socket.binaryType = "arraybuffer";
   ```

2. `url`: 服务器的 url
3. `readyState`: 连接状态，0 -> CONECTING、1 -> OPEN、2 -> CLOSEING、3 -> CLOSED
4. `protocol`: ws 对象中的协议参数指定的字符串之一
5. `bufferedAmount`: 调用 send() 中仍在排队，尚未发送到网络的字节数
6. `extensions`: 返回服务器选择的扩展

```ts
function logError(msg: string) {
  console.log(msg)
  Deno.exit(1)
}

function handleConnected(ws: WebSocket) {
  console.log('Connect to server ...')
  handleMessage(ws, 'Welcome')
}

function handleMessage(ws: WebSocket, data: string) {
  console.log('server >>' + data)
  const reply = prompt('Client >>') || 'No replay'
  if (reply === 'exit') {
    return ws.close()
  }
  ws.send(reply as string)
}

function handleError(e: Event | ErrorEvent) {
  console.log(e instanceof ErrorEvent ? e.message : e.type)
}
console.log('Connecting to server ...')
try {
  const ws = new WebSocket('ws://localhost:8000')
  ws.onopen = () => handleConnected(ws)
  ws.onmessage = (m) => handleMessage(ws, m.data)
  ws.onclose = () => logError('Disconnected from server ...')
  ws.onerror = (e) => handleError(e)
} catch {
  logError('Failed to connect to server ... exiting')
}
```

### server

> server 使用的是 [Deno.upgradeWebSocket](https://deno.land/api@v1.29.2?s=Deno.upgradeWebSocket) 搭建

```ts
/** @format */

import { serve } from 'https://deno.land/std@0.171.0/http/mod.ts'

function logError(msg: string) {
  console.log(msg)
  Deno.exit(1)
}

function handleConneted() {
  console.log('Connected to client....')
}

function handleMessage(ws: WebSocket, data: string) {
  console.log('CLIENT >>' + data)
  const reply = prompt('Server >>') || 'Np reply'
  if (reply === 'exit') {
    return ws.close()
  }
  ws.send(reply as string)
}

function handleError(e: Event | ErrorEvent) {
  console.log(e instanceof ErrorEvent ? e.message : e.type)
}

function reqHandler(req: Request) {
  if (req.headers.get('upgrade') !== 'websocket') {
    return new Response(null, { status: 501 })
  }
  const { socket: ws, response } = Deno.upgradeWebSocket(req)
  ws.onopen = () => handleConneted()
  ws.onmessage = (m) => handleMessage(ws, m.data)
  ws.onclose = () => logError('🐔🐔🐔....')
  ws.onerror = (e) => handleError(e)
  return response
}

console.log('waiting for client....')
serve(reqHandler, { port: 8000 })
```
