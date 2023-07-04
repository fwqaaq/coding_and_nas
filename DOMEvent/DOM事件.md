---
title: DOM事件
date: 2022-02-15 21:11:41
author: Jack-zhang
categories: JS
tags:
   - JS
summary: 关于直接操控 DOM 属性,编译速度大于任何框架,但是不利于维护
---
## 事件对象

![DOM事件](./img/DOM事件.png)

### 事件的绑定

>不使用 `addEventListener` 的形式只能同时为一个元素的一个事件绑定一个响应函数.不能绑定多个，如果绑定多个，则后边会覆盖前边的

* `addEventListener()`：通过这个方法也可以为元素绑定响应函数
  * 参数
     1. 事件的字符串，不要 on
     2. 回调函数，当事件触发时，该事件触发时该函数会被调用
     3. 是否在捕获阶段触发事件
        * 一个布尔值，默认值 false（冒泡阶段调用）
        * `options`：有关 `listener` 可选参数对象
           1. `capture`：`Boolean`。表示 `listener` 会在该类型的事件捕获阶段传播到该 EventTarget 时触发
           2. `once`：`Boolean`，表示 listener 在添加之后最多只调用一次。如果为 `true`，listener 会在其被调用之后自动移除
           3. `passive`：`Boolean`，如果为 true，表示 listener 永远不会调用 `preventDefault()`。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告
           4. `signal`：`AbortSignal`。该 AbortSignal 的 `abort()` 方法被调用时，监听器会被移除
  * 注意：
    * 使用 `addEventListener()` 可以同时为一个元素的相同事件同时绑定多个响应函数。
    * 这样当事件触发时，响应函数将会按照函数的绑定顺序执行
* `removeEventListener()`：使用 `addEventListener()` 绑定的事件只能通过 `removeEventListener()` 来移除。并且如果 `addEventListener()` 中的第二个参数是匿名参数将无法移除
  * 参数和 `addEventListener()` 相同

```html
<script>
  window.onload = function () {
    let btn01 = document.getElementById("btn01");
     btn01.addEventListener("click", function () {
        alert(1);
    }, false);
    let ale = function () {
        alert(2);
    }
    btn01.addEventListener("click", ale, false);
    btn01.removeEventListener("click",ale,fasle)

    //函数调用式
    function bond(obj, eventStr, callback) {
      obj.addEventListener(eventStr, callback, false)      
    }
    bond(btn01,"click",function(){
        alert("sb");
    });
  };
</script>
</head>

<body>
    <button id="btn01">点我一下</button>
</body>
```

### Event对象

>浏览器原生提供了一个`Event`对象,所有的事件都是这个对象的实例,或者说继承了`Event.prototype`对象.事件发生后,作为参数传给监听函数的事件对象

```js
const event = new Event(type, options)
```

* Event构造函数的第一个参数是**事件的名称**.第二个参数是一个options对象
  * `bubbles`:布尔值,可选,默认为false,表示事件的对象是否冒泡
  * `cancleable`:布尔值,可选,默认为false,表示事件是否可以被取消,即是否可以使用`Event.preventDefault()`取消这个事件.取消之后不会触发浏览器的默认行为
  * `composed`:布尔值,可选,默认为false,事件是否会在`shadow DOM`根节点之外触发侦听器

```js
const ev = new Event("look", { "bubbles": true, "cancelable": false });
document.dispatchEvent(ev);
```

* 上面代码新建一个look事件实例,然后使用`dispatchEvent`方法触发该事件
* 注意,如果不是显式指定`bubbles`属性为`true`,生成的事件就只能在**捕获阶段**触发监听函数

> `EventTarget.dispatchEvent`:向一个指定的目标派发一个事件,并以合适的顺序同步的顺序同步调用目标元素的事件处理函数

* 手动的使用`dispatchEvent()`方法派发事件

   ```js
   // HTML 代码为
   // <div><p>Hello</p></div>
   const div = document.querySelector('div');
   const p = document.querySelector('p');
   
   function callback(event) {
     const tag = event.currentTarget.tagName;
     console.log(`${tag} was clicked`); // DIV was clicked
   }
   
   div.addEventListener('click', callback, false);
   
   const click = new Event('click');
   p.dispatchEvent(click);
   ```

  * p 元素会发出一个 click 事件，并且默认是捕获阶段触发，在 div 上的监听函数是冒泡阶段运行，因此该函数不会触发
    * 如果写成 `div.addEventListener('click', callback, true)` 函数在捕获阶段运行
    * 或者写成 `const click = new Event("click",{bubbles:true})` 函数会在冒泡阶段运行
  * 如果 `div.dispatchEvent(click)`，无论是捕获阶段还是冒泡阶段，都会触发监听函数。因为 div 元素是事件的目标，不存在是否冒泡的问题

