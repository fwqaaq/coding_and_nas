# Wi-Fi

> 用了这么久的 WiFi，还没有真正的熟悉过它。今天想着就把它的一些理论和参数总结一下。

## IEEE 802.11 协议

> IEEE 802.11 是一组用于无线局域网（WLAN）的通信协议，也称为 Wi-Fi。

* 802.11a：1999 年发布，频段 5 GHz，提供最高 54 Mbps 的数据传输速率。
* 802.11b：1999年发布，最大速度 11 Mbps，频段 2.4 GHz。
* 802.11g：2003年发布，最大速度 54 Mbps，频段 2.4 GHz。
* 802.11n（也称为 Wi-Fi 4）：2009 年发布，频段 2.4 GHz 和 5 GHz，最大速度：600 Mbps。
  * 802.11n 引入了多输入多输出（MIMO）技术，显著提高了速度和信号覆盖范围。它是第一个在 5 GHz 频段上工作的主流标准。
* 802.11ac（也称为 Wi-Fi 5）：2014 年发布，频段 5 GHz，最大速度可达 3.46 Gbps。
  * Wi-Fi 5 支持最高 160 MHz 的信道宽度，这比前一代标准（如 802.11n）的 40 MHz 宽度大得多。
* 802.11 ax（也称为 Wi-Fi 6）：2019 年发布。频段 2.4 GHz 和 5 GHz，近 10 Gbps。
  * 它引入了诸如 OFDMA（正交频分多址）和 8×8 UL/DL MU-MIMO（多用户多输入多输出）等先进技术。
* 802.11be（Wi-Fi 7）：2023 年发布，频段 2.4 GHz、5 GHz 和 6Ghz，最高 46 Gbps。
  * 16×16 UL/DL MU-MIMO

## SSID 和 BSSID

>SSID（Service Set Identifier）和 BSSID（Basic Service Set Identifier）用于识别和管理无线网络。

1. SSID（服务集标识符）：SSID 是无线网络的名称，是用户在搜索和连接无线网络时看到的名称。SSID 用于区分不同的无线网络。当你打开设备的 Wi-Fi 功能搜索网络时，列出的每个网络名称就是一个 SSID。
   * 自定义和隐藏：网络管理员可以自定义 SSID，也可以选择隐藏 SSID，使其不在无线网络搜索列表中显示，增加网络的隐私性。
2. BSSID（基本服务集标识符）：BSSID 实质上是无线接入点（通常是无线路由器）的物理地址，也就是 **MAC 地址**。在一个由多个接入点组成的大型网络中，每个接入点都有一个唯一的 BSSID，用于无线设备识别和区分不同的物理接入点。
   * 例如，如果你的无线路由器同时支持 2.4 GHz 和 5 GHz 频段，那么它就有两个 BSSID，一个用于 2.4 GHz 频段，另一个用于 5 GHz 频段。
   * 由于 BSSID 是物理地址，因此它是唯一的，不会重复。但是，SSID 可以重复，因为它只是一个名称，不是物理地址。

## 频段

> Wi-Fi 分为 2.4GHz 和 5GHz 两个频段

2.4GHz 有较长的频段，穿透能力强，但是容易受到干扰（例如微波炉、蓝牙以及其它 Wi-Fi 等）。5GHz 的频段较短，穿透能力弱，但是干扰较少，速度也更快，并且频率足够高，信号衰减的比较快。

## 信道

> "信道"（Channel）是指用于传输信号的特定频率范围。

