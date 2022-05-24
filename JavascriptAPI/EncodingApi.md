# Encoding

>Encoding API主要用于字符串和定型数组之间的转换.新增了4个用于转换的全局类`TextEncoder`,`TextEncoderStream`,`TextDecoder`,`TextDecoderStream`

## 文本编码

* Encoding API提供了两种将字符串转换为定型数组二进制格式的方法:**批量编码和流编码**.把字符串转化为定型数据时,编码器始终使用UTF-8

>批量编码

* `TextEncoder`:构造函数`new TextEncoder()`,默认使用`UTF-8`编码将代码点流转换成字节流
* 属性:
  * `TextEncoder.encoding`:只读.目前总是返回utf-8
* 方法:
  * `TextEncoder.prototype.encode()`:接受一个`USVString`作为输入,返回一个`Unit8Array`,其中文本使用UTF-8编码
  * `TextEncoder.prototype.encodeInto()`:接受一个`USVString`作为输入,返回一个`Unit8Array`,返回一个字典.性能比`encode()`更好一些
    * 该字典包含`read`和`written`属性.分别表示成功的从源字符串读取多少字符和向目标数组写入了多少字符.如果定型数组空间不够,编码就会提前终止

```js
const e = new TextEncoder()
console.log(e.encoding)//utf-8
const encode = e.encode("😄")
console.log(encode)//Uint8Array(4)[ 240, 159, 152, 132 ]
const u = new Uint8Array(4)
const eninto = e.encodeInto("fade", u)
console.log(u)//Uint8Array(5) [ 102, 97, 100, 101 ]
console.log(eninto)//{ read: 4, written: 4 }
```

>流编码:TextEncodeStream

* `TextEncodeStream`其实就是TransformStream形式的TextEncoder.将解码后的文本流通过管道输入流解码器会得到编码后的文本块流

* `TextEncoderStream()`构造函数.创建新对象
* 属性
  * `TextEncoderStream.prototype.encoding`只读.始终返回utf-8
  * `TextEncoderStream.prototype.readable`只读.返回由此对象控制的ReadableStream(可读流)实例
  * `TextEncoderStream.prototype.writeableRead`只读.返回由此对象控制的WriteableStream(可写流)实例

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

* 与编码器不同,在定型数组转化为字符串时,支持非常多的字符串解码,例如utf-8,iso-8859-2,koi8,cp1261,gbk等等

>批量解码`TextDecoder`

* `TextDecoder(code,options)`:构造函数.
  * `code?`默认是`UTF-8`,可以指定其他的字符解码
  * `options?`:`fatal`标志.指示在发现编码错误是,decode是否必须引发`TypeError`
* 属性
  * `TextDecoder.prototype.encoding`:只读.解码器的名称
  * `TextDecoder.prototype.fatal`:只读.布尔值,是否显示致命错误
  * `TextDecoder.prototype.ignoreBOM`:只读.布尔值,是否忽略`BOM`标记
* 方法
  * `TextDecoder.prototype.decode()`:返回一个`DOMString`,中包含使用特定TextDecoder对象的方法解码的文本

```js
const decode = new TextDecoder()
const encode = Uint8Array.of(66, 67, 68)
console.log(decode.decode(encode))//BCD
```

>流解码`TextDecoderStream`

* TextDecoderStream其实就是TransformStream形式的TextDecoder.将编码后的文本通过管道输入解码器会得到新的文本流

* `TextDecoderStream(code?,options)`创建新对象
* 属性:和TextDecoder一样,不过还新增了以下两个属性
  * `TextDecoderStream.readable`只读.返回由此对象控制的ReadableWrite可读流实例
  * `TextDecoderStream.writeable`只读.返回由此对象控制的 WriteableStream 实例

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

## URI的解编码

* `encodeURI()`:函数通过将特定字符的每个实例替换为一,两个,三或四转义序列来对统一资源标识符`URI`进行编码(该字符的`UTF-8`编码仅为四转义序列)由两个`代理`字符组成

   ```js
   encodeURI("http://www.daidu.com?bar= 中文")
   //'http://www.daidu.com?bar=%20%E4%B8%AD%E6%96%87'
   ```

  * `encodeURI`会替换所有的字符,但不包括以下字符,即使它们具有适当的UTF-8转义序列

  | 类型         | 包含                        |
  | ------------ | --------------------------- |
  | 保留字符     | ; , / ? : @ & = + $         |
  | 非转义的字符 | 字母 数字 - _ . ! ~ * ' ( ) |
  | 数字符号     | #                           |

  * `encodeURI` 自身无法产生能适用于HTTP GET或POST请求的URI,例如对于`XMLHTTPRequests`, 因为"&","+",和"="不会被编码
* `encodeURIComponent(URI)`会对以上字符进行转义,以产生可以使用与`HTTP GET`和POST的请求
  * 除了这些字符不会进行转义`A-Z a-z 0-9 - _ . ! ~ * ' ( )`

* `decodeURI()`:解码由`encodeURI`创建或其它流程得到的统一资源标识符
  * 将已编码 URI 中所有能识别的转义序列转换成原字符,但不能解码那些不会被`encodeURI`编码的内容(例如`#`)

   ```js
   console.log(decodeURI('http%3A%2F%2Fwww.daidu.com%3Fbar%3D%23'))
   //'http%3A%2F%2Fwww.daidu.com%3Fbar%3D%23'
   ```

  * 这时候需要使用`decodeURIComponent`.他会解码`encodeURIComponent`的编码

   ```js
   console.log(decodeURIComponent('http%3A%2F%2Fwww.daidu.com%3Fbar%3D%23'))
   //http://www.daidu.com?bar=#
   ```
