# BasicLayout 基础布局

后台管理系统的基础布局组件，集成了顶部导航、侧边菜单、标签页和鉴权功能。

## 基础用法

<ClientOnly>
  <demo src="./demo/BasicUsage.vue"/>
</ClientOnly>

## 鉴权

通过 `auth` prop 配置鉴权逻辑，支持校验、成功/失败回调和重定向。

<ClientOnly>
  <demo src="./demo/WithAuth.vue"/>
</ClientOnly>

## 自定义右侧

通过 `#right` 插槽自定义右上角内容。

<ClientOnly>
  <demo src="./demo/CustomRight.vue"/>
</ClientOnly>

## Props

| 属性        | 类型                                | 默认值 | 说明                               |
| ----------- | ----------------------------------- | ------ | ---------------------------------- |
| title       | `string`                            | -      | 标题（必填）                       |
| logo        | `string \| false \| Component`      | -      | logo，字符串为图片路径，false 隐藏 |
| menus       | `MenuItem[]`                        | -      | 菜单数据（必填），最多支持三级     |
| authorities | `string[]`                          | -      | 权限列表，用于菜单过滤             |
| topTabs     | `{ title: string; path: string }[]` | -      | 固定标签页，不可关闭               |
| auth        | `AuthConfig`                        | -      | 鉴权配置                           |

## 插槽

| 名称    | 说明                                         |
| ------- | -------------------------------------------- |
| right   | 右上角自定义内容                             |
| default | 自定义内容区（不使用时自动渲染 router-view） |

## 类型定义

```ts
interface MenuItem {
  name: string;
  path?: string;
  icon?: string | Component;
  children?: MenuItem[];
  authority?: string | string[];
}

interface AuthConfig {
  redirectURL?: string;
  check: () => Promise<any>;
  onSuccess?: (res: any) => void;
  onFail?: (err: Error) => void;
}
```
