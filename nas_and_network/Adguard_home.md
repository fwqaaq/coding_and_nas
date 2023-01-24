# ADGuard Home

> 下面只教授如何在旁路网关下设置，ADGuard Home 会根据 DNS 负责解释网址和过滤广告

首先就是将主路由中的 [DNS 分发设置给旁路由](./网关设置/assus_router.png)。DNS 的默认端口号是 53，可以忽略不写

* 注意，如果对旁路网关不知道如何设置的请参考[旁路网关设置](./网关设置.md#旁路网关透明网关)

## DHCP/DNS 设置

1. 在基本设置中，**DNS 转发**需要设置为一个空闲的端口，例如 `127.0.0.1#7874`
   * dnsmasq 会将客户端的 dns 先转发至 Adguard，然后 Adguard 再转发请求至 dnsmasq
2. **HOSTS 和解析文件**中需要选忽略解析文件和使用 /etc/ethers 配置
3. 高级设置中的 **DNS 查询缓存的大小**设置为 0，不缓存

## ADGuard Home 设置

[adguard home](./Adguard_home/adguard_home.png)

上游服务器设置 `127.0.0.1:53`，由 Adguard Home 接收局域网内所有 dns 请求，传递给 dnsmasq。这样最基本的设置就设置好了。