1. 频率分配：信道基本上是无线频谱中的一段频率。这些频率被划分成多个信道，以便多个设备可以同时在相同的物理空间内进行通信，而不会（或尽量少地）相互干扰。
2. Wi-Fi 信道：在 Wi-Fi 网络中，2.4 GHz 和 5 GHz 频段被划分为多个信道。例如，在 2.4 GHz 频段中，通常有 11-14 个信道（具体取决于国家/地区），每个信道宽度约为 20 MHz。
3. 信道重叠：在 2.4 GHz 频段中，由于信道数量有限且每个信道宽度较宽，信道之间可能会发生重叠，这会导致干扰和网络性能下降。
   * 例如，在 2.4 GHz 频段中，通常只有信道 1、6 和 11 是不重叠的，因此它们是最常被推荐使用的信道。
   * 在 5 GHz 频段中，由于可用的频率范围更广，可以更容易地使用 40 MHz、80 MHz 或 160 MHz 的带宽，而不会造成太多的信道重叠。
4. 动态信道选择：一些现代的 Wi-Fi 路由器具有**动态信道选择**（Dynamic Channel Selection, DCS）功能，可以自动选择最佳的信道，以减少干扰并提高网络性能。

### 信道带宽

> 信道带宽（Channel Width）指的是在特定的无线信道内可用于传输数据的频率范围

信道的带宽（如 20 MHz、40 MHz、80 MHz 甚至 160 MHz）决定了可用于数据传输的频率范围。带宽越宽，理论上可用的数据传输速率就越高，但也更容易受到干扰。

国内 100 - 140 的信道是不开放的，参考：<https://zhiliao.h3c.com/Theme/details/200064>

## SNR

>SNR（Signal-to-Noise Ratio）是信噪比，用于衡量信号质量

* 信噪比是有用信号强度与背景噪声强度的比率。一个高的信噪比表示有用信号强度远大于噪声水平，这通常意味着更清晰、更准确的信号传输。高信噪比可以提供更稳定的连接和更高的数据传输速度。
* 理想值：理想的信噪比取决于特定的应用和技术。在无线通信中，一个较高的信噪比（如 25dB 以上）通常被认为是很好的，意味着信号质量高。
* 提高信噪比：提高信噪比的方法包括增强信号源的功率、使用更有效的天线、减少环境噪声源或使用更先进的信号处理技术。

信噪比与其他无线网络性能指标（如 RSSI - 接收信号强度指示）有关，但它们不是同一回事。RSSI 主要衡量信号强度，而不考虑噪声水平。

## Beacon

Wi-Fi 握手的第一帧就是 Beacon 帧，它会发上面这些信息，以及国家的代号等相关的信息，用于控制信道的号。

在这里，我们有一个捕获 Wi-Fi 802.11 相关的参考：<https://wiki.wireshark.org/CaptureSetup/WLAN#turning-on-monitor-mode>，在不开启 `monitor mode` 的模式下，网络驱动器会将 `802.11` 数据包翻译到一个“假的”以太网数据包。

> Without any interaction, capturing on WLAN's may capture only user data packets with "fake" Ethernet headers. In this case, you won't see any 802.11 management or control packets at all, and the 802.11 packet headers are "translated" by the network driver to "fake" Ethernet packet headers.

在 WireShark 设置中的 `monitor mode` 中勾选上，就可以捕获“真正的”原始数据包，但是不幸的是 MacOS 竟然将这一功能禁止了：<https://ask.wireshark.org/question/14292/how-to-get-monitor-mode-working-in-mac-os-catalina/>。并且只在 Wireless Diagnostics 这一程序中可以使用 monitor mode，打开最上层的 window 窗口选择 sniff 监视，然后就会得到 802.11 的 pcap 数据包。

