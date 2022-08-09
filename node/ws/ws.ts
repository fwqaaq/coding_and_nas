/** @format */
import * as ws from 'ws'
import { Server, type AddressInfo } from 'ws'

const webSocketServer = new Server({ port: 30002 })

webSocketServer.on('listening', (socket: ws) => {
  // webSocketServer.close()
  console.log('listening on port 30002')
})

// listen for new connections
webSocketServer.on('connection', (socket: ws, req) => {
  // listen client message
  socket.on('message', (data) => {
    console.log(data.toString())
    if (data.toString() === 'terminate') {
      socket.close()
      setTimeout(() => {
        webSocketServer.close()
      }, 3000)
    }
  })

  // listen client close
  socket.on('close', (code, reason) => {
    console.log(`code ${code},reason ${reason.toString()}`)
  })

  // an error in monitoring the communication socket
  socket.on('error', (error) => {
    console.log(`error ${error}`)
  })

  const ip = req.socket.address() as AddressInfo
  console.log(ip.address + ' is connected')
})

webSocketServer.on('close', () => {
  console.log('websocket server is closed')
})
