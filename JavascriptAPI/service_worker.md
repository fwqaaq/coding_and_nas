# [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)

> Service Worker 更类似于服务端的角色，它可以对前端的**请求**和资源的缓存进行控制

1. 首先，需要使用 [serviceWorkerContainer.register()](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer) 去注册。使用 [navigator.serviceWorker](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/serviceWorker) 可以返回 `serviceWorkerContainer`，并且注册成功的 service worker 会在 [serviceWorkerGlobalScope](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope) 中执行，这是一种特殊的上下文，其中并不会有 DOM 权限
2. `install` 事件。用于安装 service worker。
   * 由于我们不希望同一 service worker 的两个不同版本同时运行，如果有先前的版本处于活动状态并打开页面，那么 service worker 的新版本不会运行
   * 如果所有的 service worker 都已经关闭，那么才会安装新的 service worker。
   * 如果要立即更新 service worker，可以使用 [skipWaiting](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting) 去跳过等待，要求立即激活。

   ```js
   self.addEventListener("install", (event) => {
     self.skipWaiting()
   })
   ```

3. 新的 service worker 会立即收到 `activate` 事件，该事件主要用于清理过时的 service worker。
4. 激活后，service worker 会立刻控制只有那些在 register() 成功后打开的页面（<span style="color:red">文档必须重新加载才能真正的受控制，因为文档不管 service worker 是否存在的情况下就已经存在，并在其生命周期维护</span>）。

如果我们使用 `register()` 注册成功，它会使用 [ServiceWorkerRegistration](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration) 对象来兑现。

> 注意

* 在 HTTPS 下运行你的程序。
* service worker 文件的地址没有写对——需要相对于源（origin），而不是 app 的根目录。例如，worker 是在 <https://mdn.github.io/sw-test/sw.js，app> 的根目录是 <https://mdn.github.io/sw-test/>，你需要写成 `/sw.js`。
* 不允许你的 app 指向**不同源**（origin）的 service worker。
* service worker 只能在 **service worker 作用域**里捕获客户端发出的请求。
* service worker 最大的作用域是 worker 所在的位置（换句话说，如果脚本 `sw.js` 位于 `/js/sw.js` 中，<sapn style="color:red">默认情况下它只能控制 `/js/` 下的 URL</sapn>）。可以使用该 **Service-Worker-Allowed** 标头指定该 worker 的最大范围列表。

## 事件

> [serviceWorkerGlobalScope](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope)，这是 service worker 的全局上下文。如果在 service worker 中，可以使用 self 代替。

* 例如 fetch、install、push 等

> serviceWorkerContainer，它是由 navigator.serviceWorker 方法返回的。

* `controllerchange`：该事件在 ServiceWorkerRegistration 获取新的活动的 worker 时触发。
* [`message`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/message_event)：该事件用于在受控制的页面接收从 service worker 传来的消息

```js
// event.data 用于接收 service worker 客户端传来的数据
navigator.serviceWorker.addEventListener('message', event => progress(event.data))
```

> ServiceWorkerRegistration 实例，它是由 serviceWorkerContainer.register() 方法成功之后兑现的

* `updatefound` 事件，该事件会在 ServiceWorkerRegistration.installing 获取新的 service worker 时触发。

```js
reg.onupdatefound = function () {
  const newSw = reg.installing
  newSw.onstatechange = function () {
    // 一直处于等待状态
    if (newSw.state === 'installed') {
      document.getElementById('new-service-worker-installed').style.display = 'block'
    }
  }
}
```

> Service Worker 实例，它是由 ServiceWorkerRegistration 的 `installing`（正在下载）、`waiting`（等待）或者 `active`（已激活）属性返回。

* `error`，在 service worker 中发生错误时触发

```js
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('service-worker.js');
  navigator.serviceWorker.ready.then((registration) => {
    registration.active.onerror = (event) => {
      console.log('An error occurred in the service worker!')
    }
  })
}
```

* `statechange`：每当 ServiceWorker.state 更改时，statechange 事件都会触发。

## Client

>[Client](https://developer.mozilla.org/en-US/docs/Web/API/Client) 表示 worker 的执行上下文，可以使用 [`Clients`](https://developer.mozilla.org/en-US/docs/Web/API/Clients) 获得

```js
self.clients.get(id).then((client) => {
  self.clients.openWindow(client.url);
})
```

* postMessage(message, transfer?)，该事件可以将数据从 service worker 中传递给受控页面

```js
client.postMessage({ loaded, total })
```
