---
title: process
date: 2022-05-09 22:55:33
author: Jack-zhang
categories: node
tags:
   - JS
   - node
summary: node中的process模块
---

* 参考:<http://nodejs.cn/api/process.html#processexecargv>

## process

> process 位于全局模块，不需要使用加载模块

* process的主要事情
   1. 获取进程信息（资源使用、运行环境、运行状态）
   2. 执行进程操作（监听事件、调度任务、发出警告）

### 内存

>menoryUsage()：描述 Node.js 进程的内存使用情况

```js
console.log(process.memoryUsage())
// {
//   rss: 28729344,
//   heapTotal: 8060928,
//   heapUsed: 6062024,
//   external: 976895,
//   arrayBuffers: 17342
// }
```

* `rss`：常驻集大小，是进程在主内存设备（即总分配内存的子集）中占用的空间量，包括所有 **C++** 和 **JavaScript** 对象和代码
  * ![ ](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/30/163b10282fbb4e46~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)
* `heapTotal` 和 heapUsed 指的是 V8 的内存使用量
* `external` 指的是绑定到 V8 管理的 JavaScript 对象的 C++ 对象的内存使用量
* `arrayBuffers`：是指为 `ArrayBuffer` 和 `SharedArrayBuffer` 分配的内存，包括所有 Node.js `Buffer` 这也包含在 `external` 值中当 Node.js 被用作嵌入式库时，此值可能为 0，因为在这种情况下可能不会跟踪 `ArrayBuffer` 的分配

> cpuUsage()：返回当前进程的用户和系统 CPU 时间使用情况

* 可以传入参数，参数时之前的 `process.cpuUsage()`

```js
console.log(process.cpuUsage())
//{ user: 62000, system: 78000 }
```

### 运行环境

>cwd()：返回 Node.js 进程的当前工作目录

```js
console.log(process.cwd)
//E:\Project\hexoPage
```

>version：node 版本信息

```js
console.log(node.version)//v16.14.2
```

>versions：返回 Node.js 的版本字符串及其依赖项

```js
console.log(node.versions)
// {
//   node: '16.14.2',
//   v8: '9.4.146.24-node.20',
//   uv: '1.43.0',
//   zlib: '1.2.11',
//   brotli: '1.0.9',
//   ares: '1.18.1',
//   modules: '93',
//   nghttp2: '1.45.1',
//   napi: '8',
//   llhttp: '6.0.4',
//   openssl: '1.1.1n+quic',
//   cldr: '40.0',
//   icu: '70.1',
//   tz: '2021a3',
//   unicode: '14.0',
//   ngtcp2: '0.1.0-DEV',
//   nghttp3: '0.1.0-DEV'
// }
```

>arch：返回当前操作系统的架构

```js
console.log(process.arch)
//x64
```

>env：返回包含用户环境的对象

```js
console.log(process.env)
//设置用户变量
process.env.NODE_ENV = 'production'
```

>platform：用户操作系统的平台

```js
console.log(process.platform)
//win32
```

### 运行状态

* 运行状态指当前进程的运行相关的信息包括启动参数、执行目录、主文件、PID信息、运行时间

> 启动参数

* `argv` 获取非命令行选项的所有信息
* `argv0` 则获取 argv[0] 的值
* `execArgv` 进程启动时传入的一组特定于 `Node.js` 的命令行选项。这些选项可用于衍生与父进程具有相同执行环境的子进程
  * 选项不会出现在 `process.argv` 属性返回的数组中，也不包括 `Node.js` 可执行文件，脚本名称或脚本名称后面的任何选项

```js
// node --harmony a.js --version
console.log(process.argv)
console.log(process.argv0)
console.log(process.execArgv)
// [
//   'E:\\envPath\\node\\node\\node.exe',
//   'E:\\Project\\hexoPage\\a.js',
//   '--version'
// ]
// E:\envPath\node\node\node.exe
// [ '--harmony' ]
```

>execPath：执行目录

```js
console.log(process.execPath)
// E:\envPath\node\node\node.exe
```

>uptime()：运行时间

```js
console.log(process.uptime())
// 0.5094782
```

### 标准I/O流

### 进程

>pid:返回进程的ID名称
>
>ppid:属性返回当前进程的父进程的ID名称

```js
console.log(process.pid)
console.log(process.ppid)
// 30316
// 32772
```

>exitCode：进程退出码的数字
>
> exit([code]):以 code 的退出状态同步终止进程

* `exitCode`：当进程正常退出或通过 `process.exit()` 退出而不指定代码时，将作为进程退出码的数字
  * 将代码指定为 `process.exit(code)` 将覆盖 `process.exitCode` 的任何先前设置
