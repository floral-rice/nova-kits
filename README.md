# nova-kits

# 目标

该组件工具库主要是基于element的基础上，新增一些适合web后台的组件库，或在el的基础上，对原来的组件进行二次封装，安装该组件库无需重复安装element,已经直接导出了element的组件，同时也导出了这个工具库自己的组件、hooks、方法等，使用者完全可以安装这个工具还或者直接下载源码自己进行开发发布插件

# 邀请

该工具库刚起步，有想要自己做一些组件的小伙伴或者像尝试的小伙伴也欢迎加入

# 版本

```bash
"vite": "^7.2.4",
"vue": "^3.5.24",
"node": 20.18+
```

# 下载安装

```bash
npm install @nova-kits/components @nova-kits/hooks
# 或
yarn add @nova-kits/components @nova-kits/hooks
# 或
pnpm add @nova-kits/components @nova-kits/hooks
```

# 使用

```bash
import NovaKits from '@nova-kits/components';
import '@nova-kits/components/style.css';
const app = createApp(App);
app.use(NovaKits);
```
