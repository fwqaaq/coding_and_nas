---
title: node_event
date: 2022-05-17 18:33:13
author: Jack-zhang
categories: node
tags:
   - JS
   - node
summary: node中的事件模块
---

## events

>nodejs的大部分核心api都是围绕惯用的异步事件驱动架构构建的

* 例如: `net.Server`对象在每次有连接时触发;`fs.ReadSteam`在打开文件时触发事件;`stream`在每当有数据提供时触发事件
* 所有触发事件的对象都是`EventEmitter`类的实例.这些对象暴露了`eventEmitter.on()`函数,允许将一个或者多个函数绑定到对象触发的命名事件.通常,事件名称是驼峰式字符串
* 当`EventEmitter`对象触发事件时,所有绑定到该特定事件的函数都会被同步调用.被调用的监听器返回的任何值都将被忽略和丢弃

   ```js
   import EventEmitter from "events"
   
   const myEmitter = new EventEmitter()
   myEmitter.on("events", () => {
     console.log("events")
   })
   
   myEmitter.emit("events")
   ```

* 事件监听器返回并且使用以下事件:
  * 当监听器被添加时返回`newListener`
  * 当监听器被移除时返回`removerListener`

>将参数和this传给监听器

* `eventEmitter.emit()`方法允许将任意一组参数传给监听函数.

   ```js
   import EventEmitter from "events"
   const myEmitter = new EventEmitter()
   myEmitter.on("events", function (a, b) {
     console.log(a, b, this)
   })
   myEmitter.emit("events", 1, 2)
   //1 2 EventEmitter {
   //  _events: [Object: null prototype] { events: [Function (anonymous)] },
   //  _eventsCount: 1,
   //  _maxListeners: undefined,
   //  [Symbol(kCapture)]: false
   //}
   ```

* 使用箭头函数作为监听器,this关键字不再引用`EventEmitter`实例

>异步 VS 同步

* `EventEmitter`按照注册的顺序同步地调用所有监听器.这确保了事件的正确排序,并有助于避免竞争条件和逻辑错误. 在适当的时候,监听器函数可以使用 `setImmediate()` 或 `process.nextTick()` 方法切换到异步的操作模式

   ```js
   const myEmitter = new MyEmitter();
   myEmitter.on('event', (a, b) => {
     setImmediate(() => {
       console.log('this happens asynchronously');
     });
   });
   myEmitter.emit('event', 'a', 'b');
   ```

>仅处理事件一次

* 当使用`eventEmitter.on()`方法注册监听器时,每次触发命名事件时都会调用该监听器

   ```js
   const myEmitter = new MyEmitter();
   let m = 0;
   myEmitter.on('event', () => {
     console.log(++m);
   });
   myEmitter.emit('event');
   // 打印: 1
   myEmitter.emit('event');
   // 打印: 2
   ```

* 使用 `eventEmitter.once()` 方法,可以注册一个监听器,该监听器最多为特定事件调用一次.一旦事件被触发,则监听器就会被注销然后被调用.

   ```js
   const myEmitter = new MyEmitter();
   let m = 0;
   myEmitter.once('event', () => {
     console.log(++m);
   });
   myEmitter.emit('event');
   // 打印: 1
   myEmitter.emit('event');
   // 忽略
   ```

>错误事件

* 当`EventEmitter`实例中发生错误时,典型的操作是触发`'error'`事件.这些在 Node.js 中被视为特殊情况.
* 如果`EventEmitter`没有为error事件注册至少一个监听器,并且触发`error`事件,则会抛出错误,打印堆栈跟踪,然后退出Node.js进程

```js
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// 抛出错误并使 Node.js 崩溃
```

* 为了防止 Node.js 进程崩溃,可以使用`domain`模块.(但请注意,不推荐使用 node:domain 模块)
* 作为最佳实践,应始终为`error`事件添加监听器.

```js
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// 打印: whoops! there was an error
```

* 通过使用符号`events.errorMonitor`安装监听器,可以在不消费触发的错误的情况下监视`error`事件.

```js
const { EventEmitter, errorMonitor } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// 仍然抛出错误并使 Node.js 崩溃
```

> Promise

* 将`async`函数与事件句柄一起使用是有问题的,因为它会在抛出异常的情况下导致未处理的拒绝

```js
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
```

* `EventEmitter`构造函数中的`captureRejections`选项或全局的设置可以改变这种行为,在`Promise`上安装`.then(undefined, handler)`句柄.此句柄将异常异步地路由到`Symbol.for('nodejs.rejection')`方法(如果有)或`error`事件句柄(如果没有).

```js
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
```

设置 `events.captureRejections = true` 将更改 `EventEmitter` 的所有新实例的默认值.

```js
const events = require('node:events');
events.captureRejections = true;
const ee1 = new events.EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
```

由`captureRejections`行为生成的`error`事件没有捕获句柄以避免无限的错误循环:建议不要使用`async`函数作为`error`事件句柄.

### 常用事件

1. `emitter.addListener()`:`emitter.on()`的别名
2. `emitter.on()`:添加当事件触发时调用的回调函数
3. `emitter.emit()`:触发事件.按照事件被注册的顺序同步的调用每个事件监听器

   ```js
   myEmitter.emit("events")
   ```

4. `emitter.eventNames()`.返回字符串数组(表示在当前`EventEmitter`对象上注册的事件):

   ```js
   myEmitter.eventNames()
   ```

5. `emitter.getMaxListeners()`:获取到`EventEmitter`对象的监听器的最大数量(默认为10,但可以使用`setMaxListeners()`进行增加或减少)

   ```js
   myEmitter.getMaxListeners()
   ```

6. `emitter.setMaxListeners()`:设置可以添加到`EventEmitter`对象的监听器的最大数量(默认为 10,但可以增加或减少)

   ```js
   myEmitter.setMaxListener()
   ```

7. `emitter.listenerCount()`:获取作为参数传入的事件监听器的计数

   ```js
   myEmitter.listenerCount("open")
   ```

8. `emitter.off()`:`emitter.removeListener`的别名
9. `emitter.removeListener`:移除特定的监听器.可以通过将回调函数保存到变量中,方便以后引用

   ```js
   const doSomething = ()=>{}
   myEvent.on("open",doSomething)
   myEvent.removeListener("open",doSomething)
   ```

10. `emitter.removeAllListeners()`:移除`EventEmitter`对象的所有监听特定事件的监听器

   ```js
   door.removeAllListeners('open')
   ```

11. `emitter.once()`:添加当事件在注册之后首次触发时调用的回调函数.该事件只会被调用一次,不会再被调用.

   ```js
   import EventEmitter from "events"
   const ee = new EventEmitter()
   ee.once('myevent'()=>{
     //只调用一次
   })
   ```

12. `emitter.prependListener()`:当使用`on`或`addListener`添加监听器时,监听器会被添加到监听器队列中的最后一个,并且最后一个被调用.使用`prependListener`则可以在其他监听器之前添加并调用.

   ```js
   server.prependListener('connection', (stream) => {
     console.log('someone connected!');
   });
   ```

13. `emitter.prependOnceListener()`:当使用`once`添加监听器时,监听器会被添加到监听器队列中的最后一个,并且最后一个被调用.使用`prependOnceListener`则可以在其他监听器之前添加并调用.
