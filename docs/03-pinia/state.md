---
autoSort: 5
---

# pinia 核心概念 - state

在大多数情况下，state 是 store 的核心部分。在 pinia 中，state 被定义为一个返回初始 state 的函数。这使得 pinia 可以在服务器和客户端都工作。

## 定义 state

```js
import { defineStore } from 'pinia'

const useStore = defineStore('storeId', {
  // 箭头函数推荐用于类型推理
  state: () => {
    return {
      // 所有这些属性将自动推断出它们的类型
      counter: 0,
      name: 'Eduardo',
      isAdmin: true,
    }
  },
})
```

## 访问 state

默认情况下，可以通过`store`实例访问状态来直接读写状态：

```js
// 组件中
const store = useStore()
// store 实例可以直接访问 state 中的值
store.counter++
```

## 重置 state

通过`$reset()`来将 state 重置为初始值

```js
const store = useStore()
store.$reset()
```

## options API 使用 state

如果使用的是`data`、`methods`，这样使用`state`

```js
import { mapState } from 'pinia'

export default {
  computed: {
    // this.counter 就能访问了
    // 和 store.counter 是一样的效果
    ...mapState(useStore, ['counter'])
    // 和上面的一样，但是将 counter 注册为 myOwnName
    ...mapState(useStore, {
      myOwnName: 'counter',
      // 你也可以写一个函数来获得对 store 的访问权
      double: store => store.counter * 2,
      // 可以访问 this，但是不会有任何代码提示，你会在 getters 章节看到为什么
      magicValue(store) {
        return store.someGetter + this.counter + this.double
      },
    }),
  },
}
```

## 更改 state

除了可以直接通过`state.counter++`这种方式来更改`state`，还可以使用`$patch`来批量更改值

```js
store.$patch({
  counter: store.counter + 1,
  name: 'alex',
})
```

`$patch`同样还可以接收一个函数，这个主要是为了在`devtools`中分组

```js
cartStore.$patch(state => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

## 替换 state

通过`$state`来整体替换 state，**会覆盖原来的**

```js
store.$state = {
  name: 'alex',
}
```

## 订阅状态

使用`$subscribe`来观察 state 的变化。和 vuex 的 \$subscribe 用法相同，与 watch 不同的是， subscribe 在数据更新后只会触发一次

关于 subscribe 相关内容，请看 [这里](https://vuex.vuejs.org/zh/api/#subscribe)

```js
cartStore.$subscribe((mutation, state) => {
  mutation.type // 'direct' | 'patch object' | 'patch function'
  //  === cartStore.$id
  mutation.storeId // 'cart'
  // mutation.type === 'patch object' 的时候才能使用 payload
  mutation.payload // 传递给 cartStore.$patch() 的 patch 对象

  // 例如在数据发生变化时，持久化保存在 localStorage
  localStorage.setItem('cart', JSON.stringify(state))
})
```

默认情况下，订阅将会绑定在使用的组件中，也就是说当该组件卸载时，消息订阅也会随之消失，配置 `$subscribe` 第二个参数中的属性值`detached: true`将消息订阅与组件分离

```js
store.$subscribe(() => {}, { detached: true })
```

## 监听整个 state 实例

可以直接监听整个 state 实例

```js
export default {
  setup() {
    watch(
      pinia.state,
      state => {
        localStorage.setItem('piniaState', state)
      },
      { deep: true }
    )
  },
}
```
