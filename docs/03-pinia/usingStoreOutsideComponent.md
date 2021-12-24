---
autoSort: 1
---

# 在组件外使用 store

`pinia` 储存依赖于所有的 store 都依赖于一个 `pinia` 实例。在大多数时候，直接引入你定义的 store 就可以做到开箱即用。例如在 `setup` 中，就可以直接采用 `store.xx` 来访问该 store 中的数据。但是在组件之外就不同了，这一章节将讲述该如何在组件外使用一个 store

## SPA

如果没有做 SSR，那么使用 `app.use()`

```js
// 引入自己定义的 store
import { useUserStore } from '@/stores/user'
import { createApp } from 'vue'
import App from './App.vue'

// ❌  失败，因为还没有创建 pinia
const userStore = useUserStore()

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// ✅ 只有在创建 pinia 后才能使用自定义的 store
const userStore = useUserStore()
```

确保自定义 store 要在创建 pinia 之后使用，这样才是有效的。

接下来看一下在 VueRouter 导航守卫里面使用 store 的案例：

```js
import { createRouter } from 'vue-router'
const router = createRouter({
  // ...
})

// ❌ 取决于 import 的顺序，这一行代码将会无效
const store = useStore()

router.beforeEach((to, from, next) => {
  // 如果只想在 beforeEach 中使用 store 的话
  if (store.isLoggedIn) next()
  else next('/login')
})

router.beforeEach(to => {
  // ✅ 这个没问题，因为此时 router 已经被安装了，所以 pinia 也会被自动注入
  const store = useStore()

  if (to.meta.requiresAuth && !store.isLoggedIn) return '/login'
})
```
