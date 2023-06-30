---
title: Buffer
date: 2022-05-19 15:22:37
author: Jack-zhang
categories: node
tags:
  - JS
  - node
summary: node中的stream机制
---

## Buffer

>Buffer 是内存区域，帮助开发者处理二进制数据，在此生态系统中处理二进制数据

* Buffer 与流紧密相连。当处理器接受的数据的速度快于消费的速度，则会将数据收入 Buffer

### 创建 Buffer

> 在 6.0.0 之前只能使用 Buffer 构造函数（new Buffer()）创建，该函数会根据提供的参数以不同的方式分配返回的 `Buffer`

* 可以通过 `Buffer.from()`、`Buffer.alloc()` 与 `Buffer.allocUnsafe()` 三种方式来创建

>使用 Buffer.from 来创建

* `Buffer.from(array)`：使用 `0 ~ 255` 范围内的字节 `array` 分配新的 `Buffer`。该范围之外的数组条目将被截断以符合他
  
   ```js
   const buf = Buffer.from([0x00, 0x75, 0x66, 0x66, 0x65, 0x72])
   console.log(buf)
   //<Buffer 00 75 66 66 65 72>
   ```

* `Buffer.from(buffer)`：buffer，`<Buffer> | <Uint8Array>` 要从中复制的 `Buffer` 或者 `Unit8Array` 数据
  * 将传入的 buffer 数据复制到新的 Buffer 实例上

   ```js
   const buf = Buffer.from("hello")
   const buf2 = Buffer.from(buf)
   buf[0] = 0x61
   console.log(buf.toString())//aello
   console.log(buf2.toString())//hello
   ```

* `Buffer.from(string[, encoding])`：创建包含 `string` 的新的 Buffer.encoding 参数标识将 string 转换为字节是要使用的字符编码
  * `string` 要编码的字符串
  * `encoding` string 的编码。默认值 `utf8`

  ```js
  const buf2 = Buffer.from("68656c6c6f", "hex")
  console.log(buf2.toString())//hello
  ```

* `Buffer.from(arrayBuffer[, byteOffset[, length]])`
  * `object`：\<Object> 支持 `Symbol.toPrimitive` 或 `valueOf()` 的对象
  * `offsetOrEncoding`：\<integer> | \<string> 字节偏移量或编码
  * `length`：\<integer> 长度

   ```js
   const buf2 = Buffer.from(new String("hello"))
   console.log(buf2)//<Buffer 68 65 6c 6c 6f>
   ```

> 使用 `Buffer.alloc` 来创建

`Buffer.alloc(size[, fill[, encoding]])`

* `size`：\<integer>新的`Buffer`所需的长度.
* `fill`：**默认值： 0**。\<string> | \<Buffer> | \<Uint8Array> | \<integer> 用于预填充新 `Buffer` 的值。
* `encoding`：**默认值:`utf8`**。\<string> 如果 `fill` 是字符串，则是字符本身的编码

   ```js
   const buf = Buffer.alloc(5)
   console.log(buf)
   ```

* <span style="background-color:red">如果 `size` 大于 `buffer.constants.MAX_LENGTH` 或小于 0，则抛出 `ERR_INVALID_ARG_VALUE`</span>

1. 如果指定了 `fill`，则分配的 `Buffer` 将通过调用 `buf.fill(fill)` 进行初始化

   ```js
   const buf = Buffer.alloc(5, `a`)
   console.log(buf)
   //<Buffer 61 61 61 61 61>
   ```

2. 如果同时指定了 fill 和 encoding，则分配的 `Buffer` 将通过调用 `buf.fill(fill, encoding)` 进行初始化

   ```js
   const buf = Buffer.alloc(5, `agudGQ=`, "base64")
   console.log(buf)
   //<Buffer 6a 0b 9d 19 6a>
   ```

* 调用 `Buffer.alloc()` 可能比替代的 `Buffer.allocUnsafe()` 慢得多，但可确保新创建的 `Buffer` 实例的内容永远<span style="color:red">不会包含来自先前分配的敏感数据</span>，包括可能尚未分配给 `Buffer` 的数据

>`Buffer.allocUnsafe(size)`：以这种方式创建的 Buffer 实例的底层内存不会被初始化。新创建的 Buffer 的内容是未知的，可能包含敏感的数据

* 分配 size 个字节的新 Buffer。如果 size 大于 `buffer.constants.MAX_LENGTH` 或小于 0，则抛出 `ERR_INVALID_ARG_VALUE`

   ```js
   const buf = Buffer.allocUnsafe(10);
   console.log(buf);
   // 打印(内容可能会有所不同): <Buffer a0 8b 28 3f 01 00 00 00 50 32>
   buf.fill(0);
   console.log(buf);
   // 打印: <Buffer 00 00 00 00 00 00 00 00 00 00>
   ```

* `Buffer` 模块预先分配了大小为 `Buffer.poolSize` 的内部 Buffer 实例作为池，用于快速分配使用 `Buffer.allocUnsafe()`、`Buffer.from(array)`、`Buffer.concat()` 创建的新 Buffer 实例
  * 仅当 size 小于或等于 `Buffer.poolSize >> 1`（Buffer.poolSize 除以二再向下取整）时才使用弃用的 new Buffer(size) 构造函数.

* 使用此预先分配的内部内存池是调用 `Buffer.alloc(size, fill)` 与调用 `Buffer.allocUnsafe(size)` 之间的关键区别.
  * `Buffer.alloc(size, fill)` 永远不会使用内部的 Buffer 池，而 `Buffer.allocUnsafe(size).fill(fill)` 会在 size 小于或等于 `Buffer.poolSize` 的一半时使用内部的 Buffer 池。
  * 当应用程序需要 `Buffer.allocUnsafe()` 提供的额外性能时，差异很细微，但可能很重要。

