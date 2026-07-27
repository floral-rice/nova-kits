# BasicLayout 组件设计

> 日期：2026-07-27
> 分支：featrue/BasicLayout

## 目标

1. 新增 `kits` 聚合包，用户只需安装 `@nova-kits/kits` 即可使用组件库全部功能
2. 在 kits 包中实现 `BasicLayout` 组件，提供后台管理系统的基础布局能力

## kits 包结构

```
packages/kits/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── index.ts              # 聚合入口：re-export components + hooks + BasicLayout
    └── layouts/
        └── BasicLayout/
            ├── BasicLayout.vue       # 主组件
            ├── typings.ts            # 类型定义
            └── components/
                ├── NavHeader.vue     # 顶部导航（logo + 标题 + 标签页 + 右侧插槽）
                ├── SideMenu.vue      # 侧边菜单（基于 el-menu）
                └── TabBar.vue        # 标签页栏
```

**kits/src/index.ts：**

```ts
export * from '@nova-kits/components'
export * from '@nova-kits/hooks'
export { default as NBasicLayout } from './layouts/BasicLayout/BasicLayout.vue'
```

**package.json 依赖：**

- `dependencies`: `@nova-kits/components`, `@nova-kits/hooks`

## BasicLayout 组件设计

### 整体布局

```
┌──────────────────────────────────────────┐
│  NavHeader (logo + 标题 + 标签页 + 右侧) │
├──────────┬───────────────────────────────┤
│          │                               │
│ SideMenu │       内容区 (router-view)     │
│          │                               │
└──────────┴───────────────────────────────┘
```

### Props

```ts
interface MenuItem {
  name: string
  path?: string
  icon?: string | Component
  children?: MenuItem[]
  authority?: string | string[]
}

interface BasicLayoutProps {
  /** 标题 */
  title: string
  /** logo，字符串为图片路径，false 隐藏，组件为自定义渲染 */
  logo?: string | false | Component
  /** 菜单数据，最多支持三级 */
  menus: MenuItem[]
  /** 用户权限列表，用于菜单过滤 */
  authorities?: string[]
  /** 固定标签页（如首页），不可关闭 */
  topTabs?: { title: string; path: string }[]
  /** 鉴权配置 */
  auth?: {
    redirectURL?: string
    check: () => Promise<any>
    onSuccess?: (res: any) => void
    onFail?: (err: Error) => void
  }
}
```

### 插槽

| 名称 | 说明 |
|------|------|
| `right` | 右上角自定义内容 |
| `default` | 自定义内容区（不使用时自动渲染 router-view） |

### 路由集成

不通过 props 传入 routes，直接使用 vue-router API：

- `useRouter().getRoutes()` 获取已注册路由
- `useRoute()` 监听当前路由变化
- 标签页根据路由变化自动生成，用户在路由配置 `meta.title` 即可

### Composables

**useAuth** — 鉴权逻辑

- 在 BasicLayout `onMounted` 中调用
- 调用 `auth.check()`，成功执行 `onSuccess`，失败执行 `onFail`
- 默认失败行为：重定向到 `redirectURL`，携带当前 URL 作为 redirect 参数
- loading 期间显示加载状态

**useTabs** — 标签页管理

- 监听 `route.path` 变化，自动新增/激活标签
- `topTabs` 作为固定标签，始终显示在最前，不可关闭
- 动态标签上限 10 个，超出自动关闭最早的
- 提供操作方法：`closeTab`、`refreshTab`、`closeOtherTabs`、`closeAllTabs`
- 刷新机制：通过改变 router-view 的 `key`（累加 refreshCount）触发组件重新渲染

**useMenuFilter** — 菜单权限过滤

- 纯计算，无副作用
- 无 `authorities` 配置时返回原菜单
- 递归过滤：保留 `authority` 匹配或无 `authority` 的菜单项

### 子组件

**NavHeader.vue** — 顶部导航栏

- 左侧：logo（图片/自定义/隐藏）+ 标题
- 中间：TabBar 组件
- 右侧：`#right` 插槽
- 固定在顶部，`position: sticky`

**SideMenu.vue** — 侧边菜单

- 基于 `el-menu` 实现，支持 `el-sub-menu` 嵌套（最多三级）
- 点击菜单项：外部链接用 `window.open`，内部路由用 `router.push`
- 当前路由高亮：`:default-active="route.path"`
- 菜单折叠：通过 `el-menu` 的 `:collapse` prop 控制

**TabBar.vue** — 标签页栏

- 固定标签（topTabs）不可关闭，始终显示在最前
- 动态标签可关闭
- 右键菜单：关闭 / 关闭其他 / 刷新
- 当前激活标签高亮
- 超过 10 个标签时自动关闭最早的动态标签

### 样式方案

使用 BEM 命名，统一用 `-` 连接：

```
nk-basic-layout                // 块
nk-basic-layout-nav            // 顶部导航
nk-basic-layout-nav-logo       // logo
nk-basic-layout-nav-title      // 标题
nk-basic-layout-menu           // 侧边菜单
nk-basic-layout-content        // 内容区
nk-basic-layout-tab-bar        // 标签栏
```

- 修饰符：`nk-basic-layout-{element}--{modifier}`
- 样式写在 `<style scoped>` 中，使用 SCSS
- 可通过 CSS 变量覆盖主题色

## 文档设计

文档放在 `docs/zh/components/layout/basic-layout/` 下：

```
docs/zh/components/layout/
├── index.md           # 现有 NLayout 文档
├── meta.json          # 侧边栏配置（需更新）
└── basic-layout/
    ├── index.md       # BasicLayout 文档
    └── demo/          # 示例组件
        ├── BasicUsage.vue        # 基础用法
        ├── WithAuth.vue          # 鉴权示例
        └── CustomRight.vue       # 自定义右侧插槽
```

文档内容包含：组件说明、基础用法示例、Props 表格、插槽说明、类型定义。

## 不包含的功能

- 收藏夹
- 水印
