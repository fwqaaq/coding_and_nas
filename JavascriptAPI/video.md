---
title: video
date: 2022-04-06 11:52:39
author: Jack-zhang
categories: JS
tags:
   - JS
summary: html中的video对象
---

## video标签

>\<video>实现了HTMLVideoElement这个接口.该接口继承了`HTMLMediaElement`和`HTMLElement`的属性和方法

* 浏览器并不都是支持相同的视频格式,你可以在\<source>中提供多个源,浏览器会使用他所支持的那个
  * \<video>标签的中间内容,是针对浏览器不支持此内容的降级处理

> \<video>标签的属性

1. `src`:该属性指向你想要嵌入的网页当中的视频,与\<img>标签的src相同
2. `width`和`height`:设置视频的宽度和高度
3. `controls`:`bool`.浏览器提供的控件界面,用户可以通过控件视频的回放功能
4. `autoplay`:`bool`.设置此元素视频会自动播放.但是也必须设置`muted`
5. `muted`:`bool`.默认值是false,意味着视频播放的时候音频也会播放.设置为true,音频会初始化为静音
   * 浏览器为了用户的体验考虑,限制了音视频的自动播放,最大限度地减少广告或者噪音等骚扰
6. `loop`:`bool`.指定后,会在视频结尾的地方自动返回视频开始的地方
7. `poster`:视频播放前显示的图像.封面图像
8. `preload`:浏览器是否需要缓存该视频
   * `none`:浏览器不会缓存该视频
   * `auto`:当页面加载后缓存该视频
   * `metadata`:仅缓存原视频的数据
9. `controlslist`(实验):用户在显示其自己的控件集时选择要在媒体元素上显示的控件
   * `nodownload`:禁止下载.隐藏下载的小控件
   * `nofullscreen`:隐藏全屏小控件
   * `noremoteplayback`:隐藏小窗口控件

### HTMLVideoElement

```html
<button id="pay">开始播放</button>
<button id="pau">暂停播放</button>
<video id="video" src="https://zyjcould.ltd/mv/player.mp4" height="300px" controls autoplay muted></video>
```

>该接口提供了用于操作视频对象的特殊属性和方法

* 由于不同的浏览器会支持不同的媒体格式.因此在提供媒体文件的时候,提供一种所有浏览器都支持的格式,或者提供格式不同的多个视频源来支持不同浏览器.

> 除了继承父对象`HTMLMediaElement`的属性之外,同时自己也实现了自身的属性

1. `height,width,preload`:看上文
2. `videoWidth,videoHeight`:只读.以`css pixels`单位给出的视频资源本身的大小.这个值考虑了大小,对比度,明度等等.而height,width只给出视频显示区域的大小

#### `HTMLMediaElement`对象的属性

* 除了支持**src,controls,autoplay,muted,loop,poster等**之外还支持以下属性(并不完全)
* 详细请看:<https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement>

1. `duration`:只读.媒体以秒为单位的总长度时间.视频的总时长
   * 如果媒体不可用,则为0
   * 如果媒体可用,但时间长度未知,值为NAN(可能未完全加载媒体)
   * 如果媒体是以stream形式传输并且没有预定长度,则值为Inf

   ```js
   video.addEventListener("loadeddata", function (e) {
     console.log(e.target.duration);
   })
   ```

2. `currentTime`:获取当前位置的播放时间,或者设置从某个位置开始播放

   ```js
   video.addEventListener("loadeddata", function (e) {
    console.log(e.target.currentTime );//0
   })
   ```

3. `volume`:音量.表示音频的音量.值从0.0(静音)到1.0(最大音量)
   * `muted`属性和`volume`属性没有关联关系,改变其中一个值另一个也不会改变

   ```js
   video.addEventListener("loadeddata", function (e) {
    console.log(e.target.volume);//1
   })
   ```