* `event.type`：获得触发事件的类型

> `currentTarge` 和 `targe`，前者是当前事件处理程序的所在元素。并且始终等于 this 对象，而 target 只包含事件的实际目标

```js
let btn =  document.getElementById("myBtn")
btn.onclick = function(){
   console.log(event.currentTarge === this)//true
   console.log(event.targe === this)//true
}

//将事件处理程序添加到父节点
document.body.onclick = function(){
   console.log(event.currentTarge === this)//true
   console.log(document.body === this)//true
   console.log(event.targe === document.getElementById("myBtn"))//true
}
```

>Event.bubbles，Event.eventPhase

* `Event.bubbles`：该属性返回一个布尔值。**只读属性**，一般用于 Event 实例是否可以冒泡
* `Event.eventPhase`：返回一个整数常量，表示事件所处的目标
  * `0`：事件目前没有发生
  * `1`：事件目前处于捕获阶段，即处于从祖先节点向目标节点的传播过程
  * `2`：事件到达目标节点，`Event.target` 属性指向的那个节点
  * `3`：事件处于冒泡阶段，即处于从目标节点的反向传播过程

> Event.cancelable，Event.cancelBubble，Event.defaultPrevented

* `cancelable`：属性返回一个布尔值，**只读**表示事件是否可以取消
  * 大多数浏览器原生事件是可以被取消的。比如取消 `click` 事件，点击链接将无效。除非显示声明，否则默认是不可取消的

   ```js
   const ev = new Event("click")
   ev.cancelable//false
   ```

  * 如果 `Event.cancelable = true`，调用 `Event.preventDefault()` 可以阻止浏览器对该事件的默认行为
  * 如果事件不能取消，调用 Event.preventDefault() 会没有任何效果
* `Event.cancelBubble` 属性是一个布尔值，如果设为true，相当于执行`Event.stopPropagation()`，可以阻止事件的传播
* `Event.defaultPrevented` 属性返回一个布尔值，**只读**，表示该事件是否调用过Event.preventDefault方法

> `Event.isTrusted`

* 属性返回一个布尔值，表示事件是否由真实的用户行为产生。比如用户点击链接产生一个 click 事件，该事件由用户产生；`Event` 构造函数生成的事件则是由脚本产生的

   ```js
   const ev = new Event("foo")
   ev.isTrusted //false  
   ```

  * ev 是由脚本产生的，所以会返回 false

> `Event.detail`

* `Event.detail` 属性只有浏览器的 UI（用户界面）事件才具有。该属性返回一个数值，表示事件的某种信息，具体含义与事件类型相关
  * 比如，对于 click 和 dbclick 事件，`Event.detail` 是鼠标按下的次数（1 表示单击、2 表示双击、3 表示三击）
  * 对于鼠标滚轮事件，`Event.detail` 是滚轮正向滚动的距离，负值就是负向滚动的距离，返回值总是 3 的倍数

  ```js
  function giveDetails(e) {
    console.log(e.detail);
  }
  
  document.querySelector('p').onclick = giveDetails;
  ```

> Event 对象的实例方法

* `event.preventDefault()`：用于阻止特定事件的默认动作。比如链接的默认行为是在被单机时导航到 href 属性指定的 url
* `event.stopPropagation()`：立即阻止事件流在DOM结构中传播，取消后续事件捕获或者冒泡，不包括当前节点上的其他的事件监听函数

   ```js
   // 事件传播到 p 元素后，就不再向下传播了
   p.addEventListener('click', function (event) {
     event.stopPropagation()
     console.log(1)
   }, true)
   
   // 事件冒泡到 p 元素后，就不再向上冒泡了
   p.addEventListener('click', function (event) {
     console.log(2)
   }, false)
   ```

  * p 元素绑定的两个 click 事件的监听函数。`stopPropageation` 方法只能组织这个事件向其他元素传播，第二个监听函数会触发，输出是 1，然后是2
* `event.stopImmediatePropagation()`：彻底组织这个事件的传播，不会在触发后面所有的 click 的监听函数
  * 将上面的 `stopPropagation` 改为 `stopImmediatePropagation` 可以彻底阻止这个事件的传播
  * 现在只会输出 1
* `Event.composedPath()`：返回一个数组，成员是事件的最底层节点和依次冒泡经过的所有上层节点

   ```js
    // <div><p>Hello</p></div>
  const div = document.querySelector("div")
  div.addEventListener("click", function (e) {
    console.log(e.composedPath())
  })
  //[p, div, body, html, document, Window]
   ```

