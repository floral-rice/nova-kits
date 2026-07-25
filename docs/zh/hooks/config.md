---
title: Hooks 配置
group:
  path: /hooks
---

# Hooks 配置

全局配置 hooks 的行为，包括错误处理、toast 显示、loading 状态等。

## 配置项

| 配置项                  | 说明               | 类型                                                     | 默认值          |
| ----------------------- | ------------------ | -------------------------------------------------------- | --------------- |
| showError               | 显示错误信息       | `(err: Error) => void`                                   | `console.error` |
| showToast               | 显示加载中的 toast | `() => any`                                              | `() => null`    |
| cancelToast             | 取消 toast 显示    | `(toast: any) => void`                                   | `() => {}`      |
| showLoading             | 显示加载中状态     | `() => Component \| null`                                | `() => null`    |
| errorResult             | 错误结果展示       | `(err: Error, refresh: () => void) => Component \| null` | `() => null`    |
| setPrimaryColor         | 设置主题色         | `(val: string) => void`                                  | `() => {}`      |
| requestThrottleInterval | 默认节流时间（ms） | `number`                                                 | `0`             |
| requestLock             | 防止重复调用       | `boolean`                                                | `false`         |

## 使用方式

### 方式一：provideHooksConfig

在应用根组件中配置：

```vue
<script setup>
import { provideHooksConfig } from '@nova-kits/hooks';
import { ElMessage, ElLoading } from 'element-plus';

provideHooksConfig({
  showError: (err) => ElMessage.error(err.message),
  showToast: () => ElLoading.service(),
  cancelToast: (toast) => toast.close(),
  requestThrottleInterval: 300,
  requestLock: true,
});
</script>
```

### 方式二：createHooksPlugin

创建插件并在应用中使用：

```typescript
// hooks-plugin.ts
import { createHooksPlugin } from '@nova-kits/hooks';
import { ElMessage, ElLoading } from 'element-plus';

export const hooksPlugin = createHooksPlugin({
  showError: (err) => ElMessage.error(err.message),
  showToast: () => ElLoading.service(),
  cancelToast: (toast) => toast.close(),
});
```

```typescript
// main.ts
import { createApp } from 'vue';
import { hooksPlugin } from './hooks-plugin';
import App from './App.vue';

const app = createApp(App);
app.use(hooksPlugin);
app.mount('#app');
```

### 方式三：局部覆盖

在使用 useRequest 时覆盖全局配置：

```typescript
const { run } = useRequest(api, {
  showError: (err) => alert(err.message), // 覆盖全局配置
});
```

## 默认配置

```typescript
const defaultConfig = {
  showError: (err) => console.error(err),
  showToast: () => null,
  cancelToast: () => {},
  showLoading: () => null,
  errorResult: () => null,
  setPrimaryColor: () => {},
  requestThrottleInterval: 0,
  requestLock: false,
};
```

## 与 useRequest 配合

useRequest 会自动使用全局配置：

```typescript
const { run, loading, data } = useRequest(api, {
  toast: true, // 自动调用 showToast/cancelToast
  lock: true, // 使用全局 requestLock 配置
});
```
