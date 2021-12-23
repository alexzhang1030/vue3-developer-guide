# pinia 核心概念 - getters

## 定义 getters

`getters`是 store 中`state`的计算值，推荐使用箭头函数

```js
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    doubleCount: state => state.counter * 2,
  },
})
```

在大多数情况下，`getters`只依赖于`state`，`getters`也可以使用其他的`getter`。所以我们可以定义一个普通的函数，来访问整个 store 实例（普通函数中就可以使用`this`了），但是要定义返回的类型（在 Typescript）中，但是因为一个已知的 Typescript 限制。如果你的`getters`不需要使用`this`或用了箭头函数，那么就无需定义返回类型。

```ts
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    // 不用 this 自动推断出返回类型是一个数字
    doubleCount(state) {
      return state.counter * 2
    },
    // 使用了 this 返回类型必须明确设置
    doublePlusOne(): number {
      return this.counter * 2 + 1
    },
  },
})
```

## 使用 getters

可以直接使用 store 实例访问 getters

```vue
<template>
  <p>Double count is {{ store.doubleCount }}</p>
</template>

<script>
  export default {
    setup() {
      const store = useStore()
      return { store }
    },
  }
</script>
```

## 访问其他 getter

可以组合多个`getter`，通过`this`来访问其他的`getter`，如果使用的不是 Typescript，也可以使用 JSDoc 来提示你使用的 IDE 你返回的类型

```js
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    // 不用 this，就不需要指定返回类型，直接用箭头函数也 OK
    doubleCount: state => state.counter * 2,
    // 如果使用的是 JS，无法指定返回类型的时候
    // 可以使用 JSDoc 来指定返回类型
    /**
     *
     * @returns {number}
     */
    doubleCountPlusOne() {
      // 具有代码提示 ✨
      return this.doubleCount + 1
    },
  },
})
```

## 向 getter 传递参数

`getter`只是`state`的计算属性，因此无法向`getter`传递参数，但是可以返回一个函数来绕开一步传递参数

```js
export const useStore = defineStore('main', {
  getters: {
    getUserById: state => {
      return userId => state.users.find(user => user.id === userId)
    },
  },
})
```

在 Vue 组件中使用

```vue
<script>
  export default {
    setup() {
      const store = useStore()

      return { getUserById: store.getUserById }
    },
  }
</script>

<template> User 2: {{ getUserById(2) }} </template>
```

:::tip 注意
这种方式将不会缓存 getter，因为此时 getter 已经变成了可供调用的函数。可以在 getter 内部缓存结果来提高性能。
:::

```js
export const useStore = defineStore('main', {
  getters: {
    getActiveUserById(state) {
      // 先换缓存一部分的数据
      const activeUsers = state.users.filter(user => user.active)
      return userId => activeUsers.find(user => user.id === userId)
    },
  },
})
```

## 访问其他 store 的 getters

如果想要访问其他 store 的 getters，可以在 getter 内部使用

```js
import { useOtherStore } from './other-store'

export const useStore = defineStore('main', {
  state: () => ({
    // ...
  }),
  getters: {
    otherGetter(state) {
      // 定义一个其他 store 的实例
      const otherStore = useOtherStore()
      // 就可以直接使用了
      return state.localData + otherStore.data
    },
  },
})
```

## setup 中使用

可以直接使用 store 实例来访问 getters，和`state`是一样的

```vue
<script setup>
  import { useStore } from '../store/index.js'
  const store = useStore()
  store.otherGetter // otherGetter 是一个 getter
</script>
```

## options API 中使用

可以使用`state`章节中的`mapState`来引入`getter`

```js
import { mapState } from 'pinia'

export default {
  computed: {
    // 在组件中使用 this.doubleCount
    ...mapState(useStore, ['doubleCount'])
    // 将 doubleCounter 作为 myOwnName 来引入
    ...mapState(useStore, {
      myOwnName: 'doubleCounter',
      // 可以写一个函数，这样能够访问整个 store
      double: store => store.doubleCount,
    }),
  },
}
```
