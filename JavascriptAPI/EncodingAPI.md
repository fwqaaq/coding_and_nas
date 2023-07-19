# Encoding

>Encoding API 主要用于字符串和定型数组之间的转换。新增了 4 个用于转换的全局类 `TextEncoder`、`TextEncoderStream`、`TextDecoder`、`TextDecoderStream`

## 文本编码

### [码位](https://developer.mozilla.org/zh-CN/docs/Glossary/Code_point)和[码元](https://developer.mozilla.org/zh-CN/docs/Glossary/Code_unit)

* **码位**是表示文本的系统（例如 Unicode）中用于表示抽象字符的数值。例如 Unicode 中使用 `U+0041` 表示字符 `A` 的码位。你可以在[这里](https://www.qqxiuzi.cn/bianma/Unicode.htm)尝试。
* **码元**是字符编码系统的基本组成部分，1 或者 2 个码元可能编码成一个 Unicode 码位。
  * 码元是 16 位值，但是并非所有的 Unicode 码位都适合 16 位（例如 emoji，它一般是 32 位）。在 JavaScript 中查看字符的长度，其实就是查看码元的个数：
* **Unicode 字符集**试图为全世界的每一个字符提供一个唯一的数字标识，而这个标识就是码位，每个字符都对应一个码位（可能不准确，因为可能由两个码位组成的 emoji）。

   ```js
   const face = "🥵";
   console.log(face.length); // 2
   ```
  
  * 码元可能是一个字节也可能是多个字节，即使它是 16 位，也可以由不同的编码形式设定：

   ```js
  new Blob(["a"]).size // 1
   ```

* **字符编码**决定了如何将 Unicode 编码成一个字节序列。不同的编码形式可以将系统的码位编码成不同的字节序列：例如在 UTF-8 中，将 A 编码成 `\x41`。你可以[在这里查看](https://www.qqxiuzi.cn/bianma/utf-8.htm)
  * 你可以使用如下方式查看（会以十进制的方式输出）：

   ```js
   "A".codePointAt(0) // 65
   ```

### 超出常用 Unicode 范围的字符

> 一般 Unicode 字符集是 0~65535（使用 UTF-16 表示是一个码元），一般称为基本多语言平面（BMP），超出这个范围的字符，需要使用代理对来表示。

在 JavaScript 中，我们会看到如下的情况：

```js
const s = '吃'
console.log(new Blob(['吃']).size) // 3
console.log(s.length) // 1
```

这时，肯定会想，明明是 3 个字节的内容，应该使用代理对表示（一个高位代理，一个低位代理），应该有 2 个字节。但实际上只有 1 个字节，实际上是因为它们用了不同的编码方式。

* 在 `Blob` 中，使用的是 `UTF-8` 编码，表示为 3 个字节。
* 在 `String.length` 中，使用的是 `UTF-16` 编码，表示为 1 个码元。

* 所以一般情况下我们使用 `codePointAt` 来查看某个字符的码位（Unicode 字符）是多少是更准确的：

   ```js
   console.log(s.codePointAt(0)) // 21512
   ```

* 但就如上面的示例所示，如果仅仅只有一个码元表示，而没有代理对的情况下，`codePointAt` 的返回也是一个码元的值，所以使用 `codePointAt` 也可以是码位的值。

   ```js
   console.log('💗'.charCodeAt(0)) // 码元，不是有效的 unicode 字符
   ```

> 我们也会经常遇到由两个**码位**组成的 emoji，例如 `🀄️`，这种是拼接 emoji，具体字节取决于码位的字符编码。

```js
const emoji = '🀄️'
// 这里很好理解，因为它的第一个码位是两个高代理对（两个码元）
// 第二个码位在 BMP 中，所以只需要一个码元
console.log(emoji.length) // 3
```

* 如果使用 Rust 中的方法可以更简单地得出结论

   ```rust
   // Rust 中的 len() 方法是字节长度 -> 7
   "🀄️".encode_utf16().count() // 这里得到的是 utf16 编码的个数 -> 3
   ```

* 但是当我们使用 [String.codePointAt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt) 的时候，我们必须了解它的返回值，如果是高位代理，会返回整个字符的码位（包含低位代理），如果是低位代理，则返回该低位代理。
  * `emoji.codePointAt(0)` 获取的是索引位置 0 的码位，返回值 126980 对应的是 `U+1F004`，这是字符“🀄”的 Unicode 码位。
  * `emoji.codePointAt(1)` 获取的是索引位置 1 的码位，返回值 56324 是因为字符“🀄”超出了 Unicode 的基本多语言平面（BMP），在 UTF-16 编码中被表示为一个代理对。所以你这里得到的是这个代理对的**第二个部分**。
  * `emoji.codePointAt(2)` 获取的是索引位置 2 的码位，返回值 65039 对应的是 U+FE0F，这是字符“”的 Unicode 码位，用于指定前面的 emoji 应该以彩色显示。你可以看到，字符“🀄️”实际上由两个 Unicode 码位 `U+1F004` 和 `U+FE0F` 组成，它们分别对应字符“🀄”和“”。

   ```js
   const emoji = '🀄️'
   emoji.codePointAt(0) // 126980，高位代理
   emoji.codePointAt(1) // 56324，低位代理
   emoji.codePointAt(2) // 65039，另一个码位
   String.fromCodePoint(126980, 65039) // 🀄️
   ```

* 验证 0 是整个字符的码位

   ```js
   "\ud83d\ude0d".codePointAt(0) // 128525
   String.fromCodePoint(128525) // 😍
   "😍".codePointAt(1) // 56845
   ```

### UTF-8 编码

* 对于单字节的字符（即 Unicode 码点在 0-127 之间的字符），编码为 0xxxxxxx。
* 对于两字节的字符（即 Unicode 码点在 128-2047 之间的字符），编码为 110xxxxx 10xxxxxx。
* 对于三字节的字符（即 Unicode 码点在 2048-65535 之间的字符），编码为 1110xxxx 10xxxxxx 10xxxxxx。
* 对于四字节的字符（即 Unicode 码点在 65536 及以上的字符），编码为 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx。

## Encoding API

* Encoding API 提供了两种将字符串转换为定型数组二进制格式的方法：**批量编码和流编码**。把字符串转化为定型数据时，编码器始终使用 UTF-8。

>批量编码

* `TextEncoder`：构造函数 `new TextEncoder()`，默认使用 `UTF-8` 编码将代码位流转换成字节流
* 属性：
  * `TextEncoder.encoding`：只读。目前总是返回 utf-8。
* 方法：
  * `TextEncoder.prototype.encode()`：接受一个 `USVString` 作为输入，返回一个 `Unit8Array`，其中文本使用UTF-8编码
  * [`TextEncoder.prototype.encodeInto()`](https://developer.mozilla.org/zh-CN/docs/Web/API/TextEncoder/encodeInto)：接受一个 `USVString` 作为输入，将其编码好的字符填充到传入的 Unit8Array 中，并返回一个字典。性能比 `encode()` 更好一些
    * 该字典包含 `read`（使用 UTF-16 编码的码元数）和 `written`（在目标 Uint8Array 中修改的字节数）属性。如果给定的 Uint8Array 的长度小于编码字符的字节数，则最后的值为数组的长度。

    ```js
    const e = new TextEncoder()
    console.log(e.encoding)//utf-8
    const encode = e.encode("😄")
    console.log(encode)//Uint8Array(4)[ 240, 159, 152, 132 ]
    const u = new Uint8Array(4)
    const eninto = e.encodeInto("😄", u)
    console.log(u)//Uint8Array(4) [ 102, 97, 100, 101 ]
    console.log(eninto)//{ read: 2, written: 4 }
    ```

>流编码：TextEncodeStream

* `TextEncodeStream` 其实就是 TransformStream 形式的 TextEncoder。将解码后的文本流通过管道输入流解码器会得到编码后的文本块流

* `TextEncoderStream()` 构造函数。创建新对象：
* 属性
  * `TextEncoderStream.prototype.encoding` 只读。始终返回 utf-8
  * `TextEncoderStream.prototype.readable` 只读。返回由此对象控制的 ReadableStream（可读流）实例
  * `TextEncoderStream.prototype.writeableRead` 只读。返回由此对象控制的 WriteableStream（可写流）实例

```js
async function* chars() {
  const decodedText = "foo"
  for (let char of decodedText) {
    yield await new Promise((resolve) => setTimeout(resolve, 1000, char))
  }
}

const decodedTextStream = new ReadableStream({
  async start(controller) {
    for await (let chunk of chars()) {
      controller.enqueue(chunk)
    }
    controller.close()
  }
})

const encodedTextStream = decodedTextStream.pipeThrough(new TextEncoderStream())

const ReadableStreamDefault = encodedTextStream.getReader()

  ; (async function () {
    while (true) {
      const { done, value } = await ReadableStreamDefault.read()
      if (done) {
        break
      } else {
        console.log(value)
      }
    }
  })()
```

## 文本解码

* 与编码器不同，在定型数组转化为字符串时，支持非常多的字符串解码，例如 utf-8、iso-8859-2、koi8、cp1261、gbk 等等

>批量解码 `TextDecoder`

* `TextDecoder(code,options)`：构造函数。
  * `code?` 默认是 `UTF-8`，可以指定其他的字符解码
  * `options?`：`fatal` 标志。指示在发现编码错误是，decode 是否必须引发 `TypeError`
* 属性
  * `TextDecoder.prototype.encoding`：只读。解码器的名称
  * `TextDecoder.prototype.fatal`：只读。布尔值，是否显示致命错误
  * `TextDecoder.prototype.ignoreBOM`：只读。布尔值，是否忽略 `BOM` 标记
* 方法
  * `TextDecoder.prototype.decode()`：返回一个 `DOMString`，中包含使用特定 TextDecoder 对象的方法解码的文本

```js
const decode = new TextDecoder()
const encode = Uint8Array.of(66, 67, 68)
console.log(decode.decode(encode))//BCD
```

>流解码 `TextDecoderStream`

* TextDecoderStream 其实就是 TransformStream 形式的 TextDecoder。将编码后的文本通过管道输入解码器会得到新的文本流

* `TextDecoderStream(code?,options)` 创建新对象
* 属性：和TextDecoder一样，不过还新增了以下两个属性
  * `TextDecoderStream.readable` 只读。返回由此对象控制的 ReadableWrite 可读流实例
  * `TextDecoderStream.writeable` 只读。返回由此对象控制的 WriteableStream 实例

```js
async function* chars() {
  //每一个块必须是一个定型数组
  const encodedText = [102, 111, 111].map(x => Uint8Array.of(x))
  for (let char of encodedText) {
    yield await new Promise((resolve) => setTimeout(resolve, 1000, char))
  }
}
const encodedTextStream = new ReadableStream({
  async start(controller) {
    for await (let chunk of chars()) {
      controller.enqueue(chunk)
    }
    controller.close()
  }
})
const decodedTextStream = encodedTextStream.pipeThrough(new TextDecoderStream())
const ReadableStreamDefault = decodedTextStream.getReader()
  ; (async function () {
    while (true) {
      const { done, value } = await ReadableStreamDefault.read()
      if (done) {
        break
      } else {
        console.log(value)
      }
    }
  })()
```

## URI 的解编码

* `encodeURI()`：函数通过将特定字符的每个实例替换为一、两个、三或四转义序列来对统一资源标识符 `URI` 进行编码（该字符的 `UTF-8` 编码仅为四转义序列）由两个 `代理` 字符组成

   ```js
   encodeURI("http://www.daidu.com?bar= 中文")
   //'http://www.daidu.com?bar=%20%E4%B8%AD%E6%96%87'
   ```

  * `encodeURI`会替换所有的字符，但不包括以下字符，即使它们具有适当的UTF-8转义序列

  | 类型         | 包含                        |
  | ------------ | --------------------------- |
  | 保留字符     | ; , / ? : @ & = + $         |
  | 非转义的字符 | 字母 数字 - _ . ! ~ * ' ( ) |
  | 数字符号     | #                           |

  * `encodeURI` 自身无法产生能适用于HTTP GET或POST请求的URI，例如对于 `XMLHTTPRequests`， 因为 `&`、 `+` 和 `=` 不会被编码
* `encodeURIComponent(URI)` 会对以上字符进行转义，以产生可以使用与 HTTP `GET` 和 `POST` 的请求
  * 除了这些字符不会进行转义 `A-Z a-z 0-9 - _ . ! ~ * ' ( )`

* `decodeURI()`：解码由 `encodeURI` 创建或其它流程得到的统一资源标识符
  * 将已编码 URI 中所有能识别的转义序列转换成原字符，但不能解码那些不会被 `encodeURI` 编码的内容（例如 `#`）

   ```js
   console.log(decodeURI('http%3A%2F%2Fwww.daidu.com%3Fbar%3D%23'))
   //'http%3A%2F%2Fwww.daidu.com%3Fbar%3D%23'
   ```

  * 这时候需要使用 `decodeURIComponent`。它会解码 `encodeURIComponent` 的编码

   ```js
   console.log(decodeURIComponent('http%3A%2F%2Fwww.daidu.com%3Fbar%3D%23'))
   //http://www.daidu.com?bar=#
   ```

## base64编码

* `atob()`：如果传入字符串不是有效的 `base64` 字符串，比如其长度不是 4 的倍数，则抛出 DOMException
* `btob()`：该字符串包含非单字节的字符，则抛出 DOMException
  * 例如 `new Blob(["✓"]).size` 为 3 个字节

```js
let encodedData = window.btoa("Hello, world"); // 编码
let decodedData = window.atob(encodedData);    // 解码
```
