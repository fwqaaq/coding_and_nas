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

* `eqBy(fn, T1, T2)`: 判断两个元素经过 fn 映射后是否相等, 使用 `equal` 判断(不比较引用)

   ```JS
   const res = R.eqBy((obj)=>obj)({name:"zhangsan"})({name:"zhangsan"})//true
   ```

* `equals()`: 判断两个元素是否相等, 使用 `equal` 判断(不比较引用),如果是对象会进行深拷贝比较,完全一样才是相等

   ```js
   const b = R.equals(1, '1') //=> false
   const c = R.equals([1, 3, 2])([1, 2, 3]) //=> false
   R.eauqals({a: 1})( {a: {}}) //=> true
   ```

* `gt(T1,T2)`:如果第一个参数大于第二个参数,则返回 true.

   ```JS
   R.gt(2)( 1); //=> true
   ```

* `gte(T1,T2)`:如果第一个参数大于等于第二个参数,则返回true

   ```js
   R.gte(2)( 2)//=> true
   ```

* `identical(T1)(T2)`: 判断两个元素是否相等, 如果是对象,比较**引用**是否完全相等

   ```js
   R.identical({}, {})//flase
   ```

* `innerJoin((T1,T2)=>boolean, T1[], T2[])`, `pred` 函数必须是二元函数,根据 `pred` 函数的返回值,是否返回 `T1` 元素

   ```JS
   const res = R.innerJoin(
     (record, id) => record.id === id,
     [{ id: 824, name: 'Richie Furay' },
     { id: 956, name: 'Dewey Martin' },
     { id: 313, name: 'Bruce Palmer' },
     { id: 456, name: 'Stephen Stills' },
     { id: 177, name: 'Neil Young' },
     { id: 177, name: 'Neil Young' }],
     [177, 456, 999]);
     //[
     //    { id: 456, name: 'Stephen Stills' },
     //    { id: 177, name: 'Neil Young' },
     //    { id: 177, name: 'Neil Young' }
     //]
   ```

* `intersection(T1[],T2[])`:取出两个 list 中相同的元素组成的 set 并返回一个新的 list

   ```js
   const res = R.intersperse([{ a: "name" }])([{ a: "name" }, { b: "age" }])
   //=> [{ a: "name" }, [{ a: "name" }], { b: "age" }]
   ```

* `It(T1,T2)`:如果首个参数小于第二个参数,返回 true

   ```JS
   R.lt(2, 1); //=> false
   ```

* `Ite(T1,T2)`:如果首个参数小于等于第二个参数,返回 true

   ```JS
   R.lte(2, 2); //=> true
   ```

* `R.max(T1,T2)`: 返回两个参数中指定的较大值

   ```js
   R.max(1, 3)//3
   ```

* `R.maxBy(fn, T1, T2)`,返回经过 `fn` 映射后元素的较大值

   ```JS
   R.maxBy(n=>n*n)(-3)(2)//-3
   ```

* `R.min(T1,T2)`: 返回两个参数中指定的较小值

   ```js
   R.max(1, 3)//1
   ```

* `R.maxBy(fn, T1, T2)`,返回经过 `fn` 映射后元素的较小值

   ```JS
   R.maxBy(n=>n*n)(-3)(2)//2
   ```

* `pathEq(readonly[], val?, obj?)`: 判断对象的嵌套路径上是否为给定的值，通过 `R.equals` 函数进行相等性判断

   ```js
   const user1 = { address: { zipCode: 90210 } };
   const user2 = { address: { zipCode: 55555 } };
   const user3 = { name: 'Bob' };
   const users = [ user1, user2, user3 ];
   const isFamous = R.pathEq(['address', 'zipCode'], 90210);
   R.filter(isFamous, users); //=> [ user1 ]
   ```

* `propEq(name, val?, obj?)`: 如果指定对象和属性与给定的值相等,则返回 true.

   ```js
   const abby = {name: 'Abby', age: 7, hair: 'blond'};
   const fred = {name: 'Fred', age: 12, hair: 'brown'};
   const rusty = {name: 'Rusty', age: 10, hair: 'brown'};
   const alois = {name: 'Alois', age: 15, disposition: 'surly'};
   const kids = [abby, fred, rusty, alois];
   const hasBrownHair = R.propEq('hair', 'brown');
   R.filter(hasBrownHair, kids); //=> [fred, rusty]
   ```

* `sortBy(fn, [])`:根据给定的 `fn` 对列表进行排序

   ```js
   const pairs = [[-1, 1], [-2, 2], [-3, 3]]
   const sortByFirstItem = R.sortBy(R.prop(0))(pairs) //=> [[-3, 3], [-2, 2], [-1, 1]]
   ```

* `sortWith(Fn[], [])`:根据给定的 `Fn` 数组列表依次对输入数组进行排序

   ```js
   const res = R.sortWith([(a, b) => a * a - b * b], [-1, -9, 4, 0, -5])//[ 0, -1, 4, -5, -9 ]
   ```

* `symmetricDifference(T1[],T2[])`:求差集,所有不属于两列表交集元素集合.**如果是对象不会比较引用**

   ```JS
   R.symmetricDifference([1,2,3,4], [7,6,5,4,3]); //=> [1,2,7,6,5]
   R.symmetricDifference([{ a: 1 }], [{ a: 1 }, { b: 2 }])//=> [{b: 2}]
   ```

* `symmetricDifferenceWith(fn, T1[], T2[])`:差集.所有不属于两列表交集元素的集合.交集的元素由条件函数的返回值决定.

   ```JS
   const l1 = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
   const l2 = [{ a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }];
   const res = R.symmetricDifferenceWith((a, b) => a.a + 1 === b.a, l1, l2)
   //[ { a: 1 }, { a: 4 }, { a: 5 }, { a: 6 } ]
   ```

* `union(T1[],T2[])`:求并集,所有属于两列表元素集合.并且无重复元素

   ```js
   R.union([1, 2, 3], [2, 3, 4]); //=> [1, 2, 3, 4]
   ```

* `unionWith(Fn, T1[], T2[])`:求并集,合并两个列表为新列表(新列表中无重复元素).由 `predicate` 的返回值决定两元素是否重复

   ```js
   const l1 = [{ a: 1 }, { a: 2 }];
   const l2 = [{ a: 2 }, { a: 4 }];
   const res = R.unionWith((a, b) => a.a + 1 === b.a, l1, l2); //=> [{a: 1}, {a: 2}, {a: 2}, {a: 4}]
   ```

## Object

* `pathOr(defaultValue, readonly[]?, obj?)`: 非空对象在给定的路径上存在值,则将该值返回;否则返回默认值

   ```js
   R.pathOr('N/A', ['a', 'b'], {a: {b: 2}}); //=> 2
   R.pathOr('N/A', ['a', 'b'], {c: {b: 2}}); //=> "N/A"
   ```

* `paths(readonly[], obj?)`:提取对象中指定路径数组 `paths` 上的对应的值 `values`

   ```js
   R.paths([['a', 'b'], ['p', 0, 'q']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, 3]
   R.paths([['a', 'b'], ['p', 'r']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, undefined]
   ```
