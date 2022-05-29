# GPU

> 检查浏览器是否支持webgpu

```js
if(navigator.gpu) console.log("支持webgpu")
```

* 需要的**开发依赖**:`@webgpu/types`,`typescript`,`vite`(更简单的构建项目)
* 生产环境依赖:`gl-matrix`

![ ](./img/gpu.png)

1. web页面会被分配到一个独立的渲染进程中,处于相对独立的沙盒环境,并且本身没有权利调用系统级的底层API
2. 只能通过事先定义好的 JavaScript 与浏览器进行沟通
3. 浏览器通过IPC(inner Process Communication)将js的命令传递给`Native Modules`
4. `Native Modules`会通过底层操作设备或者系统的API(比如操作蓝牙/文件/ajax请求等等)
5. 最后依然会通过IPC将获取的信息返回给web

![ ](./img/gpu-workflows.png)
