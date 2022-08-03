# [MediaSource Extensions](https://developer.mozilla.org/zh-CN/docs/Web/API/Media_Source_Extensions_API)

> Media Source Extensions (MSE),即媒体源扩展 API,实现无插件且基于 Web 的流媒体功能.通过 MSE, 媒体串流能够通过 js 创建,并且使用\<video>和\<audio> 播放

* `MSE` 通常可以把单个媒体文件的 `src` 值替换成引用 `MediaSource` 对象(<span style="color:red">一个包含即将播放的媒体文件的准备状态等信息的容器</span>),以及引用多个 `SourceBuffer` 对象(<span style="color:red">代表多个组成整个串流的不同媒体块元素</span>)
* 它是基于可扩展的 API 建立自适应比特流客户端(例如 DASH 和 HLS 客户端)的基础.

> 使用 `ffmpeg` 将其他媒体资源转换为 FMP4

* 如果是 `mp4` 格式的媒体文件:

   ```bash
   ffmpeg -i non_fragmented.mp4 -movflags frag_keyframe+empty_moov -c copy fragmented.mp
   ```

* 如果是其他格式的媒体文件:

   ```bash
   ffmpeg -i trailer_1080p.mov -c:v copy -c:a copy -movflags frag_keyframe+empty_moov bunny_fragmented.mp4
   ```

## FFMPEG

