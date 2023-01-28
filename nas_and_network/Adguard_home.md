# ADGuard Home

> 有以下几个方案，这里只讲述第三种方案

1. client: any -> Dnsmasq: 53 -> Clash: 7874 -> ADG: 5335
   * 这里需要在 clash 中开启 dns 劫持，让 dnsmasq 将请求转发到 clash，然后将 clash 中的所有自定义上游 dns 换成 ADG 的 <sapn style="color:red">fallback 127.0.0.1:5535 UDP</sapn>。
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

注意：<sapn>由于已经将 openclash 定义为上游 dns 服务器，这里将不会再配置</sapn>

## 设置 OpenClash

在**全局设置**中，将 DNS 设置的**本地 DNS 拦截**关闭，开启**自定义上游 DNS 服务器**。

最后在 ADG 的 **DNS 拦截列表**中添加规则即可
