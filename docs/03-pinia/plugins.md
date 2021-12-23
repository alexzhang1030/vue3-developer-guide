# pinia 核心概念 - plugins

通过一些底层 API，Pinia 商店可以可以被完全扩展。以下是可以执行的操作：

- 向 store 添加新属性
- 定义 store 时添加新选项
- 向 store 添加新方法
- 包装现有方法
- 更改甚至取消 action
- 实现本地存储等操作
- 只适用于特定的 store

插件通过`pinia.use()`添加到 pinia 的实例中。

下面是一个通过一个对象将一个静态属性添加到所有的 store 实例的一个例子：

```js
import { createPinia } from 'pinia'

// 在应用此插件后，所有的 store 实例都会被添加一个 secret 文件
// 插件应该被写在其他的文件中
function SecretPiniaPlugin() {
  return { secret: 'the cake is a lie' }
}

const pinia = createPinia()
// 向 pinia 提供这个插件
pinia.use(SecretPiniaPlugin)

// 在其他的地方这样使用
const store = useStore()
store.secret // store 就能被自动注入一个 secret 属性
```

这对于添加路由管理器、Dialog、Toast 管理器很有帮助

## 什么是 plugins

pinia 的插件是一个函数，可以选择返回到 store 的属性，它需要一个参数，即 context 上下文

```js
export function myPiniaPlugin(context) {
  context.pinia // 使用`createPinia()`创建的 pinia
  context.app // 使用`createApp`创建的当前 app (仅 Vue 3)
  context.store // 该插件正在增强的 store
  context.options // 使用`defineStore`定义 store 时的选项对象
  // ...
}
```

这个函数通过`pinia.use()`来传递到 pinia 实例中

```js
pinia.use(myPiniaPlugin)
```

插件只适用于传递给 app 的 pinia 之后的 store，否则将不会被应用

```js
createApp({}).use(createPinia())
```

## 为 store 添加新属性

可以通过个插件中返回一个对象来为每个 store 添加属性

```js
pinia.use(() => ({ hello: 'world' }))
```

也可以直接设置，不过推荐使用`返回值`的方式，因为这样会被`devtools`更好的追踪

```js
pinia.use(({ store }) => {
  // 可以直接这样设置，但是推荐还是使用返回值的方式
  store.hello = 'world'
})
```

使用插件的返回值会被`devtools`自动跟踪，但是为了你在调试这个变量的时候在 devtools 中展现出来，请确保在 dev 模式下将其添加到`store._customProperties`中。

```js
pinia.use(({ store }) => {
  store.hello = 'world'
  // 确保你使用的打包工具可以支持这样的语法，webpack 和 vite 应该默认支持
  if (process.env.NODE_ENV === 'development') {
    // 添加你在 store 中设置的任意键
    store._customProperties.add('hello')
  }
})
```

每个 store 都是用`reactive()`包装的，会自动解包它包含的`ref`、`computed`

```js
const sharedRef = ref('shared')
pinia.use(({ store }) => {
  // 每个 store 对象都有独立的 hello 属性
  store.hello = ref('secret')
  // 被自动解包了，不再需要 store.hello.value
  store.hello // 'secret'

  // 如果把值写在插件的外面
  // 那么所有的 store 的`shared`属性时共享的
  store.shared = sharedRef
  // 也会被自动解包
  store.shared // 'shared'
})
```

这就是为什么可以不用`.value`来访问属性，以及为什么它们为什么是响应式的。

## 为 store 添加新 state

如果想要为 store 添加新属性，或者在实例化 store 的时候使用 state，你需要在两个地方添加：

- 在 `store` 中设置，可以通过`store.myState`访问
- 在 `store.$state` 中设置，可以在 devtools 中看到，并在在 SSR 中会被序列化