> Seems that Apple has decided in its great wisdom to disable monitor mode for newer Mac (or it is a bug they don't bother to fix...

必须使用 `monitor mode` 才能真正捕获 802.11 帧，大多数时候这些都会像上面那样被翻译成假的以太网帧。以下是链路层 802.11 的详细帧情况：

1. Frame：表示捕获的帧的总体信息，包括在网络上的大小和捕获的大小。
2. Radiotap Header：是一个介于物理层和 MAC 层之间的自定义头部，通常包含了关于捕获的无线数据包的物理层信息，如信道、速率、信号强度等。
3. 802.11 radio information：提供关于无线电传输的详细信息，比如使用的频率、信道宽度等。
4. IEEE 802.11 Beacon frame：这是一个管理帧，用于在无线网络中通告网络的存在，包含了网络的一些基本信息，如时间戳、SSID、支持的速率等。
5. IEEE 802.11 Wireless Management：这部分提供了管理无线网络连接和配置的信息。

<details>
  <summary>管理帧</summary>
  <p><pre>Frame 4: 465 bytes on wire (3720 bits), 465 bytes captured (3720 bits)
Radiotap Header v0, Length 36
802.11 radio information
IEEE 802.11 Beacon frame, Flags: ........C
IEEE 802.11 Wireless Management
    Fixed parameters (12 bytes)
        Timestamp: 5338465996880
        Beacon Interval: 0.102400 [Seconds]
        Capabilities Information: 0x1131
    Tagged parameters (389 bytes)
        Tag: SSID parameter set: "Redmi_436A_5G"
        Tag: Supported Rates 6(B), 9, 12(B), 18, 24(B), 36, 48, 54, [Mbit/sec]
        Tag: DS Parameter set: Current Channel: 48
        Tag: Traffic Indication Map (TIM): DTIM 0 of 1 bitmap
        Tag: Country Information: Country Code CN, Environment Global operating classes
        Tag: Power Constraint: 0
        Tag: TPC Report Transmit Power: 22, Link Margin: 0
        Tag: Tx Power Envelope
        Tag: RM Enabled Capabilities (5 octets)
        Tag: AP Channel Report: Operating Class 129, Channel List : 50,
        Tag: RSN Information
        Tag: Vendor Specific: Microsoft Corp.: WPS
        Tag: QBSS Load Element 802.11e CCA Version
        Tag: HT Capabilities (802.11n D1.10)
        Tag: HT Information (802.11n D1.10)
        Tag: VHT Capabilities
        Tag: VHT Operation
        Tag: Extended Capabilities (11 octets)
        Tag: Vendor Specific: Microsoft Corp.: WMM/WME: Parameter Element
        Ext Tag: HE Capabilities
        Ext Tag: HE Operation
        Ext Tag: Spatial Reuse Parameter Set
        Ext Tag: MU EDCA Parameter Set
        Tag: Vendor Specific: Ralink Technology, Corp.
        Tag: Vendor Specific: MediaTek Inc.
        Tag: FILS Indication</pre></p>
</details>

### 管理帧

> 以下帧用于与 Wi-Fi 之间的认证

* Beacon 帧：包含网络信息，如 SSID 和支持的速率。
* Probe 请求/响应：用于发现网络和获取网络信息。
* Authentication 帧：网络访问前的身份验证过程。
* Association 请求/响应：用于将客户端设备连接到 AP。
* Reassociation 请求/响应：用于在 AP 之间进行漫游。
* Disassociation 帧：终止关联。
* Deauthentication 帧：终止认证。

### 控制帧

> 控制帧用于辅助数据的传递过程。包括：

* RTS（Request to Send）：清除发送数据的通道。
* CTS（Clear to Send）：响应RTS，提供发送数据的确认。
* ACK（Acknowledgement）：数据接收确认。
* PS-Poll：省电模式下的客户端询问AP是否有等待的数据。
* CF-End（Contention-Free End）：结束无竞争期。
* CF-End + CF-Ack：结束无竞争期并确认接收。

### 数据帧

> 数据帧用于实际的数据传输。包括：

* Data：承载上层协议的数据。
* Data + CF-Ack：数据帧和确认。
* Data + CF-Poll：数据帧和询问下一个接收方。
* Null Function：没有数据传输，但通知 AP 客户端仍然活跃。

## [IEEE 802.1 协议](https://en.wikipedia.org/wiki/IEEE_802.1)

参考：<https://zhuanlan.zhihu.com/p/469409849>
