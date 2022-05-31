---
title: blob
date: 2022-03-07 20:32:14
author: Jack-zhang
categories: TS
tags:
   - JS
   - TS
summary: blob对象的使用
---

## blob

>blob对象使用不可变的,原始数据的类文件对象.他的数据可以是文本或者二进制的格式进行读取,同时也可以转换成`ReadableStream`来读取操作

1. Blob不一定表示js的原生格式的数据.`File`接口基于Blob,继承了blob的功能,并将起扩展使其支持用于系统上的文件
2. 要从其他非blob对象和数据构造一个 `Blob`,请使用 `Blob()` 构造函数
3. 要创建一个 blob 数据的子集 blob,请使用`slice()`方法
4. 要获取用户文件系统上的文件对应的Blob对象,请参阅[File](https://developer.mozilla.org/zh-CN/docs/Web/API/File)文档

### Blob()

```js
const aBlob = new Blob( array, options )
```

* **array**是由:`ArrayBuffer`, `ArrayBufferView`, `Blob`, `DOMString` 等对象构成的 Array ,或者其他类似对象的混合体,它将会被放进 Blob
* **options**使用可选的`BlobPropertyBag`字典:
  1. `type`,默认值为"",为**数组内容的MIME类型**
  2. `endings`,默认值为"transparent",用于指定包含行结束符\n的字符串如何被写入
     * `"native"`,代表行结束符会被更改为适合宿主操作系统文件系统的换行符
     * `"transparent"`,代表会保持blob中保存的结束符不变

> 属性(只读)

* `Blob.size`:Blob 对象中所包含数据的大小(字节)
* `Blob.type`:一个字符串,表明该Blob对象所包含数据的**MIME**类型.(未知则是`""`)

#### 方法

* `blob.text()`:返回一个 promise 对象,以 `resolve` 状态返回一个以文本形式包含 blob 中数据的 `USVString`

```js
let str = "xhr"
const blob = new Blob([str], {
  type: "text/plain"
})
blob.text().then(res => console.log(res))
```

* `blob.stream()`:方法返回一个**ReadableStream**对象,读取它将返回包含在Blob中的数据
* `blob.slice()`:方法创建并返回一个新对象,该对象包含来自调用它的`blob`子集的数据
  1. `start`可选.默认值为 0.<span style="color:red">Blob中的索引,指示要包含在新 Blob 中的第几个字节</span>.指定的值大于源Blob的大小,默认为0,并且不包含任何数据.如果指定负值,则会将其视为从 Blob 末尾到开头的偏移量.例如,-10 将是 Blob 中距离最后一个字节的第 10 个字节.
  2. `end`可选.缺省值为**size**lob 中的索引,指示 Blob 中的末尾字节(不包含此索引中的字节).如果指定负值,和start一样.
  3. `contentType`可选.默认值为空字符串.要分配给新 Blob 的内容类型
* `blob.arrayBuffer()`:返回一个 Promise,该 Promise 将 blob 的内容解析为`ArrayBuffer`中包含的二进制数据

> 文件的下载.\<a>中在h5中有一个新属性`download`(可以设置下载的名称),当链接的地址是同源的时候会进行下载

* windows上的`URL.createObjectURL()`静态方法创建一个`DOMString`,其中返回值表示参数中给定对象的URL.
* URL 生存期与创建文档的窗口中的文档相关联.新对象 URL 表示指定的`File对象`或`Blob 对象`.
* 要释放URL对象,请调用`revokeObjectURL()`

```html
<body>
  <a id="btn" download="index.html">下载</a>
</body>
<script>
  const str = `<div style="color: red;font-size:5rem">hello world</div>`
  const blob = new Blob([str], { type: 'text/html' })

  document.getElementById("btn").onclick = function () {
    this.setAttribute('href', URL.createObjectURL(blob))
  }
</script>
```

## File

>File对象是特殊类型的`Blob`,且可以用在人气的Blob类型的 context中.

* 例如`FileReader`,`URL.createObjectURL()`,`createImageBitmap()`及`XMLHttpRequest.send()` 都能处理 Blob 和 File

### FileList

>首先了解`Filelist`,此类型是HTML\<input type="file">元素返回`File`对象的集合.不过该类型的对象也有可能来自用户的拖放操作(DataTransfer)

* 并且如果`input`元素拥有`multiple`属性,则可以使用它来选择多个文件

* File对象:文件列表会放在在files数组中.所哟与`type="file"`的`<input>`元素都有一个files属性,用来存储用户选择的文件

```html
<input id="fileItem" type="file">
```

* 获取FileList对象中的第一个文件(**File对象**)

```js
const file = document.getElementById("filelist");
file.onchange = function (e) {
  console.log(file.files[0])
}
```

### File对象

* File对象同样可以使用构造函数(`new File()`)创造新的对象实例

```js
const myFile = new File(bits, name[, options]);
```

1. `bits`:一个包含`ArrayBuffer`,`ArrayBufferView`,`Blob`,或者 `DOMString` 对象的数组
2. `name`:表示文件名称或者文件路径
3. `options?`
   * `type: DOMString`,表示将要放到文件中的内容的**MIME类型**.**默认值为 ""** .
   * `lastModified: 数值`,表示文件最后修改时间的 Unix 时间戳(毫秒).**默认值为 Date.now()**.

>属性

1. `file.lastModified`:返回所引用文件最后修改日期, 为自 1970年1月1日0:00 以来的毫秒数
2. `file.name`:返回文件的名称.由于安全原因,返回的值并不包含文件路径.
3. `flie.type`:引用文件的名字
4. `file.size`:返回文件的大小
5. `file.type`:返回文件的MIME类型

>方法

* `slice()`:继承了blob对象的方法

### FileReader()

> `FileReader`对象允许网络程序或异步读取存储在计算机上应用的数据文件(或原始数据用户)的内容,使用File或Blob 指定要读取的文件

* 通常情况下:文件对象可以是来自其中一个\<input>元素上选择文件的`FileList`对象
* 同样这是一个构造函数`new FileReader()`

>属性

1. `FileReader.error`:只读.表示在读取文件时发生的错误
2. `FileReader.readyState`:只读.表示FileReader状态的数字

   | 特征名  | 值  | 描述                 |
   | ------- | --- | -------------------- |
   | EMPTY   | 0   | 还没有加载数据       |
   | LOADING | 1   | 数据正在被加载       |
   | DONE    | 2   | 已完成全部的读取请求 |

3. `FileReader.result`:只读(**字符串**或者`ArrayBuffer`).该属性仅在读取操作完成才有效,数据格式的使用后的方法来启动读取操作.

>FileReader接口的事件

| 事件        | 描述                  |
| ----------- | --------------------- |
| onabort     | 中断                  |
| onerror     | 出错                  |
| onloadstart | 开始                  |
| onprogress  | 正在读取              |
| onload      | 成功读取              |
| onloadend   | 读取完成,无论成功失败 |

> FileReader接口有4个方法,其中3个用来读取文件,另一个用来中断读取.无论读取成功或失败,方法并不会返回读取结果,这一结果存储在result属性中

* `readAsArrayBuffer(file/blob)`:读取指定Blob或文件的内容.完成后`readyState`变为Done,并且触发`loadend`.`result`以`ArrayBufer`返回文件的数据
* `readAsText(file/blob)`:`result`以文本字符串的形式返回文件内容.其余与上个属性相同
* `readAsDataURL(file/blob)`:`result`以url的形式返回文件的数据(文件的数据会以base64的编码表示).其余与上个属性相同
* `abort()`:中断读取操作

```html
<body>
  <input type="file" id="input">
</body>
<script>
document.getElementById("input").onchange = function (e) {
  let file = e.target.files[0]
  let img = new Image()
  let fileReader = new FileReader()
  document.body.appendChild(img)
  fileReader.readAsDataURL(file)
  fileReader.onload = function () {
    img.src = fileReader.result
    console.log(fileReader.result)
  }
}
</script>
```

>`FileReaderSync`是FileReader的同步版本,只有当整个文件都加载到内存中才会读取

* `FileReaderSync`只在工作者线程中可用,因为如果整个文件加载事件过长,则会影响全局
