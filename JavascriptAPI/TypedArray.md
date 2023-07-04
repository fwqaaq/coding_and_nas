# ArrayBuffer

> `ArrayBuffer` 对象用来表示通用的，固定长度的原始二进制数据缓冲区

* 并且以下的所有 `TypedArray` 都继承 `ArrayBuffer`

* 它是一个字节数组，通常在其他语言中称为 `byte array`
* 不能直接操作 `ArrayBuffer` 的内容，而是要通过 [`TypedArray` 对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#try_it)或 [DataView 对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView)来操作，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容

>构造函数

* 要创建的 `ArrayBuffer` 的大小，单位为字节。

   ```js
   new ArrayBuffer(length)
   ```

>`ArrayBuffer.prototype.byteLength`

* 只读属性，表示 ArrayBuffer 的 byte 的大小

> 方法

```js
ArrayBuffer.isView(value)
```

* true：如果提供的参数是一种 ArrayBuffer 视图
* false：提供的参数不是一种 ArrayBuffer 视图类型

```js
const buffer = new ArrayBuffer(12)
const float = new Float32Array(buffer, 4, 1)
console.log(ArrayBuffer.isView(buffer))//false
console.log(ArrayBuffer.isView(float))//true
```

>[ArrayBufferView](https://developer.mozilla.org/zh-CN/docs/Web/API/ArrayBufferView) 是一种简化规范的辅助数据类型，它不是一个接口，也没有实现它的对象

## TypedArray

> 一个**类型化数组**（TypedArray）对象表示的是一个底层的**二进制缓冲区**的一个类数组视图（view）

* 事实上，没有名为 `TypedArray` 的全局属性，也没有一个名为 `TypedArray` 的构造函数
* [TypedArray 对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#typedarray_%E5%AF%B9%E8%B1%A1)

> 创建 TypedArray 类型的构造函数

1. 参数是`length`

   ```js
   new TypedArray(length)
   ```

   * 当传入 `length` 参数时，一个内部的数组缓冲区会被创建在内存中，该**缓存区的大小**（类型化数组中 `byteLength` 属性的值）是传入的 length 乘以数组中每个元素的字节数（`BYTES_PER_ELEMENT`）

2. 参数是 `object`：当传入一个对象作为参数时，就像通过 `TypedArray.from()` 方法创建一个新的类型化数组一样

   ```js
   const test = new Float32Array(new Set([1, 2, 3]))
   console.log(test)//Float32Array(3) [ 1, 2, 3 ]
   ```

3. 参数是`typedArray`:当传入一个**任意类型化数组**对象作为 `typedArray` 参数时（比如 Int32Array），typedArray 会被**复制**到一个新的类型数组中
   * `typedArray` 中的每个值在被复制到新的数组之前，会被转化为相应类型的构造函数

   ```js
   const test = new Int32Array([1, 2, 3])
   const a = new Int16Array(test)
   console.log(a.BYTES_PER_ELEMENT, test.BYTES_PER_ELEMENT)//2 4
   ```

4. 参数是：`buffer`，`byteOffset`，`length`.该 buffer 是对类 `ArrayBuffer` 的引用
   * 如果只传入buffer，那么会呈现整个 `buffer` 的内容
   * `byteOffset?`：该数值必须是各个 `TypedArray.BYTES_PER_ELEMENT` 的倍数（例如 Float32Array，就需要传入 4）
   * `length?`：该数值必须小于等于剩余字节/`TypedArray.BYTES_PER_ELEMENT` 的大小

   ```js
   const buffer = new ArrayBuffer(8)
   console.log(new Float32Array(buffer, 4, 1))
   ```

> 属性

* `TypedArray.BYTES_PER_ELEMENT`：返回一个数值，代表不同类型的类型化数组对象中，单个元素的字节大小。

   ```js
   new Float32Array().BYTES_PER_ELEMENT//4
   ```

* `TypedArray.length`：类型化数组的个数

   ```js
   new Float32Array(3).length//3
   ```

* `TypedArray.name`：返回一个字符串值，代表当前构造器的名称

   ```js
   Float32Array.name//Float32Array
   ```

>方法

* `TypedArray.from()`：从一个**类数组**或者**可迭代对象**中创建一个新类型数组。这个方法和 `Array.from()` 类似

   ```js
   TypedArray.from(source[, mapFn[, thisArg]])
   ```

  * 示例

   ```js
   // 使用 Set (可迭代对象)
   var s = new Set([1, 2, 3]);
   Uint8Array.from(s);
   // Uint8Array [ 1, 2, 3 ]
   // 使用箭头函数对数组元素进行映射
   Float32Array.from([1, 2, 3], x => x + x);
   // Float32Array [ 2, 4, 6 ]
   ```

>原型属性(只读)

* 使用 `Float32Array` 示例
   1. `Float32Array.prototype.buffer`（只读）。返回这个 Float32Array **引用的 ArrayBuffer**
   2. `Float32Array.prototype.byteLength`（只读）。返回从 Float32Array 的 ArrayBuffer 开头开始的长度（以字节为单位）
   3. `Float32Array.prototype.byteOffset`（只读）。返回从 Float32Array 的 ArrayBuffer 开头开始的偏移量（以字节为单位）
   4. `Float32Array.prototype.length`（只读）。返回 Float32Array 中的元素个数

   ```js
  const buffer = new ArrayBuffer(12)
  const float = new Float32Array(buffer, 4, 1)
  console.log(float.buffer)
  //ArrayBuffer {
  //  [Uint8Contents]: <00 00 00 00 00 00 00 00 00 00 00 00>,
  //  byteLength: 12
  //}
  console.log(float.byteOffset)//4
  console.log(float.byteLength)//4
  console.log(float.length)//1
   ```

>原型方法：和数组一样
