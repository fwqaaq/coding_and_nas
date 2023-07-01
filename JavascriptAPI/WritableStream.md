# Writable

## WritableStream

> **`WritableStream`** 接口为将流数据写入目的地（称为 sink）提供了一个标准的抽象。该对象带有内置的背压和队列。

* `WritableStream` 是一个可转移对象.

### 构造函数

```js
new WritableStream(underlyingSink?, queuingStrategy?)
```

* **返回值**：WritableStream 对象的一个实例

>`underlyingSink`：一个包含定义了构造流行为方法和属性的对象

1. `start(controller)?`
   * 这是一个当对象被构造时立刻调用的方法。
   * 如果这个过程是异步完成的，它可以返回一个 promise，表明成功或失败。
   * `controller` 是一个 `WritableStreamDefaultController`（可以使用此方法在设立期间控制流）
2. `write(chunk, controller)?`
   * **当一个新的数据块（由 chunk 参数中指定）准备好写入底层 sink 时**，将调用该方法。
   * 它可以返回一个 promise 来表示写入操作的成功或者失败。**只有在先前已经写入成功后才会调用该方法**，并且永远不会在流关闭或者中止后调用。
   * `controller` 参数是一个 `WritableStreamDefaultController`，当提交了更多的块进行写入时，开发人员可以使用它来控制流。
3. `close(controller)?`
   * **这个方法只有在所有数据排队写入成功后才会被调用**。
   * 如果应用程序发出已完成将块写入流的信号，将调用此方法。其内容应该完成写入底层 sink，并且释放对它的访问。如果这个过程是异步完成的，它可以返回一个  promise，表明成功或失败。
   * `controller` 参数是一个 `WritableStreamDefaultController`，可用于写入结束时控制流。
4. `abort(reason)?`
   * **如果应用程序发出希望立即关闭流并且将其移至错误状态的信号，将调用此方法**。
   * 它可以清理任何被占用的资源，就像 close() 一样，但是即使写入的数据正在排入，`abort()` 也将被调用——那些块将被丢弃。如果这个过程是异步完成的，它可以返回一个 promise，表明成功或失败。
   * `reason`参数包含一个字符串，用于指定流被中止的原因。

>`queuingStrategy?`：一个可选择定义流的排队策略的对象。这需要两个参数：

* `highWaterMark`：非负整数——这定义了在应用背压之前可以包含在内部队列中的块的总数
* `size(chunk)`：包含参数 chunk 的方法——这表示每个块使用的大小（以字节为单位）

### 属性

> `locked`：WritableStream 接口的只读属性返回一个布尔值，表示 WritableStream 是否锁定到一个 writer

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

>`abort(reason)`：中止流，表示生产者不能再向流写入数据（会立刻返回一个错误状态），并丢弃所有已入队的数据。

* `reason`：错误原因的字符串。
* **返回值**：返回一个 `promise`，会在成功的时候用给定的 `reason` 参数兑现。

>`getWriter()`：方法返回一个新的 `WritableStreamDefaultWriter` 实例并且将流锁定到该实例

* **返回值**：一个 `WritableStreamDefaultWriter` 对象实例

### WritableStreamDefaultController

>**`WritableStreamDefaultController`** 接口表示一个允许控制 `WritableStream` 状态的控制器。当构造 `WritableStream` 时，会为底层的 sink 提供一个相应的 `WritableStreamDefaultController` 实例以进行操作

* 无构造函数，也没有任何属性。

* 方法：`error(message)`，很少被使用，通常他从底层 sink 的其中一个方法返回被拒绝的 promise 足矣。但是，在响应与底层 sink 交互的正常生命周期之后的事件时，使用 error() 突然关闭流很可能会很有用
  * `message`：表示你希望的以后交互失败的错误

### CountQueuingStrategy

>该接口提供了一个计数策略，该计数策略内置了对分块队列的计数并且可以在构造流的时候使用

1. 构造函数：`new CountQueuingStrategy(highWaterMark)`
   * `highWaterMark`：一个包含 `highWaterMark` 属性的对象。这个属性是一个非负整数，定义了在应用背压之前内部队列包含的分块的总数。
2. `size()`：该属性始终返回 1（分块），因此队列的总大小是队列中所有分块的计数。

```js
const queuingStrategy = new CountQueuingStrategy({ highWaterMark: 1 });
const writableStream = new WritableStream({
  // Implement the sink
  write(chunk) {
    ...
  },
  close() {
    ...
  },
  abort(err) {
    console.log("Sink error:", err);
  }
}, queuingStrategy);
var size = queuingStrategy.size();
```

## WritableStreamDefaultWriter

> `WritableStreamDefaultWriter` 接口是由 `WritableStream.getWriter()` 返回的对象，并且一旦创建就会将 `writer` 自动锁定到 `WritableStream`，确保没有其他流可以写入底层 `sink`

### WritableStreamDefaultWriter 构造函数

> 通常不需要手动创建此构造函数；可以直接使用 `WritableStream.getWriter()` 方法

* 语法：参数是一个 `WritableStream`

   ```js
   new WritableStreamDefaultWriter(WritableStream)
   ```

* **返回值**:返回`WritableStreamDefaultWriter`对象的一个实例

### WritableStreamDefaultWriter 属性（只读）

1. `closed`：允许你在编写当流结束时执行的代码。返回一个流关闭时兑现的 `promise`，或者在抛出错误或者 writer 的锁释放时被拒绝
2. `desiredSize`：返回填充流的内部队列所需要的大小
   * **注意：**如果队列已满，可能是负数。如果流无法成功写入（由于出错中止排入），则该值为null，如果流已经关闭，则该值为 0
3. `ready`：返回一个`promise`，当流填充内部队列的所需大小从非正数变为整数时兑现，表明它不再使用**背压**

### WritableStreamDefaultWriter 方法

1. `write(chunk)`：将传递的数据块写入 `WritableStream` 和它的底层 sink，然后返回一个 `promise`，promise 的状态由写入操作是否成功来决定.
   * `chunk`：要传递的二进制数据块
2. `releaseLock()`：释放`writer()`对相应流的锁定.释放锁后，writer将不再处于锁定的状态.如果释放锁时关联的流出错，writer随后也会以同样的方式出错；此外，writer 将关闭
3. `close()`：用于关闭关联的可写流，在调用关闭行为之前，底层的 sink 将完成对所有先前写入的分块的处理.在此期间任何的进一步尝试都将失败，但是不会导致流出错
   * 返回值：一个 `promise`，如果所有剩余的分块在关闭之前成功写入，则使用 `undefined` 对象，如果在此遇到任何问题，则拒绝并返回相关问题
4. `abort(reason?)`：中止流，表示生产者不能再向流写入数据（会立刻返回一个错误状态），并丢弃所有已入队的数据
   * 如果 `writer` 处于活动状态，则 `abort()` 的行为与关联流 `WritableStream.abort()` 的行为相同。如果不是，则返回一个被拒绝的 promise
   * `reason`：人类可读的中止原因
   * 返回值：一个 promise，会在成功时用给定的 reason 参数兑现
