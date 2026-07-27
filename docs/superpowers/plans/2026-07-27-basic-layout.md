# BasicLayout 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建 kits 聚合包并实现 BasicLayout 后台布局组件

**Architecture:** kits 包作为聚合入口 re-export components 和 hooks，同时提供 BasicLayout 组件。BasicLayout 由 NavHeader、SideMenu、TabBar 三个子组件组成，通过 useAuth、useTabs、useMenuFilter 三个 composable 管理逻辑。

**Tech Stack:** Vue 3.5+、Element Plus、vue-router 4、SCSS、Vite、TypeScript

## Global Constraints

- Vue 3.5+，使用 `<script setup lang="ts">` 语法
- Element Plus 作为基础 UI 库
- BEM 命名统一用 `-` 连接，前缀 `nk-basic-layout`
- 样式使用 SCSS，写在 `<style scoped>` 中
- 每个 composable 独立文件，职责单一
- 菜单最多支持三级嵌套
- 标签页上限 10 个
- 不包含收藏夹和水印功能

---

### Task 1: 创建 kits 包基础结构

**Files:**
- Create: `packages/kits/package.json`
- Create: `packages/kits/tsconfig.json`
- Create: `packages/kits/vite.config.ts`
- Create: `packages/kits/src/index.ts`
- Modify: `packages/components/package.json` (添加 kits 到 workspace)

