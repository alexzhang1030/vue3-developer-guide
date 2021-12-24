---
autoSort: 0
---

# 组合 store

组合多个 store 需要遵守一个顺序，不要在需要组合的 store 中引用对方，这会导致死循环

```js
const useA = defineStore('a', () => {
  const b = useB()

  // ❌ 不要这么搞，因为在 store b 中同样引入了 store a.name 一直引用导致嵌套循环了
  b.name

  function doSomething() {
    // ✅ 要在 action 或者 getters 中获取其他 store 的 name
    const bName = b.name
    // ...
  }

  return {
    name: ref('I am A'),
  }
})

const useB = defineStore('b', () => {
  const a = useA()

  // ❌ 同上方
  a.name

  function doSomething() {
    // ✅ 同上方
    const aName = a.name
    // ...
  }

  return {
    name: ref('I am B'),
  }
})
```

## store 引用 store

可以再任何 `getters` 和 `actions` 的顶部来引入其他的 store，这样就可以来使用其他的 store 的值了

```js
import { useUserStore } from './user'

export const cartStore = defineStore('cart', {
  getters: {
    // ... other getters
    summary(state) {
      const user = useUserStore()

      return `Hi ${user.name}, you have ${state.list.length} items in your cart. It costs ${state.price}.`
    },
  },

  actions: {
    purchase() {
      const user = useUserStore()

      return apiPurchase(user.id, this.list)
    },
  },
})
```

## 共享 getters

可以在 `getters` 来引入另一个 store 的 getter

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  getters: {
    summary(state) {
      // 引入，就可以共享
      const user = useUserStore()

      return `Hi ${user.name}, you have ${state.list.length} items in your cart. It costs ${state.price}.`
    },
  },
})
```

## 共享 actions

和 getters 相同

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  actions: {
    async orderCart() {
      const user = useUserStore()

      try {
        await apiOrderCart(user.token, this.items)
        // another action
        this.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})
```
