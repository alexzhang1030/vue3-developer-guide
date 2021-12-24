# 脚手架建设

以下内容，将作为参考内容，实际模拟一个大型项目的脚手架建设

在这之前，你需要先了解

- pnpm ，点击左侧查看 `pnpm` 相关内容
- vite ，点击左侧查看 `vite` 相关内容

现代的 fd(frontend, 前端) Vue 3 工程，工具链是这样的：

- 包管理工具采用 `pnpm`
- 使用 `typescript` 编写
- 使用 `Vue 3` 框架
- 使用 `vite` 开发、打包
- 使用一些 UI 框架
  - 可选 [naive UI](https://www.naiveui.com/zh-CN/light)
  - 或者 [element plus](http://element-plus.gitee.io/)
- 可以使用一些 CSS 框架（windiCSS、tailwindCSS）

## 创建项目

Vue 3 官方提供了一种快速创建下一代 Vue 应用的方式：

[create vue](https://github.com/vuejs/create-vue)

```bash
npm init vue@3
```

通过这种方式创建你会获得：

- Vue 3
- Vite
- Typescript 支持
- Vue Router
- jsx/tsx 支持

下面我们将创建以下目录

```
test-project
├─ .gitignore
├─ .vscode
│    └─ extensions.json
├─ README.md
├─ env.d.ts
├─ index.html
├─ package.json
├─ public
│    └─ favicon.ico
├─ src
│    ├─ App.vue
│    ├─ assets
│    │    ├─ base.css
│    │    └─ logo.svg
│    ├─ components
│    │    ├─ HelloWorld.vue
│    │    ├─ TheWelcome.vue
│    │    ├─ WelcomeItem.vue
│    │    └─ icons
│    ├─ main.ts
│    ├─ router
│    │    └─ index.ts
│    ├─ stores
│    │    └─ counter.ts
│    └─ views
│           ├─ AboutView.vue
│           └─ HomeView.vue
├─ tsconfig.json
└─ vite.config.ts
```

进入项目目录，`pnpm install`下载所有依赖，`pnpm dev`启动项目，即可在 3000 端口看到项目启动

查看项目目录，以下是约定：

- src 中放应用源码
  - `assets` 放 图片/font 文件 等
  - `components` 放组件
  - `router` 放路由
  - `stores` 放 pinia store
  - `views` 放页面
  - 创建 `composables`，放所有的可组合式的逻辑
  - 创建 `layouts`，放通用的页面，例如 `header.vue`、`404.vue`、`home.vue`
  - 创建 `styles`，放 css 文件
  - 创建 `utils` 放公共工具函数
  - 创建 `api` 放 api 函数

:::tip
值得注意的是，vite 默认创建了一个路径别名`alias`，指向的是`./src/`

以后我们引入文件的时候不需要再`../../../`，而是直接 `import { xxxModule } from '@/utils/util.ts'`
:::

## 基建

### polyfill 低版本浏览器

`vite` 插件
