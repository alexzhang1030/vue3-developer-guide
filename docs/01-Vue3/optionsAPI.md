---
autoSort: 2
---

# options API

:::tip
options API 和 Vue 2 版本的几乎完全相同，这里只写一些不是很常用的
:::

## 1. 案例

在 Vue 3 中，同样可以使用`options api`去定义一个应用，例如：

```js
// index.js
import { createApp } from 'vue'

const app = {
  data() {
    return {
      counter: 0,
    }
  },
  methods: {
    incrementCounter() {
      this.counter++
    },
  },
}

createApp(app).mount('#app')
```

```html
<!-- index.html -->
<div id="app">
  <button @click="incrementCounter">点击自增 counter 的值</button>
  <div>
    counter's value is {{counter}}
  </div>
</div>
```

[代码对应 CodeSandbox](https://codesandbox.io/s/01-optionsapi-b40z0)

## 2. computed/watch

[对应文档地址](https://v3.cn.vuejs.org/api/options-data.html#watch)

- `computed`
  - 接收 getter 函数，并返回一个**不可变**的 ref 响应式对象
  - 或者接收 getter/setter，返回**可读可写**的 ref 响应式对象
- `watch`：监听某个属性的值改变
  - deep：深度监听，如监听一个对象，添加 deep 属性时该对象的属性值发生变化也会触发监听
  - immediate：即时，即立刻触发一次回调
  - flush：控制回调时间，可选值`pre`|`post`|`sync`
    - `pre` 默认值，在模板渲染前调用回调
    - `post` 将回调延迟到模板渲染后调用，如果在回调中需要获取 DOM，那么就选择此值
    - `sync` 值改变就同步调用回调

### 例子：

```js
// index.js
import { createApp } from 'vue'

const app = {
  data() {
    return {
      firstName: 'alex',
      lastName: 'zhang',
      obj: {
        name: 'alex',
        age: 18,
      },
    }
  },
  methods: {
    changeObj() {
      this.obj.age = 19
    },
  },
  computed: {
    fullName: {
      get() {
        return this.firstName + ' ' + this.lastName
      },
      set(val) {
        console.log('更改了 fullName 的值，而且值是 ' + val)
        ;[this.firstName, this.lastName] = val.split(' ')
      },
    },
  },
  watch: {
    obj: {
      deep: true, // 不加 deep 不会监听引用对象的值的改变
      immediate: true,
      handler(val) {
        console.log('obj has changed', val)
      },
    },
  },
}

createApp(app).mount('#app')
```

```html
<!-- index.html -->
<div id="app">
  <div>firstName：<input placeholder="firstName" v-model="firstName" /></div>
  <div>lastName：<input placeholder="lastName" v-model="lastName" /></div>
  <div>fullName：<input placeholder="fullName" v-model="fullName" /></div>
  fullName is {{fullName}}
  <div>
    <button @click="changeObj">更改 obj 的值</button>
  </div>
</div>
```

[CodeSandbox 链接](https://codesandbox.io/s/computed-watch-86k1c)

### 区别：

- `computed`具有缓存
- `watch`无，一般用于监听某个属性发生变化，能使用`computed`写的尽量使用`computed`写
  - `watch` 一般用于 fetch api，或执行某些异步操作，例如搜索时，根据搜索条件`name`的变化来请求 api，此时就可以使用`watch`

## 事件处理

### 1. 多事件处理

（通过`,`分割不同的处理函数）：

```html
<div @click="handler01($event), handler02($event)"></div>
```

### 2. 事件描述符

[文档地址](https://v3.cn.vuejs.org/guide/events.html#%E4%BA%8B%E4%BB%B6%E4%BF%AE%E9%A5%B0%E7%AC%A6)

- `.stop`：`event.stopPropagation()`，阻止冒泡
- `.prevent`：`event.preventDefault()` 阻止默认行为
- `.capture`：事件捕获
- `.self`：仅本元素可处理该事件，如果`@click.self`则阻止除了该元素外的所有元素的点击事件
- `.once`：事件仅可触发一次
- `.passive`：事件的原生操作会在绑定回调的方法前执行，这个描述符是为了防止回调中有`event.preventDefault()`

多个描述符可以串联`@click.stop.prevent`，但是**注意串联的顺序**

## 生命周期钩子变化

Vue 3 中，生命周期函数更新为：

- `beforeCreate`
- `created`
- `beforeMount`
- `mounted`
- `beforeUnmount`
- `unmounted`

## 全局 API 更改

#### globalProperties

之前想要在全局上挂载某个属性

`Vue.prototype.foo = 'bar'`

在 Vue 3 中，请使用`globalProperties`

```js
const app = createApp({})

app.config.globalProperties.foo = 'bar'
```
