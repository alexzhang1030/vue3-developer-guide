# Vite

## 什么是 Vite

[vite 官方文档](https://cn.vitejs.dev/)

`vite` 是一个新型前端构建工具，具有极快的热更新（基于 ES Module），与 Webpack 相比提升了大量的开发体验

## 为什么选 Vite

查看 [为什么选择 Vite](https://cn.vitejs.dev/guide/why.html) 获取更多相关信息

## Start

### 搭建第一个 vite 项目

```bash
pnpm create vite
```

之后安装提示操作即可

### `index.html` 与根目录

你可能会看到，创建的 `index.html` 不是在项目的根目录而是在 `public` 文件夹中，这是因为在开发时 vite 是一个服务器，而 `index.html` 将视为你开发项目的根目录

Vite 将 index.html 视为源码和模块图的一部分。Vite 解析 `<script type="module" src="...">` ，这个标签指向你的 JavaScript 源码。甚至内联引入 JavaScript 的 `<script type="module">` 和引用 CSS 的 `<link href>` 也能利用 Vite 特有的功能被解析。另外，index.html 中的 URL 将被自动转换，因此不再需要 `%PUBLIC_URL%` 占位符了。

### 命令行界面

在安装了 Vite 的项目中，可以在 npm scripts 中使用 vite 可执行文件，或者直接使用 `npx vite` 运行它。下面是通过脚手架创建的 Vite 项目中默认的 npm scripts：

```json
{
  "scripts": {
    "dev": "vite", // 启动开发服务器，别名：`vite dev`，`vite serve`
    "build": "vite build", // 为生产环境构建产物
    "preview": "vite preview" // 本地预览生产构建产物
  }
}
```

## 功能部分

### npm 依赖创建与预构建

原生 ES 导入不支持下面这样的裸模块导入：

```js
import { someMethod } from 'my-dep'
```

上面的代码会在浏览器中抛出一个错误。Vite 将会检测到所有被加载的源文件中的此类裸模块导入，并执行以下操作:

- 预构建，提高页面加载速度，并将 CommonJS/UMD 转为 ESM 格式的
- 重写导入为合法的 URL，例如 `/node_modules/.vite/my-dep.js?v=f3sf2ebd` 以便浏览器能够正确导入它们。

### 模块热重载

Vite 提供了一套原生 ESM 的 HMR API。 具有 HMR 功能的框架可以利用该 API 提供即时、准确的更新，而无需重新加载页面或清除应用程序状态。Vite 内置了 HMR 到 Vue 单文件组件（SFC） 和 React Fast Refresh 中。也通过 @prefresh/vite 对 Preact 实现了官方集成。

注意，你不需要手动设置这些 —— 当你通过 `create-vite` 创建应用程序时，所选模板已经为你预先配置了这些。

### Typescript

Vite 天然支持引入 `.ts` 文件

Vite 仅执行 `.ts` 文件的转译工作，并 不 执行任何类型检查。并假设类型检查已经被你的 IDE 或构建过程接管了（你可以在构建脚本中运行 `tsc --noEmit` 或者安装 `vue-tsc` 然后运行 `vue-tsc --noEmit` 来对你的 `*.vue` 文件做类型检查）。

Vite 使用 esbuild 将 TypeScript 转译到 JavaScript，约是 tsc 速度的 20~30 倍，同时 HMR 更新反映到浏览器的时间小于 50ms。

查看 [这里](https://cn.vitejs.dev/guide/features.html#typescript-compiler-options) 获取 Typescript 的编译选项

### Vue

Vite 为 Vue 提供了第一优先支持

- Vue 3 单文件支持：[@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)
- Vue 3 jsx 支持：[@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)

### jsx

`.jsx` 和 `.tsx` 文件同样开箱即用

查看 [这里](https://cn.vitejs.dev/guide/features.html#jsx) 获取更多有关 jsx 的支持

### CSS

通过导入 `.css` 文件会将内容插入到 `<style>` 中，同样支持热更新

查看 [这里](https://cn.vitejs.dev/guide/features.html#css) 获取更多有关 CSS 的支持

### 静态资源处理

导入一个静态资源会返回解析后的 URL：

```js
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

添加一些特殊的查询参数来更改资源引入的方式：

```js
// 显式加载资源为一个 URL
import assetAsURL from './asset.js?url'
```

```js
// 以字符串形式加载资源
import assetAsString from './shader.glsl?raw'
```

```js
// 加载为 Web Worker
import Worker from './worker.js?worker'
```

```js
// 在构建时 Web Worker 内联为 base64 字符串
import InlineWorker from './worker.js?worker&inline'
```

### JSON

JSON 可以被直接导入

```js
// 导入整个对象
import json from './example.json'
// 对一个根字段使用具名导入 —— 有效帮助 treeshaking！
import { field } from './example.json'
```

## 使用插件

Vite 可以使用插件进行扩展，这得益于 Rollup 优秀的插件接口设计和一部分 Vite 独有的额外选项。这意味着 Vite 用户可以利用 Rollup 插件的强大生态系统，同时根据需要也能够扩展开发服务器和 SSR 功能。

### 添加一个插件

若要使用一个插件，需要将它添加到项目的 `devDependencies` 并在 vite.config.js 配置文件中的 plugins 数组中引入它。例如，要想为传统浏览器提供支持（babel），可以按下面这样使用官方插件 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)

`plugins` 也可以接受包含多个插件作为单个元素的预设。这对于使用多个插件实现的复杂特性（如框架集成）很有用。该数组将在内部被扁平化。

Falsy 虚值的插件将被忽略，可以用来轻松地启用或停用插件。

### 查找插件

:::tip 注意
Vite 旨在为常见的 Web 开发范式提供**开箱即用**的支持。在寻找一个 Vite 或兼容的 Rollup 插件之前，请先查看 功能指引。大量在 Rollup 项目中需要使用插件的用例在 Vite 中已经覆盖到了。
:::

查看 [这里](https://cn.vitejs.dev/guide/using-plugins.html#finding-plugins) 获取插件更多内容

## 构建生产版本

当需要将应用部署到生产环境时，只需运行 vite build 命令。默认情况下，它使用 `<root>/index.html` 作为其构建入口点，并生成能够静态部署的应用程序包。

### 浏览器兼容性

用于生产环境的构建包会假设目标浏览器支持现代 JavaScript 语法。默认情况下，Vite 的目标浏览器是指能够 支持原生 ESM script 标签 和 支持原生 ESM 动态导入 的。

查看 [构建生产版本](https://cn.vitejs.dev/guide/build.html#building-for-production) 获取更多相关信息
