# Writable

## WritableStream

> **`WritableStream`** 接口为将流数据写入目的地(称为 sink)提供了一个标准的抽象.该对象带有内置的背压和队列.

* `WritableStream`是一个可转移对象.

### 构造函数

```js
new WritableStream(underlyingSink?, queuingStrategy?)
```

* **返回值**:WritableStream 对象的一个实例

>`underlyingSink`:一个包含定义了构造流行为方法和属性的对象

1. `start(controller)?`
   * 这是一个当对象被构造时立刻调用的方法.
   * 如果这个过程是异步完成的,它可以返回一个 promise,表明成功或失败.
   * `controller`是一个`WritableStreamDefaultController`(可以使用此方法在设立期间控制流)
2. `write(chunk, controller)?`
   * **当一个新的数据块(由 chunk 参数中指定)准备好写入底层 sink 时**,将调用该方法.
   * 它可以返回一个 promise 来表示写入操作的成功或者失败.**只有在先前已经写入成功后才会调用该方法**,并且永远不会在流关闭或者中止后调用.
   * `controller`参数是一个`WritableStreamDefaultController`,当提交了更多的块进行写入时,开发人员可以使用它来控制流.
3. `close(controller)?`
   * **这个方法只有在所有数据排队写入成功后才会被调用**.
   * 如果应用程序发出已完成将块写入流的信号,将调用此方法.其内容应该完成写入底层 sink,并且释放对它的访问.如果这个过程是异步完成的,它可以返回一个 promise,表明成功或失败.
   * `controller`参数是一个`WritableStreamDefaultController`,可用于写入结束时控制流.
4. `abort(reason)?`
   * **如果应用程序发出希望立即关闭流并且将其移至错误状态的信号,将调用此方法**.
   * 它可以清理任何被占用的资源,就像 close() 一样,但是即使写入的数据正在排入,`abort()`也将被调用——那些块将被丢弃.如果这个过程是异步完成的,它可以返回一个 promise,表明成功或失败.
   * `reason`参数包含一个字符串,用于指定流被中止的原因.

>`queuingStrategy?`:一个可选择定义流的排队策略的对象.这需要两个参数：

* `highWaterMark`:非负整数 - 这定义了在应用背压之前可以包含在内部队列中的块的总数
* `size(chunk)`:包含参数chunk的方法 - 这表示每个块使用的大小(以字节为单位)

### 属性

> `locked`:WritableStream接口的只读属性返回一个布尔值,表示 WritableStream 是否锁定到一个 writer

```js
const writableStream = new WritableStream({
  write(chunk) {...},
  close() {...},
  abort(err) {...}
}, queuingStrategy);

...

const writer = writableStream.getWriter();
writableStream.locked
```

### 方法

>`abort(reason)`:中止流,表示生产者不能再向流写入数据(会立刻返回一个错误状态),并丢弃所有已入队的数据.

* `reason`:错误原因的字符串.
* **返回值**:返回一个`promise`,会在成功的时候用给定的`reason`参数兑现.

>`getWriter()`:方法返回一个新的`WritableStreamDefaultWriter`实例并且将流锁定到该实例

* **返回值**:一个`WritableStreamDefaultWriter`对象实例

## WritableStreamDefaultWriter
