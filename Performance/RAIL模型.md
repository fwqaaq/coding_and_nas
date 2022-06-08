# RAIL

>Rail是一个以用户为中心的性能模型,他把用户的体验拆分成几个关键点(`Response`(响应),`Animation`(动画),`Idle`(空闲),`Load`(加载))

![ ](https://web-dev.imgix.net/image/admin/uc1IWVOW2wEhIY6z4KjJ.png?auto=format&w=964)

* 用户感知

| 延迟时间        | 用户感知                   |
| --------------- | -------------------------- |
| 0-16ms          | 很流畅                     |
| 0-100ms         | 基本流畅                   |
| 100-1000ms      | 感觉到网站上有一些加载任务 |
| 1000ms or more  | 失去耐心了                 |
| 10000ms or more | 直接离开,不会再访问了      |

## Response

>用户的输入到响应的时间不超过100ms,给用户的感受是瞬间就完成

* **优化方案**:
  1. 事件处理函数在50ms内完成,考虑搭配`idle task`的情况,事件会排队,等待事件大概在50ms.适用于`click`,`toggle`,`starting` `animations`等,不适用于drag和scroll
  2. 复杂的js计算尽可能放在后台,如`web worker`,避免对用户输入造成阻塞
  3. 超过50ms的响应,一定要提供反馈,比如倒计时,进度百分比等
* 空闲任务如何影响输入响应预算
* ![空闲任务如何影响输入响应预算](https://web-dev.imgix.net/image/admin/I7HDZ9qGxe0jAzz6PxNq.png?auto=format&w=964)

## Animation

> 目标为流畅的视觉效果,用户会注意到帧速率的变化

* 在10ms或者更短的时间生成动画的每一帧.从技术上讲,每帧的最大预算为16ms(1000ms/60帧).但是浏览器需要大约6ms来渲染一帧,因此,准则为美珍10ms.

* **优化方案**
  * 在一些高压点上,比如动画,不要去挑战cpu,尽可能地少做事(如取offset,设置style等操作).尽可能地保证60帧的体验.
  * 在渲染性能上,针对不同的动画做一些特定优化

>动画不只是UI的视觉效果,以下行为都属于
>
> * 视觉动画,如渐隐渐显,tweens,loading等
> * 滚动,包含弹性滚动,松开手指后,滚动会持续一段距离
> * 拖拽,缩放,经常伴随着用户行为

## Idle

>最大限度增加空闲时间以提高页面在 50 毫秒内响应用户输入的几率.

* **优化方案**:
  * 利用空闲时间完成延缓的工作.例如,对于初始页面加载,应加载尽可能少的数据,然后利用空闲时间加载其余数据.
  * 在 50 毫秒或更短的空闲时间内执行工作.如果时间更长,您可能会干扰应用在 50 毫秒内响应用户输入的能力.
  * 如果用户在空闲时间工作期间与页面交互,则应中断空闲时间工作,用户交互始终具有最高优先级.

## Load

>* 优化加载速度,可以根据设备、网络等条件.目前,比较好的一个方式是,让你的页面在一个中配的3G网络手机上打开时间不超过5秒
>* 对于第二次打开,尽量不超过2秒

* **优化方案**
  * 在手机设备上测试加载性能,选用中配的3G网络（400kb/s,400ms RTT）,可以使用[WebPageTest](https://www.webpagetest.org/easy)来测试
  * 要注意的是,即使用户的网络是4G,但因为丢包或者网络波动,可能会比预期的更慢
  * [禁用渲染阻塞的资源,延后加载](https://web.dev/render-blocking-resources/)
  * 可以采用[lazy load](https://web.dev/browser-level-image-lazy-loading/),[code-splitting](https://web.dev/fast/)等其他优化手段,让第一次加载的资源更少

## 分析RAIL用的工具

* [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
* [Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=zh)
* [WebPageTest](https://www.webpagetest.org/easy)
