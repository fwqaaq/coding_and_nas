# base

* `useState`、`useReducer` 以及 `useContext` 定义因变量
* `useEffect` 是将自变量变化后引发一系列副作用的 `Hook`，`useMemo` 以及 `useCallback` 也是对自变量的更新，但是不会涉及副作用
* `useRef`：[标记](https://react.dev/reference/react/useRef#referencing-a-value-with-a-ref)，不会触发组件的重新渲染，仅仅是缓存的作用

## useState

* useState：[参数为一个纯函数](https://react.dev/reference/react/useState#parameters)
  * It should be pure, should take no arguments, and should return a value of any type. React will call your initializer function when initializing the component, and store its return value as the initial state.
  * React 官方旨意它必须是一个纯函数（React 只会在初始渲染时调用这个函数）。为什么要使用回调函数？如果初始的计算值是一个复杂计算得到的值，那么每次重新渲染组件都会进行计算，影响性能。另一种情况是依赖于其它组件（`props` 传值）状态的时候，每次组件渲染的时候，也会重新计算；这时候使用回调函数，只会在初始化时更新一次，这时候我们可能希望使用 `useEffect` 这类自变量观察 `props` 传入的值，来达到更新的效果。
* setState：[参数也为一个纯函数](https://react.dev/reference/react/useState#setstate-parameters)
  * 更新 state 时也可以使用一个回调函数
  * React will put your updater function in a queue and re-render your component.
  * React 在并发模式下，可能会延迟会重新安排一些更新，如果直接使用当前状态值来更新状态可能是过时的值，[示例](https://react.dev/reference/react/useState#troubleshooting)。如果使用回调函数，那么该回调会放入一个更新的队列，之后重新渲染你的函数，这时，[它会根据上一个值来更新状态](https://react.dev/reference/react/useState#setstate-caveats)。
* 关于数组以及对象的更新：<https://react.dev/reference/react/useState#updating-objects-and-arrays-in-state>
