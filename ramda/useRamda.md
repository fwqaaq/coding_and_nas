# useRamda

> 如何使用 Ramda 完成一个函数式的编程,ramda 所有函数都支持柯里化

## Relation

* `clamp(min,max,val)`: 将一个数字限制在一个范围内

   ```JS
   //* curry
   const res = R.clamp(1)(10)(4) // 4
   ```

* `countBy(()=>{})([*])`: 将数组中的元素使用函数映射后返回一个对象,`key` 是数组的重新映射, `value` 是 `key` 的个数

   ```js
   const letters = ['a', 'b', 'A', 'a', 'B', 'c'];
   const res = R.countBy(R.toLower)(letters)   //=> {'a': 3, 'b': 2, 'c': 1}
   ```

* `difference([*],[*])`: 只返回两个数组中第一个数组的差集,如果是 `object(e.g. array,object...)` 只比较值,不比较引用

   ```JS
    R.difference([{ a: 1 }, { b: 2 }])([{ a: 1 }, { b: 3 }])//[{b: 2}]
    R.difference([[[1]], [2, 3]])([[[2, 3]], [3]])// [[[1]], [2, 3]]
   ```

* `differenceWith((T1,T2)=>boolean, T1[], T2[])`: 只返回两个数组中第一个数组中的差集,回调函数的两个参数分别是`T1`,`T2`两个类型的元素

   ```js
   const l = [1, -1, 1, 3, 4, -4, -4, -5, 5, 3, 3]
   const l2 = [1, -1, 1, 3]

   const res = R.differenceWith((x, y) => (x === y))(l)(l2)//[ 4, -4, -5, 5 ]
   ```