**Interfaces:**
- Produces: `@nova-kits/kits` 包可用，聚合导出 components 和 hooks

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "@nova-kits/kits",
  "version": "1.0.0",
  "description": "Nova Kits - 一站式组件库，聚合所有子包",
  "type": "module",
  "main": "./dist/index.umd.cjs",
  "module": "./dist/index.esm.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.esm.js",
      "require": "./dist/index.umd.cjs"
    },
    "./style.css": "./dist/style.css"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "vite build && vue-tsc --declaration --emitDeclarationOnly --outDir dist"
  },
  "dependencies": {
    "@nova-kits/components": "workspace:*",
    "@nova-kits/hooks": "workspace:*",
    "element-plus": "^2.14.2"
  },
  "peerDependencies": {
    "vue": "^3.5.24",
    "vue-router": "^4.6.4"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.0",
    "sass": "^1.101.0",
    "typescript": "^6.0.3",
    "vite": "^7.2.4",
    "vue-tsc": "^3.1.4"
  }
}
```

- [ ] **Step 2: 创建 tsconfig.json**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: 创建 vite.config.ts**

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [vue() as any],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: (source: string, filePath: string) => {
          if (filePath.includes('node_modules')) return source;
          const varPath = resolve(__dirname, '../components/src/styles/_variables').replace(/\\/g, '/');
          return `@use "${varPath}" as *;\n${source}`;
        },
      },
    },
  },

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NovaKits',
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'umd'}.${format === 'es' ? 'js' : 'cjs'}`,
      cssFileName: 'style',
    },

    rollupOptions: {
      external: ['vue', 'vue-router', 'element-plus', '@nova-kits/components', '@nova-kits/hooks'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
```

- [ ] **Step 4: 创建 src/index.ts 聚合入口**

```ts
import { App } from 'vue';
export * from '@nova-kits/components';
export * from '@nova-kits/hooks';

export { default as NBasicLayout } from './layouts/BasicLayout/BasicLayout.vue';

import { default as NBasicLayout } from './layouts/BasicLayout/BasicLayout.vue';
import { install as componentsInstall } from '@nova-kits/components';

export function install(app: App) {
  app.component('NBasicLayout', NBasicLayout);
  componentsInstall(app);
}

export default {
  install,
};
```

- [ ] **Step 5: 安装依赖并验证构建**

```bash
cd packages/kits
pnpm install
pnpm build
```

- [ ] **Step 6: 提交**

```bash
git add packages/kits/
git commit -m "feat(kits): 创建 kits 聚合包基础结构"
```

---

### Task 2: 定义类型

**Files:**
- Create: `packages/kits/src/layouts/BasicLayout/typings.ts`

**Interfaces:**
- Produces: `MenuItem`、`TabItem`、`BasicLayoutProps` 类型供后续所有任务使用

- [ ] **Step 1: 创建 typings.ts**

```ts
import type { Component } from 'vue';

export interface MenuItem {
  /** 菜单名称 */
  name: string;
  /** 路由路径，外部链接以 http/https 开头 */
  path?: string;
  /** 图标，字符串为 icon 名称，组件为自定义渲染 */
  icon?: string | Component;
  /** 子菜单，最多支持三级 */
  children?: MenuItem[];
  /** 权限标识，字符串或字符串数组 */
  authority?: string | string[];
}

export interface TabItem {
  /** 标签标题 */
  title: string;
  /** 路由路径 */
  path: string;
  /** 是否可关闭，固定标签为 false */
  closable: boolean;
  /** 刷新计数，用于触发 router-view 重新渲染 */
  refreshCount: number;
}

export interface BasicLayoutProps {
  /** 标题 */
  title: string;
  /** logo，字符串为图片路径，false 隐藏，组件为自定义渲染 */
  logo?: string | false | Component;
  /** 菜单数据，最多支持三级 */
  menus: MenuItem[];
  /** 用户权限列表，用于菜单过滤 */
  authorities?: string[];
  /** 固定标签页（如首页），不可关闭 */
  topTabs?: { title: string; path: string }[];
  /** 鉴权配置 */
  auth?: {
    /** 鉴权失败时的重定向地址 */
    redirectURL?: string;
    /** 鉴权校验函数 */
    check: () => Promise<any>;
    /** 鉴权成功回调 */
    onSuccess?: (res: any) => void;
    /** 鉴权失败回调 */
    onFail?: (err: Error) => void;
  };
}
```

- [ ] **Step 2: 提交**

```bash
git add packages/kits/src/layouts/BasicLayout/typings.ts
git commit -m "feat(kits): 定义 BasicLayout 类型"
```

---

### Task 3: 实现 useMenuFilter composable

**Files:**
- Create: `packages/kits/src/layouts/BasicLayout/composables/useMenuFilter.ts`

**Interfaces:**
- Consumes: `MenuItem` from typings.ts
- Produces: `useMenuFilter(menus, authorities)` → `ComputedRef<MenuItem[]>`

- [ ] **Step 1: 创建 useMenuFilter.ts**

```ts
import { computed, type ComputedRef } from 'vue';
import type { MenuItem } from '../typings';

/**
 * 判断是否拥有指定权限
 */
function hasAuthority(authority: string | string[], authorities: Set<string>): boolean {
  if (Array.isArray(authority)) {
    return authority.some((a) => authorities.has(a));
  }
  return authorities.has(authority);
}

/**
 * 递归过滤菜单树
 */
function filterMenuTree(menus: MenuItem[], authorities: Set<string>): MenuItem[] {
  return menus
    .map((menu) => {
      // 有子菜单时递归过滤
      if (menu.children && menu.children.length > 0) {
        const filteredChildren = filterMenuTree(menu.children, authorities);
        if (filteredChildren.length > 0) {
          return { ...menu, children: filteredChildren };
        }
        // 子菜单全部被过滤掉时，检查当前节点是否有 path
        return menu.path ? { ...menu, children: undefined } : null;
      }

      // 有权限限制时检查
      if (menu.authority !== undefined) {
        return hasAuthority(menu.authority, authorities) ? menu : null;
      }

      // 无权限限制，直接保留
      return menu;
    })
    .filter(Boolean) as MenuItem[];
}

/**
 * 根据权限过滤菜单
 * 无 authorities 配置时返回原菜单
 */
export default function useMenuFilter(menus: () => MenuItem[], authorities?: () => string[]): ComputedRef<MenuItem[]> {
  return computed(() => {
    const menuList = menus();
    const authList = authorities?.();

    if (!authList || authList.length === 0) {
      return menuList;
    }

    return filterMenuTree(menuList, new Set(authList));
  });
}
```

- [ ] **Step 2: 提交**

```bash
git add packages/kits/src/layouts/BasicLayout/composables/useMenuFilter.ts
git commit -m "feat(kits): 实现 useMenuFilter composable"
```

---

### Task 4: 实现 useAuth composable

**Files:**
- Create: `packages/kits/src/layouts/BasicLayout/composables/useAuth.ts`

**Interfaces:**
- Consumes: `BasicLayoutProps['auth']` from typings.ts
- Produces: `useAuth(auth)` → `{ loading: Ref<boolean>, checkAuth: () => Promise<void> }`

- [ ] **Step 1: 创建 useAuth.ts**

```ts
import { ref, type Ref } from 'vue';
import type { BasicLayoutProps } from '../typings';

/**
 * 鉴权 composable
 * 处理登录校验和重定向逻辑
 */
export default function useAuth(auth?: BasicLayoutProps['auth']): {
  loading: Ref<boolean>;
  checkAuth: () => Promise<void>;
} {
  const loading = ref(!!auth);

  const checkAuth = async () => {
    if (!auth) {
      loading.value = false;
      return;
    }

    try {
      const res = await auth.check();
      auth.onSuccess?.(res);
    } catch (err) {
      auth.onFail?.(err as Error);

      // 默认行为：重定向到登录页
      if (auth.redirectURL) {
        const currentUrl = encodeURIComponent(window.location.href);

        if (/^(?:https?:)?\/\//.test(auth.redirectURL)) {
          // 外部地址
          const url = new URL(auth.redirectURL);
          url.searchParams.set('redirect', currentUrl);
          window.location.href = url.toString();
        } else {
          // 内部路由
          const [pathname, search] = auth.redirectURL.split('?');
          const params = new URLSearchParams(search || '');
          params.set('redirect', currentUrl);
          window.location.href = `${pathname}?${params.toString()}`;
        }
      }
    } finally {
      loading.value = false;
    }
  };

  return { loading, checkAuth };
}
```

- [ ] **Step 2: 提交**

```bash
git add packages/kits/src/layouts/BasicLayout/composables/useAuth.ts
git commit -m "feat(kits): 实现 useAuth composable"
```

---

### Task 5: 实现 useTabs composable

**Files:**
- Create: `packages/kits/src/layouts/BasicLayout/composables/useTabs.ts`

**Interfaces:**
- Consumes: `TabItem` from typings.ts, `topTabs` from props
- Produces: `useTabs(topTabs)` → `{ tabs, active, addTab, closeTab, refreshTab, closeOtherTabs, closeAllTabs }`

- [ ] **Step 1: 创建 useTabs.ts**

```ts
import { ref, watch, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { TabItem } from '../typings';

const MAX_TABS = 10;

/**
 * 标签页管理 composable
 */
export default function useTabs(topTabs?: { title: string; path: string }[]): {
  tabs: Ref<TabItem[]>;
  active: Ref<number>;
  addTab: (tab: Omit<TabItem, 'refreshCount' | 'closable'>) => void;
  closeTab: (index: number) => void;
  refreshTab: (index: number) => void;
  closeOtherTabs: () => void;
  closeAllTabs: () => void;
} {
  const route = useRoute();
  const router = useRouter();

  // 初始化固定标签
  const defaultTabs: TabItem[] = (topTabs || []).map((tab) => ({
    title: tab.title,
    path: tab.path,
    closable: false,
    refreshCount: 0,
  }));

  const tabs = ref<TabItem[]>([...defaultTabs]);
  const active = ref(-1);

  // 添加标签
  const addTab = (tab: Omit<TabItem, 'refreshCount' | 'closable'>) => {
    const existingIndex = tabs.value.findIndex((t) => t.path === tab.path);

    if (existingIndex >= 0) {
      // 已存在，激活
      active.value = existingIndex;
    } else {
      // 新增
      tabs.value.push({
        ...tab,
        closable: true,
        refreshCount: 0,
      });

      // 超过上限时关闭最早的动态标签
      if (tabs.value.length > MAX_TABS) {
        const firstDynamicIndex = tabs.value.findIndex((t) => t.closable);
        if (firstDynamicIndex >= 0) {
          tabs.value.splice(firstDynamicIndex, 1);
        }
      }

      active.value = tabs.value.length - 1;
    }
  };

  // 关闭标签
  const closeTab = (index: number) => {
    const tab = tabs.value[index];
    if (!tab || !tab.closable) return;

    tabs.value.splice(index, 1);

    // 调整激活索引
    if (index <= active.value) {
      active.value = Math.max(0, active.value - 1);
    }

    // 导航到当前激活的标签
    const currentTab = tabs.value[active.value];
    if (currentTab && currentTab.path !== route.path) {
      router.push(currentTab.path);
    }
  };

  // 刷新标签
  const refreshTab = (index: number) => {
    const tab = tabs.value[index];
    if (tab) {
      tab.refreshCount += 1;
    }
  };

  // 关闭其他标签
  const closeOtherTabs = () => {
    const currentTab = tabs.value[active.value];
    tabs.value = [
      ...defaultTabs,
      ...(currentTab && currentTab.closable ? [currentTab] : []),
    ];
    active.value = tabs.value.length - 1;
  };

  // 关闭所有标签
  const closeAllTabs = () => {
    tabs.value = [...defaultTabs];
    active.value = defaultTabs.length > 0 ? 0 : -1;

    if (defaultTabs.length > 0 && defaultTabs[0].path !== route.path) {
      router.push(defaultTabs[0].path);
    }
  };

  // 监听路由变化，自动新增标签
  watch(
    () => route.path,
    () => {
      const matched = route.matched;
      if (matched.length > 0) {
        const title = (route.meta?.title as string) || '';
        addTab({ title, path: route.path });
      }
    },
    { immediate: true },
  );

  return { tabs, active, addTab, closeTab, refreshTab, closeOtherTabs, closeAllTabs };
}
```

- [ ] **Step 2: 提交**

```bash
git add packages/kits/src/layouts/BasicLayout/composables/useTabs.ts
git commit -m "feat(kits): 实现 useTabs composable"
```

---

### Task 6: 实现 TabBar 组件

**Files:**
- Create: `packages/kits/src/layouts/BasicLayout/components/TabBar.vue`

**Interfaces:**
- Consumes: `TabItem` from typings.ts
- Produces: `TabBar` 组件，props: `tabs`, `active`，emits: `click`, `close`, `refresh`, `closeOther`, `closeAll`

- [ ] **Step 1: 创建 TabBar.vue**

```vue
<template>
  <div class="nk-basic-layout-tab-bar">
    <div
      v-for="(tab, index) in tabs"
      :key="tab.path"
      :class="[
        'nk-basic-layout-tab-bar__item',
        { 'nk-basic-layout-tab-bar__item--active': index === active },
        { 'nk-basic-layout-tab-bar__item--fixed': !tab.closable },
      ]"
      @click="$emit('click', index)"
      @contextmenu.prevent="showContextMenu($event, index)"
    >
      <span class="nk-basic-layout-tab-bar__title">{{ tab.title }}</span>
      <el-icon
        v-if="tab.closable"
        class="nk-basic-layout-tab-bar__close"
        @click.stop="$emit('close', index)"
      >
        <Close />
      </el-icon>
    </div>
  </div>

  <!-- 右键菜单 -->
  <teleport to="body">
    <div
      v-if="contextMenu.visible"
      class="nk-basic-layout-tab-bar__context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
    >
      <div class="nk-basic-layout-tab-bar__context-menu-item" @click="handleRefresh">
        刷新
      </div>
      <div class="nk-basic-layout-tab-bar__context-menu-item" @click="handleCloseOther">
        关闭其他
      </div>
      <div class="nk-basic-layout-tab-bar__context-menu-item" @click="handleCloseAll">
        关闭所有
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue';
import { Close } from '@element-plus/icons-vue';
import type { TabItem } from '../typings';

defineProps<{
  tabs: TabItem[];
  active: number;
}>();

const emit = defineEmits<{
  click: [index: number];
  close: [index: number];
  refresh: [index: number];
  closeOther: [];
  closeAll: [];
}>();

const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  index: -1,
});

