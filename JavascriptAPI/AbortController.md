
# AbortController

>`AbortController` 是一个简单的对象，当 abort() 方法被调用时，会在自身的 `signal` 属性上生成 **abort** 事件（并将 `signal.aborted` 设置为 true）

* 构造函数，创建一个新的 `AbortController` 实例

  ```js
  const controller = new AbortController()
  ```

* `abort()` 方法：它可以在 `DOM` 请求完成之前中断它（例如 Fetch）

   ```js
    controller.abort()
    ```

* `signal`：只读属性。返回一个 `AbortSignal` 实例对象，根据需要联系或者中断 DOM 请求

   ```js
   controller.signal
   ```

## AbortSignal

> `AbortSignal`：接口表示一个信号对象（signal object）,它允许您通过 AbortController 对象与 DOM 请求（如 Fetch）进行通信并在需要时将其中止。

### 属性

* `AbortSignal.aborted`：只读属性，返回一个布尔值，表示与 `DOM` 通讯的信号是否已被放弃

    ```js
    controller.signal.aborted
    ```

* `AbortSignal.reason`：一旦信号中断，返回提供中断原因的 `JavaScript` 的值

   ```js
   let res = signal.aborted ? `Request aborted with reason: ${signal.reason}` : 'Request not aborted'
   ```

### **方法**

* `AbortSignal.throwIfAborted()`：`AbortSignal` 的帮助选项，如果信号已中止，则抛出信号的中止原因，防止您不断的检查代码。

   ```js
   if(signal.aborted) throw new Error(...)
   //可以这样写
   signal.throwIfAborted()
   ```

  * 如果需要 `polyfill`，你可以这样写

   ```js
   function throwIfSignalAborted(signal){
    if(signal.aborted){
      threw new Error(...)
    }
   }
   ```

### **静态方法**

>`AbortSignal.timeout(time)`：方法返回一个 AbortSignal，它将在指定时间后自动中止

   ```js
   const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
   ```

>`AbortSignal.abort(reason?)`:该方法返回一个已经设置为 `aborted` 的 `AbortSignal`

* 为以下片段的简写

   ```js
   const controller = new AbortController();
   controller.abort();
   return controller.signal;
   ```

### **事件**

>`abort`:当信号被中止时触发

   ```js
   addEventListener('abort', event => { })
   onabort = event => { }
   ```

> 使用以上两个 API 中断请求

* 使用此方法中断请求：DOMException: The user aborted a request.

```js
const controller = new AbortController()
setTimeout(() => {
  controller.abort()
}, 10)
fetch("README.md", { signal: controller.signal }).then(res =>
  res.text()
).then(data => console.log(data)).catch(err => console.log(err))

//使用timeout
fetch("README.md", { signal: AbortSignal.timeout(10) })
```

## AbortController 和 AbortSignal

> 一个 `AbortController` 对象可以提供一个附加的从属信号，称之为 `AbortSignal`

```js
const controller = new AbortController()
const {signal} = controller
```

* controller 允许持有人通过 `controller.abort()` 方法中断请求
* signal 不能直接中断，但是可以传给 `fetch()` 等调用，或者直接接收其中止状态

你可以检查 `signal.aborted` 属性来确定是否已经中止请求，或者为 `abort` 事件增加事件监听器

>remove event handler

```js
const controller = new AbortController()
const signal = controller.signal
button.addEventListener("click", () => {
  console.log("signal")// 永远不会打印
},{signal})
console.log(signal.aborted)//false
controller.abort()
console.log(signal.aborted)//true
```

* 如果直接使用 `removeListener` 方法，则不能在 `addEventListener` 中直接使用回调函数。

> abort a fetch

```js
const controller = new AbortController()
setTimeout(() => {
  controller.abort()
}, 10)
fetch("README.md", { signal: controller.signal }).then(res =>
  res.text()
).then(data => console.log(data)).catch(err => console.log(err))
```

> AbortSignal.any(signals)

* 创建一个信号，如果任何传递的信号中止，该信号将被中止。同样，你可以自己创建它---但是请注意，如果你没有传递信号，派生的信号将永远不会中止

```js
function signalAny(signals){
  const controller = new AbortController()
  signals.forEach(signal => {
    if(signal.aborted){
      controller.abort()    
    }else{
      signal.addEventListener("abort",()=> controller.abort())
    }
  })
  return controller.signal
}
```
