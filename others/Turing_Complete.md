# 图灵完备

> 起因：今天面试，谈到图灵完备，面试官说 TypeScript 类型系统是图灵完备的，但是我本人并不是很认可，所以就想写一篇文章来记录一下。

* 特地来补充一下：TypeScript 在语言层面是图灵完备的，但是在实际实现中并不健全。

## 什么是图灵完备

> 图灵完备（Turing completeness）是一个计算系统的属性，指的是该系统能够模拟标准图灵机的计算能力。具体来说，如果一个系统能够执行任何算法或者计算过程，那么它就被认为是图灵完备的。

1. **无限存储能力**：理论上，系统应该能够使用无限的内存或存储空间。在实际应用中，这通常意味着系统可以使用任意数量的内存。
2. **状态机制**：系统能够根据当前状态和输入来改变状态或执行操作。
3. **条件分支**：系统能够根据条件执行不同的操作或计算路径。
4. **循环或递归能力**：系统能够执行重复的操作，直到满足某个条件。

## 为什么不健全

> 图灵完备的系统在执行循环或者递归的时候，可以重复操作达到某个条件。但是 TypeScript 的编译器在很多时候很快就会崩溃。

* 类型推导也是不健全的

```ts
function dec(n: number): boolean {
  return n === 0 ? true : dec(n - 1)
}
const _x = dec(10) ? true : 42
```

* 递归或者循环时不能完全的满足到某个条件（这是预期的行为）：<https://github.com/microsoft/TypeScript/issues/14837>

这里有一个很棒的示例：<https://github.com/Dragon-Hatcher/type-system-chess>。

综上 TypeScript 是语言层面的图灵完备。

参考：<https://github.com/microsoft/TypeScript/issues/14833>、<https://sdleffler.github.io/RustTypeSystemTuringComplete/>