### Buffer 的字符编码

* `ascii`：仅适用于 7 位 ASCII 数据。此编码速度很快，如果设置则会剥离高位。
* `utf8`：多字节编码的 Unicode 字符。许多网页和其他文档格式都使用 UTF-8。
* `utf16le`：2 或 4 个字节，小端序编码的 Unicode 字符。支持代理对（U+10000 至 U+10FFFF）
* `ucs2`：`utf16le` 的别名。
* `base64`：Base64 编码。当从字符串创建 `Buffer` 时，（此编码也会正确地接受 RFC 4648 第5节中指定的 URL 和文件名安全字母）。
* `latin1`：一种将 `Buffer` 编码成单字节编码字符串的方法（由 RFC 1345 中的 IANA 定义，第 63 页，作为 Latin-1 的补充块和`C0/C1`控制码）
* `binary`：`latin1` 的别名。
* `hex`：将每个字节编码成两个十六进制的字符

```js
const buf = Buffer.from("hello", "ascii")
//转换成16进制编码
console.log(buf.toString("hex"))
//68656c6c6f
```

>字符串与 Buffer 类型互转

* `Buffer.form()` 实现,如果不传递 `encoding` 默认按照 UTF-8 格式转换存储

   ```js
   const buf = Buffer.from("hello 世界", "utf8")
   console.log(buf.length)//12
   console.log(buf.toString("utf-8", 0, 8))//hello �
   ```

* 中文在 UTF-8 下占用 3 个字节,所以**世**这个字在buf中对应的字节为 `e4 b8 96`，而这里只截取了前两个。所以会造成字符被剪断的乱码现象

### Buffer 的内存机制

* 由于 Buffer 是大量的二进制数据，假如用一点就像系统去申请，则会造成频繁的像系统内存调用的情况。所以 Buffer 占用的内存不会再由 `V8` 分配，而是在 Nodejs 的 C++ 层面申请，再在 js 中进行内存分配，这部分内存称之为**堆外内存**

>Buffer 内存的分配原理

* node 采用 `slab` 机制进行**预先申请，事后分配**，是一种动态的管理机制
* `Buffer.alloc(size)` 传入指定的 size 就会申请一个固定大小的内存区域，slab 具有如下的三种状态

1. `full`：完全分配状态
2. `partial`：部分分配状态
3. `empty`：没有被分配状态

* <span style="color:red">Buffer 在创建时大小已经被确定且是无法调整的</span>,并且以8kb限制区分是大对象还是小对象
   1. 在初次加载时就会初始化1个8KB的内存空间，buffer.js 源码有体现
   2. 根据申请的内存大小分为小 Buffer 对象和大 Buffer 对象
   3. 小 Buffer 情况，会继续判断这个 slab 空间是否足够
      * 如果空间足够就去使用剩余空间同时更新 slab 分配状态，偏移量会增加
      * 如果空间不足，slab 空间不足，就会去创建一个新的 slab 空间用来分配
   4. 大 Buffer 情况，则会直接走 `createUnsafeBuffer(size)` 函数
   5. 不论是小Buffer对象还是大Buffer对象，内存分配是在C++层面完成，内存管理在JavaScript层面，最终还是可以被V8的垃圾回收标记所回收

### Buffer 的应用

1. `I/O` 操作
   * fs.createReadStream()
   * fs.createWriteStream()
2. `zlib.js`：zlib.js 为 `Node.js` 的核心库之一其利用了缓冲区（Buffer）的功能来操作二进制数据流，提供了压缩或解压功能
3. `加解密`：重点使用了 `Buffer.alloc()` 初始化一个实例，之后使用了 fill 方法做了填充，这里重点在看下这个方法的使用
   * `buf.fill(value[, offset[, end]][, encoding])`
     * `value`：第一个参数为要填充的内容
     * `offset`：偏移量,填充的起始位置
     * `end`：结束填充 buf 的偏移量
     * `encoding`：编码集

    ```js
    //Cipher 的对称加密
    const crypto = require('crypto');
    const [key, iv, algorithm, encoding, cipherEncoding] = [
      'a123456789', '', 'aes-128-ecb', 'utf8', 'base64'
    ];
    
    const handleKey = key => {
      const bytes = Buffer.alloc(16); // 初始化一个 Buffer 实例,每一项都用 00 填充
      console.log(bytes); // <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>
      bytes.fill(key, 0, 10) // 填充
      console.log(bytes); // <Buffer 61 31 32 33 34 35 36 37 38 39 00 00 00 00 00 00>
   
      return bytes;
    }
    let cipher = crypto.createCipheriv(algorithm, handleKey(key), iv);
    let crypted = cipher.update('Node.js 技术栈', encoding, cipherEncoding);
        crypted += cipher.final(cipherEncoding);
    ```

* **缓冲（Buffer）**
  * **缓冲（Buffer）**是用于处理二进制流数据，将数据缓冲起来，它是临时性的，对于流式数据，会采用缓冲区将数据临时存储起来，等缓冲到一定的大小之后在存入硬盘中。
  * 视频播放器：有时你会看到一个缓冲的图标，这意味着此时这一组缓冲区并未填满，当数据到达填满缓冲区并且被处理之后，此时缓冲图标消失，你可以看到一些图像数据。
* **缓存（Cache）**
  * **缓存（Cache）**我们可以看作是一个中间层，它可以是永久性的将热点数据进行缓存，使得访问速度更快，例如我们通过 `Memory`，`Redis` 等将数据从硬盘或其它第三方接口中请求过来进行缓存，目的就是将数据存于内存的缓存区中，这样对同一个资源进行访问，速度会更快，也是性能优化一个重要的点。
