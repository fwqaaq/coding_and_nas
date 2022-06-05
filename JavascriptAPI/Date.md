# Date

> JavaScript的Date实例,用于呈现现实时间中的某一个时刻

* `dateString`:符合[`RFC2822`](https://datatracker.ietf.org/doc/html/rfc2822#page-14)或者[ISO 8601](https://www.w3.org/TR/NOTE-datetime)日期格式的字符串

## 构造函数

1. `new Date()`:无参数.表示新创建的 Date 对象表示实例化时刻的日期和时间

   ```js
   new Date()
   //Sun Jun 05 2022 20:07:28 GMT+0800 (中国标准时间)
   ```

2. `new Date(value)`:一个Unix时间戳,他表示一个整数值,自1970年1月1日00:00:00 UTC（the Unix epoch）以来的毫秒数
   * 中国地区标准时间:Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间)

   ```js
   new Date(1000)
   //Thu Jan 01 1970 08:00:01 GMT+0800 (中国标准时间)
   ```

3. `new Date(dataString)`:表示日期的字符串值.该字符串应该能被`Date.parse()`正确识别.(不建议使用此方法)

   ```js
   new Date("Sun Jun 05 2022 20:07:28 GMT+0800")
   //Sun Jun 05 2022 20:07:28 GMT+0800 (中国标准时间)
   ```

4. `new Date(year, monthIndex [, date? [, hours? [, minutes? [, seconds? [, milliseconds?]]]]])`
   * `year`:表示年份的整数值.0~99会会被映射到 1900~1999,其他值表示真实年份
   * `monthIndex`:0(1月)~11(12月)
   * `date`:表示一个月中的第几天的整数值,从1开始.默认值是1
   * `hours`:表示一天中的小时数(24小时制).默认值为0
   * `minutes`:表示完整的时间中的分钟的整数值.默认值为0
   * `seconds`:表示一个完整时间中的秒部分的整数值.默认值为0
   * `milliseconds`:表示一个完整时间的毫秒部分的整数值.默认值为0

   ```js
   new Date(2022,6,5,20,20,20)
   //Tue Jul 05 2022 20:20:20 GMT+0800 (中国标准时间)
   ```

## 方法

>Date.now():返回一个`Number`,表示从（1970 年 1 月 1 日 00:00:00 (UTC)）到当前时间的毫秒数

```js
Date.now()
//1654432343079
```

> Date.parse(dataString):解析一个表示日期的字符串,并返回从 1970-1-1 00:00:00 所经过的毫秒数

* 如果该字符串无法识别,或者一些情况下,包含了不合法的日期数值,则返回值为 NaN
* 由于不同宿主再如何解析日期字符串存在很多差异,一次最好还是手动解析日期字符串

* 显示调用:

   ```js
   Date.parse(dateString)
   ```

* 隐式调用:

   ```js
   new Date(dateString).getTime()
   ```

>Date.UTC(year,month[,date?[,hrs?[,min?[,sec?[,ms?]]]]])

* 返回返回 `1970-1-1 00:00:00 UTC` 到指定的日期之间的毫秒数.和new Date()最多参数的方法的参数使用方法一样

```js
Date.UTC(0,0)
//-2208988800000
```

## 实例方法

> getTime():返回值和Date.parse()

```js
new Date().getTime()
//1654433604966
```

> 指定各个时间段的方法

1. `getDate()`:返回一个指定的日期对象为一个月中的哪一日(1~31)
2. `getDay()`: 返回一个具体日期中一周的第几天,**0 表示星期天**
3. `getFullYear()`: 方法根据本地时间返回指定日期的年份
4. `getMonth()`返回一个指定的日期对象的月份,为基于 0 的值
5. `getHours()`:方法根据本地时间,返回一个指定的日期对象的小时
6. `getMinutes()`:方法根据本地时间,返回一个指定的日期对象的分钟数
7. `getMilliseconds()`:方法返回一个指定的日期对象的毫秒数

```js
const date = new Date()
console.log(date.getFullYear())//2022
console.log(date.getMonth())//5
console.log(date.getDate())//5
console.log(date.getDay())//0
console.log(date.getHours())//20
console.log(date.getMinutes())//59
console.log(date.getMilliseconds())//517
```

> 修改各个时间段的方法:只需要将get-->set

```js
date.setFullYear(2020)
date.getFullYear()//2020
```

>修改时间段返回的格式

1. `toJSON()`:以字符串的形式返回Date对象

   ```js
   date.toJSON()
   //'2020-06-09T12:59:48.517Z'
   ```

2. `toString()`方法返回一个表示该对象的字符串

   ```js
   date.toString()
   //'Tue Jun 09 2020 20:59:48 GMT+0800 (中国标准时间)'
   ```

3. `toLocaleString([locales [, options]])`:方法返回该日期对象的字符串,locales 和 options 使程序能够指定使用哪种语言格式化规则
   * `locals`:当地语言.例如中国是`zh-CN`
   * `options`:需要返回并格式化的日期(一下仅是一部分)
      * `weekday?`: "long" | "short" | "narrow"
      * `year?`: "numeric" | "2-digit"
      * `month?`: "numeric" | "2-digit" | "long" | "short" | "narrow"
      * `day?`: "numeric" | "2-digit"
      * `hour?`: "numeric" | "2-digit"
      * `minute?`: "numeric" | "2-digit"
      * `second?`: "numeric" | "2-digit"
   * 各个字段的意思:
     * `long`:完整的字段表述
     * `short`:部分字段表述(可以使用这个意思)
     * `2-dight`:只有两位数字表示.亲测之后除了Year字段外使用会抛出
       * <span style="color:red">Value 2-dight out of range for Date.prototype.toLocaleString options property month</span>
     * `narrow`:相比于short,更少的描述
     * `numeric`:本地化的字符描述

    ```js
    console.log(date.toLocaleString("zh-CN", { year: '2-digit', weekday: 'long', month: 'long', day: "numeric", hour: "numeric" }))//20年6月19日星期五 20时
    console.log(date.toLocaleString("zh-CN", { year: '2-digit', weekday: 'short', month: "short" }))//20年6月 周五
    console.log(date.toLocaleString("zh-CN", { year: 'numeric', weekday: 'narrow', month: 'numeric' }))//2020年6月 五
    console.log(date.toLocaleString("zh-CN", { year: 'numeric', weekday: 'narrow', month: 'narrow' }))//2020年6月 五
    ```
