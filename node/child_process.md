---
title: child_process
date: 2022-05-10 19:56:38
author: Jack-zhang
categories: node
tags:
   - JS
   - node
summary: node中的child_process模块
---

## 异步流程

> child_process.spawn()、child_process.fork()、child_process.exec() 和 child_process.execFile() 方法都遵循其他 Node.js API 的典型惯用异步编程模式

* 每个方法都会返回一个 `ChildProcess` 实例，这些对象实现 `Node.js` 的 `EventEmitter` API，允许父进程注册在子进程的生命周期中发生某些事件时调用的侦听器函数
  * `exec`，`execFile` 创建时可以指定 `timeout` 属性设置超时时间，一旦创建的进程运行超过设定的时间将会被杀死。`spawn` 不可以
  * `exec` 适合执行已有的命令，`execFile` 适合执行文件
  * `exec`、`execFile`、`fork`都是 spawn 的延伸应用，底层都是通过 spawn 实现的

| options     | 参数说明                                                                                             |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| cwd         | 默认值 `process.cwd()` 当前工作路径                                                                    |
| env         | 默认值 `process.env` 环境变量                                                                          |
| encoding    | 编码，默认是 `utf8`                                                                                    |
| shell       | 用来执行命令的 `shell`，`unix` 上默认是 `/bin/sh`，windows 上默认是 cmd.exe                                 |
| timeout     | 默认是 `0`                                                                                            |
| killSignal  | 默认是 `SIGTERM`                                                                                      |
| uid         | 执行进程的 `uid`                                                                                      |
| gid         | 执行进程的 `gid`                                                                                      |
| maxBuffer   | 标准输出，错误输出最大允许的数据量（单位为字节），如果超出的话，子进程就会被杀死。默认是 `200*1024`（即 200k） |
| windowsHide | 默认值 false。隐藏通常在 `Windows` 系统上创建的子进程控制台窗口                                          |

### spawn(command\[, args][, options])

1. `command`：要执行的命令
2. `args`：字符串参数列表
3. `options`：参数说明，其它重复的参数不在重复

> 异步衍生子进程，不会阻塞父进程的执行

```js
import { spawn } from 'child_process'
const ls = spawn('ls'， ['-lh', '/usr'])

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`)
})

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`)
})

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`)
})
```

> spawn 自带的 options 参数

1. `detached`，如果为 true，使子进程能够在父进程退出后继续运行
2. [`stdio`：](https://nodejs.org/dist/latest-v16.x/docs/api/child_process.html#optionsstdio)
   * `'pipe'`：默认值。相当于 `['pipe', 'pipe', 'pipe']`
     * 在子进程和父进程之间创建管道
   * `'overlapped'`：相当于 `['overlapped', 'overlapped', 'overlapped']`
     * 与 `'pipe'` 相同，只是在参数上设置了 `FILE_FLAG_OVERLAPPED` 标志
   * `'ignore'`：相当于 `['ignore', 'ignore', 'ignore']`
     * 指示 Node.js 忽略子进程中的文件描述符
   * `'inherit'`：相当于 `['inherit', 'inherit', 'inherit']` 或 `[0, 1, 2]`（0、1 和 2 分别对应于标准输入、标准输出和标准错误）
     * 通过相应的标准输入输出流传入/传出父进程

>当使用 detached 选项启动长时间运行的进程时，进程在父进程退出后**不会一直在后台运行**，想要长时间运行需要提供 stdio

```js
import { spawn } from 'child_process'
const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore'
});