```js
const globalSecret = ref('secret')
pinia.use(({ store }) => {
  // 设置普通的属性
  // secret 这个属性所有的 store 共享
  store.$state.secret = globalSecret
  store.secret = globalSecret
  // 自动解包
  store.secret // 'secret'

  // 设置一个函数
  const hasError = ref(false)
  store.$state.hasError = hasError
  // 必须要设置这一步
  store.hasError = toRef(store.$state, 'hasError')
})
```

## 添加新的外部属性

在添加外部变量、库实例或者其他简单的非响应式的变量时，需要使用`makeRaw()`包装一下，下面是一个将 router 添加到所有的 store 实例中的例子：

```js
import { markRaw } from 'vue'
import { router } from './router'

pinia.use(({ store }) => {
  // 例如在 store 中注册 router 时，必须要使用 makeRaw 包装一下
  store.router = markRaw(router)
})
```

## 在插件内部调用`$subscribe`

你也可以在插件中使用`store.$subscribe`和`store.$onAction`

```js
pinia.use(({ store }) => {
  store.$subscribe(() => {
    // 对商店的变化做出响应
  })
  store.$onAction(() => {
    // 对商店的 actions 做出响应
  })
})
```

## 添加新的选项

plugins 可以获取到在创建 store 时设置的额外选项。例如，可以设置一个`debounce`选项，可以防抖任何 store 中的函数

```js
defineStore('search', {
  actions: {
    searchContacts() {
      // ...
    },
  },

  // 会被插件读取
  debounce: {
    // searchContacts 防抖 300ms
    searchContacts: 300,
  },
})
```

下面是插件

```js
// 用一个 debounce 的库
import debounce from 'lodash/debounce'

pinia.use(({ options, store }) => {
  if (options.debounce) {
    // 使用新的 action 来覆盖需要 debounce 的 action
    return Object.keys(options.debounce).reduce((debouncedActions, action) => {
      debouncedActions[action] = debounce(
        store[action],
        options.debounce[action]
      )
      return debouncedActions
    }, {})
  }
})
```

:::tip
注意：在使用`setup`语法的时候，将自定义选项作为第三个参数
:::

```js
defineStore(
  'search',
  () => {
    // ...
  },
  {
    debounce: {
      searchContacts: 300,
    },
  }
)
```

## TypeScript

关于`plugins`所有的语法都有类型支持，因此无需使用`any`或`@ts-ignore`

### 注册 plugin 类型支持

一个 pinia 插件可以以下面的方式注册

```ts
import { PiniaPluginContext } from 'pinia'

export function myPiniaPlugin(context: PiniaPluginContext) {
  // ...
}
```

### 注入 store 属性类型支持

当向 store 添加新属性时，你也应该扩展`PiniaCustomProperties`接口

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    // 设置一个 setter，允许字符串 和 ref 的 字符串
    set hello(value: string | Ref<string>)
    get hello(): string

    // 也可以定义一个简单的值
    simpleNumber: number
  }
}
```

然后，自定属性就可以被类型安全地写入和读取了

```ts
pinia.use(({ store }) => {
  store.hello = 'hello'
  store.hello = ref('hello')

  store.number = Math.random()
  // 如果类型错误，就会报错了
  store.number = ref(Math.random())
})
```

`PiniaCustomProperties`是一个通用类型，允许你引用 store 的属性。

下面的例子中，可以给所有的`store`添加一个`options`属性，值是该`store`的`$options`（仅在使用`options`创建 store 时有效）

```ts
pinia.use(({ options }) => ({ $options: options }))
```

可以通过使用`PiniaCustomProperties` 的 4 种通用类型来正确地输入

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties<Id, S, G, A> {
    $options: {
      id: Id
      state?: () => S
      getters?: G
      actions?: A
    }
  }
}
```

:::tip 注意

当在泛型中扩展类型时，它们必须与源代码中的命名完全一致。Id 不能被命名为 id 或 I，S 不能被命名为 State。下面是每个字母代表的含义。

- S：State
- G：Getters
- A：Actions
- SS：Setup Store/Store

:::

## 注入新 state 类型支持

当添加新的属性的时候（包括 store 和 `store.$state`），你需要把
