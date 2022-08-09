/** @format */

import ws from 'ws'
//@ts-ignore
const webSocketClient = new ws('ws://localhost:30002')

// create websocket client, and connect to websocket server on port 30002
webSocketClient.on('open', () => {
  console.log('websocket is open')
})

webSocketClient.on('message', (data: ws.RawData) => {
  console.log(data.toString())
  setTimeout(() => {
    webSocketClient.send('terminate')
  }, 3000)
})

webSocketClient.on('error', (err: Error) => {
  console.log(err)
})

webSocketClient.on('close', () => {
  console.log('websocket is closed')
})

// 监听的是 收到来自服务端的心跳检测 ping 的事件
webSocketClient.on('ping', (data: Buffer) => {
  console.log('ping' + data)
})

// 监听的是 收到来自服务端的收到心跳检测 pong 的事件
webSocketClient.on('pong', (data: Buffer) => {
  console.log('pong' + data)
})
