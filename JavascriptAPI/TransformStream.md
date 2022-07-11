# TransformStream

>Streams API 接口的 `TransformStream` 表示一组可转换的数据

* [`TextEncodeStream`和`TextDecoderStream`](./EncodingApi.md#encoding)都是TransformStream

## 构造函数

```js
new TransformStream(transformer?, writableStrategy?, readableStrategy?)
```

* `transformer?`:一个表示 transformer 的对象.如果未提供,则生成的流将是一个恒等变换流,它将所有写入可写端的分块转发到可读端,不会有任何改变.每个方法的`controller`都是一个`TransformStreamDefaultController`实例.
  * `start(controller)`:当`TransformStream`被构造时调用.它通常用于使用**TransformStreamDefaultController.enqueue()** 对分块进行排队.
  * `transform(chunk, controller)`:当一个写入可写端的分块准备好转换时调用,并且执行转换流的工作.如果没有提供 `transform()`方法,则使用恒等变换,并且分块将在没有更改的情况下排队.
  * `flush(controller)`:当所有写入可写端的分块成功转换后被调用,并且可写端将会关闭.
* `writableStrategy?`:一个定义了排队策略的可选对象
  * `highWaterMark`:一个非负整数.它定义了在应用背压之前内部队列包含的分块的总数.
  * `size(chunk)`:一个包含参数 chunk 的方法.它表示用于每一个块的大小,以字节为单位.
* `readableStrategy`:一个定义了排队策略的可选对象
  * `highWaterMark`:一个非负整数.它定义了在应用背压之前内部队列包含的分块的总数.
  * `size(chunk)`:一个包含参数 chunk 的方法.它表示用于每一个块的大小,以字节为单位

>如果没有提供 transformer 参数,那么结果将是一个恒等流,它将所有写入可写端的分块转发到可读端,并且不做任何改变

```js
const writableStrategy = new ByteLengthQueuingStrategy({ highWaterMark: 1024 * 1024 });
readableStream
  .pipeThrough(new TransformStream(undefined, writableStrategy))
  .pipeTo(writableStream);
```

### TransformStreamDefaultController

>Streams API 的 TransformStreamDefaultController 接口提供了操作关联的 ReadableStream 和 WritableStream 的方法

* 当构造`TransformStream`时,会创建一个 `TransformStreamDefaultController`.因此它没有构造函数.获取 `TransformStreamDefaultController` 实例的方式是通过 `TransformStream()` 的回调方法

#### TransformStreamDefaultController属性

>`desiredSize`(**只读**),返回填充满关联的 ReadableStream 的内部队列所需要的大小.如果这个desiredSize是0,则队列已满

```js
console.log(controller.desiredSize)
```

#### TransformStreamDefaultController方法

> `enqueue(chunk)`:排入一个分块（单个数据）到流的可读端

* `chunk`:正在排入的分块.一个分块是一个数据片段.它可以是任何数据类型,并且一个流可以包含不同类型的分块

>`error(reason)`:转换流的可写端和可读端都出现错误.

* `reason`:一个字符串,包含在与流进一步交互时返回的错误信息

>terminate():关闭流的可读端并且流的可写端出错.

* 关闭流的可读端并且会使流的可写端出错

## 属性

>`TransformStream.readable`:TransformStream 接口的只读属性 readable 返回由这个 TransformStream 控制的 ReadableStream 实例

```js
const textEncoderStream = new TransformStream();
console.log(textEncoderStream.readable) // a ReadableStream
```

>`TransformStream.writable`:TransformStream 接口的只读属性 writable 返回由这个 TransformStream 控制的 WritableStream 实例

```js
const textEncoderStream = new TransformStream();
console.log(textEncoderStream.writable) // a WritableStream
```
