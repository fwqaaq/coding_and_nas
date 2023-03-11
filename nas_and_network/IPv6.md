# IPv6

>主路由进行 PPPoE 桥接之后，由主路由开启 IPv6，这样每个设备默认会分配到一个公网 IP 地址。

![PPPoE 模式下 IPv6 的设置](./Ipv6/IPv6.png)

开启 IPv6 代理后，会出现一系列的兼容问题，建议不要开启。<sapn style="color:red">IPv6 建议用于国内直连。</sapn>

注意：<span style="color:red">需要跟据 Vps/节点提供商确认是否支持，如果该站点支持 IPv6 可以放心大胆地开启，并根据以下操作食用。</span>

该站点只支持 ipv6：<http://6.ipw.cn>

## IPv6 的 nat

> 当 IPv6 的网关还是使用 nat 分发 IPv6 的内网地址时，与外部 IPv6 网站的通信则会判定本站是 IPv4 协议栈。

在使用 dig 查询某网站的 aaaa 记录时，可能出现 IPv4 到 IPv6 地址的映射。例如 `::ffff:198.18.0.72`:

```bash
$dig aaaa 6.ipw.cn
; <<>> DiG 9.10.6 <<>> aaaa 6.ipw.cn
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 20501
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;6.ipw.cn.    IN  AAAA

;; ANSWER SECTION:
6.ipw.cn.   1 IN  AAAA  ::ffff:198.18.0.72

;; Query time: 0 msec
;; SERVER: 198.18.0.2#53(198.18.0.2)
;; WHEN: Thu Feb 23 18:15:49 CST 2023
;; MSG SIZE  rcvd: 54
```

当 IPv6 启用的设备向 IPv4 地址发送数据包时，IPv6 栈通过在前面加上 `::ffff:` 的前缀，将 IPv4 地址映射为 IPv6 地址。这允许数据包通过 IPv6 网络发送到 IPv4 设备。<sapn style="color:red">如果使用 IPv6 协议，但是经过 nat 之后，其它设备分配到 IPv6 的子网地址，则默认的协议栈是 IPv4。</sapn>

## OpenClash

> 这里只说明其做为旁路由的情况。

使用 OpenClash 做旁路由并**开启 IPv6** 的时候，它并不会主动代理 IPv6，建议还是关闭对 IPv6 的代理。如果有一些网站嗅探你的 IPv6 的地址，因为你的 Vps 并没有支持 IPv6，所以它也不会代理，显示的 IP 还是国内的 IPv6 的 IP。所以如果一定要访问这些网站建议关闭，或者单独设置一个子网，并将 IPv6 关闭或者使用以下的方式关闭 IPv6 功能（这样并不会影响外网设备访问内网的 IPv6 设备，例如 nas 等）。

* 如果需要关闭 IPv6 DNS 记录，那么首先需要开启【**DHCP/DNS**】下的【**高级设置**】中的【**禁止解析 IPv6 DNS 记录**】功能，这样就会得到网站 IPv4 的 DNS 记录，默认 OPenClash 中的 IPv6 功能是全部关闭的，而不会使用本机的 IPv6 去访问。这样，你会完全丧失 IPv6 的功能，例如访问只有 IPv6 的网站。

可以使用该网站去测试：<https://ip125.com>，一般情况下不会出现 IPv6 地址。

## merlingClash

> 开启 merlingClash 的 IPv6 支持，一定要确定 Vps 是否支持。

1. 在【**附加功能**】的【**高级模式**】下开启【**TPROXY**】功能
2. 然后在【高级模式】中滑到最下面的【**Tproxy转发 | IPV6模式**】，按照指示开启即可

> 这里是作为主路由。merlingClash 的问题也是 IPv6 的 DNS 记录，对于访问只有 IPv6 的网站，不能查到对应的 IP。（开启的代理中不支持 IPv6 的情况下会出现）
>
> 未开启 merlingClash IPv6 的情况

* 关于下发的 IPv6 DNS 服务器，<span color="red">实际上如果对方的网址只有 IPv6，并且没有开启 merlingClash IPv6 时，不会返回 AAAA 记录，</span>所以需要手动指定公共的 DNS，可能是我的华硕路由器太老，并不能指定 IPv6 的 DNS。可以指定以下的 DNS 服务器：

| 服务商     | DNS                                          |
| ---------- | -------------------------------------------- |
| Cloudflare | 2606:4700:4700::1111、2606:4700:4700::1001  |
| Google     | 2001:4860:4860::8888、2001:4860:4860::8844 |

* 但是这会出现一个问题，IPv6 一般会优先访问，这样还是会造成网络卡顿的情况（部分国外网站可能无法访问，其也可以回落支持 IPv4）。参考：<https://ipw.cn/doc/ipv6/user/ipv4_ipv6_prefix_precedence.html#_3-调整网络前缀优先级-让-ipv4-访问优先>

注意：<sapn style="color:red">下发的 DNS 服务器不要有 IPv6 的</sapn>

## 群晖 docker 中设置 IPv6

> 群晖 docker 网络默认是不开启 IPv6 的，这里我们需要手动设置桥接模式

![ ](./Ipv6/docker_IPv6.png)

* 其中 IPv6 的网络和 IPv4 一样，都是通过子网进行映射

## WIFI Calling

> 国内对于 ultra mobile 的域名会进行 DNS 污染，但是即使是用 google、cloudflare 的公共 dns 服务器也是有问题的。

* 但是，IPv6 的阿里云公共 DNS 是完全可以解析的，不仅仅是对 WIFI Calling，而且对国外，如 Youtube 的域名都是可以解析，而且很快：`2400:3200::1`
* 不过 ultra mobile 至今未支持 IPv6。所以使用**域名劫持**还是得对应 IPv4
* 可以在该网站：<https://dnschecker.org> 查找一下域名对应的 IPv4
  * ss.epdg.epc.geo.mnc260.mcc310.pub.3gppnetwork.org
  * epdg.epc.mnc260.mcc310.pub.3gppnetwork.org

## 开启 IPv6 代理

> 一些设备和浏览器并不会对不能进行访问的 IPv6 进行回落，所以会出现无法访问网站个例的现象

例如 Apple TV、Edge、Safria 个别时候等，这时候要么关闭对 IPv6 的代理支持，要么切换支持到 IPv6 的节点。

### Apple TV

> 问题：在开启 IPv6 时，使用 APPLE TV 可能出现刚打开 YouTube 的一瞬间可以访问，之后就无法访问的情况。（其它设备都可以访问）

* 猜测以及解决方法：APPLE TV 可能是无法进行 IPv6 到 IPv4 的回落，所以一旦 IPv6 检测到是国内，无法回落，就会被禁止访问。
   1. 将 IPv6 的功能关闭，只使用 IPv4 的代理进行访问。
   2. 开启带有 IPv6 代理的 Vps。
