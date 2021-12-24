# PNpm

查看 [官方文档](https://pnpm.io/zh/) 获取更多有关 pnpm 信息

pnpm 是一个包管理工具，就像 `npm`、`cnpm`、`yarn` 一样

## 为什么使用 pnpm ？

查看 [pnpm 项目初衷](https://pnpm.io/zh/motivation) 获取更多有关为什么使用 pnpm 相关信息

- Vue 全线项目已转为 pnpm
- pnpm 安装和下载的速度极快
- pnpm 安装非扁平化的 `node_modules`，提高了安全性

## 使用 pnpm

确保你的 Node Version >= 12.0.0

```bash
# 全局安装 pnpm，就像 安装 cnpm、yarn 一样
npm install -g pnpm
```

## pnpm 命令

:::tip
这里只写一些常用的，更多命令请查看官方文档
:::

### `pnpm add <pkg>`

使用 `add` 来安装软件包以及依赖的软件包。

```bash
# 安装 vue
pnpm add vue
```

支持的参数：

- `--save-prod`, `-P`：将软件包安装为常规的 `dependencies`
- `--save-dev`, `-D`：将软件包安装为 `devDependencies`
- `--save-optional`, `-O`：将软件包安装为 `optionalDependencies`
- `--save-extract`, `-E`：保存的依赖将会有一个确切的版本
- `--save-peer`：将软件包安装到 `peerDependencies`
- `--global`：安装全局依赖
- `--workspace`：仅添加在 `workspace` 所找到的依赖

### `pnpm install`

别名：`pnpm i`

安装项目的所有依赖，详细的信息请看 [官方文档](https://pnpm.io/zh/cli/install) 获取更多配置选项

### `pnpm update`

更新依赖包，在不带参数的情况下，将会更新所有依赖关系

查看 [官方文档](https://pnpm.io/zh/cli/update) 获取更多信息

### `pnpm remove <pkg>`

删除指定项目依赖包

查看 [官方文档](https://pnpm.io/zh/cli/remove) 获取更多信息

### `pnpm run <script-name>`

运行一个在 `package.json` 中的 `scripts` 节点的脚本命令

比如：

```json
"scripts": {
    "dev": "vite dev"
}
```

这样运行：

```bash
pnpm run dev
# 或者直接，但是注意不要和 npm 命令重名
pnpm dev
```

:::tip 注意
使用 `pnpm run` 并不会触发用户定义的 `pre`、`post` 钩子，如果由于某种原因需要执行，请开启 `enable-pre-post-scripts`
:::

查看 [官方文档](https://pnpm.io/zh/cli/run) 获取更多有关 `run` 命令的信息
