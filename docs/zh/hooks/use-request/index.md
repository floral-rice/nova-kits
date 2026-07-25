---
title: useRequest
group:
  path: /hooks
---

# useRequest

发起网络请求, 主要面向场景: 提交单据、点击列表打开详情页前请求数据，自动捕获异常

## 基础用法

手动触发请求

<demo src="./demo/basic.vue"/>

## 自动请求

页面加载时自动请求

<demo src="./demo/auto.vue"/>

## 防抖请求

输入搜索时防抖请求

<demo src="./demo/debounce.vue"/>

## 节流请求

按钮点击时节流请求

<demo src="./demo/throttle.vue"/>

## API

```typescript
const { run, loading, data } = useRequest(request, options);
```

### 参数

| 参数    | 说明         | 类型                               | 默认值 |
| ------- | ------------ | ---------------------------------- | ------ |
| request | 网络请求方法 | `(...args: any[]) => Promise<any>` | -      |
| options | 配置项       | `UseRequestOptions`                | -      |

### Options

| 参数             | 说明                             | 类型                         | 默认值  |
| ---------------- | -------------------------------- | ---------------------------- | ------- |
| manual           | 是否需要手动执行                 | `boolean`                    | `true`  |
| defaultData      | 数据默认值                       | `any`                        | `null`  |
| loadingState     | 启用loading状态                  | `boolean`                    | `true`  |
| debounceInterval | 防抖模式的时间（ms）             | `number`                     | `0`     |
| throttleInterval | 节流模式的时间（ms）             | `number`                     | `0`     |
| lock             | 在上一次未完成之前，防止重复调用 | `boolean`                    | `false` |
| refreshDeps      | 非手动模式自动刷新的依赖项       | `Ref<any>[]`                 | `[]`    |
| onSuccess        | 成功回调                         | `(res, params) => void`      | -       |
| onError          | 错误回调                         | `(err, params) => void`      | -       |
| onFinally        | 最终回调                         | `() => void`                 | -       |
| onLoading        | loading状态变化监听函数          | `(loading: boolean) => void` | -       |

### 返回值

| 参数    | 说明         | 类型                |
| ------- | ------------ | ------------------- |
| run     | 手动执行函数 | `(...args) => void` |
| loading | loading状态  | `Ref<boolean>`      |
| data    | 数据         | `Ref<any>`          |
