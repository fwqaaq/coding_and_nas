# [JavaScript 类型转换](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#强制类型转换)

> 这里只讲述 JavaScript 类型转换的过程

## 强制原始值转换

### 原始值

> 原始值是指除了 Object 以外，所有类型都定义了表现在语言最低层面的[不可变的值](https://developer.mozilla.org/zh-CN/docs/Glossary/Immutable)。这些值称为原始值

* 除了 null，所有原始类型都可以使用 `typeof` 运算符进行测试。

参考：<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#原始值>

### [Symbol.toPrimitive](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive)

> Symbol.toPrimitive 是内置的 symbol 属性，其指定了一种接受首选类型并返回对象原始值的表示的方法。**它被所有的强类型转换制算法优先调用**。

* 可以将 hint 看作一种信号：hint 参数的取值是 `"number"`、`"string"` 和 `"default"` 中的任意一个。没有 `@@toPrimitive` 属性的对象通过以不同的顺序调用 `valueOf()` 和 `toString()` 方法将其转换为原始值。

```js
const object1 = {
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return 42;
    }
    return null;
  }
};

console.log(+object1);
// expected output: 42
```

注意：`[@@toPrimitive]()` 必须返回一个原始值，否则将抛出 TypeError。

### 原始值的强制转换

> 通常如果实际的类型已经是原始值了，例如字符串、数值或 BigInt 类型都是可以接受的

* `Date()` 构造函数，当它收到一个不是 Date 实例的参数时——字符串表示日期字符串，而数值表示时间戳。
* `+` 运算符——如果运算对象是字符串（例如：`"foo" + 1`），执行字符串串联；否则，执行数值相加。
* `==` 运算符——如果一个运算对象是原始值，而另一个运算对象是对象（object），则该对象将转换为没有首选类型的原始值。

> 如果值已经是原始值，那么以上操作不会进行任何转换。如果是对象，则按以下顺序调用。

* [`[@@toPrimitive]()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive)（将 hint 作为 default）、`valueOf()` 和 `toString()` 方法，将其转换为原始值。注意原始值转换会在 `toString()` 方法之前调用 `valueOf()` 方法，这与强**制数字类型转换**的行为相似，但与**强制字符串类型转换**不同。

* 对于 `valueOf()` 和 `toString()`，如果其中一个返回对象，则忽略其返回值，从而使用另一个的返回值；如果两者都不存在，或者两者都没有返回一个原始值，则抛出 TypeError。

```js
console.log({} + []); // "[object Object]"
```

`{}` 和 `[]` 都没有 `[@@toPrimitive]()` 方法。`{}` 和 `[]` 都从 `Object.prototype.valueOf` 继承 `valueOf()`，其返回对象自身。**因为返回值是一个对象，因此它被忽略。**因此，调用 `toString()` 方法。`{}.toString()` 返回 `"[object Object]"`，而 `[].toString()` 返回 `""`，因此这个结果是它们的串联：`"[object Object]"`。

## [强制数字类型转换](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number#number_强制转换)

> 数字类型包括 number 类型和 BigInt 类型。强制数字类型转换与强制 number 类型转换几乎相同，只是 BigInt 会按原样返回，而不是引起 TypeError。

* 对于 Number 则总是返回自己
* `undefined` 变成了 `NaN`、`null` 变成了 `0`、`true` 变成了 `1`、`false` 变成了 `0`
* 如果它们包含**数字字面量**，字符串通过解析它们来转换。如果解析失败，返回的结果为 `NaN`。与实际数字字面量相比，它们有一些细微的差别。
  * 忽略前导和尾随空格/行终止符。
  * 前导数值 `0` 不会导致该数值成为八进制文本（或在严格模式下被拒绝）。
  * `+` 和 `-` 允许在字符串的开头指示其符号。（在实际代码中，它们“看起来像”文字的一部分，但实际上是单独的一元运算符。）然而，该标志只能出现一次，不得后跟空格。
  * `Infinity` 和 `-Infinity` 被当作是字面量。在实际代码中，它们是全局变量。
  * 空字符串或仅空格字符串转换为 `0`。
  * 不允许使用数字分隔符。
* BigInt 抛出 TypeError，以防止意外的强制隐式转换损失精度。
* Symbol 抛出 TypeError。
* 对象首先按顺序调用 `@@toPrimitive]()`（将 `"number"` 作为 hint）、`valueOf()` 和 `toString()` 方法将其转换为原始值。然后将生成的原始值转换为数值。

>有两种方法可以在 JavaScript 中实现几乎相同的效果。

* [一元加](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Unary_plus)，它总是强制 number 类型转换。
* `Number()` 函数：`Number(x)` 使用相同的算法转换 `x`，除了 BigInt 不会抛出 TypeError，而是返回它的 Number 值，并且可能损失精度。

### 整数转换

 一些操作需要整数，最值得注意的是那些适用于数组/字符串索引、日期/时间组件和数值基数的整数。执行上述数值强制转换步骤后，结果被[截断](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc)为整数（通过丢弃分数部分）。如果数值为 ±Infinity，则按原样返回。如果数值是 `NaN` 或 `-0`，则返回为 `0`。因此，结果总是整数（不是 `-0`）或 ±Infinity。

 值得注意的是，当转换到整数时，`undefined` 和 `null` 都会变成 `0`，因为 `undefined` 被转换为 `NaN`，`NaN` 也变成了 `0`。

## [强制字符串类型转换](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String#字符串强制转换)

>首先，对象通过依次调用 `[@@toPrimitive]()`（hint 为 "string"）、toString() 和 valueOf() 方法将其转换为原始值。然后将生成的原始值转换为一个字符串。

* 字符串按原样返回。
* undefined 转换成 "undefined"，null 转换成 "null"，true 转换成 "true"；false 转换成 "false"。
* 使用与 toString(10) 相同的算法转换数字，使用与 toString(10) 相同的算法转换 BigInt。
* Symbol 抛出 TypeError。

>有几种方法可以在 JavaScript 中实现几乎相同的效果。

* 模板字符串：`${x}` 为嵌入的表达式执行上面的字符串强制转换步骤。
* String() 函数：`String(x)` 使用相同的算法去转换 x，只是 Symbol 不会抛出 TypeError，而是返回 `"Symbol(description)"`，其中 description 是对 Symbol 的描述。
* 使用 + 运算符：`"" + x` 将其操作数强制转为原始值，而不是字符串，并且对于某些对象，其行为与普通字符串强制转换完全不同。

根据你使用的情况，你可能想要使用 `${x}`（模拟内置行为）或 `String(x)`（处理 symbol 值而不抛出错误），但你不应该使用 `"" + x`。

### [toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)

>该方法由字符串转换优先调用，但是数字的强制转换和原始值的强制转换会优先调用 `valueOf()`。

* 然而，因为基本的 `valueOf()` 方法返回一个对象，`toString()` 方法通常在结束时调用，除非对象重写了 `valueOf()`。例如，`+[1]` 返回 1，因为它的 `toString()` 方法返回 "1"，然后将其转换为数字。

```js
const arr = [1, 2, 3];

arr.toString(); // "1,2,3"
Object.prototype.toString.call(arr); // "[object Array]"
```

* `Object.prototype.toString()` 返回 `"[object Type]"`，这里的 `Type` 是对象的类型。如果对象有 `Symbol.toStringTag` 属性，其值是一个字符串，则它的值将被用作 Type
  * 许多内置的对象，包括 `Map` 和 `Symbol`，都有 `Symbol.toStringTag`。
  * 一些早于 ES6 的对象没有 `Symbol.toStringTag`，但仍然有一个特殊的标签。标签与给出的类型名相同:（如 Array、Function 等）

### [Symbol.toStringTag](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag)

>大多数内置的对象提供了它们自己的 `@@toStringTag` 属性。所有内置对象的 `@@toStringTag` 属性都是不可写的（writable）、不可枚举的（enumerable）但是可配置的（configurable）。

```js
class ValidatorClass {
  get [Symbol.toStringTag]() {
    return 'Validator';
  }
}

console.log(Object.prototype.toString.call(new ValidatorClass()));
// "[object Validator]"
```

> [toStringTag 适用于所有 DOM 原型对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag#tostringtag_适用于所有_dom_原型对象)

```js
const test = document.createElement('button');
test.toString(); // Returns [object HTMLButtonElement]
test[Symbol.toStringTag];  // Returns HTMLButtonElement
```

## 总结

* 强制原始值转换：`[@@toPrimitive]("default")` → valueOf() → toString()
* 强制数字类型转换、强制 number 类型转换、强制 BigInt 类型转换：`[@@toPrimitive]("number")` → valueOf() → toString()
* 强制字符串类型转换：`[@@toPrimitive]("string")` → toString() → valueOf()