>[FFMPEG 入门教程](https://www.ruanyifeng.com/blog/2020/01/ffmpeg.html)

* 在使用 MSE 播放 MP4 资源时,可能会遇到不可以播放的情况,原因是 MSE 不支持 MP4 格式的媒体文件,需要将 MP4 的文件转换为 FMP4(Fragment MP4) 格式,然而即使转换成 FMP4 格式,也不一定能播放.
   1. 普通的 MP4 格式的媒体文件所有**元数据**都在文件头,所有媒体数据都在一整块.如果文件比较大,对于一些视频播放器来说需要用户将整个文件都下载下来才可以播放,这就意味着用户的缓冲时间会因为 mp4 整体的大小而增加,尽管这样对本地视频没有问题
   2. FMP4 格式的媒体文件会被分成多个片段,每个片段都可以单独索引,传输和播放.<sapn style="color:red">但是这种格式目前并不被多数解码器完全支持,并且浏览器内嵌的播放器也可能不完全支持</sapn>

>在 `Fragmented MP4` 文件中含有三个非常关键的 boxes：moov, moof 和 mdat.

1. moov(movie metadata box):用于存放多媒体 `file-level` 的元信息.
2. mdat(media data box):和普通 MP4 文件的 mdat 一样,用于存放媒体数据,**不同的是普通 MP4 文件只有一个 mdat box,而 Fragmented MP4 文件中,每个 fragment 都会有一个 mdat 类型的 box**.
3. moof(movie fragment box):用于存放 fragment-level 的元信息.该类型的 box 在普通的 MP4 文件中是不存在的,**而在 Fragmented MP4 文件中,每个 fragment 都会有一个 moof 类型的 box**.

* 并且每一个 `FMP4` 都是由一个 `moov` 和多个 `fragment` 组成的,每一个仅仅包含一个 `mdat` 类型的 box,一个 `moof` 类型的 box.  

## MediaSource

>表示将要通过 `HTMLMediaElement` 播放的媒体资源

<img src="./img/pipeline_model.svg" height="400px">

### Static Methods

```js
const mime = 'video/mp4; codecs="avc1.640033, mp4a.40.2"'
MediaSource.isTypeSupported(mimeType)
```

* 返回一个布尔值,表示当前客户端的用户代理是否支持指定的 MIME 类型,是否它可以成功的为 MIME 类型创建 sourceBuffer 对象

>[video MimeCodec](https://www.jackpu.com/web-video-mimetype-jiu-jing-dai-biao-shi-yao-yi-si/)

```bash
'video/mp4; codecs="avc1.640033, mp4a.40.2"'
# 分成三部分
video/mp4
avc1.640033
mp4a.40.2
```

* `video/mp4` 即类似于 `text/plain`,`image/png` 这样的资源格式,常见的类型有以下几种

   ```bash
   video/webm
   video/mp4
   video/quicktime
   audio/mpeg
   audio/mpeg
   audio/ogg
   audio/mpeg
   ```

* `codec=?` 主要用于上面的编码,例如是 `H.264` 或者是 `H.265`
* `AVC`:表示基于 H.264 来进行编解码的.`vp9`:表示基于 VP9 来进行编解码的.`hevc`:表示视频是基于 H.265 编码的

```bash
avc1.PPCCLL

PP = profile_idc
CC = constraint_set flags
LL = level_idc
```

### Constructor

>`MediaSource` 构造函数返回一个没有分配 source buffers 新的 `MediaSource` 对象.<span style="color:red">并且返回一个 sourceBuffer 对象</span>

```js
const mediaSource = new MediaSource()
```

### value

> `sourceBuffers`:**只读属性**.返回一个 `SourceBufferList` 对象,表示当前的 `MediaSource` 对象中的所有的 `SourceBuffer` 对象.

   ```js
   media.sourceBuffers
   ```

> `readyState`:**只读属性**.返回一个表明当前状态的枚举,有三种可能的枚举

1. `closed`: 资源没有附着到目前的 media 元素
2. `open`: 资源附着到一个 media 元素并且准备去接收 `SourceBuffer` 对象
3. `ended`: 资源已经附着到一个 media 元素,但是流已经通过 outOfStream 方法结束了

> `duration`:读取或者设置当前正在播放的媒体元素的时长,单位是秒.

   ```js
   media.duration
   media.duration = 10
   ```

> `activeSourceBuffers`:**只读属性**.返回一个 `SourceBufferList` 对象,该对象包含了 `sourceBuffers` 中的 `SourceBuffer` 子集对象 — 提即供当前所选的视频轨道、启用的音频轨道和显示或者隐藏的字幕轨道的对象列表

### Events

* `sourceclose`: 当 `MediaSource` 实例不再附着到 `HTMLMediaElement` 上时触发
* `sourceended`: 当 `MediaSource` 实例已经附着到 `HTMLMediaElement` 上,但是已经调用了 `endOfStream()`
* `sourceopen`: 当 `MediaSource` 实例已经打开并准备好将数据附加到 `sourceBuffers` 中的 `sourceBuffer` 对象

```js
const mime = 'video/webm; codecs="vorbis,vp8"'
if (MediaSource.isTypeSupported(mime)) {
  const media = new MediaSource()
  video.src = URL.createObjectURL(media)
  media.addEventListener("sourceopen", sourceOpen)
} else {
  console.log("not supported")
}
```

### Methods

>`addSourceBuffer(mime)`:该方法会根据给定的 MIME 类型创建一个新的 SourceBuffer 对象，然后会将它追加到 MediaSource 的 SourceBuffers 列表中.返回新的 SourceBuffer 对象.

```js
media.addSourceBuffer(mimeType)
```

> `endOfStream(endOfStreamError?)`:该方法意味着流的结束.可选值为`"network"`或者`"decode"`

* `network`: 中止播放并出现网络错误的信号
* `decode`: 终止播放并出现解码错误的信号

   ```js
  function sourceOpen(e) {
    URL.revokeObjectURL(video.src)
    const media = e.target
    const sourceBuffer = media.addSourceBuffer(mime)
    const videoUrl = "./test.webm"
    fetch(videoUrl).then(
      response => response.arrayBuffer()
    ).then(
      data => {
        sourceBuffer.addEventListener("updateend", () => {
          if (!sourceBuffer.updating && media.readyState === 'open') {
            media.endOfStream()
          }
        })
        sourceBuffer.appendBuffer(data)
      }
    )
  }
   ```

>`removeSourceBuffer(sourceBuffer)`:该方法从与 `MediaSource` 关联的 `SourceBuffers` 列表中删除给定的 SourceBuffer

   ```js
   for (let i = 0; i < 10; i++) {
     const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
   }
   mediaSource.removeSourceBuffer(mediaSource.sourceBuffers[0]);
   ```
