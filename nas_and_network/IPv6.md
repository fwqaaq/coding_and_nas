# IPv6

>主路由进行 PPPoE 桥接之后，由主路由开启 IPv6，这样每个设备默认会分配到一个公网 IP 地址。

![PPPoE 模式下 IPv6 的设置](./Ipv6/IPv6.png)

开启 IPv6 代理后，会出现一系列的兼容问题，建议不要开启。<sapn style="color:red">IPv6 建议用于国内直连。</sapn>

注意：<span style="color:red">需要跟据 Vps/节点提供商确认是否支持</span>

该站点只支持 ipv6：<http://6.ipw.cn>

## OpenClash

> 这里只说明做其为旁路由的情况。

使用 OpenClash 做旁路由并开启 IPv6 的时候，它并不会主动代理 IPv6，建议还是关闭。如果有一些网站嗅探你的 IPv6 的地址，即使你开了 IPv6 代理，它也不会代理，显示的 IP 还是国内的 IPv6 的 IP。所以如果一定要访问这些网站建议关闭，或者单独设置一个子网，并将 IPv6 关闭。

* 在该插件中，IPv6 的 DNS 服务器并不会出现解析错误，可以直接使用旁路由的 DNS 服务器。
* 如果需要关闭 IPv6 DNS 记录，那么首先需要开启 **DHCP/DNS** 下的**高级设置**中的**禁止解析 IPv6 DNS 记录**功能，这样就会得到网站 IPv4 的 DNS 记录，默认 OPenClash 中的 IPv6 功能是全部关闭的，而不会使用本机的 IPv6 去访问（但是即使这样，对方网站并不会过滤掉本机的 AAAA 记录）

可以使用该网站去测试：<https://ip125.com>，一般情况下不会出现 IPv6 地址。

> 设置 DNS 解析回落

仅关闭 **DHCP/DNS** 下的**高级设置**中的**禁止解析 IPv6 DNS 记录**功能，这样你不会显示 IPv6 地址，也不会是 IPv6 优先访问，<span style="color:red">但是我们通过公共 DNS 的设置还是可以访问 IPv6 的网站</span>。

* 由于禁止解析 IPv6，所以 OpenClash 并不会将 IPv6 的解析返回，所以我们要设置公共的 IPv6 DNS，然后 OpenClash 的 DNS 用于**回落**，顺序不能颠倒。例如：

```plain
2400:3200::1 # 阿里云
192.168.50.57 # Openclash DNS
```

## merlingClash

> 这里是作为主路由。merlingClash 最大的问题就是 IPv6 的 DNS 记录，对于访问只有 IPv6 的网站，不能建立连接。

* 开启 IPv6，开启 IPv6 后会出现的问题（[开启 IPv6](https://mcreadme.gitbook.io/mc/Advanced/udp)），由于使用的是代理，如果代理的 ssl 证书有问题，在控制台会有一系列的警告（和 ssl 证书相关的）

> 未开启 merlingClash IPv6 的情况

* 关于下发的 IPv6 DNS 服务器，<span color="red">实际上如果对方的网址只有 IPv6，并且没有开启 merlingClash IPv6 时，不会返回 AAAA 记录，</span>所以需要手动指定公共的 DNS，可能是我的华硕路由器太老，并不能指定 IPv6 的 DNS。可以指定以下的 DNS 服务器

| 服务商     | DNS                                          |
| ---------- | -------------------------------------------- |
| Cloudflare | 2606:4700:4700::1111 、2606:4700:4700::1001  |
| Google     | 2001:4860:4860::8888 、 2001:4860:4860::8844 |

* 但是这会出现一个问题，IPv6 一般会优先访问，这样还是会造成网络卡顿的情况。参考：<https://ipw.cn/doc/ipv6/user/ipv4_ipv6_prefix_precedence.html#_3-调整网络前缀优先级-让-ipv4-访问优先>

注意：<sapn style="color:red">下发的 DNS 服务器不要有 IPv6 的</sapn>

## 群晖 docker 中设置 IPv6

> 群晖 docker 网络默认是不开启 IPv6 的，这里我们需要手动设置桥接模式

![ ](./Ipv6/docker_IPv6.png)

* 其中 IPv6 的网络和 IPv4 一样，都是通过子网进行映射

## WIFI Calling

> 国内对于 ultra mobile 的域名会进行 DNS 无染，但是即使是用 google、cloudflare 的公共 dns 服务器也是有问题的。

* 但是，IPv6 的阿里云公共 DNS 是完全可以解析的，不仅仅是对 WIFI Calling，而且对国外，如 Youtube 的域名都是可以解析，而且很快：`2400:3200::1`
* 不过 ultra mobile 至今未支持 IPv6。所以使用**域名劫持**还是得对应 IPv4
* 可以在该网站：<https://dnschecker.org> 查找一下域名对应的 IPv4
  * ss.epdg.epc.geo.mnc260.mcc310.pub.3gppnetwork.org
  * epdg.epc.mnc260.mcc310.pub.3gppnetwork.org
