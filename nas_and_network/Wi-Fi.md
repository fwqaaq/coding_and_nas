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

Wi-Fi 握手的第一帧就是 Beacon 帧，它会发上面这些信息，以及国家等相关的信息。

在这里，我们有一个捕获 Wi-Fi 802.11 相关的参考：<https://wiki.wireshark.org/CaptureSetup/WLAN#turning-on-monitor-mode>，在不开启 `monitor mode` 的模式下，网络驱动器会将 `802.11` 数据包翻译到一个“假的”以太网数据包。

> Without any interaction, capturing on WLAN's may capture only user data packets with "fake" Ethernet headers. In this case, you won't see any 802.11 management or control packets at all, and the 802.11 packet headers are "translated" by the network driver to "fake" Ethernet packet headers.

在 WireShark 设置中的 `monitor mode` 中勾选上，就可以捕获“真正的”原始数据包，但是不幸的是 MacOS 竟然将这一功能砍掉：<https://ask.wireshark.org/question/14292/how-to-get-monitor-mode-working-in-mac-os-catalina/>

> Seems that Apple has decided in its great wisdom to disable monitor mode for newer Mac (or it is a bug they don't bother to fix...
