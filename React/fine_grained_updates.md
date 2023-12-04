# Study React

> I'm studying React with kasong's 《Reack 设计原理》.

React does not have fine-grainded updates. Like `solid` and `svelte` are element-level frameworks, `vue` is component-level framework, but `react` is application-level framework. So its finer granularity does not need to be very fine-grained.

## Implementation of `useState` and `useEffect` with fine-grainded updates

1. Why does we need a global `effectStack`?
   * `effectStack` is used to store the current `effect` context in the top of stack. It seems to be of little use in the following code. Because it will have multiple `effect` contexts in the stack when `useEffect` is nested called.
2. Dependency relationship:
   * `state` -> subs(bucket with Set) that has many `effect` contexts
   * `effect` -> deps(bucket with Set) that has many `subs`, and `execute` function (side effect function) that will be called when `state` is changed.
3. Why does reset the dependency relationship when `cleanup` function is called?
   * **Because the context it retains may be unrelated to the current `state`.**
   * If cleanup function is not called, then the `effect.deps` is not empty. You will trigger irrelevant dependencies when you change the `state` in the second time.
   * For example, setName2("name2-2") -> effect context with setName1("name1-1") with triggerShow(false)

```js
/**
 * @typedef {Object} Effect
 * @property {Function} execute -- side effect function
 * @property {Set<Set<() => void>>} deps
 */

// effect called stack
const effectStack = []
// sub -> [effect1, effect2, ...], effect.dep -> [sub1, sub2, ...]
// effect (a `dep` bucket) -> this dep bucket has many subs
// ie. sub -> effect
//      |        | (.)
//      ------- dep
// effect.deps is going to be cleaned up when the some `state` is changed by `cleanup` function

/**
 * @param {Effect} effect
 * @param {Set<()=>void>} subs
 */
function subscribe(effect, subs) {
  // build subscribed relationship
  subs.add(effect)
  // dependency collection
  effect.deps.add(subs)
}

/**
 * clean up side effect fucntion
 * @param {Effect} effect
 */
function cleanup(effect) {
  // remove side effect function from all the `state` that all the effect has subscribed to.
  for (const subs of effect.deps) {
    subs.delete(effect)
  }
  // remove all the `state` that this effect has subscribed to.
  effect.deps.clear()
}

function useState(value) {
  /**
   * @type {Set<()=>void>}
   */
  const subs = new Set()
  const getter = () => {
    /**
  * get current effect in the top of stack, **triggered** by `useEffect`
  * @type {Effect}
  * */
    const effect = effectStack[effectStack.length - 1]
    if (effect) {
      // build subscribed relationship
      subscribe(effect, subs)
    }
    return value
  }
  const setter = (nextValue) => {
    value = nextValue
    // notify all the subscribed effects
    for (const effect of [...subs]) {
      effect.execute() //  execute side effect function
    }
  }
  return [getter, setter]
}

/**
 * @param {Function} callback
 */
function useEffect(callback) {
  const execute = () => {
    cleanup(effect)
    // push current effect into the stack context
    effectStack.push(effect)

    try {
      // execute callback at first time when call `useEffect`
      callback()
    } finally {
      effectStack.pop() // pop this effect from the stack context when current effect is done
    }
  }

  const effect = { execute, deps: new Set() }
  // immediately execute the effect
  execute()
}

/**
 * @param {Function} callback
 */
function useMemo(callback) {
  const [s, set] = useState()
  useEffect(() => { set(callback()) })
  return s
}
```

## Code example

```js
const [name1, setName1] = useState("name1")
const [name2, setName2] = useState("name2")
const [showAll, triggerShowA] = useState(true)

// the corresponding relationship between `deps` and state
// for example, a effect.deps has **three** `state` when execute useMemo function with showAll() is true.
// Each `state` has a `sub` bucket with the current effect context.
const whoIsHere = useMemo(() => {
  if (!showAll()) return name1()
  return `${name1()} and ${name2()}`
})

useEffect(() => console.log(`who is here: ${whoIsHere()}`))

setName1("name1-1")
triggerShowA(false)
setName2("name2-2")
```
