# RPC

> RPC（Remote Procedure Call）是跨网络的通讯方式，允许程序在远程服务器上执行另一程序或方法。

1. 透明性：对于调用者来说，远程过程调用看起来就像是本地过程调用，隐藏了底层的通信细节。
2. 通信：RPC 需要请求和响应。当客户端发起请求时，它会将参数打包并发送到服务器。服务器解包参数，执行请求的过程，然后将结果打包并返回给客户端。
3. 数据序列化：为了在网络上发送数据，RPC 使用了数据序列化和反序列化技术。这意味着它会将数据结构或对象转换为可传输的格式，如 JSON 或 XML。
4. 多种语言支持：许多 RPC 系统允许不同的客户端和服务器使用不同的编程语言。例如，一个用 Python 编写的客户端可能调用一个用 Java 编写的远程服务。
5. 同步和异步：RPC 可以是同步的，也可以是异步的。在同步RPC中，客户端发送请求并等待响应。在异步RPC中，客户端可以在没有等待响应的情况下继续执行其他任务。
6. 应用案例：RPC 常用于分布式系统、云计算、微服务架构等领域。

以下示例使用的是 JSON-RPC，它是一种轻量级的 RPC 协议，使用 JSON 作为数据格式。

## 定义一个 RPC 客户端

```go
package main

import (
        "log"
        "net"
        "net/rpc"
        "net/rpc/jsonrpc"
)

const HelloServiceName = "HelloService"

type HelloServiceClient struct {
        *rpc.Client
}

func DialHelloService(network, address string) (*HelloServiceClient, error) {
        client, err := rpc.Dial(network, address)
        if err != nil {
                return nil, err
        }
        return &HelloServiceClient{Client: client}, nil
}

func (p *HelloServiceClient) Hello(request string, reply *string) error {
        return p.Client.Call(HelloServiceName+".Hello", request, reply)
}
```

在 main 函数中调用 RPC 服务：

```go
func main() {
        conn, err := net.Dial("tcp", "localhost:1234")
        if err != nil {
                log.Fatal("dialing:", err)
        }
       
        client := rpc.NewClientWithCodec(jsonrpc.NewClientCodec(conn))
        var reply string
        client.Call("HelloService.Hello", "World", &reply)
       
        if err != nil {
                log.Fatal(err)
        }
        log.Println(reply)
}
```

首先启动一个 TCP 服务器，并监听 1234 端口：

```bash
nc -l 1234
# {"method":"HelloService.Hello","params":["hello"],"id":0}
```

## 定义一个 RPC 服务端

```go
package main

import (
        "io"
        "net/http"
        "net/rpc"
        "net/rpc/jsonrpc"
)

type HelloService struct{}

type HelloServiceInterface interface {
        Hello(request string, reply *string) error
}

func RegisterHelloService(svc HelloServiceInterface) error {
        return rpc.RegisterName("HelloService", svc)
}

func (p *HelloService) Hello(request string, reply *string) error {
        *reply = "hello:" + request
        return nil
}
```

在 main 函数中调用 RPC 服务：

```go
func main() {
        RegisterHelloService(new(HelloService))

        listener, err := net.Listen("tcp", ":1234")
        if err != nil {
                log.Fatal("ListenTCP error:", err)
        }

        for {
                conn, err := listener.Accept()
                if err != nil {
                        log.Fatal("Accept error:", err)
                }

                go rpc.ServeCodec(jsonrpc.NewServerCodec(conn))
        }
}
```

启动一个 TCP 客户端，并连接到 1234 端口：

```bash
echo -e '{"method":"HelloService.Hello","params":["hello"],"id":1}' | nc localhost 1234
# {"id":1,"result":"hello:World","error":null}
```

参考：<https://chai2010.cn/advanced-go-programming-book/ch4-rpc/ch4-01-rpc-intro.html>
