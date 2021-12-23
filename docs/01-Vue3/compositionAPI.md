---
autoSort: 1
---

# composition API

:::tip 提示
在 Vue 3 中，composition API (组合式 API) 几乎无处不在

这也是比较推荐的使用方式。

这里将会有大量篇幅来介绍组合式 API 相关内容，如果你是 Vue 3 的新手开发者，请**详细阅读本篇章**
:::

## 什么是组合式 API

compositionAPI 组合式 API 是 Vue 3 引入的一种编码方式，在 Vue 2 的开发中，我们将逻辑固定死`data`中只能放数据，`methods`中只能放函数等等，过大的逻辑处理流程将会在`template`、`data`、`methods`中跳来跳去，其实是非常不利于开发的，而通过组合式 API 的方式来处理逻辑，将会增加复用性、解耦性，掌握后对于开发效率会有不小的提高。

通过查看 [官方文档](https://v3.cn.vuejs.org/guide/composition-api-introduction.html#%E4%BB%80%E4%B9%88%E6%98%AF%E7%BB%84%E5%90%88%E5%BC%8F-api) 获取更多有关**什么是组合式 API 的相关信息**

#### setup 选项

`setup() {}`

所有有关组合式 API 的使用，请在`setup`中使用

## ref

查看 [官方文档](https://v3.cn.vuejs.org/api/refs-api.html) 获取所有有关`ref`的 API

:::danger 注意
ref 函数只能接收基本数据类型的参数，例如`0`、`'aa'`、`[]`等，**无法接收 Object 对象**，创建响应式对象请使用下文的`reactive`
:::

通过`ref`来创建一个响应式变量

例如:

```js
let counter = ref(0)
```

`ref`函数接收一个参数，该参数就是响应式变量的初始值

上述代码创建一个`0`的响应式副本`counter`，是一个对象，只有一个属性`value`，访问/修改请使用`counter.value`

- 逻辑中使用`counter.value`来读取/写入值
- 视图中使用`counter`来读取值

#### Vue 2 对照

在 Vue 2 中，上述代码相当于在`data`中创建了一个属性`counter`初始值`0`

```js
export default {
  data() {
    return {
      counter: 0,
    }
  },
}
```

#### 例子

```js
import { createApp, ref } from 'vue'

const app = {
  setup() {
    const counter = ref(0)
    function incrementCounter() {
      counter.value++
    }
    return {
      counter,
      incrementCounter,
    }
  },
}

createApp(app).mount('#app')
```

```html
<div id="app">
  <button @click="incrementCounter">点击自增 counter 的值</button>
  <div>
    counter's value is {{counter}}
  </div>
</div>
```

[CodeSandbox 链接](https://codesandbox.io/s/ref-5tm1q)

## reactive

通过`reactive`来创建一个对象的响应式副本，转换是**深层次**的，基于`Proxy`实现，转换后的对象不等于原来的对象

查看 [官方文档](https://v3.cn.vuejs.org/api/basic-reactivity.html#reactive) 获取更多有关 reactive 内容

```js
let fetchUserInfo = reactive({
  name: 'alex',
  age: 18,
  address: 'Beijing',
})
```

[CodeSandbox 例子](https://codesandbox.io/s/reactive-o0vnc)

#### Vue 2 对照

上述代码相当于在 data 中创建

```js
export default {
  data() {
    return {
      fetchUserInfo: {
        name: 'alex',
        age: 18,
        address: 'Beijing',
      },
    }
  },
}
```

## 生命周期

在`setup`中注册生命周期钩子函数，类似于以下：

```js
import { onBeforeCreate } from 'vue'
export default {
  setup() {
    onBeforeCreate(() => {
      console.log('触发了 beforeCreate 生命周期')
    })
  },
}
```

#### 和 options API 对照

:::warning 注意
setup 是围绕着`beforeCreate`和`created`这两个生命周期钩子的，因此在`setup`中不需要使用。推荐将这两个钩子函数的代码写在`setup`中
:::

查看 [官方文档](https://v3.cn.vuejs.org/guide/composition-api-lifecycle-hooks.html) 获取更多对照信息

一模一样，只是增加了`on`前缀

- `beforeCreate`：`onBeforeCreate`
- `created`：`onCreated`
- `beforeMount`：`onBeforeMounted`
- `mounted`：`onMounted`
- `beforeUpdate`：`onBeforeUpdate`
- `updated`：`onBeforeUpdated`
- `beforeUnmount`：`onBeforeUnmount`
- `unmounted`：`onUnmounted`

例子请看:

[CodeSandbox 链接](https://codesandbox.io/s/lifecycle-setup-2z2vd?file=/src/index.js)

## computed

- 传入参数，如果是一个函数，那么就是 getter，返回一个**值不可变的 ref 变量**（通过`.value`来访问值）

```js
import { ref, computed } from 'vue'
export default {
  setup() {
    const counter = ref(2)
    // computed 第一个参数接收一个 getter 函数
    const doubleCounter = computed(() => counter.value * 2)
    // 如果想要 getter/setter，需要将第一个参数修改为一个对象
    let trebleCounter = computed({
      get() {
        return counter.value * 3
      },
      set(val) {
        counter.value = val / 3
      },
    })
    function decrementTrebleCounter() {
      // 访问通过`.value`来访问
      trebleCounter.value = trebleCounter.value - 1
    }
  },
}
```

[CodeSandbox 地址](https://codesandbox.io/s/computed-setup-oe8mw?file=/src/index.js:326-420)

## watch

查看 [官方文档](https://v3.cn.vuejs.org/api/computed-watch-api.html#watch) 获取更多有关 watch 的内容

接收 3 个参数：

- 一个想要侦听的响应式数据或者 getter 函数
- 一个回调
- 可选的配置

```js
const app = {
  setup() {
    const fetchUserInfo = reactive({
      username: 'alex',
      age: 18,
    })
    watch(
      fetchUserInfo,
      (val, oldVal) => {
        console.log('监听到 fetchUserInfo 发生变化', val)
      },
      {
        deep: true,
      }
    )
    function changeUsername(val) {
      fetchUserInfo.username = val
    }
    return {
      fetchUserInfo,
      changeUsername,
    }
  },
}
```

[CodeSandbox 地址](https://codesandbox.io/s/watch-setup-enq53)

#### Vue 2 对照

```js
export default {
  data() {
    return {
      fetchUserInfo: {
        username: 'alex',
        age: 18,
      },
    }
  },
  watch: {
    fetchUserInfo: {
      deep: true,
      handler(val) {
        console.log('监听到 fetchUserInfo 发生变化', val)
      },
    },
  },
}
```

## 为什么需要组合式 API

学习了组合式 API 部分，相信你还是有疑问，为什么需要组合式 API？将原本`data`、`methods`等等所有写在`setup`里，不是还是非常臃肿吗？组合式 API 十分接近`纯函数`的概念，和`react hook`的开发体验很相似，正如指南最开始所说，`composition API`将代码大大提高了可复用性和解耦性

#### 一个例子

我们试试使用`options`创建一个稍微复杂一点的 todo 案例

查看代码：[CodeSandbox 地址](https://codesandbox.io/s/optionsapi-todo-3y4pw?file=/src/index.js)

试想以下，如果要多个地方用到`todo`，是不是要重写一遍？你可能会想封装为组件，但是如果其他地方的样式稍微变化了一下呢？我们仅仅是需要所有有关 todo 的逻辑，而页面则是自己写，那么组合式 API 就是一个很棒的解决方案

组合式 API 改造后的代码：[CodeSandbox 地址](https://codesandbox.io/s/compositionapi-todo-gx6fn)

通过`useTodo`这个**hook**，我们可以获取到暴露出来的属性和方法，而无需再关心其内部逻辑，再次使用，只需要引入其属性即可，真正做到了解耦

## 在单文件组件中使用 setup

`Vue 3.2.x`版本正式通过这个`setup`语法糖提案，我们在使用组合式 API 的时候，必须要使用`setup(){}`，并且需要`return`才能在模板中使用，但是在单文件组件中，可以直接这样

```vue
<template> counter is {{ counter }} </template>
<script setup>
  import { ref } from 'vue'
  let counter = ref(0)
</script>
```

在`script`中使用`setup`关键字，无需`setup(){}`，无需`export default`

## 一些规范

查看 [官方文档](https://v3.cn.vuejs.org/style-guide/) 获取更多有关编码风格的内容

以下是一些编码风格约定

- 在创建可组合式函数（hook）时，最好使用`useXxx`，以`use`开头

## 写在最后

关于组合式 API，本指南只说这么多，但是旅途还远远没有结束，Vue 3 的官方文档写的相当详细，我也希望你能够通读一遍文档。

组合式 API 和选项式 API 的逻辑与表现大大不同，过于灵活的组合式 API 肯定一开始是不适应的，希望你能够摒弃掉 options API 的思想，全面拥抱 composition API。
