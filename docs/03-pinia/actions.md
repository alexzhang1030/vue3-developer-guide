# pinia 核心概念 - actions

## 定义 actions

`actions`相当于组件中的方法，通过`defineStore()`中的`actions`节点来定义，是 pinia 中写业务逻辑的最佳选择

```js
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  actions: {
    increment() {
      this.counter++
    },
    randomizeCounter() {
      this.counter = Math.round(100 * Math.random())
    },
  },
})
```

和`getter`一样，`actions`也可以通过`this`来获取对整个`store`实例的访问（并支持完整的类型推断和代码补全）。与`getter`不同的是，**`action`可以是异步的**。可以在`action`中等待 api 响应或是另一个`action`。

```js
import { mande } from 'mande'

const api = mande('/api/users')

export const useUsers = defineStore('users', {
  state: () => ({
    userData: null,
    // ...
  }),

  actions: {
    async registerUser(login, password) {
      try {
        this.userData = await api.post({ login, password })
        showTooltip(`Welcome back ${this.userData.name}!`)
      } catch (error) {
        showTooltip(error)
        // let the form component display the error
        return error
      }
    },
  },
})
```

可以随意定义`action`返回的内容。

## 使用 action

就像调用方法一样简单

```vue
<script setup>
  import { useStore } from '../store/index.js'
  const store = useStore()
  store.someAction() // 使用 action
</script>
```

## 访问其他 store 的 action

和`getter`很类似

```js
import { useAuthStore } from './auth-store'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    // ...
  }),
  actions: {
    async fetchUserPreferences(preferences) {
      // 直接访问其他的 store
      const auth = useAuthStore()
      if (auth.isAuthenticated) {
        this.preferences = await fetchPreferences()
      } else {
        throw new Error('User must be authenticated')
      }
    },
  },
})
```

## options API 使用 action

使用`mapActions`映射`actions`

```js
import { mapActions } from 'pinia'

export default {
  methods: {
    // 直接通过`this.increment()`
    ...mapActions(useStore, ['increment'])
    // 将`doubleCounter`作为`myOwnName`引入
    ...mapActions(useStore, { myOwnName: 'doubleCounter' }),
  },
}
```

## 订阅 action

使用`store.$onAction`来订阅`action`。传递的回调函数将会在`action`指定之前执行。在处理`Promises`后，允许回调修改`action`的返回值。`onError`允许阻止 error 传播。这些对于在运行时跟踪错误很有用，类似于 Vue DOC 中的这个技巧。

以下在运行`action`之前记录和`resolve/reject`的例子

```js
const unsubscribe = someStore.$onAction(
  ({
    name, // action 的 name
    store, // store 实例，这里 === someStore
    args, // 传递给 action 的参数数组
    after, // 在 action 返回 resolve 后的钩子
    onError, // 在 action 抛出错误或者 reject 后的钩子
  }) => {
    // 创建一个变量
    const startTime = Date.now()
    // 这个将会在执行 action 之前触发
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // after 的回调将会在 action 完全之后成功后触发
    // 它会等待返回的 promise
    after(result => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // onError 将会在 action 抛出了异常或者 Promise 返回的 reject 触发回调
    onError(error => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)

// 这一行是手动删除监听器
unsubscribe()
```

默认情况下，`action`订阅会被绑定到组件上（如果`store`在`setup`）,这就意味着如果组件被卸载，订阅也将被删除，如果想让订阅与组件分离开，请在第二个参数传入`true`

```js
export default {
  setup() {
    const someStore = useSomeStore()

    // 在组件被卸载后，订单仍然存在
    someStore.$onAction(callback, true)

    // ...
  },
}
```

test auto deploy
