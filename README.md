# 👍

## HTTP

* [HTTP](http/http.md)
* [HTTP 缓存](http/HTTP_Cache.md)
* [源和站](http/origin_and_site.md)
* [websocket](http/websocket.md)
* [分片下载](http/splitter_file.md)
* [RPC](http/rpc.md)

## JavaScript API

>浏览器原生对 javascript 的支持

* [TypedArray](./JavascriptAPI/TypedArray.md)
* [StreamsAPI](./JavascriptAPI/StreamsAPI.md)
  * [ReadableStream](./JavascriptAPI/StreamsAPI.md#readablestream)
    * [ReadableStreamDefaultReader](./JavascriptAPI/StreamsAPI.md#readablestreamdefaultreader)
  * [WritableStream](./JavascriptAPI/WritableStream.md)
    * [WritableStreamDefaultWriter](./JavascriptAPI/WritableStream.md#writablestreamdefaultwriter)
  * [TransformStream](./JavascriptAPI/TransformStream.md)
* [EncodingAPI](./JavascriptAPI/EncodingAPI.md)
* [blob](./JavascriptAPI/blob.md)
* [fetch](./JavascriptAPI/Fetch.md)
* [drag](./JavascriptAPI/drag.md)
* [video](./JavascriptAPI/video.md)
* [Date](./JavascriptAPI/Date.md)
* [MediaSource](./JavascriptAPI/MediaSource.md)
* [AbortController](./JavascriptAPI/AbortController.md)
* [worker](./JavascriptAPI/worker.md)
* [Crypto](./JavascriptAPI/Cryptography.md)

### 类型转换

* [type_coercion](./JavascriptAPI/type_coercion.md)

## Canvas

* [webgpu](./Canvas/webgpu.md)
* [动态更改gpu](./Canvas/webgpu.md)
* [矩阵变换](./Canvas/矩阵变换.md)

## 表单

1. [表单基础](./form/表单基础.md)
2. [文本框](./form/文本框编程.md)
3. [选择框](./form/选择框编程.md)

## DOM Event

1. [DOM事件流](./DOMEvent/DOM事件流.md)
2. [DOM事件](./DOMEvent/DOM事件.md)
3. DOM事件类型
   * [x] [用户界面事件（UIEvent）](./DOMEvent/键盘事件.md#用户界面事件)：涉及BOM交互的通用浏览器事件
   * [x] [焦点事件（FocusEvent）](./DOMEvent/键盘事件.md#焦点事件)：元素获得或失去焦点时触发
   * [x] 鼠标事件（MouseEvent）：鼠标在页面上执行某些操作触发
   * [x] 滚轮事件（WheelEvent）：使用鼠标滚轮或者类似设备触发
   * [x] [键盘事件（InputEvent）](./DOMEvent/键盘事件.md#键盘事件)：在文档中输入文本时触发
   * [x] [进度事件（ProgressEvent）](./DOMEvent/进度事件.md)：测量如HTTP等底层流程进度的事件
   * [ ] 合成事件（CompositionEvent）：使用某种 IME（输入法编辑器）输入字符时触发

## 正则

> 学习「正则迷你书」

* [匹配模式](regular/01正则表达式的匹配模式.md)
* [位置](regular/02正则表达式位置匹配.md)
* [括号](regular/03正则表达式括号的作用.md)
* [回溯](regular/04正则表达式回溯法.md)
* [表达式拆分](regular/05正则表达式拆分.md)
* [表达式构建](regular/06正则表达式构建.md)
* [正则表达式编程](regular/07正则表达式编程.md)
* [正则速查](regular/08速查.md)

## Bash

* [glob 语法](Bash/00.glob.md)
* [bash 基础语法](Bash/01.Bash基础语法.md)
* [Bash 环境变量](Bash/02.Bash环境变量.md)
* [Bash 操作](Bash/03.Bash操作.md)
* [Linux 正则表达式](Bash/04.Linux正则表达式.md)
* [Shell 脚本入门](Bash/05.Shell脚本入门.md)
* [Bash 语句](Bash/06.Shell语句.md)
* [深入 Bash](Bash/others.md)

## Others

1. [ESM](./others/ESM.md)
2. [端口转发](./others/端口转发.md)
3. [netcat](./others/netcat.md)
4. [使用 iperf3 测速](./others/iperf3.md)
5. [图灵完备](./others/Turing_Complete.md)
6. [文件系统](./others/FileSystem.md)
7. [设计模式](./others/design_pattern.md)
8. [JavaScript 异步错误处理](./others/error_promise.md)

## Stream Media

* [音视频概念](./Stream_media/Video_and_Audio.md)
* [ffmpeg 命令](./Stream_media/ffmpeg.md)
* [ffplay 命令](./Stream_media/ffplay.md)
* [ffproble 命令](./Stream_media/ffprobe.md)
* [字幕流](./Stream_media/字幕流.md)
* [ffmpeg 中使用的一些 track](./Stream_media/)

## nas

* [网关设置](./nas_and_network/OpenWrt.md)
* [emby 设置](./nas_and_network/emby%20流媒体管理.md)
* [ADGuard Home](./nas_and_network/Adguard_home.md)
* [开启 IPv6](./nas_and_network/IPv6.md)
  * [开启 docker IPv6](./nas_and_network/IPv6.md#群晖-docker-中设置-ipv6)
  * [阿里云公共 IPv6 DNS 对 WIFI Calling 的支持](./nas_and_network/IPv6.md#wifi-calling)
* [ESXI 学习](./nas_and_network/Esxi.md)
* [Wi-Fi](./nas_and_network/Wi-Fi.md)
* [群晖问题](./nas_and_network/Synology.md)

## 一些示例

* [fetch 请求的进度示例](./JavascriptAPI/fetch/index_basic.html)
* [在 service worker 中使用 fetch](./JavascriptAPI/fetch/service_worker/index.html)