4. `ended`:只读.表示媒体是否已经播放完毕
5. `error`:只读,返回一个[`MediaError`](https://developer.mozilla.org/en-US/docs/Web/API/MediaError).表示对象最近的错误,没有错误返回error
6. `paused`:指示媒体元素是否被暂停
7. `defaultPlaybackRate`:控制媒体的播放速度.
   * 1.0表示正常的播放速度,如果值小于1.0,则播放速度会比"正常速度"慢,如果值大于1.0,则播放速度会比"正常速度"快
   * 如果是`0.0`是一个无效的值,并且会抛出错误

>`TimeRangs`:该接口用来表示一组时间范围,主要目的是跟踪供\<audio>和\<video>元素加载使用的媒体哪些部分已经被缓冲

* 一个TimeRangs对象包括一个或多个时间范围,其中每个都由一个开始偏移量和结束偏移量指定
  * 可以将你想要检索的时间范围的索引值传递给end()和start()方法来引用每个时间范围

* 视频一般情况下只有一个时间段,即`TimeRanges.length`值为1;如果进行了跳跃观看(例如3->4分钟这个时间段),并且跳跃内容并没有缓冲完毕,则会出现两个时间段,这时TimeRanges的length为2
  * TimeRanges个数会随着跳跃观看未缓冲完成的内容而增加,随着缓冲的完成而减少,最少为1个,即从开头到结尾
  * 参考:<https://developer.mozilla.org/zh-CN/docs/Web/Guide/Audio_and_video_delivery/buffering_seeking_time_ranges>

  ```bash
  ------------------------------------------------------
  |=============|                    |===========|     |
  ------------------------------------------------------
  0             5                    15          19    21
  ```

* 属性值:`length`:返回对象中时间范围的个数
* 方法:
  * `end(index)`:指定索引的范围的开始时间
  * `start(index)`:指定索引的范围的结束时间

* 以下三个属性皆实现了`TimeRangs`这个接口
  1. `buffered`:只读.buffered属性会告诉浏览器哪一部分的媒体已经被下载(返回一个TimeRangs对象)
  2. `played`:只读.媒体可被播放的范围
  3. `seekable`:(如果有)用户可以试图找到的寻求范围

* 何通过TimeRanges来判断video是否已经完全加载

```js
const buf = video.buffered
console.log(buf.length)
if (buf.length == 1) {
  // only one range
  if (buf.start(0) == 0 && buf.end(0) == v.duration) {
    console.log("hello")
    // The one range starts at the beginning and ends at
    // the end of the video, so the whole thing is loaded
  }
}
```

>`readyState`:媒体的就绪状态

| 常量              | 值  | 描述                                                                |
| ----------------- | --- | ------------------------------------------------------------------- |
| HAVE_NOTHING      | 0   | 没有关于媒体资源的可用信息                                          |
| HAVE_METADATA     | 1   | 已检索到足够的媒体资源,因此已初始化元数据属性寻求将不再引发异常     |
| HAVE_CURRENT_DATA | 2   | 数据可用于当前播放位置,但不足以实际播放多个帧                       |
| HAVE_FUTURE_DATA  | 3   | 当前播放位置以及至少一点点未来的数据是可用的(换句话说,至少两帧视频) |
| HAVE_ENOUGH_DATA  | 4   | 有足够的数据可用,下载速率足够高,媒体可以不间断地播放到底            |

>`networkState`:获取媒体时的网络状态

| 常量              | 值  | 描述                                              |
| ----------------- | --- | ------------------------------------------------- |
| NETWORK_EMPTY     | 0   | 还没数据.readyState是HAVE_NOTHING                 |
| NETWORK_IDLE      | 1   | 是有效的并且已经选择了一个资源,但是还没有使用网络 |
| NETWORK_LOADING   | 2   | 正在下载HTMLMediaElement 数据.                    |
| NETWORK_NO_SOURCE | 3   | 没有找到 HTMLMediaElement src                     |

#### HTMLMediaElement方法

>由于HTMLVideoElement本身的方法还在实验性中,这里使用HTMLMediaElement父元素的方法

* `play()`:开始播放
* `pause()`:暂停播放

```js
pay.addEventListener("click", function () {
  video.play()
})
pau.addEventListener("click", function () {
  video.pause()
})
```

* `canPlayType(in DOMString type)`:返回以下属性
  * `probably`:如果指定的类型似乎可以播放
  * `maybe`:如果不播放就无法判断该类型是否可播放
  * `空字符串`:如果指定的类型肯定不能播放

```js
console.log(video.canPlayType('video/webm'))//maybe
```

* `load()`:重置媒体元素并重新选择媒体资源.任何未决事件都将被丢弃.获取多少媒体数据仍受`preload`属性的影响
  * 此方法可用于在删除任何`src`属性和\<source>来放资源
  * 通常不需要使用此方法,除非需要在动态更改后重新扫描\<source>元素

## video事件

1. `loadstart`:浏览器开始寻找指定的音频/视频时触发

   ```js
   video.addEventListener("loadstart", function (e) {
     //由于没有视频资源,所以duration是null
    console.log("loadstart", e.target.duration)
   })
   ```

2. `durationchange`:时长变化的时候.音频/视频的时长数据发生变化时触发,时长由NaN变为音频/视频的实际时长

   ```js
   video.addEventListener("durationchange", function (e) {
     console.log("durationchange", e.target.duration)//视频总时长
   })
   ```

3. `loadedmetadata`:元数据加载的时候.音频/视频的元数据已加载时触发,元数据包括:时长,尺寸(仅视频)以及文本轨道

   ```js
   video.addEventListener("loadedmetadata", function (e) {
     console.log("loadedmetadata", e.target.duration)//视频总时长
   })
   ```

4. `progress`:浏览器下载监听.当浏览器正在下载指定的音频/视频时触发

   ```js
   video.addEventListener("progress", function (e) {
     console.log("progress")
   })
   ```

5. `loadeddata`:视频的首帧已经加载时,但没有足够的数据来播放指定音频/视频的下一帧时触发

   ```js
   video.addEventListener("loadeddata", function (e) {
     console.log("loadeddata")
   })
   ```

6. `canplay`:可播放监听.当浏览器能够开始播放指定的音频/视频时触发

   ```js
   video.addEventListener("canplay", function (e) {
     console.log("canplay")
   })
   ```

7. `canplaythrough`:可流畅播放.在不停下来进行缓冲的情况下持续播放指定的音频/视频时触发

   ```js
   video.addEventListener("canplaythrough", function (e) {
     console.log("canplaythrough")
   })
   ```

8. `play`:播放监听.

   ```js
   video.addEventListener("play", function (e) {
     console.log("play")
   })
   ```

9. `pause`:暂停监听

   ```js
   video.addEventListener("pause", function (e) {
     console.log("pause")
   })
   ```

10. `seeking`:当用户开始移动/跳跃到音频/视频中新的位置时触发

   ```js
   video.addEventListener("seeking", function (e) {
     console.log("seeking")
   })
   ```

11. `seeked`:当用户已经移动/跳跃到视频中新的位置时触发

   ```js
   video.addEventListener("seeked", function (e) {
     console.log("seeked")
   })
   ```

12. `waiting`:视频加载等待.当视频由于需要缓冲下一帧而停止,等待时触发
    * 当触发play事件的时候,如果视频还没有加载好,就会触发waiting

   ```js
   video.addEventListener("waiting", function (e) {
     console.log("waiting")
   })
   ```

13. `playing`:当视频在已因缓冲而暂停或停止后已就绪时触发

   ```js
   video.addEventListener("playing", function (e) {
     console.log("playing")
   })
   ```

14. `timeupdate`:当播放位置已更改,播放时间更新

   ```js
   video.addEventListener("timeupdate", function (e) {
     console.log("timeupdate")
   })
   ```

15. `ended`:播放结束的时候

   ```js
   video.addEventListener("ended", function (e) {
     console.log("ended")
   })
   ```

16. `error`:播放错误

   ```js  
   video.addEventListener('error', function(e) {
     console.log('error')
   })
   ```

17. `volumechange`:当音量更改时

   ```js
   video.addEventListener('volumechange', function(e) {
     console.log('volumechange')
   })
   ```

18. `stalled`:当浏览器尝试获取媒体数据,但数据不可用时

   ```js
   video.addEventListener('stalled', function(e) {
     console.log('stalled')
   })
   ```

19. `ratechange`:当视频的播放速度已更改时

   ```js
   video.addEventListener('ratechange', function(e) {
     console.log('ratechange')
   })
   ```

20. `emptied`:媒体内容为空时触发.例如,当这个`media`已经加载完成(或者部分加载完成).`load()`被用来进行重新加载

>注意点:

* 你可以用CSS属性[`object-position`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-position) 来调整视频在元素内部的位置,它可以控制视频尺寸适应于元素外框的方式.
* 如果想在视频里展示字幕或者标题,你可以在 [`<track>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/track) 元素和 [WebVTT](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API) 格式的基础上使用 JavaScript 来实现.详情请见 [Adding captions and subtitles to HTML5 video](https://developer.mozilla.org/en-US/docs/Web/Apps/Fundamentals/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video)

## [画中画](https://developer.mozilla.org/zh-CN/docs/Web/API/PictureInPictureWindow)

* HTML中的属性:
  * `autoPictureInPicture`:该属性指示视频是否应自动进入或离开画中画模式
    * 如果是`true`:视频在更改选项卡和/或应用程序时应自动进入或离开画中画模式
  * `disablePictureInPicture`:阻止用户代理(`User-Agent`)是否应该向用户建议画中画功能,或者请求它自动
    * 如果是`true`,表示用户代理(请求头中的[`User-Agent`](https://developer.mozilla.org/en-US/docs/Glossary/User_agent))不应向用户建议该功能(就是画中画不能播放)

* 方法:
   1. `HTMLVideoElement.requestPictureInPicture()`:异步请求,以画中画模式显示视频
      * 如果成功进入画中画了.会触发`enterpictureinpicture`事件,让它知道它现在处于画中画状态
      * 返回一个`PictureInPictureWindow`对象
   2. `Document.exitPictureInPicture()`将此文档中包含的视频(当前处于浮动状态)从画中画模式中取出,从而恢复屏幕的先前状态
      * 返回值一个Promise,一旦用户代理完成退出画中画模式,就会解析.如果发生错误,那么会调用promise处理
      * 语法:`exitPromise = document.exitPictureInPicture();`
* 属性:`Document.pictureInPictureEnabled`.指示画中画模式是否可用.默认情况下,画中画模式可用

* 事件:
  * `enterpictureinpicture`:当视频成功进入画中画模式时,将触发该事件.`enterpictureinpicture`此事件不可取消,也不会冒泡
  * `leavepictureinpicture`:当视频元素成功离开画中画模式时,将触发该事件.`leavepictureinpicture`此事件不可取消,也不会冒泡

* `PictureInPictureWindow`接口是一个对象,它可以通过编程的方式获得浮动视频窗口的宽度和高度,并调整浮动视频窗口的大小.
  * 使用`HTMLVideoElement.requestPictureInPicture()`返回一个具有此接口的promise
  * `width,height`:只读.返回小窗口的高度和宽度
  * `resize`:监听小窗口调整大小的事件

```js
video.addEventListener('enterpictureinpicture', function(event) {
  const smallWindow = event.pictureInPictureWindow;
  // smallWindow就是一个PictureInPictureWindow对象
  smallWindow.addEventListener('resize', function (event) {
    //event.targe就是smallWidth
    // event.target.width是小视频窗口的宽度
    // event.target.width是小视频窗口的高度
  });
});
```

### 实现画中画

> 实现画中画不可缺少的就是观察者模式(IntersectionObserver)的使用
> .
> 如果对观察者不熟,可以看<https://juejin.cn/post/7075666393508773895>

* 第一种方式使用vue的`teleport`组件<http://mail.zyjcould.ltd/player/#/player>.
* [仓库地址](https://github.com/Jack-Zhang-1314/player)

* 第二种就是使用`autoPictureInPicture`实现小窗口传送
* 由于谷歌浏览器原生的政策,画中画暂时还是不能使用原生很好的支持

```html
<body style="height: 2000px;">
  <video id="video" src="https://zyjcould.ltd/mv/player.mp4" autoPictureInPicture="true" height="300px"
    controls></video>
</body>
<script type="module">
  const v = document.querySelector("#video")
  const observe = new IntersectionObserver((entries, observe) => {
    entries.forEach(entry => {
      console.log("jinru")
      if (!entry.intersectionRatio) {
        v.requestPictureInPicture()
      } else if (v.readyState > 0 && entry.intersectionRatio) {
        document.exitPictureInPicture().then(
          value => console.log(value),
          error => console.log(error)
        )
      }
    })
  })
  observe.observe(v)
</script>
```

1. 第一个错误是由于为使用用户手势,也就是必须要点击视频(可以是任何位置)才可以触发小窗口

   ```bash
   Uncaught (in promise) DOMException: Failed to execute 'requestPictureInPicture' on 'HTMLVideoElement': Must be    handling a user gesture if there isn't already an element in Picture-in-Picture.
   ```

2. 第二个错误,是因为,用户代理事件是有生命周期的,触发小窗口切换来回之后(或者在可能是5s)内会死亡

   ```bash
   DOMException: Failed to execute 'exitPictureInPicture' on 'Document': There is no Picture-in-Picture element in    this document.
   ```

* 这里有详解的错误原因
* <https://stackoverflow.com/questions/56252108/why-video-requestpictureinpicture-works-only-once>
