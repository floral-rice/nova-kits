# Layout

页面最外层包裹，常与 Section 组合，带有 loading。支持可拖拽侧边栏、标签页布局和 Portal 机制。

## API

<NovaApiDoc component="Layout" />

## 基础用法

<demo src="./demo/basic.vue"/>

## 可拖拽侧边栏

支持拖拽调整宽度和折叠/展开

<demo src="./demo/resizable.vue"/>

## 带标签页

使用 NLayoutTabs 实现标签页切换

<demo src="./demo/tabs.vue"/>

## Portal 机制

子组件通过 NLayoutPortal 将内容渲染到 Layout 的 header/footer 区域

<demo src="./demo/portal.vue"/>
