# pinia 教程

## 什么是 pinia

pinia 是 Vuex 的一种替代方案。目前`Vuex 4.x`只是向下兼容了 V3 版本，并不能发挥出`composition API`的作用

因此在社区中有一种推荐的解决方案`pinia`，[官方文档](https://pinia.vuejs.org/)

> pinia 目前已被合并到 Vue 项目中

## 安装 pinia

```bash
pnpm install pinia
# or use npm
npm install pinia
```

在`main.js`中使用`pinia`

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'

createApp({}).mount('#app').use(createPinia())
```

## 使用 pinia

#### 定义 store

```js
// store 文件中
import { defineStore } from 'pinia'

// 第一个参数是 store 的 id，是唯一的，不能重复
export const useStore = defineStore('main', {
  // 其他的配置
})
```

可以定义无数个`store`，但是注意 id 不能重复，并且**强烈建议将不同的 store 放在不同的文件中**

#### 使用 store

```js
// 组件中
import { useStore } from './store/user/index.js'

export default {
  setup() {
    // 获取到定义的 store 实例
    const store = useStore()
  },
}
```

获取到实例化的 store，就可以访问该 store 的`state`、`getters`、`actions`

#### 不能解构 store

不过要注意，store 实例是一个`reactive`包装的对象，所以不需要使用`.value`来获取值。但是，不能解构实例

```js
export default defineComponent({
  setup() {
    const store = useStore()
    // ❌ 这样破坏了响应式，name 和 doubleCount 不再是响应式变量
    const { name, doubleCount } = store

    name // "alex"
    doubleCount // 2

    return {
      // 永远都会是`alex`
      name,
      // 永远都会是`2`
      doubleCount,
      // 通过`computed`包装一下，就可以是响应式了
      doubleValue: computed(() => store.doubleCount),
    }
  },
})
```

#### 让解构 store 的值具有响应式

通过`storeToRefs`来让解构`store`的变量具有响应式

```js
import { storeToRefs } from 'pinia'

export default defineComponent({
  setup() {
    const store = useStore()
    // name、doubleCount 具有响应式
    const { name, doubleCount } = storeToRefs(store)

    return {
      name,
      doubleCount,
    }
  },
})
```