const showContextMenu = (e: MouseEvent, index: number) => {
  contextMenu.visible = true;
  contextMenu.x = e.clientX;
  contextMenu.y = e.clientY;
  contextMenu.index = index;
};

const hideContextMenu = () => {
  contextMenu.visible = false;
};

const handleRefresh = () => {
  emit('refresh', contextMenu.index);
  hideContextMenu();
};

const handleCloseOther = () => {
  emit('closeOther');
  hideContextMenu();
};

const handleCloseAll = () => {
  emit('closeAll');
  hideContextMenu();
};

onMounted(() => {
  document.addEventListener('click', hideContextMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', hideContextMenu);
});
</script>

<style scoped lang="scss">
.nk-basic-layout-tab-bar {
  display: flex;
  align-items: center;
  flex: 1;
  overflow-x: auto;
  gap: 4px;
  padding: 0 12px;

  &__item {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
    font-size: $font-sm;
    color: #666;
    transition: all 0.2s;

    &:hover {
      background: #f5f5f5;
    }

    &--active {
      color: #409eff;
      background: #ecf5ff;
    }

    &--fixed {
      color: #333;
    }
  }

  &__close {
    font-size: 12px;
    border-radius: 50%;
    transition: all 0.2s;

    &:hover {
      background: #d9d9d9;
      color: #fff;
    }
  }

  &__context-menu {
    position: fixed;
    z-index: 9999;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    padding: 4px 0;
    min-width: 100px;

    &-item {
      padding: 8px 16px;
      font-size: $font-sm;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add packages/kits/src/layouts/BasicLayout/components/TabBar.vue
git commit -m "feat(kits): 实现 TabBar 组件"
```

---

### Task 7: 实现 NavHeader 组件

**Files:**
- Create: `packages/kits/src/layouts/BasicLayout/components/NavHeader.vue`

**Interfaces:**
- Consumes: `TabBar` component, `TabItem` from typings.ts
- Produces: `NavHeader` 组件，props: `title`, `logo`, `tabs`, `active`，slots: `right`，emits: tab 相关事件

- [ ] **Step 1: 创建 NavHeader.vue**

```vue
<template>
  <header class="nk-basic-layout-nav">
    <div class="nk-basic-layout-nav__left">
      <div v-if="logo !== false" class="nk-basic-layout-nav__logo">
        <img v-if="typeof logo === 'string'" :src="logo" alt="logo" />
        <component :is="logo" v-else-if="logo" />
      </div>
      <div class="nk-basic-layout-nav__title">{{ title }}</div>
    </div>

    <TabBar
      :tabs="tabs"
      :active="active"
      @click="$emit('tabClick', $event)"
      @close="$emit('tabClose', $event)"
      @refresh="$emit('tabRefresh', $event)"
      @close-other="$emit('tabCloseOther')"
      @close-all="$emit('tabCloseAll')"
    />

    <div class="nk-basic-layout-nav__right">
      <slot name="right" />
    </div>
  </header>
</template>

<script setup lang="ts">
import TabBar from './TabBar.vue';
import type { TabItem } from '../typings';
import type { Component } from 'vue';

defineProps<{
  title: string;
  logo?: string | false | Component;
  tabs: TabItem[];
  active: number;
}>();

defineEmits<{
  tabClick: [index: number];
  tabClose: [index: number];
  tabRefresh: [index: number];
  tabCloseOther: [];
  tabCloseAll: [];
}>();
</script>

<style scoped lang="scss">
.nk-basic-layout-nav {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 $padding-lg;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;

  &__left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  &__logo {
    display: flex;
    align-items: center;

    img {
      height: 28px;
      width: auto;
    }
  }

  &__title {
    font-size: $font-lg;
    font-weight: 600;
    color: #333;
    white-space: nowrap;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    margin-left: 12px;
  }
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add packages/kits/src/layouts/BasicLayout/components/NavHeader.vue
git commit -m "feat(kits): 实现 NavHeader 组件"
```

---

### Task 8: 实现 SideMenu 组件

**Files:**
- Create: `packages/kits/src/layouts/BasicLayout/components/SideMenu.vue`

**Interfaces:**
- Consumes: `MenuItem` from typings.ts
- Produces: `SideMenu` 组件，props: `menus`, `defaultActive`

- [ ] **Step 1: 创建 SideMenu.vue**

```vue
<template>
  <aside class="nk-basic-layout-menu">
    <el-scrollbar>
      <el-menu
        :default-active="defaultActive"
        :collapse="collapse"
        class="nk-basic-layout-menu__inner"
        @select="handleSelect"
      >
        <template v-for="menu in menus" :key="menu.path || menu.name">
          <!-- 有子菜单 -->
          <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path || menu.name">
            <template #title>
              <el-icon v-if="menu.icon">
                <component :is="menu.icon" v-if="typeof menu.icon !== 'string'" />
              </el-icon>
              <span>{{ menu.name }}</span>
            </template>

            <template v-for="child in menu.children" :key="child.path || child.name">
              <!-- 二级有子菜单 -->
              <el-sub-menu v-if="child.children && child.children.length > 0" :index="child.path || child.name">
                <template #title>
                  <el-icon v-if="child.icon">
                    <component :is="child.icon" v-if="typeof child.icon !== 'string'" />
                  </el-icon>
                  <span>{{ child.name }}</span>
                </template>
                <el-menu-item
                  v-for="grandchild in child.children"
                  :key="grandchild.path || grandchild.name"
                  :index="grandchild.path"
                >
                  <el-icon v-if="grandchild.icon">
                    <component :is="grandchild.icon" v-if="typeof grandchild.icon !== 'string'" />
                  </el-icon>
                  <span>{{ grandchild.name }}</span>
                </el-menu-item>
              </el-sub-menu>

              <!-- 二级无子菜单 -->
              <el-menu-item v-else :index="child.path">
                <el-icon v-if="child.icon">
                  <component :is="child.icon" v-if="typeof child.icon !== 'string'" />
                </el-icon>
                <span>{{ child.name }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>

          <!-- 无子菜单 -->
          <el-menu-item v-else :index="menu.path">
            <el-icon v-if="menu.icon">
              <component :is="menu.icon" v-if="typeof menu.icon !== 'string'" />
            </el-icon>
            <template #title>{{ menu.name }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </aside>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { MenuItem } from '../typings';

const props = defineProps<{
  menus: MenuItem[];
  defaultActive?: string;
  collapse?: boolean;
}>();

const router = useRouter();

const handleSelect = (index: string) => {
  if (/^(?:https?:)?\/\//.test(index)) {
    window.open(index);
  } else {
    router.push(index);
  }
};
</script>

<style scoped lang="scss">
.nk-basic-layout-menu {
  width: 220px;
  height: 100%;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  flex-shrink: 0;
  transition: width 0.3s;

  &__inner {
    border-right: none;
    height: 100%;
  }
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add packages/kits/src/layouts/BasicLayout/components/SideMenu.vue
git commit -m "feat(kits): 实现 SideMenu 组件"
```

---

### Task 9: 实现 BasicLayout 主组件

**Files:**
- Create: `packages/kits/src/layouts/BasicLayout/BasicLayout.vue`

**Interfaces:**
- Consumes: `NavHeader`, `SideMenu`, `useAuth`, `useTabs`, `useMenuFilter`, `BasicLayoutProps`
- Produces: `NBasicLayout` 组件，完整布局功能

- [ ] **Step 1: 创建 BasicLayout.vue**

```vue
<template>
  <div v-loading="authLoading" class="nk-basic-layout">
    <NavHeader
      :title="title"
      :logo="logo"
      :tabs="tabs"
      :active="active"
      @tab-click="handleTabClick"
      @tab-close="closeTab"
      @tab-refresh="refreshTab"
      @tab-close-other="closeOtherTabs"
      @tab-close-all="closeAllTabs"
    >
      <template #right>
        <slot name="right" />
      </template>
    </NavHeader>

    <div class="nk-basic-layout__body">
      <SideMenu
        :menus="filteredMenus"
        :default-active="route.path"
      />

      <div class="nk-basic-layout__content">
        <slot>
          <router-view v-slot="{ Component: RouteComponent, route: viewRoute }">
            <keep-alive>
              <component
                :is="RouteComponent"
                :key="getTabKey(viewRoute)"
              />
            </keep-alive>
          </router-view>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavHeader from './components/NavHeader.vue';
import SideMenu from './components/SideMenu.vue';
import useAuth from './composables/useAuth';
import useTabs from './composables/useTabs';
import useMenuFilter from './composables/useMenuFilter';
import type { BasicLayoutProps } from './typings';

const props = defineProps<BasicLayoutProps>();

const route = useRoute();
const router = useRouter();

// 鉴权
const { loading: authLoading, checkAuth } = useAuth(props.auth);

// 标签页
const { tabs, active, closeTab, refreshTab, closeOtherTabs, closeAllTabs } = useTabs(props.topTabs);

// 菜单过滤
const filteredMenus = useMenuFilter(() => props.menus, () => props.authorities);

// 标签点击
const handleTabClick = (index: number) => {
  const tab = tabs.value[index];
  if (tab) {
    router.push(tab.path);
  }
};

// 获取标签 key（用于刷新）
const getTabKey = (viewRoute: any) => {
  const tab = tabs.value.find((t) => t.path === viewRoute.path);
  if (tab && tab.refreshCount > 0) {
    return `${tab.refreshCount}_${viewRoute.path}`;
  }
  return viewRoute.path;
};

onMounted(() => {
  checkAuth();
});
</script>

<style scoped lang="scss">
.nk-basic-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;

  &__body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  &__content {
    flex: 1;
    overflow: auto;
    padding: $padding-lg;
    background: #f5f5f5;
  }
}
</style>
```

- [ ] **Step 2: 验证构建**

```bash
cd packages/kits
pnpm build
```

- [ ] **Step 3: 提交**

```bash
git add packages/kits/src/layouts/BasicLayout/BasicLayout.vue
git commit -m "feat(kits): 实现 BasicLayout 主组件"
```

---

### Task 10: 导出 composable 和类型

**Files:**
- Modify: `packages/kits/src/index.ts`

**Interfaces:**
- Produces: 外部可导入 `useAuth`, `useTabs`, `useMenuFilter` 和类型定义

- [ ] **Step 1: 更新 src/index.ts**

```ts
import { App } from 'vue';
export * from '@nova-kits/components';
export * from '@nova-kits/hooks';

// BasicLayout 组件
export { default as NBasicLayout } from './layouts/BasicLayout/BasicLayout.vue';

// Composables
export { default as useAuth } from './layouts/BasicLayout/composables/useAuth';
export { default as useTabs } from './layouts/BasicLayout/composables/useTabs';
export { default as useMenuFilter } from './layouts/BasicLayout/composables/useMenuFilter';

// 类型
export type { MenuItem, TabItem, BasicLayoutProps } from './layouts/BasicLayout/typings';

import { default as NBasicLayout } from './layouts/BasicLayout/BasicLayout.vue';
import { install as componentsInstall } from '@nova-kits/components';

export function install(app: App) {
  app.component('NBasicLayout', NBasicLayout);
  componentsInstall(app);
}

export default {
  install,
};
```

- [ ] **Step 2: 验证构建**

```bash
cd packages/kits
pnpm build
```

- [ ] **Step 3: 提交**

```bash
git add packages/kits/src/index.ts
git commit -m "feat(kits): 导出 composable 和类型"
```

---

### Task 11: 编写文档

**Files:**
- Create: `docs/zh/components/layout/basic-layout/index.md`
- Create: `docs/zh/components/layout/basic-layout/demo/BasicUsage.vue`
- Create: `docs/zh/components/layout/basic-layout/demo/WithAuth.vue`
- Create: `docs/zh/components/layout/basic-layout/demo/CustomRight.vue`
- Modify: `docs/zh/components/layout/meta.json`
- Modify: `docs/package.json` (添加 kits 依赖)

**Interfaces:**
- Produces: 文档页面可在 VitePress 中预览

- [ ] **Step 1: 更新 docs/package.json，添加 kits 依赖**

在 `dependencies` 中添加：
```json
"@nova-kits/kits": "workspace:*"
```

- [ ] **Step 2: 创建基础用法示例 demo/BasicUsage.vue**

```vue
<template>
  <div style="height: 400px; border: 1px solid #eee">
    <NBasicLayout title="管理系统" :menus="menus" :top-tabs="topTabs" />
  </div>
</template>

<script setup lang="ts">
import { NBasicLayout } from '@nova-kits/kits';

const menus = [
  {
    name: '首页',
    path: '/home',
  },
  {
    name: '系统管理',
    children: [
      { name: '用户管理', path: '/system/user' },
      { name: '角色管理', path: '/system/role' },
    ],
  },
];

const topTabs = [{ title: '首页', path: '/home' }];
</script>
```

- [ ] **Step 3: 创建鉴权示例 demo/WithAuth.vue**

```vue
<template>
  <div style="height: 400px; border: 1px solid #eee">
    <NBasicLayout
      title="管理系统"
      :menus="menus"
      :auth="authConfig"
    />
  </div>
</template>

<script setup lang="ts">
import { NBasicLayout } from '@nova-kits/kits';

const menus = [
  { name: '首页', path: '/home' },
  { name: '用户管理', path: '/user' },
];

const authConfig = {
  redirectURL: '/login',
  check: async () => {
    // 模拟鉴权请求
    return { user: 'admin' };
  },
  onSuccess: (res: any) => {
    console.log('鉴权成功', res);
  },
  onFail: (err: Error) => {
    console.error('鉴权失败', err);
  },
};
</script>
```

- [ ] **Step 4: 创建自定义右侧插槽示例 demo/CustomRight.vue**

```vue
<template>
  <div style="height: 400px; border: 1px solid #eee">
    <NBasicLayout title="管理系统" :menus="menus">
      <template #right>
        <el-avatar :size="32" src="https://via.placeholder.com/32" />
        <span>管理员</span>
        <el-dropdown>
          <el-icon><ArrowDown /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </NBasicLayout>
  </div>
</template>

<script setup lang="ts">
import { NBasicLayout } from '@nova-kits/kits';
import { ArrowDown } from '@element-plus/icons-vue';

const menus = [
  { name: '首页', path: '/home' },
  { name: '用户管理', path: '/user' },
];
</script>
```

- [ ] **Step 5: 创建文档 index.md**

```md
# BasicLayout 基础布局

后台管理系统的基础布局组件，集成了顶部导航、侧边菜单、标签页和鉴权功能。

## 基础用法

<demo src="./demo/BasicUsage.vue"/>

## 鉴权

通过 `auth` prop 配置鉴权逻辑，支持校验、成功/失败回调和重定向。

<demo src="./demo/WithAuth.vue"/>

## 自定义右侧

通过 `#right` 插槽自定义右上角内容。

<demo src="./demo/CustomRight.vue"/>

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | `string` | - | 标题（必填） |
| logo | `string \| false \| Component` | - | logo，字符串为图片路径，false 隐藏 |
| menus | `MenuItem[]` | - | 菜单数据（必填），最多支持三级 |
| authorities | `string[]` | - | 权限列表，用于菜单过滤 |
| topTabs | `{ title: string; path: string }[]` | - | 固定标签页，不可关闭 |
| auth | `AuthConfig` | - | 鉴权配置 |

## 插槽

| 名称 | 说明 |
|------|------|
| right | 右上角自定义内容 |
| default | 自定义内容区（不使用时自动渲染 router-view） |

## 类型定义

```ts
interface MenuItem {
  name: string
  path?: string
  icon?: string | Component
  children?: MenuItem[]
  authority?: string | string[]
}

interface AuthConfig {
  redirectURL?: string
  check: () => Promise<any>
  onSuccess?: (res: any) => void
  onFail?: (err: Error) => void
}
```
```

- [ ] **Step 6: 创建 BasicLayout 的 meta.json**

创建 `docs/zh/components/layout/basic-layout/meta.json`：

```json
{
  "name": "BasicLayout",
  "title": "BasicLayout",
  "description": "后台管理系统基础布局",
  "category": "布局"
}
```

- [ ] **Step 7: 安装依赖并验证文档**

```bash
pnpm install
pnpm docs:dev
```

- [ ] **Step 8: 提交**

```bash
git add docs/zh/components/layout/basic-layout/ docs/package.json
git commit -m "docs: 添加 BasicLayout 文档和示例"
```

---

### Task 12: 最终验证

**Files:**
- 全局验证

- [ ] **Step 1: 验证 kits 包构建**

```bash
cd packages/kits
pnpm build
```

确认 `dist/` 目录包含：
- `index.esm.js`
- `index.umd.cjs`
- `index.d.ts`
- `style.css`

- [ ] **Step 2: 验证文档构建**

```bash
pnpm docs:build
```

- [ ] **Step 3: 验证类型导出**

确认 `dist/index.d.ts` 包含：
- `NBasicLayout`
- `useAuth`
- `useTabs`
- `useMenuFilter`
- `MenuItem`
- `TabItem`
- `BasicLayoutProps`

- [ ] **Step 4: 提交版本**

```bash
git add .
git commit -m "chore: v1.0.0 kits 包发布准备"
```
