# ADGuard Home

## 工作原理

1. ADGuard Home 作为本地网络的 DNS 服务器：ADGuard Home会运行一个本地DNS服务器，如 dnsmasq 或 unbound，监听本地网络的 53 端口 DNS 请求。本地网络设备会把 DNS 查询发送到 ADGuard Home。

2. 过滤查询请求：ADGuard Home 收到 DNS 查询请求后，会先检查请求域名是否在过滤列表或黑名单中，如果命中，则直接返回空地址或错误，不会进一步转发查询。
3. 转发查询请求：如果查询请求未被过滤，ADGuard Home 会将其转发到上游 DNS 服务器，如 AdGuard DNS 或 OpenDNS 等。上游 DNS 服务器会递归解析查询，并返回结果。
4. 过滤查询结果：上游 DNS 返回查询结果后，ADGuard Home 会再次检查是否需要过滤，过滤之后再返回给本地网络设备。
5. 缓存结果：ADGuard Home 还会 caches DNS 查询结果，下次相同查询时直接使用缓存，提高速度。

## 三种模式

* 作为 dnsmasq 的上游服务器：这个选项表示 ADGuard Home 自己会运行一个 dnsmasq DNS 服务器，并将其上游设置为指定的上游 DNS 服务器。启用此选项后，ADGuard Home 会作为一个递归 DNS 服务器工作，本地网络的设备会把 DNS 查询请求发到 ADGuard Home，然后 ADGuard Home 再向上游 DNS 请求数据。
* 重定向 53 端口到上游服务器：这个选项会关闭 ADGuard Home 中的 dnsmasq 服务器，直接把本地网络设备的 DNS 请求（53端口）重定向到上游 DNS 服务器。也就是说，本地网络的设备会直接把 DNS 查询发送到上游 DNS，不经过 ADGuard Home 本身。（需要重定向到 ADG DNS 等有拦截广告等上游服务器）
* 重定向 53 端口替换 dnsmasq：这个选项表示关闭 dnsmasq，并把本地 DNS 请求重定向到上游 DNS。与上一个选项作用基本一致。

## 设计方案

> 有以下几个方案，这里只讲述第三种方案

1. client: any -> Dnsmasq: 53 -> Clash: 7874 -> ADG: 5335
   * 这里需要在 clash 中开启 dns 劫持，让 dnsmasq 将请求转发到 clash，然后将 clash 中的所有自定义上游 dns 换成 ADG 的 `fallback 127.0.0.1:5535 UDP`。
   * 但是如果屏蔽的广告在 clash 中决定走代理，那么就不会向上游 ADG 去请求，并且只会出现 `127.0.0.1`
2. client: any -> Dnsmasq: 53 -> ADG: 5335 -> Clash: 7874
   * 该方案的 Dnsmasq 明显是多余的，只是起到了转发功能
3. client: any -> ADG: 53 -> Clash: 7874
   * 该方案跳过了 dnsmasq，那么 dhcp 也不能使用，则可以使用旁路由的形式或者使用 ADG 的 dhcp 功能。
   * 即使使用改方案，网速也会大大下降，并且除广告效果远没有浏览器自带的插件效果好。

> 下面只教授如何在旁路网关下设置，ADGuard Home 会根据 DNS 负责解释网址和过滤广告

首先就是将主路由中的 [DNS 分发设置给旁路由](./网关设置/assus_router.png)。DNS 的默认端口号是 **53**，可以忽略不写。

* 注意，如果对旁路网关不知道如何设置的请参考[旁路网关设置](./网关设置.md#旁路网关透明网关)

## DHCP/DNS 设置

1. 在基本设置中，**DNS 转发**默认是转发的 clash 的端口 `127.0.0.1#7874`
2. **HOSTS 和解析文件**中需要选忽略解析文件和使用 /etc/ethers 配置
3. 高级设置中的 **DNS 查询缓存的大小**设置为 0，不缓存，并且将 dns 服务器端口设置为其他端口，例如 5533

## ADGuard Home 设置

在 AdGuard Home 中，重定向选择**无**，或者可以在设置页面中修改成如下的

```yaml
# ...
dns:
  bind_hosts:
    - 0.0.0.0
  port: 53
  #...
  upstream_dns:
    - 127.0.0.1:7874
```

注意：由于已经将 openclash 定义为上游 dns 服务器，这里将不会再配置

## 设置 OpenClash

在**全局设置**中，将 DNS 设置的**本地 DNS 拦截**关闭，开启**自定义上游 DNS 服务器**。

最后在 ADG 的 **DNS 拦截列表**中添加规则即可