### CustomEvent

>用于生成自定义事件的实例。浏览器预定义的事件，虽然可以手动生成，但是往往不能在事件上绑定数据。如果需要在出发事件的同时，传入指定的数据，就可以使用 CustomEvent 接口生成的自定义事件对象

* 浏览器原生提供 CustomEvent 构造函数来生成 CustomEvent 事件实例

   ```js
   new CustomEvent(type,options)
   ```

  * 造函数接受两个参数。第一个参数是字符串，表示事件的名字，这是必须的
  * 第二个参数是事件的配置对象，这个参数是可选的。CustomEvent 的配置对象除了接受 Event 事件的配置属性，只有一个自己的属性
  * `detail`：事件的附带数据，默认为 null

  ```js
  const myEvent = new CustomEvent('myevent', {
    detail: {
      message: 'Hello World'
    },
    bubbles: true,
    cancelable: true
  });
  const el = document.querySelector("p")
  el.addEventListener("myevent", function (e) {
    console.log(e.detail.message);
  })

  el.dispatchEvent(myEvent);
  ```

### 鼠标和滚轮事件

* `click`：用户单机鼠标主键（通常是左键）或者按回车键时触发。
* `dblclick`：用户双机鼠标主键（通常是左键）。
* `mousedown`：用户按下任意鼠标键触发
* `mouseenter`：用户把光标从元素的外部移动到元素的内部触发。该事件不冒泡，也不会在光标经过后代元素触发
* `mouseleave`：用户把光标从元素的内部移动到元素的外部触发。该事件不冒泡，也不会在光标经过后代元素触发
* `mousemove`：鼠标在元素上移动时反复触发
* `mouseout`：鼠标光标从一个元素移动到另一个元素时触发。移到的元素可以是原始元素的外部元素也可以是子元素
* `mouseover`：用户把鼠标光标从元素的外部移动到元素的内部时触发
* `mouseup`：用户释放鼠标时触发

>点击事件的触发顺寻

1. mousedown
2. mouseup
3. click
4. mousedown
5. mouseup
6. click
7. dblclick

> 客户端坐标：被保存在 `event.clientX`（鼠标指针的水平坐标）和 `event.clientY`（鼠标指针的垂直坐）

* 这两个属性表示事件发生时鼠标光标在视口中的位置

> 页面坐标：页面坐标时事件发生在页面上的坐标 `event.pageX` 和 `event.pageY` 可以获取.

* 这个属性返回的是鼠标在页面上的位置，并不是像客户端坐标一样返回的是视口左边与上边的距离

> 屏幕坐标：相对于屏幕，而不是相对于浏览器视口。所以通常屏幕坐标大于等于客户端坐标

* `event.screenX` 和 `event.screenY` 来获取坐标位置

```html
<style type="text/css">
  #areaDiv {
    width: 200px;
    height: 20px;
    border: 2px solid black;
  }
  #showMsg {
    width: 200px;
    height: 50px;
    border: 2px solid black;
  }
</style>
<script type="text/javascript">
  window.onload = function () {
    let areaDiv = document.getElementById("areaDiv");
    let showMsg = document.getElementById("showMsg");
    areaDiv.onmousemove = function (event) {
      let x = event.clientX;
      let y = event.clientY;
      //在showMsg中显示鼠标的坐标
      showMsg.innerHTML = "x=" + x + "," + "y=" + y
    }
  }
</script>

<body>
    <div id="areaDiv"></div>
    <br>
    <div id="showMsg"></div>
</body>
```

* `onmousewheel` 鼠标滚轮滚动的事件，会在滚轮滚动时触发，但是火狐不支持
  * `event.wheelDelta` 可以获取鼠标滚轮滚动的方向

```html
<style type="text/css">
  #box1 {
    width: 100px;
    height: 100px;
    background-color: red;
  }
</style>
<script type="text/javascript">
  window.onload = function () {
    //获取id为box1的div
    let box1 = document.getElementById("box1");
    //为box1绑定一个鼠标滚轮滚动的事件
    box1.onmousewheel = function (event) {
      //判断鼠标滚轮滚动的方向
      if (event.wheelDelta > 0 || event.detail < 0) {
          //向上滚,box1变短
          box1.style.height = box1.clientHeight - 10 + "px";
      } else {
          //向下滚,box1变长
          box1.style.height = box1.clientHeight + 10 + "px";
      }
      /* 
      当滚动条滚动时,如果浏览器有滚动条,滚动条会随之滚动
      这是浏览器的默认行为,如果不希望发生,则取消默认行为
      */
      return false;
    };
  };
</script>

<body style="height: 2000px;">
    <div id="box1"></div>
</body>
```