* `exit()`：以 `code` 的退出状态同步终止进程
  * 如果省略 code，则退出将使用**成功**代码 `0` 或 `process.exitCode`的值（如果已设置）
  * 执行 Node.js 的 `shell` 应该看到退出码为 1
  * 调用 `process.exit()` 将强制进程尽快退出，即使仍有未完全完成的异步操作挂起，包括对 `process.stdout` 和 `process.stderr` 的 I/O 操作

>kill(pid[, signal])

* `pid`：进程标识
* `signal`：要发送的信号，可以是字符串或者数字。默认值 `SIGTER`

* 如果使用 `pid` 来杀死进程组，则 `Windows` 平台将抛出错误。它实际上只是信号发送者，发送信号可能是做其他事情，而不一定是杀死进程

```JS
import process, { kill } from 'node:process'

process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.')
})

setTimeout(() => {
  console.log('Exiting.')
  process.exit(0)
}, 100)

kill(process.pid, 'SIGHUP')
```

>title：返回当前进程的标题（即 ps 列出的值）

* 为`process.title`分配一个新值会修改ps的当前值

```js
process.title = "hhh"
console.log(process.title)
//hhh
```

>process.abort()：立即退出,并生成核心文件

```js
process.abort()
```

>nextTick(callback[, ...args])

* `callback`：需要传入的回调函数
* `...args`：回调函数需要传入的额外参数
* 在 mjs 的 `eventloop` 中 `Promise` 的执行顺序大于 `nextTick`
* 在 cjs 的 `eventloop` 中 `Promise` 的执行顺序小于 `nextTick`

```js
process.nextTick(() => {
  console.log('nextTick');
})
Promise.resolve().then(() => {
  console.log('promise');
})
queueMicrotask(() => {
  console.log('queueMicrotask');
})
//mjs:promise>queueMicrotask>nextTick
//cjs:nextTick>promise>queueMicrotask
```

* `queueMicrotask()`：使用**微任务队列**来执行回调函数。微任务队列会在 Eventloop 之前执行完，如果在 Eventloop 中加入微任务队列，会在下一次 eventloop 开头的时候执行完微任务队列
  * setTimeout 在第一次 EventLoop 阶段会等定时器结束将自己的回调放入 timer 中，等到下一次再执行
  * 首先从上往下执行先将 `p1` 这个微任务放入微任务队列中，之后将 `queueMicrotask` 放入微任务
  * 取出 `p1` 这个微任务执行 `console`，里面的 `q1` 和 `p2`，继续放入微任务队列，然后执行下一个微任务 `queueMicrotask`
  * ...

```js
//mjs
process.nextTick(() => {
  console.log('nextTick');
})

Promise.resolve().then(() => {
  console.log("p1")
  queueMicrotask(() => {
    console.log('q1');
    queueMicrotask(() => {
      console.log('q2');
    })
  })
  Promise.resolve().then(() => {
    console.log("p2")
  })
})
queueMicrotask(() => {
  console.log('queueMicrotask');
})
setTimeout(() => {
  console.log('setTimeout');
}, 1)
// p1
// queueMicrotask
// q1
// p2
// q2
// nextTick
// setTimeout
```

* 尽量使用`queueMicrotask()`而不是`process.nextTick()`

### report

>一个对象，其方法用于为当前进程生成诊断报告

```js
{
  writeReport: [Function: writeReport],
  getReport: [Function: getReport],
  directory: [Getter/Setter],
  filename: [Getter/Setter],
  compact: [Getter/Setter],
  signal: [Getter/Setter],
  reportOnFatalError: [Getter/Setter],
  reportOnSignal: [Getter/Setter],
  reportOnUncaughtException: [Getter/Setter]
}
```

* `compact`：默认值 `false`。以紧凑的单行 `JSON` 格式编写报告
* `direction`：默认是 `''`,将 report 写入 Node.js 进程的当前工作目录
* `filename`：写入的文件名称
* `signal`：默认值 `SIGUSR2`，用于触发诊断报告创建的信号
* `reportOnFatalError`：默认值 `false`。根据致命错误（如内存不足错误或 C++ 断言失败）生成诊断报告
* `reportOnSignal`：默认值 `false`。在进程收到指定的信号时生成诊断报告
* `reportOnUncaughtException`：默认值 `false`。在未捕获的异常时生成诊断报告
* `writeReport([filename][, err])`：该函数用于将 report 写入指定文件
  * `filename`写入 report 的文件名称
  * `err`：报告 JavaScript 堆栈的自定义错误
* `getReport([err])`：
  * `error`：如果存在,报告 JavaScript 堆栈的自定义错误出错的地方

```js
process.report.compact = true
process.report.directory = "./"
process.report.writeReport("report.json")
//写了 filename 就不需要传入文件名参数
```
