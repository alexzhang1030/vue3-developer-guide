# Vue Router

Vue 3 版本上线，Vue Router 也有配合的版本（Vue Router V4）

[官方文档](https://next.router.vuejs.org/zh/)

这里记录 Vue Router V3 -> V4 的 重大变化（Breaking Change）

## new Router -> createRouter

Vue Router 不再是一个对象，而是一个函数，现在不需要写`new Router`，而是`createRouter`

```js
// 以前是
// import Router from 'vue-router'
import { createRouter } from 'vue-router'
const router = createRouter({
  // ...
})
```

## 新的 history 配置替代 mode

`mode: 'history'` 配置已经被一个更灵活的 history 配置所取代。根据你使用的模式，你必须用适当的函数替换它：

- "history": `createWebHistory()`
- "hash": `createWebHashHistory()`
- "abstract": `createMemoryHistory()`

```js
import { createRouter, createWebHistory } from 'vue-router'
// 还有 createWebHashHistory 和 createMemoryHistory

createRouter({
  history: createWebHistory(),
  routes: [],
})
```

## setup 中访问当前路由实例

由于在`setup`中没有`this`的概念，所以`this.$router`也就不复存在了，替换方案是`useRouter`

```js
import { useRouter, useRoute } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()

    function pushWithQuery(query) {
      router.push({
        name: 'search',
        query: {
          ...route.query,
        },
      })
    }
  },
}
```

## 其他重大更新

查看更多 [重大更新](https://next.router.vuejs.org/zh/guide/migration/index.html)

## 组合式 API

查看在 Vue Router 中的 [组合式 API](https://next.router.vuejs.org/zh/guide/advanced/composition-api.html)