subprocess.unref();
```

### exec(command\[, options][, callback])

>创建一个shell,然后在shell里执行命令.执行完成后,将`stdout`,`stderr`作为参数传入回调方法

```js
exec("echo 'hello world' >> a.txt", (error, stdout, stderr) => {
  if (error) console.log(error);
  console.log(stdout);
  console.log(stderr);
});
```

### child_process.execFile(file\[, args]\[, options][, callback])

> 跟exec类似,但是不会创建一个新的shell,options和exec一样

* 执行shell脚本命令

```js
execFile("./a.sh", (error, stdout, stderr) => {
  if (error) console.log(error);
  console.log(stdout);
  console.log(stderr);
});
```

### child_process.fork(modulePath\[, args][, options])

1. `modulePath`：子进程运行的模块
2. `args`：字符串参数列表
3. `options`：参数如下所示。其中与 exec 重复的参数就不重复介绍
   * `execPath`：用来创建子进程的可执行文件，默认是 `/usr/local/bin/node`。也就是说通过 execPath 来指定具体的 node 版本
   * `execArgv`：传给可执行文件的字符串参数列表。默认是 `process.execArgv`，跟父进程保持一致
   * `silent`：默认是 `false`，即子进程的 `stdio` 从父进程继承。如果是 true，则直接 `pipe` 向子进程的 `child.stdin`，`child.stdout` 等
   * `stdio`：选项用于配置在父进程和子进程之间建立的管道，如果声明了 stdio，则会覆盖 silent 选项的设置

```js
//child3.js
console.log('Ending...');
```

>默认 silent 为 false，子进程会继承父进程

```js
const { fork } from "";

console.log('Starting...');
fork('./child3.js', {
  silent: true
});
```

> 设置 silent 为 true，则子进程不会输出

```js
fork('./child3.js', {
  silent: true
});
```

>通过 stdout 属性，可以获取到子进程输出的内容

```js
const child3 = fork('./child3.js', {
  silent: true
});

child3.stdout.setEncoding('utf8');
child3.stdout.on('data', function (data) {
  console.log('stdout 中输出:');
  console.log(data);
});
```

## 同步流程

> child_process.spawnSync()、child_process.execSync() 和 child_process.execFileSync() 方法是同步的，将阻塞 Node.js 事件循环，暂停任何其他代码的执行，直到产生的进程退出

* 像这样的阻塞调用对于简化通用脚本任务和在启动时简化应用**程序配置的加载/处理非常有用**
* 参数和异步的相同

## 事件

1. **close事件**：子进程的stdio流关闭时触发
2. **disconnect事件**：事件在父进程手动调用 `child.disconnect` 函数时触发
3. **error事件**：产生错误时会触发
4. **exit事件**：子进程自行退出时触发
5. **message事件**：它在子进程使用 `process.send()` 函数来传递消息时触发

```js
import { fork } from 'child_process';

const child = fork('./child3.js')

child.on('close', (code, signal) => {
  console.log('close 事件：', code, signal);
})

child.on('disconnect', () => {
  console.log('disconnect 事件...');
})

child.on('error', (code, signal) => {
  console.log('error 事件：', code, signal);
})

child.on('exit', (code, signal) => {
  console.log('exit 事件：', code, signal);
})

child.on('message', (val) => {
  console.log('message 事件：', val);
})

child.on('spawn', () => {
  console.log('spawn 事件');
})

//child3.js
console.log('starting...');
process.send("子线程...")
// starting...
// spawn事件
// message 事件： 子线程...
// exit 事件： 0 null
// close 事件： 0 null
```

## 进程间通信

* 通过以上 4 种 API 创建子进程后，父进程与子进程之间将会创建 `IPC` 通道，通过 `IPC` 通道，父子进程之间通过 `message` 和 `send` 来通信
* Node 中实现 IPC 通道的是管道（`pipe`）技术，具体实现细节由 libuv 实现

![ ](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a9ff71a53994eba8b5eec5e37e70626~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

* 父进程在实际创建子进程之前，会创建 IPC 通道并监听它，然后才真正创建出子进程，并通过环境变量`NODE_CHANNEL_FD`告诉子进程这个 IPC 通道的文件描述符.子进程在启动过程中，根据文件描述符去连接这个已存在的 IPC 通道，从而完成父子进程之间的连接

![ ](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a87f3b25fee948d9bd65185da459ca06~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

```js
import { fork } from 'child_process';
// 父进程
const child3 = fork('./child3.js');
child3.on('message', (m) => {
  console.log('message from child: ' + JSON.stringify(m));
});
child3.send({ from: 'parent' });

// 子进程
process.on('message', function (m) {
  console.log('message from parent: ' + JSON.stringify(m));
});

process.send({ from: 'child' });
```
